<?php

namespace App\Http\Controllers\Researcher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Researcher\StoreKnowledgeSubmissionRequest;
use App\Http\Requests\Researcher\UpdateKnowledgeSubmissionRequest;
use App\Models\KnowledgeSubmission;
use App\Models\Species;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeSubmissionController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {
    }

    public function index(Request $request): Response
    {
        $submissions = KnowledgeSubmission::query()
            ->with(['species:id,name', 'reviewer:id,name'])
            ->where('submitted_by', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Researcher/KnowledgeSubmissions/Index', [
            'submissions' => $submissions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Researcher/KnowledgeSubmissions/Form', [
            'submission' => null,
            'species' => Species::orderBy('name')->get(['id', 'name']),
            'statusOptions' => ['draft', 'submitted', 'under_review', 'correction_requested', 'approved', 'rejected', 'published', 'archived'],
            'sourceTypes' => ['journal', 'textbook', 'field_report', 'guideline', 'other'],
            'evidenceLevels' => ['high', 'moderate', 'low', 'preliminary'],
            'severityLevels' => ['mild', 'moderate', 'severe', 'emergency'],
            'mode' => 'create',
        ]);
    }

    public function store(StoreKnowledgeSubmissionRequest $request): RedirectResponse
    {
        $submission = $this->persistSubmission(
            submission: new KnowledgeSubmission(),
            payload: $request->validated(),
            userId: $request->user()->id,
        );

        return redirect()
            ->route('researcher.knowledge-submissions.show', $submission)
            ->with('success', 'Knowledge submission draft created successfully.');
    }

    public function show(Request $request, KnowledgeSubmission $knowledgeSubmission): Response
    {
        $submission = $this->ownedSubmission($request, $knowledgeSubmission);
        $submission->load([
            'species:id,name',
            'reviewer:id,name',
            'curator:id,name',
            'symptoms',
            'riskFactors',
            'sources',
            'reviews.reviewer:id,name',
        ]);

        return Inertia::render('Researcher/KnowledgeSubmissions/Show', [
            'submission' => $submission,
            'canEdit' => in_array($submission->status, ['draft', 'correction_requested'], true),
            'canSubmit' => in_array($submission->status, ['draft', 'correction_requested'], true),
        ]);
    }

    public function edit(Request $request, KnowledgeSubmission $knowledgeSubmission): Response
    {
        $submission = $this->ownedSubmission($request, $knowledgeSubmission);
        abort_unless(in_array($submission->status, ['draft', 'correction_requested'], true), 403);

        $submission->load(['symptoms', 'riskFactors', 'sources']);

        return Inertia::render('Researcher/KnowledgeSubmissions/Form', [
            'submission' => $submission,
            'species' => Species::orderBy('name')->get(['id', 'name']),
            'statusOptions' => ['draft', 'submitted', 'under_review', 'correction_requested', 'approved', 'rejected', 'published', 'archived'],
            'sourceTypes' => ['journal', 'textbook', 'field_report', 'guideline', 'other'],
            'evidenceLevels' => ['high', 'moderate', 'low', 'preliminary'],
            'severityLevels' => ['mild', 'moderate', 'severe', 'emergency'],
            'mode' => 'edit',
        ]);
    }

    public function update(
        UpdateKnowledgeSubmissionRequest $request,
        KnowledgeSubmission $knowledgeSubmission,
    ): RedirectResponse {
        $submission = $this->ownedSubmission($request, $knowledgeSubmission);
        abort_unless(in_array($submission->status, ['draft', 'correction_requested'], true), 403);

        $this->persistSubmission(
            submission: $submission,
            payload: $request->validated(),
            userId: $request->user()->id,
        );

        return redirect()
            ->route('researcher.knowledge-submissions.show', $submission)
            ->with('success', 'Knowledge submission updated successfully.');
    }

    public function submit(Request $request, KnowledgeSubmission $knowledgeSubmission): RedirectResponse
    {
        $submission = $this->ownedSubmission($request, $knowledgeSubmission);
        abort_unless(in_array($submission->status, ['draft', 'correction_requested'], true), 403);

        abort_if($submission->symptoms()->count() === 0, 422, 'At least one symptom is required before submission.');
        abort_if($submission->sources()->count() === 0, 422, 'At least one evidence source is required before submission.');

        $submission->update([
            'status' => 'submitted',
            'submitted_at' => now(),
            'reviewed_at' => null,
        ]);

        $this->notificationService->notifyRole(
            User::ROLE_REVIEWER,
            'Knowledge submission awaiting review',
            "\"{$submission->title}\" has been submitted for reviewer assessment.",
        );

        return redirect()
            ->route('researcher.knowledge-submissions.show', $submission)
            ->with('success', 'Knowledge submission sent for review.');
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function persistSubmission(
        KnowledgeSubmission $submission,
        array $payload,
        int $userId,
    ): KnowledgeSubmission {
        $metadata = $payload['metadata'] ?? null;
        if (is_array($metadata)) {
            $metadata['care_recommendations'] = $metadata['care_recommendations']
                ?? $metadata['care_advice']
                ?? null;
        }

        $submission->fill([
            'submitted_by' => $userId,
            'title' => $payload['title'],
            'disease_name' => $payload['disease_name'] ?? null,
            'species_id' => $payload['species_id'] ?? null,
            'summary' => $payload['summary'],
            'source_type' => $payload['source_type'] ?? null,
            'source_reference' => $payload['source_reference'] ?? null,
            'evidence_level' => $payload['evidence_level'] ?? null,
            'metadata' => $metadata,
            'status' => $payload['status'] ?? 'draft',
        ])->save();

        $submission->symptoms()->delete();
        foreach ($payload['symptoms'] ?? [] as $symptom) {
            if (! $this->rowHasContent($symptom, ['symptom_name'])) {
                continue;
            }

            $submission->symptoms()->create([
                'symptom_name' => $symptom['symptom_name'],
                'symptom_description' => $symptom['symptom_description'] ?? null,
                'symptom_weight' => $symptom['symptom_weight'] ?? 1,
                'severity_level' => $symptom['severity_level'] ?? null,
            ]);
        }

        $submission->riskFactors()->delete();
        foreach ($payload['risk_factors'] ?? [] as $riskFactor) {
            if (! $this->rowHasContent($riskFactor, ['risk_factor_name'])) {
                continue;
            }

            $submission->riskFactors()->create([
                'risk_factor_name' => $riskFactor['risk_factor_name'],
                'weight' => $riskFactor['weight'] ?? 1,
            ]);
        }

        $submission->sources()->delete();
        foreach ($payload['sources'] ?? [] as $source) {
            if (! $this->rowHasContent($source, ['source_title', 'source_url', 'source_author'])) {
                continue;
            }

            $submission->sources()->create([
                'source_title' => $source['source_title'] ?? null,
                'source_author' => $source['source_author'] ?? null,
                'source_year' => $source['source_year'] ?? null,
                'source_url' => $source['source_url'] ?? null,
                'source_type' => $source['source_type'] ?? null,
                'notes' => $source['notes'] ?? null,
            ]);
        }

        return $submission->fresh(['symptoms', 'riskFactors', 'sources']);
    }

    /**
     * @param  array<string, mixed>  $row
     * @param  array<int, string>  $keys
     */
    protected function rowHasContent(array $row, array $keys): bool
    {
        foreach ($keys as $key) {
            if (filled($row[$key] ?? null)) {
                return true;
            }
        }

        return false;
    }

    protected function ownedSubmission(Request $request, KnowledgeSubmission $knowledgeSubmission): KnowledgeSubmission
    {
        abort_unless($knowledgeSubmission->submitted_by === $request->user()->id, 403);

        return $knowledgeSubmission;
    }
}
