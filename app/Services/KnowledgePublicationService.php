<?php

namespace App\Services;

use App\Models\Disease;
use App\Models\KnowledgeSubmission;
use App\Models\PublishedRuleSet;
use App\Models\RiskFactor;
use App\Models\Symptom;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class KnowledgePublicationService
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function publish(
        KnowledgeSubmission $submission,
        int $curatorId,
        array $payload,
    ): PublishedRuleSet {
        return DB::transaction(function () use ($submission, $curatorId, $payload) {
            $submission->loadMissing(['symptoms', 'riskFactors', 'species']);
            $metadata = $submission->metadata ?? [];
            $careRecommendations = $this->normalizeCareRecommendations(
                $payload['care_recommendations'] ?? null,
                $metadata['care_recommendations'] ?? $metadata['care_advice'] ?? null,
            );
            $generalCareAdvice = $payload['general_care_advice']
                ?? (! empty($careRecommendations) ? implode("\n", $careRecommendations) : null);

            $disease = Disease::updateOrCreate(
                [
                    'species_id' => $submission->species_id,
                    'name' => $payload['name'],
                ],
                [
                    'description' => $payload['description'] ?? null,
                    'severity_level' => $payload['severity_level'],
                    'transmission_mode' => $payload['transmission_mode'] ?? null,
                    'general_care_advice' => $generalCareAdvice,
                    'requires_vet_attention' => (bool) $payload['requires_vet_attention'],
                    'requires_lab_test' => (bool) $payload['requires_lab_test'],
                ],
            );

            $symptomRulePayload = [];
            foreach ($submission->symptoms as $submissionSymptom) {
                $symptom = Symptom::firstOrCreate(
                    ['name' => $submissionSymptom->symptom_name],
                    [
                        'description' => $submissionSymptom->symptom_description,
                        'severity_level' => $submissionSymptom->severity_level ?: 'moderate',
                    ],
                );

                if (! $symptom->description && $submissionSymptom->symptom_description) {
                    $symptom->update(['description' => $submissionSymptom->symptom_description]);
                }

                $symptomRulePayload[$symptom->id] = [
                    'weight' => $submissionSymptom->symptom_weight,
                    'is_required' => $submissionSymptom->symptom_weight >= 3,
                    'notes' => $submissionSymptom->symptom_description,
                ];
            }

            $riskFactorRulePayload = [];
            foreach ($submission->riskFactors as $submissionRiskFactor) {
                $riskFactor = RiskFactor::firstOrCreate(
                    ['name' => $submissionRiskFactor->risk_factor_name],
                );

                $riskFactorRulePayload[$riskFactor->id] = [
                    'weight' => $submissionRiskFactor->weight,
                ];
            }

            $disease->symptoms()->sync($symptomRulePayload);
            $disease->riskFactors()->sync($riskFactorRulePayload);

            $disease->publishedRuleSets()->update(['is_active' => false]);

            $publishedRuleSet = PublishedRuleSet::create([
                'disease_id' => $disease->id,
                'species_id' => $submission->species_id,
                'version_number' => $payload['version_number'],
                'rules_json' => [
                    'submission_id' => $submission->id,
                    'care_recommendations' => $careRecommendations,
                    'care_urgency_level' => $payload['care_urgency_level'] ?? null,
                    'symptoms' => array_values(array_map(
                        fn ($symptomId, $rule) => [
                            'symptom_id' => $symptomId,
                            'weight' => $rule['weight'],
                            'is_required' => $rule['is_required'],
                        ],
                        array_keys($symptomRulePayload),
                        $symptomRulePayload,
                    )),
                    'risk_factors' => array_values(array_map(
                        fn ($riskFactorId, $rule) => [
                            'risk_factor_id' => $riskFactorId,
                            'weight' => $rule['weight'],
                        ],
                        array_keys($riskFactorRulePayload),
                        $riskFactorRulePayload,
                    )),
                ],
                'published_by' => $curatorId,
                'is_active' => true,
                'published_at' => now(),
            ]);

            $submission->update([
                'status' => 'published',
                'curator_id' => $curatorId,
                'published_at' => now(),
            ]);

            $this->notificationService->notifyUser(
                $submission->submitted_by,
                'Knowledge published',
                "\"{$submission->title}\" has been published into the live diagnosis rule base.",
            );

            $this->notificationService->notifyRole(
                User::ROLE_ADMIN,
                'Rule set published',
                "A new rule set for {$disease->name} version {$payload['version_number']} is now active.",
            );

            return $publishedRuleSet;
        });
    }

    /**
     * @param  array<int, string>|string|null  $value
     * @return array<int, string>
     */
    protected function normalizeCareRecommendations(array|string|null $value, array|string|null $fallback = null): array
    {
        $candidate = $value ?? $fallback;

        if (is_array($candidate)) {
            return array_values(array_filter(array_map(
                static fn ($item) => trim((string) $item),
                $candidate,
            ), static fn (string $item) => $item !== ''));
        }

        if (! is_string($candidate) || trim($candidate) === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $candidate) ?: [];

        return array_values(array_filter(array_map(
            static fn (string $line) => trim(ltrim($line, "-* \t")),
            $lines,
        ), static fn (string $item) => $item !== ''));
    }
}
