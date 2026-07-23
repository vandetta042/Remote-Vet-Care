<?php

namespace App\Services;

use App\Models\Disease;
use App\Models\Symptom;
use Illuminate\Support\Collection;

class DiagnosisService
{
    /**
     * @param  array<int, int>  $symptomIds
     * @param  array<int, int>  $riskFactorIds
     * @param  array<string, mixed>  $animalDetails
     * @return array{
     *     top_matches: array<int, array<string, mixed>>,
     *     urgency_level: string,
     *     primary_score: float|null,
     *     system_suggestion: string,
     *     system_explanation: string
     * }
     */
    public function analyze(
        int $speciesId,
        array $symptomIds,
        array $riskFactorIds = [],
        array $animalDetails = [],
        ?string $caseDescription = null,
    ): array {
        $symptomIds = array_values(array_unique(array_map('intval', $symptomIds)));
        $riskFactorIds = array_values(array_unique(array_map('intval', $riskFactorIds)));

        $selectedSymptoms = Symptom::query()
            ->whereIn('id', $symptomIds)
            ->get(['id', 'name', 'severity_level']);

        $emergencySelected = $selectedSymptoms->contains(
            fn (Symptom $symptom) => $symptom->severity_level === 'emergency'
        );

        $diseases = Disease::query()
            ->where('species_id', $speciesId)
            ->whereHas('publishedRuleSets', function ($query) use ($speciesId): void {
                $query->where('species_id', $speciesId)
                    ->where('is_active', true);
            })
            ->with([
                'symptomRules',
                'riskFactorRules',
            ])
            ->get();

        if ($diseases->isEmpty()) {
            return [
                'top_matches' => [],
                'urgency_level' => $emergencySelected ? 'emergency' : $this->urgencyFromSymptoms($selectedSymptoms),
                'primary_score' => null,
                'system_suggestion' => 'No published rule-based suggestions are available yet for this animal species.',
                'system_explanation' => $this->buildNoRuleExplanation(
                    selectedSymptoms: $selectedSymptoms,
                    animalDetails: $animalDetails,
                    caseDescription: $caseDescription,
                    emergencySelected: $emergencySelected,
                ),
            ];
        }

        $topMatches = $diseases
            ->map(function (Disease $disease) use ($symptomIds, $riskFactorIds) {
                $symptomRules = $disease->symptomRules;
                $riskRules = $disease->riskFactorRules;

                $totalSymptomWeight = max($symptomRules->sum('weight'), 1);
                $matchedSymptomRules = $symptomRules->whereIn('symptom_id', $symptomIds);
                $matchedSymptomWeight = $matchedSymptomRules->sum('weight');
                $symptomScore = round(($matchedSymptomWeight / $totalSymptomWeight) * 100, 2);

                $totalRiskWeight = $riskRules->sum('weight');
                $matchedRiskWeight = $riskRules->whereIn('risk_factor_id', $riskFactorIds)->sum('weight');
                $riskScore = $totalRiskWeight > 0
                    ? round(($matchedRiskWeight / $totalRiskWeight) * 100, 2)
                    : null;

                $finalScore = $riskScore === null
                    ? $symptomScore
                    : round(($symptomScore * 0.8) + ($riskScore * 0.2), 2);

                $matchedRequiredSymptoms = $matchedSymptomRules->where('is_required', true)->count();
                $requiredSymptoms = $symptomRules->where('is_required', true)->count();

                return [
                    'disease_id' => $disease->id,
                    'disease_name' => $disease->name,
                    'score' => $finalScore,
                    'symptom_score' => $symptomScore,
                    'risk_score' => $riskScore,
                    'severity' => $disease->severity_level,
                    'care_advice' => $disease->general_care_advice,
                    'requires_vet_attention' => $disease->requires_vet_attention,
                    'requires_lab_test' => $disease->requires_lab_test,
                    'matched_symptoms' => $matchedSymptomRules->count(),
                    'matched_required_symptoms' => $matchedRequiredSymptoms,
                    'required_symptoms' => $requiredSymptoms,
                    'explanation' => $this->buildMatchExplanation(
                        diseaseName: $disease->name,
                        symptomScore: $symptomScore,
                        riskScore: $riskScore,
                        matchedSymptoms: $matchedSymptomRules->count(),
                        totalSymptoms: $symptomRules->count(),
                        matchedRequiredSymptoms: $matchedRequiredSymptoms,
                        requiredSymptoms: $requiredSymptoms,
                    ),
                ];
            })
            ->filter(fn (array $match) => $match['matched_symptoms'] > 0)
            ->sortByDesc('score')
            ->values()
            ->take(3)
            ->all();

        if ($topMatches === []) {
            return [
                'top_matches' => [],
                'urgency_level' => $emergencySelected ? 'emergency' : $this->urgencyFromSymptoms($selectedSymptoms),
                'primary_score' => null,
                'system_suggestion' => 'No close published rule matches were found from the selected symptoms.',
                'system_explanation' => 'The system checked the active published rules for this species, but the selected symptoms did not strongly match any disease pattern. A veterinarian review is still recommended.',
            ];
        }

        $urgencyLevel = $emergencySelected
            ? 'emergency'
            : $this->resolveUrgencyFromTopMatches(collect($topMatches), $selectedSymptoms);

        return [
            'top_matches' => $topMatches,
            'urgency_level' => $urgencyLevel,
            'primary_score' => $topMatches[0]['score'],
            'system_suggestion' => $this->buildSuggestionSummary($topMatches),
            'system_explanation' => $this->buildExplanationSummary($topMatches, $urgencyLevel, $emergencySelected),
        ];
    }

