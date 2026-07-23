<?php

namespace Tests\Feature;

use App\Models\KnowledgeSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewerKnowledgeWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_reviewer_can_record_a_correction_request(): void
    {
        $reviewer = User::factory()->create([
            'role' => User::ROLE_REVIEWER,
        ]);
        $researcher = User::factory()->create([
            'role' => User::ROLE_RESEARCHER,
        ]);

        $submission = KnowledgeSubmission::create([
            'submitted_by' => $researcher->id,
            'title' => 'Goat digestive note',
            'summary' => 'A researcher submission that is ready for reviewer feedback and correction handling.',
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($reviewer)->post(
            route('reviewer.knowledge-reviews.store', $submission),
            [
                'decision' => 'correction_requested',
                'comments' => 'Please clarify the evidence source and symptom weights.',
            ]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('knowledge_submissions', [
            'id' => $submission->id,
            'status' => 'correction_requested',
            'reviewer_id' => $reviewer->id,
        ]);
        $this->assertDatabaseHas('knowledge_reviews', [
            'knowledge_submission_id' => $submission->id,
            'reviewed_by' => $reviewer->id,
            'decision' => 'correction_requested',
        ]);
    }
}
