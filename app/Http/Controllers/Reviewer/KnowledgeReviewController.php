<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reviewer\ReviewKnowledgeSubmissionRequest;
use App\Models\KnowledgeSubmission;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeReviewController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {
    }

    public function index(): Response
    {
        $pendingSubmissions = KnowledgeSubmission::query()
            ->with(['species:id,name', 'submitter:id,name'])
            ->whereIn('status', ['submitted', 'under_review', 'correction_requested'])
            ->latest('submitted_at')
            ->latest()
            ->get();

        return Inertia::render('Reviewer/KnowledgeReviews/Index', [
            'submissions' => $pendingSubmissions,
        ]);
    }

    public function show(KnowledgeSubmission $knowledgeSubmission): Response
    {
        $knowledgeSubmission->load([
            'species:id,name',
            'submitter:id,name,email',
            'reviewer:id,name',
            'symptoms',
            'riskFactors',
            'sources',
            'reviews.reviewer:id,name',
        ]);

        return Inertia::render('Reviewer/KnowledgeReviews/Show', [
            'submission' => $knowledgeSubmission,
            'decisionOptions' => ['approved', 'rejected', 'correction_requested'],
        ]);
    }

    public function store(
        ReviewKnowledgeSubmissionRequest $request,
        KnowledgeSubmission $knowledgeSubmission,
    ): RedirectResponse {
        $validated = $request->validated();

        $knowledgeSubmission->reviews()->create([
            'reviewed_by' => $request->user()->id,
            'decision' => $validated['decision'],
            'comments' => $validated['comments'] ?? null,
            'reviewed_at' => now(),
        ]);

        $knowledgeSubmission->update([
            'status' => match ($validated['decision']) {
                'approved' => 'approved',
                'rejected' => 'rejected',
                default => 'correction_requested',
            },
            'reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $this->notificationService->notifyUser(
            $knowledgeSubmission->submitted_by,
            'Knowledge review update',
            "Your submission \"{$knowledgeSubmission->title}\" was marked {$validated['decision']}.",
        );

        if ($validated['decision'] === 'approved') {
            $this->notificationService->notifyRole(
                User::ROLE_CURATOR,
                'Approved knowledge ready for curation',
                "\"{$knowledgeSubmission->title}\" is approved and ready for rule publication.",
            );
        }

        return redirect()
            ->route('reviewer.knowledge-reviews.show', $knowledgeSubmission)
            ->with('success', 'Review decision recorded successfully.');
    }
}
