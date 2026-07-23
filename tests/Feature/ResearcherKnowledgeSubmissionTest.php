<?php

namespace Tests\Feature;

use App\Models\KnowledgeReview;
use App\Models\KnowledgeSubmission;
use App\Models\Species;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResearcherKnowledgeSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_researcher_can_create_a_knowledge_submission_draft(): void
    {
        $researcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);
        $species = Species::create([
            'name' => 'Dog',
        ]);

        $response = $this->actingAs($researcher)->post(
            route('researcher.knowledge-submissions.store'),
            [
                'title' => 'Canine fever literature note',
                'disease_name' => 'Canine Fever Syndrome',
                'species_id' => $species->id,
                'summary' => 'A structured summary of fever-related disease presentation in dogs with early evidence sources and symptom weighting.',
                'source_type' => 'journal',
                'source_reference' => 'J-2026-001',
                'evidence_level' => 'moderate',
                'status' => 'draft',
                'metadata' => [
                    'affected_species_note' => 'Mostly domestic dogs.',
                    'severity_note' => 'Often moderate but may escalate.',
                    'care_advice' => 'Isolate and monitor hydration.',
                ],
                'symptoms' => [
                    [
                        'symptom_name' => 'Fever',
                        'symptom_description' => 'High body temperature with lethargy.',
                        'symptom_weight' => 3,
                        'severity_level' => 'moderate',
                    ],
                ],
                'risk_factors' => [
                    [
                        'risk_factor_name' => 'Crowded housing',
                        'weight' => 2,
                    ],
                ],
                'sources' => [
                    [
                        'source_title' => 'Veterinary Journal Article',
                        'source_author' => 'A. Author',
                        'source_year' => '2025',
                        'source_url' => 'https://example.com/article',
                        'source_type' => 'journal',
                        'notes' => 'Peer-reviewed source.',
                    ],
                ],
            ]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('knowledge_submissions', [
            'submitted_by' => $researcher->id,
            'title' => 'Canine fever literature note',
            'status' => 'draft',
        ]);
        $this->assertDatabaseCount('knowledge_submission_symptoms', 1);
        $this->assertDatabaseCount('knowledge_submission_risk_factors', 1);
        $this->assertDatabaseCount('knowledge_sources', 1);
    }

    public function test_researcher_can_submit_a_draft_for_review(): void
    {
        $researcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);
        $submission = KnowledgeSubmission::create([
            'submitted_by' => $researcher->id,
            'title' => 'Goat respiratory summary',
            'summary' => 'This draft contains enough structured information to move into the reviewer queue safely for validation.',
            'status' => 'draft',
        ]);
        $submission->symptoms()->create([
            'symptom_name' => 'Coughing',
            'symptom_weight' => 2,
        ]);
        $submission->sources()->create([
            'source_title' => 'Field guide',
            'source_type' => 'guideline',
        ]);

        $response = $this->actingAs($researcher)->post(
            route('researcher.knowledge-submissions.submit', $submission)
        );

        $response->assertRedirect(route('researcher.knowledge-submissions.show', $submission, false));
        $this->assertDatabaseHas('knowledge_submissions', [
            'id' => $submission->id,
            'status' => 'submitted',
        ]);
    }

    public function test_researcher_cannot_view_another_researcher_submission(): void
    {
        $researcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);
        $otherResearcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);
        $submission = KnowledgeSubmission::create([
            'submitted_by' => $otherResearcher->id,
            'title' => 'Private submission',
            'summary' => 'This should stay private to the owner researcher account only.',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($researcher)->get(
            route('researcher.knowledge-submissions.show', $submission)
        );

        $response->assertForbidden();
    }
}
