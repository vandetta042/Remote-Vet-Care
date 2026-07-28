<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\StoreVeterinaryCaseRequest;
use App\Models\Animal;
use App\Models\RiskFactor;
use App\Models\Symptom;
use App\Models\VeterinaryCase;
use App\Services\DiagnosisService;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VeterinaryCaseController extends Controller
{
    public function __construct(
        protected DiagnosisService $diagnosisService,
        protected NotificationService $notificationService,
    ) {
    }

    public function index(Request $request): Response
    {
        $cases = VeterinaryCase::query()
            ->with(['animal:id,name', 'assignedVet:id,name', 'symptoms:id,name,severity_level'])
            ->where('owner_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Owner/Cases/Index', [
            'cases' => $cases,
        ]);
    }

    public function create(Request $request): Response
    {
        $animals = Animal::query()
            ->with('species:id,name')
            ->where('owner_id', $request->user()->id)
            ->orderBy('name')
            ->get(['id', 'name', 'species_id']);

        return Inertia::render('Owner/Cases/Form', [
            'animals' => $animals,
            'symptoms' => Symptom::orderBy('name')->get(['id', 'name', 'severity_level', 'body_system']),
            'riskFactors' => RiskFactor::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreVeterinaryCaseRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $animal = Animal::query()
            ->with('species:id,name')
            ->where('owner_id', $request->user()->id)
            ->findOrFail($validated['animal_id']);

        $diagnosis = $this->diagnosisService->analyze(
            speciesId: $animal->species_id,
            symptomIds: $validated['symptom_ids'] ?? [],
            riskFactorIds: $validated['risk_factor_ids'] ?? [],
            animalDetails: [
                'name' => $animal->name,
                'species' => $animal->species?->name,
                'age' => $animal->age,
                'gender' => $animal->gender,
                'medical_history' => $animal->medical_history,
            ],
            caseDescription: $validated['description'],
        );

        $case = VeterinaryCase::create([
            'owner_id' => $request->user()->id,
            'animal_id' => $animal->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'duration' => $validated['duration'] ?? null,
            'location' => $validated['location'] ?? $animal->location,
            'status' => 'submitted',
            'urgency_level' => $diagnosis['urgency_level'],
            'system_suggestion' => json_encode($diagnosis, JSON_THROW_ON_ERROR),
            'system_score' => $diagnosis['primary_score'],
            'system_explanation' => $diagnosis['system_explanation'],
        ]);

        $case->symptoms()->sync($validated['symptom_ids'] ?? []);
        $case->riskFactors()->sync($validated['risk_factor_ids'] ?? []);

        foreach ($request->file('attachments', []) as $attachment) {
            $path = $attachment->store('case-attachments', 'public');

            $case->attachments()->create([
                'file_path' => $path,
                'file_type' => $attachment->getMimeType(),
                'original_name' => $attachment->getClientOriginalName(),
            ]);
        }

        $this->notificationService->notifyRole(
            \App\Models\User::ROLE_VET,
            'New veterinary case submitted',
            "{$animal->name} has a new case titled \"{$case->title}\" awaiting review.",
        );

        if ($case->urgency_level === 'emergency') {
            $this->notificationService->notifyRole(
                \App\Models\User::ROLE_ADMIN,
                'Emergency case alert',
                "Emergency case \"{$case->title}\" was submitted for {$animal->name}.",
            );
        }

        return redirect()
            ->route('owner.cases.show', $case)
            ->with('success', 'Veterinary case submitted successfully.');
    }

    public function show(Request $request, VeterinaryCase $veterinaryCase): Response
    {
        abort_unless($veterinaryCase->owner_id === $request->user()->id, 403);

        $veterinaryCase->load([
            'animal.species',
            'symptoms:id,name,severity_level',
            'riskFactors:id,name',
            'attachments',
            'assignedVet:id,name,email',
        ]);

        $diagnosis = $this->decodeDiagnosisPayload($veterinaryCase->system_suggestion);
        $systemMatches = $diagnosis['top_matches'] ?? $this->decodeSystemMatches($veterinaryCase->system_suggestion);

        return Inertia::render('Owner/Cases/Show', [
            'veterinaryCase' => [
                ...$veterinaryCase->toArray(),
                'system_matches' => $systemMatches,
                'system_suggestion_summary' => $this->summarizeMatches($systemMatches),
                'attachment_urls' => $veterinaryCase->attachments->map(fn ($attachment) => [
                    'id' => $attachment->id,
                    'original_name' => $attachment->original_name,
                    'file_type' => $attachment->file_type,
                    'url' => Storage::disk('public')->url($attachment->file_path),
                ]),
            ],
            'diagnosis' => $diagnosis,
            'disclaimer' => 'This is a system-generated suggestion and should not replace a veterinarian\'s professional diagnosis.',
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function decodeSystemMatches(?string $storedSuggestion): array
    {
        $decoded = $this->decodeDiagnosisPayload($storedSuggestion);

        if (isset($decoded['top_matches']) && is_array($decoded['top_matches'])) {
            return $decoded['top_matches'];
        }

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @return array<string, mixed>
     */
    protected function decodeDiagnosisPayload(?string $storedSuggestion): array
    {
        if (! $storedSuggestion) {
            return [];
        }

        $decoded = json_decode($storedSuggestion, true);

        if (! is_array($decoded)) {
            return [];
        }

        if (array_key_exists('top_matches', $decoded) || array_key_exists('possible_conditions', $decoded)) {
            return $decoded;
        }

        return [
            'top_matches' => $decoded,
            'possible_conditions' => $decoded,
            'care_recommendations' => [],
            'warnings' => [],
            'urgency_level' => 'low',
            'urgency_label' => 'LOW',
            'primary_score' => null,
            'system_suggestion' => '',
            'system_explanation' => '',
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $matches
     */
    protected function summarizeMatches(array $matches): string
    {
        if ($matches === []) {
            return 'No system suggestion available.';
        }

        return collect($matches)
            ->map(fn (array $match) => "{$match['disease_name']} ({$match['score']}%)")
            ->implode('; ');
    }
}
