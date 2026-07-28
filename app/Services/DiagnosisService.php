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
     *     possible_conditions: array<int, array<string, mixed>>,
     *     care_recommendations: array<int, array<string, mixed>>,
     *     warnings: array<int, string>,
     *     urgency_label: string,
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
            $urgencyLevel = $emergencySelected ? 'emergency' : $this->urgencyFromSymptoms($selectedSymptoms);

            return [
                'top_matches' => [],
                'possible_conditions' => [],
                'care_recommendations' => $this->buildFallbackCareRecommendations($urgencyLevel, $selectedSymptoms),
                'warnings' => $this->buildWarnings(null, [], $urgencyLevel, $emergencySelected),
                'urgency_label' => strtoupper($urgencyLevel),
                'urgency_level' => $urgencyLevel,
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
            ->map(function (Disease $disease) use ($symptomIds, $riskFactorIds, $emergencySelected) {
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
                $matchedSymptomNames = $matchedSymptomRules
                    ->pluck('symptom.name')
                    ->filter()
                    ->values()
                    ->all();
                $missingSymptomNames = $symptomRules
                    ->reject(fn ($rule) => in_array($rule->symptom_id, $matchedSymptomRules->pluck('symptom_id')->all(), true))
                    ->pluck('symptom.name')
                    ->filter()
                    ->values()
                    ->all();

                return [
                    'disease_id' => $disease->id,
                    'disease_name' => $disease->name,
                    'score' => $finalScore,
                    'confidence' => $finalScore,
                    'symptom_score' => $symptomScore,
                    'risk_score' => $riskScore,
                    'severity' => $disease->severity_level,
                    'care_advice' => $disease->general_care_advice,
                    'requires_vet_attention' => $disease->requires_vet_attention,
                    'requires_lab_test' => $disease->requires_lab_test,
                    'matched_symptoms' => $matchedSymptomRules->count(),
                    'matched_symptom_names' => $matchedSymptomNames,
                    'missing_symptom_names' => $missingSymptomNames,
                    'matched_required_symptoms' => $matchedRequiredSymptoms,
                    'required_symptoms' => $requiredSymptoms,
                    'care_recommendations' => $this->buildCareRecommendations(
                        disease: $disease,
                        matchedSymptoms: $matchedSymptomRules->count(),
                        symptomScore: $symptomScore,
                        riskScore: $riskScore,
                        urgencyLevel: $this->urgencyFromDisease($disease->severity_level),
                    ),
                    'warnings' => $this->buildWarnings(
                        disease: $disease,
                        topMatches: [],
                        urgencyLevel: $this->urgencyFromDisease($disease->severity_level),
                        emergencySelected: $emergencySelected,
                    ),
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
            $urgencyLevel = $emergencySelected ? 'emergency' : $this->urgencyFromSymptoms($selectedSymptoms);

            return [
                'top_matches' => [],
                'possible_conditions' => [],
                'care_recommendations' => $this->buildFallbackCareRecommendations($urgencyLevel, $selectedSymptoms),
                'warnings' => $this->buildWarnings(null, [], $urgencyLevel, $emergencySelected),
                'urgency_label' => strtoupper($urgencyLevel),
                'urgency_level' => $urgencyLevel,
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
            'possible_conditions' => $this->buildPossibleConditions($topMatches),
            'care_recommendations' => $this->buildLeadCareRecommendations($topMatches),
            'warnings' => $topMatches[0]['warnings'] ?? $this->buildWarnings(null, $topMatches, $urgencyLevel, $emergencySelected),
            'urgency_label' => strtoupper($urgencyLevel),
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
     * @return array<int, array<string, mixed>>
     */
    protected function buildPossibleConditions(array $topMatches): array
    {
        return collect($topMatches)
            ->map(fn (array $match): array => [
                'disease_id' => $match['disease_id'],
                'disease_name' => $match['disease_name'],
                'confidence' => $match['confidence'],
                'matched_symptoms' => $match['matched_symptom_names'],
                'missing_symptoms' => $match['missing_symptom_names'],
                'urgency_level' => $this->urgencyFromDisease($match['severity']),
                'care_recommendations' => $match['care_recommendations'],
                'warnings' => $match['warnings'],
            ])
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $topMatches
     * @return array<int, array<string, mixed>>
     */
    protected function buildLeadCareRecommendations(array $topMatches): array
    {
        $lead = $topMatches[0] ?? null;

        if (! $lead) {
            return [];
        }

        return $lead['care_recommendations'] ?? [];
    }

    /**
     * @param  Collection<int, Symptom>  $selectedSymptoms
     * @return array<int, array<string, mixed>>
     */
    protected function buildFallbackCareRecommendations(string $urgencyLevel, Collection $selectedSymptoms): array
    {
        $recommendations = [
            'Provide clean drinking water.',
            'Reduce stress and keep the animal in a quiet, comfortable space.',
            'Keep the animal warm and maintain good hygiene around the animal.',
            'Observe appetite, drinking, breathing, and body temperature closely.',
        ];

        if ($urgencyLevel === 'high' || $urgencyLevel === 'emergency') {
            $recommendations[] = 'Seek veterinary attention as soon as possible.';
        }

        if ($selectedSymptoms->contains(fn (Symptom $symptom) => $symptom->severity_level === 'emergency')) {
            $recommendations[] = 'Treat this as urgent and arrange immediate veterinary review.';
        }

        return collect($recommendations)
            ->unique()
            ->values()
            ->map(fn (string $item): array => [
                'recommendation' => $item,
                'priority' => 'supportive',
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function buildCareRecommendations(
        Disease $disease,
        int $matchedSymptoms,
        float $symptomScore,
        ?float $riskScore,
        string $urgencyLevel,
    ): array {
        $recommendations = $this->splitCareAdvice($disease->general_care_advice);

        if ($recommendations === []) {
            $recommendations = $this->buildFallbackCareRecommendations($urgencyLevel, collect());
        }

        if ($disease->requires_vet_attention) {
            $recommendations[] = [
                'recommendation' => 'Arrange veterinary review.',
                'priority' => 'high',
            ];
        }

        if ($disease->requires_lab_test) {
            $recommendations[] = [
                'recommendation' => 'A veterinarian may recommend confirmatory testing.',
                'priority' => 'supportive',
            ];
        }

        return collect($recommendations)
            ->unique('recommendation')
            ->values()
            ->map(function (array $item, int $index) use ($matchedSymptoms, $symptomScore, $riskScore, $urgencyLevel): array {
                return [
                    'priority_order' => $index + 1,
                    'recommendation' => $item['recommendation'],
                    'priority' => $item['priority'] ?? ($index === 0 ? 'high' : 'supportive'),
                    'warning_notes' => match (true) {
                        $urgencyLevel === 'emergency' => 'Immediate veterinary attention is recommended.',
                        $urgencyLevel === 'high' => 'Monitor closely and avoid delaying care.',
                        default => null,
                    },
                    'matched_symptoms' => $matchedSymptoms,
                    'symptom_score' => $symptomScore,
                    'risk_score' => $riskScore,
                ];
            })
            ->all();
    }

    /**
     * @return array<int, string>
     */
    protected function splitCareAdvice(?string $careAdvice): array
    {
        if (! filled($careAdvice)) {
            return [];
        }

        $chunks = preg_split('/[\r\n]+|(?<=[.!?])\s+|;\s*/', $careAdvice) ?: [];

        return collect($chunks)
            ->map(fn (string $item): string => trim($item))
            ->filter()
            ->map(fn (string $item): array => [
                'recommendation' => rtrim($item, ". \t\n\r\0\x0B"),
                'priority' => 'supportive',
            ])
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<string, mixed>>  $topMatches
     * @return array<int, string>
     */
    /**
     * @param  array<int, array<string, mixed>>  $topMatches
     * @return array<int, string>
     */
    protected function buildWarnings(
        ?Disease $disease,
        array $topMatches,
        string $urgencyLevel,
        bool $emergencySelected,
    ): array
    {
        $warnings = [
            'These suggestions are generated automatically from validated veterinary knowledge and are intended to support decision-making.',
            'Final diagnosis and treatment remain the responsibility of the attending veterinarian.',
        ];

        if ($disease?->requires_vet_attention) {
            $warnings[] = 'Seek veterinary attention as soon as possible.';
        }

        if ($urgencyLevel === 'high' || $urgencyLevel === 'emergency') {
            $warnings[] = 'How Soon Your Animal Needs Care: ' . strtoupper($urgencyLevel);
        }

        if ($emergencySelected) {
            $warnings[] = 'An emergency sign was selected, so urgent veterinary review is advised.';
        }

        if (
            ($disease?->requires_lab_test ?? false)
            || collect($topMatches)->contains(fn (array $match) => (bool) ($match['requires_lab_test'] ?? false))
        ) {
            $warnings[] = 'A veterinarian may request lab tests to confirm the condition.';
        }

        return collect($warnings)->unique()->values()->all();
    }

    protected function urgencyFromDisease(string $severityLevel): string
    {
        return match ($severityLevel) {
            'emergency' => 'emergency',
            'severe' => 'high',
            'moderate' => 'medium',
            default => 'low',
        };
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
