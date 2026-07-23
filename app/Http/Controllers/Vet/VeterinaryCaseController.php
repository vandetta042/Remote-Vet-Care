<?php

namespace App\Http\Controllers\Vet;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vet\UpdateVeterinaryCaseRequest;
use App\Models\User;
use App\Models\VeterinaryCase;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VeterinaryCaseController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {
    }

    public function index(): Response
    {
        $cases = VeterinaryCase::query()
            ->with(['animal.species:id,name', 'owner:id,name,email', 'assignedVet:id,name'])
            ->latest()
            ->get();

        return Inertia::render('Vet/Cases/Index', [
            'cases' => $cases,
        ]);
    }

    public function show(VeterinaryCase $veterinaryCase): Response
    {
        $veterinaryCase->load([
            'owner:id,name,email,phone,address',
            'animal.species',
            'animal.breed',
            'symptoms:id,name,severity_level',
            'riskFactors:id,name',
            'attachments',
            'assignedVet:id,name,email',
        ]);

        $systemMatches = $this->decodeSystemMatches($veterinaryCase->system_suggestion);

        return Inertia::render('Vet/Cases/Show', [
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
            'statusOptions' => ['submitted', 'under_review', 'vet_responded', 'resolved', 'referred', 'closed'],
            'vetOptions' => User::query()
                ->where('role', User::ROLE_VET)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(
        UpdateVeterinaryCaseRequest $request,
        VeterinaryCase $veterinaryCase,
    ): RedirectResponse {
        $validated = $request->validated();

        $veterinaryCase->update([
            'assigned_vet_id' => $validated['assigned_vet_id'] ?: $request->user()->id,
            'vet_diagnosis' => $validated['vet_diagnosis'] ?? null,
            'vet_advice' => $validated['vet_advice'] ?? null,
            'follow_up_date' => $validated['follow_up_date'] ?? null,
            'status' => $validated['status'],
        ]);

        if (
            filled($validated['vet_diagnosis'] ?? null)
            || filled($validated['vet_advice'] ?? null)
            || in_array($validated['status'], ['vet_responded', 'resolved', 'referred', 'closed'], true)
        ) {
            $this->notificationService->notifyUser(
                $veterinaryCase->owner_id,
                'Veterinary case updated',
                "Your case \"{$veterinaryCase->title}\" now has an updated veterinary response.",
            );
        }

        return redirect()
            ->route('vet.cases.show', $veterinaryCase)
            ->with('success', 'Veterinary response updated successfully.');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function decodeSystemMatches(?string $storedSuggestion): array
    {
        if (! $storedSuggestion) {
            return [];
        }

        $decoded = json_decode($storedSuggestion, true);

        return is_array($decoded) ? $decoded : [];
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
