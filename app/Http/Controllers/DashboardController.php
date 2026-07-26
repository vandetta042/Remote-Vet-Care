<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\KnowledgeSubmission;
use App\Models\PublishedRuleSet;
use App\Models\User;
use App\Models\VeterinaryCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $user = $request->user();

        return redirect()->route(match ($user->role) {
            User::ROLE_ADMIN => 'admin.dashboard',
            User::ROLE_VET => 'vet.dashboard',
            User::ROLE_RESEARCHER => 'researcher.dashboard',
            User::ROLE_REVIEWER => 'reviewer.dashboard',
            User::ROLE_CURATOR => 'curator.dashboard',
            default => 'owner.dashboard',
        });
    }

    public function owner(Request $request): Response
    {
        $user = $request->user();

        return $this->renderDashboard(
            title: 'Home',
            roleLabel: 'Animal Owner',
            description: 'What do you want to do for your animal today?',
            stats: [
                ['label' => 'Animals Registered', 'value' => Animal::where('owner_id', $user->id)->count(), 'tone' => 'neutral'],
                ['label' => 'Care Requests', 'value' => VeterinaryCase::where('owner_id', $user->id)->count(), 'tone' => 'neutral'],
                ['label' => 'Waiting for Vet', 'value' => VeterinaryCase::where('owner_id', $user->id)->whereIn('status', ['submitted', 'under_review'])->count(), 'tone' => 'warning'],
                ['label' => 'Vet Replies', 'value' => VeterinaryCase::where('owner_id', $user->id)->where('status', 'vet_responded')->count(), 'tone' => 'success'],
                ['label' => 'Emergency Signs', 'value' => VeterinaryCase::where('owner_id', $user->id)->where('urgency_level', 'emergency')->count(), 'tone' => 'danger'],
            ],
            quickLinks: [
                ['label' => 'Report a Sick Animal', 'href' => route('owner.cases.create'), 'description' => 'Share the signs you noticed, the details, and any photo or document you want the vet to see.'],
                ['label' => 'My Animals', 'href' => route('owner.animals.index'), 'description' => 'Keep each animal profile ready for faster care requests.'],
                ['label' => 'My Care Requests', 'href' => route('owner.cases.index'), 'description' => 'See every request, current status, and any updates from the vet.'],
                ['label' => 'Vet Replies', 'href' => route('owner.cases.index'), 'description' => "Open a care request to read the vet's advice and next steps."],
                ['label' => 'Emergency Signs', 'href' => '#emergency-signs', 'description' => 'Check the warning signs that need urgent help right away.'],
            ],
            spotlight: [
                'Use the big action cards above when you want to start quickly.',
                "Each care request will show a system suggestion, then the veterinarian's advice.",
                'The emergency section explains when to seek urgent help right away.',
            ],
        );
    }

    public function vet(): Response
    {
        return $this->renderDashboard(
            title: 'Dashboard',
            roleLabel: 'Veterinarian',
            description: 'Sort new care requests, check emergencies first, and respond with clear advice.',
            stats: [
                ['label' => 'New Care Requests', 'value' => VeterinaryCase::where('status', 'submitted')->count(), 'tone' => 'warning'],
                ['label' => 'Waiting for Vet Response', 'value' => VeterinaryCase::where('status', 'under_review')->count(), 'tone' => 'neutral'],
                ['label' => 'Emergency Cases', 'value' => VeterinaryCase::whereIn('urgency_level', ['high', 'emergency'])->count(), 'tone' => 'danger'],
                ['label' => 'Vet Replied', 'value' => VeterinaryCase::where('status', 'vet_responded')->count(), 'tone' => 'success'],
                ['label' => 'Resolved Cases', 'value' => VeterinaryCase::whereIn('status', ['resolved', 'closed'])->count(), 'tone' => 'neutral'],
            ],
            quickLinks: [
                ['label' => 'New Care Requests', 'href' => route('vet.cases.index'), 'description' => 'Open the newest requests waiting for your review.'],
                ['label' => 'Emergency Cases', 'href' => route('vet.cases.index', ['filter' => 'emergency']), 'description' => 'Jump straight to the highest-priority animals.'],
                ['label' => 'Waiting for Vet Response', 'href' => route('vet.cases.index', ['filter' => 'waiting']), 'description' => 'Review requests still awaiting a response.'],
                ['label' => 'Resolved Cases', 'href' => route('vet.cases.index', ['filter' => 'resolved']), 'description' => 'See completed care requests and prior advice.'],
            ],
            spotlight: [
                'New requests and emergency cases should be handled first.',
                'The case screen keeps the animal profile, signs noticed, and attachments together.',
                'Your diagnosis and advice are saved back to the same care request for the owner to read.',
            ],
        );
    }

    public function researcher(Request $request): Response
    {
        $user = $request->user();

        return $this->renderDashboard(
            title: 'Researcher Dashboard',
            roleLabel: 'Researcher',
            description: 'Feed evidence-backed veterinary knowledge into the review and publication pipeline.',
            stats: [
                ['label' => 'My Submissions', 'value' => KnowledgeSubmission::where('submitted_by', $user->id)->count(), 'tone' => 'neutral'],
                ['label' => 'Drafts', 'value' => KnowledgeSubmission::where('submitted_by', $user->id)->where('status', 'draft')->count(), 'tone' => 'neutral'],
                ['label' => 'Under Review', 'value' => KnowledgeSubmission::where('submitted_by', $user->id)->whereIn('status', ['submitted', 'under_review'])->count(), 'tone' => 'warning'],
                ['label' => 'Corrections Needed', 'value' => KnowledgeSubmission::where('submitted_by', $user->id)->where('status', 'correction_requested')->count(), 'tone' => 'danger'],
                ['label' => 'Published', 'value' => KnowledgeSubmission::where('submitted_by', $user->id)->where('status', 'published')->count(), 'tone' => 'success'],
            ],
            quickLinks: [
                ['label' => 'New Submission', 'href' => route('researcher.knowledge-submissions.create'), 'description' => 'Create a structured draft with symptoms, risks, and evidence sources.'],
                ['label' => 'My Submissions', 'href' => route('researcher.knowledge-submissions.index'), 'description' => 'Track draft, submitted, and correction-requested entries.'],
                ['label' => 'Review Feedback', 'href' => route('researcher.knowledge-submissions.index'), 'description' => 'See reviewer comments and update drafts when corrections are requested.'],
            ],
            spotlight: [
                'Researcher knowledge is not meant to go straight to diagnosis without review.',
                'The submission, review, and curator pipeline has been modeled in the database already.',
                'Phase 5 has now turned this dashboard into the main knowledge entry area.',
            ],
        );
    }

    public function reviewer(): Response
    {
        return $this->renderDashboard(
            title: 'Reviewer Dashboard',
            roleLabel: 'Veterinary Reviewer',
            description: 'Review researcher submissions and control what proceeds toward the published rule base.',
            stats: [
                ['label' => 'Pending Reviews', 'value' => KnowledgeSubmission::where('status', 'submitted')->count(), 'tone' => 'warning'],
                ['label' => 'Under Review', 'value' => KnowledgeSubmission::where('status', 'under_review')->count(), 'tone' => 'neutral'],
                ['label' => 'Correction Requests', 'value' => KnowledgeSubmission::where('status', 'correction_requested')->count(), 'tone' => 'danger'],
                ['label' => 'Approved Items', 'value' => KnowledgeSubmission::where('status', 'approved')->count(), 'tone' => 'success'],
                ['label' => 'Rejected Items', 'value' => KnowledgeSubmission::where('status', 'rejected')->count(), 'tone' => 'neutral'],
            ],
            quickLinks: [
                ['label' => 'Review Queue', 'href' => route('reviewer.knowledge-reviews.index'), 'description' => 'Open submitted knowledge records and record formal review decisions.'],
                ['label' => 'Approve or Reject', 'href' => route('reviewer.knowledge-reviews.index'), 'description' => 'Approved items move to curation, while rejected or correction items go back with feedback.'],
                ['label' => 'Feedback Trail', 'href' => route('reviewer.knowledge-reviews.index'), 'description' => 'Every decision creates a review record with comments and timestamps.'],
            ],
            spotlight: [
                'Only reviewer accounts can access this route group.',
                'Approved knowledge will be handed to curators rather than used directly.',
                'Phase 6 now keeps the diagnosis engine tied to vetted and published rules only.',
            ],
        );
    }

    public function curator(): Response
    {
        return $this->renderDashboard(
            title: 'Curator Dashboard',
            roleLabel: 'Data Curator',
            description: 'Structure approved veterinary knowledge into clean disease, symptom, and rule records.',
            stats: [
                ['label' => 'Approved Queue', 'value' => KnowledgeSubmission::where('status', 'approved')->count(), 'tone' => 'warning'],
                ['label' => 'Published Rules', 'value' => PublishedRuleSet::count(), 'tone' => 'success'],
                ['label' => 'Active Rule Sets', 'value' => PublishedRuleSet::where('is_active', true)->count(), 'tone' => 'neutral'],
                ['label' => 'Diseases Ready', 'value' => KnowledgeSubmission::where('status', 'approved')->whereNotNull('species_id')->count(), 'tone' => 'neutral'],
                ['label' => 'Archived Items', 'value' => KnowledgeSubmission::where('status', 'archived')->count(), 'tone' => 'neutral'],
            ],
            quickLinks: [
                ['label' => 'Approved Knowledge Queue', 'href' => route('curator.published-rules.index'), 'description' => 'Open approved submissions that are ready for structuring and publication.'],
                ['label' => 'Publish Rule Set', 'href' => route('curator.published-rules.index'), 'description' => 'Create live disease, symptom, risk factor, and rule records from validated knowledge.'],
                ['label' => 'Published Rules', 'href' => route('curator.published-rules.index'), 'description' => 'Review recent published rule sets already feeding the diagnosis engine.'],
            ],
            spotlight: [
                'The curator role separates data cleaning from reviewer approval.',
                'Published rule sets are already first-class records in the schema.',
                'Phase 6 now turns approved knowledge into active rule sets for diagnosis.',
            ],
        );
    }

    public function admin(): Response
    {
        return $this->renderDashboard(
            title: 'Admin Dashboard',
            roleLabel: 'Administrator',
            description: 'Oversee users, veterinary cases, knowledge flow, and published rule coverage across the platform.',
            stats: [
                ['label' => 'Total Users', 'value' => User::count(), 'tone' => 'neutral'],
                ['label' => 'Animal Owners', 'value' => User::where('role', User::ROLE_OWNER)->count(), 'tone' => 'neutral'],
                ['label' => 'Veterinarians', 'value' => User::where('role', User::ROLE_VET)->count(), 'tone' => 'neutral'],
                ['label' => 'Researchers', 'value' => User::where('role', User::ROLE_RESEARCHER)->count(), 'tone' => 'neutral'],
                ['label' => 'Total Cases', 'value' => VeterinaryCase::count(), 'tone' => 'warning'],
                ['label' => 'Emergency Cases', 'value' => VeterinaryCase::where('urgency_level', 'emergency')->count(), 'tone' => 'danger'],
                ['label' => 'Pending Knowledge', 'value' => KnowledgeSubmission::whereIn('status', ['submitted', 'under_review', 'correction_requested'])->count(), 'tone' => 'warning'],
                ['label' => 'Published Rules', 'value' => PublishedRuleSet::count(), 'tone' => 'success'],
            ],
            quickLinks: [
                ['label' => 'Manage Users', 'href' => route('admin.users.index'), 'description' => 'Review every user account, role, and contact record in one place.'],
                ['label' => 'Care Requests', 'href' => route('admin.cases.index'), 'description' => 'Monitor the animal care queue, serious cases, and response progress.'],
                ['label' => 'Knowledge Oversight', 'href' => route('admin.knowledge.index'), 'description' => 'Follow the research, review, and publication pipeline end to end.'],
                ['label' => 'Dashboard Summary', 'href' => route('admin.dashboard'), 'description' => 'Return to the high-level operations overview anytime.'],
            ],
            spotlight: [
                'This is the top-level operational view for the platform.',
                'The counts are already live against the new database structure.',
                'The admin navigation now opens real oversight screens instead of looping back to the dashboard.',
            ],
        );
    }

    public function adminUsers(): Response
    {
        $users = User::query()
            ->withCount(['animals', 'ownedVeterinaryCases', 'knowledgeSubmissions'])
            ->latest()
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status ?? 'active',
                'phone' => $user->phone,
                'address' => $user->address,
                'created_at' => $user->created_at?->format('M j, Y'),
                'animals_count' => $user->animals_count,
                'cases_count' => $user->owned_veterinary_cases_count,
                'knowledge_submissions_count' => $user->knowledge_submissions_count,
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => [
                ['label' => 'Total Users', 'value' => User::count()],
                ['label' => 'Animal Owners', 'value' => User::where('role', User::ROLE_OWNER)->count()],
                ['label' => 'Veterinarians', 'value' => User::where('role', User::ROLE_VET)->count()],
                ['label' => 'Researchers', 'value' => User::where('role', User::ROLE_RESEARCHER)->count()],
                ['label' => 'Reviewers', 'value' => User::where('role', User::ROLE_REVIEWER)->count()],
                ['label' => 'Curators', 'value' => User::where('role', User::ROLE_CURATOR)->count()],
            ],
        ]);
    }

    public function adminCases(): Response
    {
        $cases = VeterinaryCase::query()
            ->with(['owner', 'animal.species', 'assignedVet', 'symptoms'])
            ->withCount('attachments')
            ->latest()
            ->get()
            ->map(fn (VeterinaryCase $case): array => [
                'id' => $case->id,
                'title' => $case->title,
                'description' => $case->description,
                'status' => $case->status,
                'urgency_level' => $case->urgency_level,
                'system_suggestion' => $case->system_suggestion,
                'system_score' => $case->system_score,
                'owner' => [
                    'name' => $case->owner?->name,
                    'email' => $case->owner?->email,
                ],
                'animal' => [
                    'name' => $case->animal?->name,
                    'species' => $case->animal?->species?->name,
                ],
                'assigned_vet' => $case->assignedVet?->name,
                'signs' => $case->symptoms->pluck('name')->take(4)->values()->all(),
                'attachments_count' => $case->attachments_count,
                'follow_up_date' => $case->follow_up_date?->format('M j, Y'),
            ]);

        return Inertia::render('Admin/Cases/Index', [
            'cases' => $cases,
            'stats' => [
                ['label' => 'Total Care Requests', 'value' => VeterinaryCase::count()],
                ['label' => 'New Requests', 'value' => VeterinaryCase::where('status', 'submitted')->count()],
                ['label' => 'Waiting for Vet', 'value' => VeterinaryCase::where('status', 'under_review')->count()],
                ['label' => 'Emergency Cases', 'value' => VeterinaryCase::where('urgency_level', 'emergency')->count()],
                ['label' => 'Resolved', 'value' => VeterinaryCase::whereIn('status', ['resolved', 'closed'])->count()],
            ],
        ]);
    }

    public function adminKnowledge(): Response
    {
        $submissions = KnowledgeSubmission::query()
            ->with(['submitter', 'reviewer', 'curator', 'species'])
            ->withCount('reviews')
            ->latest()
            ->get()
            ->map(fn (KnowledgeSubmission $submission): array => [
                'id' => $submission->id,
                'title' => $submission->title,
                'disease_name' => $submission->disease_name,
                'summary' => $submission->summary,
                'source_type' => $submission->source_type,
                'evidence_level' => $submission->evidence_level,
                'status' => $submission->status,
                'submitted_at' => $submission->submitted_at?->format('M j, Y'),
                'reviewed_at' => $submission->reviewed_at?->format('M j, Y'),
                'published_at' => $submission->published_at?->format('M j, Y'),
                'reviews_count' => $submission->reviews_count,
                'submitter' => $submission->submitter?->name,
                'reviewer' => $submission->reviewer?->name,
                'curator' => $submission->curator?->name,
                'species' => $submission->species?->name,
            ]);

        $publishedRuleSets = PublishedRuleSet::query()
            ->with(['disease', 'species', 'publisher'])
            ->latest('published_at')
            ->get()
            ->map(fn (PublishedRuleSet $ruleSet): array => [
                'id' => $ruleSet->id,
                'version_number' => $ruleSet->version_number,
                'is_active' => $ruleSet->is_active,
                'published_at' => $ruleSet->published_at?->format('M j, Y'),
                'disease' => $ruleSet->disease?->name,
                'species' => $ruleSet->species?->name,
                'publisher' => $ruleSet->publisher?->name,
            ]);

        return Inertia::render('Admin/Knowledge/Index', [
            'submissions' => $submissions,
            'publishedRuleSets' => $publishedRuleSets,
            'stats' => [
                ['label' => 'Pending Review', 'value' => KnowledgeSubmission::whereIn('status', ['submitted', 'under_review', 'correction_requested'])->count()],
                ['label' => 'Approved', 'value' => KnowledgeSubmission::where('status', 'approved')->count()],
                ['label' => 'Published Rules', 'value' => PublishedRuleSet::count()],
                ['label' => 'Active Rules', 'value' => PublishedRuleSet::where('is_active', true)->count()],
            ],
        ]);
    }

    /**
     * @param  array<int, array{label:string, value:int, tone:string}>  $stats
     * @param  array<int, array{label:string, href:string, description:string}>  $quickLinks
     * @param  array<int, string>  $spotlight
     */
    protected function renderDashboard(
        string $title,
        string $roleLabel,
        string $description,
        array $stats,
        array $quickLinks,
        array $spotlight,
    ): Response {
        return Inertia::render('Portal/Dashboard', [
            'title' => $title,
            'roleLabel' => $roleLabel,
            'description' => $description,
            'stats' => $stats,
            'quickLinks' => $quickLinks,
            'spotlight' => $spotlight,
        ]);
    }
}
