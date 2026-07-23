<?php

namespace Tests\Feature;

use App\Models\KnowledgeSubmission;
use App\Models\Species;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CuratorPublicationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_curator_can_publish_an_approved_submission_into_rules(): void
    {
        $curator = User::factory()->create([
            'role' => User::ROLE_CURATOR,
        ]);
        $researcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);
        $species = Species::create([
            'name' => 'Dog',
        ]);

        $submission = KnowledgeSubmission::create([
            'submitted_by' => $researcher->id,
            'title' => 'Canine parvo approved record',
            'disease_name' => 'Canine Parvovirus',
            'species_id' => $species->id,
            'summary' => 'An approved knowledge entry ready for publication into structured rules.',
            'status' => 'approved',
            'reviewed_at' => now(),
            'metadata' => [
                'care_advice' => 'Immediate isolation and hydration support.',
            ],
        ]);

        $submission->symptoms()->create([
            'symptom_name' => 'Vomiting',
            'symptom_weight' => 4,
            'severity_level' => 'severe',
        ]);
        $submission->riskFactors()->create([
            'risk_factor_name' => 'Poor sanitation',
            'weight' => 2,
        ]);

        $response = $this->actingAs($curator)->post(
            route('curator.published-rules.publish', $submission),
            [
                'name' => 'Canine Parvovirus',
                'description' => 'Published disease rule set for canine parvovirus.',
                'severity_level' => 'severe',
                'transmission_mode' => 'contact',
                'general_care_advice' => 'Immediate isolation and hydration support.',
                'requires_vet_attention' => true,
                'requires_lab_test' => true,
                'version_number' => '1.0',
            ]
        );

        $response->assertRedirect(route('curator.published-rules.index', absolute: false));
        $this->assertDatabaseHas('diseases', [
            'name' => 'Canine Parvovirus',
            'species_id' => $species->id,
        ]);
        $this->assertDatabaseHas('published_rule_sets', [
            'species_id' => $species->id,
            'version_number' => '1.0',
            'is_active' => true,
            'published_by' => $curator->id,
        ]);
        $this->assertDatabaseHas('knowledge_submissions', [
            'id' => $submission->id,
            'status' => 'published',
            'curator_id' => $curator->id,
        ]);
        $this->assertDatabaseCount('disease_symptom_rules', 1);
        $this->assertDatabaseCount('disease_risk_factor_rules', 1);
    }
}