    /**
     * @param  Collection<int, Symptom>  $selectedSymptoms
     * @param  array<string, mixed>  $animalDetails
     */
    protected function buildNoRuleExplanation(
        Collection $selectedSymptoms,
        array $animalDetails,
        ?string $caseDescription,
        bool $emergencySelected,
    ): string {
        $symptomNames = $selectedSymptoms->pluck('name')->take(4)->implode(', ');
        $animalName = $animalDetails['name'] ?? 'This animal';

        $parts = [
            "{$animalName}'s symptoms were recorded" . ($symptomNames !== '' ? " ({$symptomNames})" : '') . ', but there are no active published rules yet for this species.',
        ];

        if ($caseDescription) {
            $parts[] = 'The case description has still been saved for veterinarian review.';
        }

        if ($emergencySelected) {
            $parts[] = 'An emergency symptom was selected, so the case urgency has been raised to emergency.';
        }

        $parts[] = 'This is a system-generated suggestion and should not replace a veterinarian\'s professional diagnosis.';

        return implode(' ', $parts);
    }

    protected function buildMatchExplanation(
        string $diseaseName,
        float $symptomScore,
        ?float $riskScore,
        int $matchedSymptoms,
        int $totalSymptoms,
        int $matchedRequiredSymptoms,
        int $requiredSymptoms,
    ): string {
        $segments = [
            "{$diseaseName} matched {$matchedSymptoms} of {$totalSymptoms} rule symptoms.",
            "Symptom score: {$symptomScore}%.",
        ];

        if ($riskScore !== null) {
            $segments[] = "Risk factor score: {$riskScore}%.";
        }

        if ($requiredSymptoms > 0) {
            $segments[] = "Required symptoms matched: {$matchedRequiredSymptoms} of {$requiredSymptoms}.";
        }

        return implode(' ', $segments);
    }

    /**
     * @param  array<int, array<string, mixed>>  $topMatches
     */
    protected function buildSuggestionSummary(array $topMatches): string
    {
        return collect($topMatches)
            ->map(fn (array $match) => "{$match['disease_name']} ({$match['score']}%)")
            ->implode('; ');
    }

    /**
     * @param  array<int, array<string, mixed>>  $topMatches
     */
    protected function buildExplanationSummary(array $topMatches, string $urgencyLevel, bool $emergencySelected): string
    {
        $lead = $topMatches[0];
        $parts = [
            "The highest preliminary rule-based match is {$lead['disease_name']} with a score of {$lead['score']}%.",
            $lead['explanation'],
        ];

        if (count($topMatches) > 1) {
            $parts[] = 'The system also found additional lower-confidence matches for veterinarian review.';
        }

        if ($emergencySelected) {
            $parts[] = 'At least one emergency symptom was selected, so the case urgency is set to emergency.';
        } else {
            $parts[] = "The current urgency level is {$urgencyLevel}.";
        }

        $parts[] = 'This is a system-generated suggestion and should not replace a veterinarian\'s professional diagnosis.';

        return implode(' ', $parts);
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $topMatches
     * @param  Collection<int, Symptom>  $selectedSymptoms
     */
    protected function resolveUrgencyFromTopMatches(Collection $topMatches, Collection $selectedSymptoms): string
    {
        $symptomUrgency = $this->urgencyFromSymptoms($selectedSymptoms);
        $topSeverity = $topMatches->pluck('severity')->first();
        $severityUrgency = match ($topSeverity) {
            'emergency' => 'emergency',
            'severe' => 'high',
            'moderate' => 'medium',
            default => 'low',
        };

        return $this->higherUrgency($symptomUrgency, $severityUrgency);
    }

    /**
     * @param  Collection<int, Symptom>  $selectedSymptoms
     */
    protected function urgencyFromSymptoms(Collection $selectedSymptoms): string
    {
        if ($selectedSymptoms->contains(fn (Symptom $symptom) => $symptom->severity_level === 'emergency')) {
            return 'emergency';
        }

        if ($selectedSymptoms->contains(fn (Symptom $symptom) => $symptom->severity_level === 'severe')) {
            return 'high';
        }

        if ($selectedSymptoms->contains(fn (Symptom $symptom) => $symptom->severity_level === 'moderate')) {
            return 'medium';
        }

        return 'low';
    }

    protected function higherUrgency(string $left, string $right): string
    {
        $priority = [
            'low' => 1,
            'medium' => 2,
            'high' => 3,
            'emergency' => 4,
        ];

        return ($priority[$left] ?? 1) >= ($priority[$right] ?? 1) ? $left : $right;
    }
}
