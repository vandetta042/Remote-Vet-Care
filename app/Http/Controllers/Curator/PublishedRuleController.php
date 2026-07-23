<?php

namespace App\Http\Controllers\Curator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Curator\PublishKnowledgeSubmissionRequest;
use App\Models\KnowledgeSubmission;
use App\Models\PublishedRuleSet;
use App\Services\KnowledgePublicationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PublishedRuleController extends Controller
{
    public function __construct(
        protected KnowledgePublicationService $knowledgePublicationService,
    ) {
    }

    public function index(): Response
    {
        $approvedSubmissions = KnowledgeSubmission::query()
            ->with(['species:id,name', 'submitter:id,name', 'reviewer:id,name'])
            ->where('status', 'approved')
            ->latest('reviewed_at')
            ->latest()
            ->get();

        $publishedRuleSets = PublishedRuleSet::query()
            ->with(['disease:id,name', 'species:id,name', 'publisher:id,name'])
            ->latest('published_at')
            ->take(12)
            ->get();

        return Inertia::render('Curator/PublishedRules/Index', [
            'approvedSubmissions' => $approvedSubmissions,
            'publishedRuleSets' => $publishedRuleSets,
        ]);
    }

    public function show(KnowledgeSubmission $knowledgeSubmission): Response
    {
        abort_unless($knowledgeSubmission->status === 'approved', 404);

        $knowledgeSubmission->load([
            'species:id,name',
            'submitter:id,name',
            'reviewer:id,name',
            'symptoms',
            'riskFactors',
            'sources',
            'reviews.reviewer:id,name',
        ]);

        return Inertia::render('Curator/PublishedRules/Show', [
            'submission' => $knowledgeSubmission,
            'defaults' => [
                'name' => $knowledgeSubmission->disease_name,
                'description' => $knowledgeSubmission->summary,
                'severity_level' => 'moderate',
                'transmission_mode' => '',
                'general_care_advice' => $knowledgeSubmission->metadata['care_advice'] ?? '',
                'requires_vet_attention' => true,
                'requires_lab_test' => false,
                'version_number' => '1.0',
            ],
        ]);
    }

    public function publish(
        PublishKnowledgeSubmissionRequest $request,
        KnowledgeSubmission $knowledgeSubmission,
    ): RedirectResponse {
        abort_unless($knowledgeSubmission->status === 'approved', 404);

        $publishedRuleSet = $this->knowledgePublicationService->publish(
            submission: $knowledgeSubmission,
            curatorId: $request->user()->id,
            payload: $request->validated(),
        );

        return redirect()
            ->route('curator.published-rules.index')
            ->with('success', "Rule set {$publishedRuleSet->version_number} published successfully.");
    }
}
