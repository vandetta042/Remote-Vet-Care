<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\StoreAnimalRequest;
use App\Http\Requests\Owner\UpdateAnimalRequest;
use App\Models\Animal;
use App\Models\Breed;
use App\Models\Species;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnimalController extends Controller
{
    public function index(Request $request): Response
    {
        $animals = Animal::query()
            ->with(['species', 'breed'])
            ->where('owner_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Owner/Animals/Index', [
            'animals' => $animals->map(fn (Animal $animal) => $this->presentAnimal($animal))->values(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Owner/Animals/Form', [
            'animal' => null,
            'species' => Species::orderBy('name')->get(['id', 'name']),
            'breeds' => Breed::orderBy('name')->get(['id', 'species_id', 'name']),
            'ageGroups' => ['young', 'adult', 'senior'],
            'genders' => ['male', 'female', 'unknown'],
            'vaccinationStatuses' => ['up_to_date', 'partial', 'not_vaccinated', 'unknown'],
            'mode' => 'create',
        ]);
    }

    public function store(StoreAnimalRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $animal = Animal::create([
            ...collect($validated)->except('profile_photo')->all(),
            'owner_id' => $request->user()->id,
            'profile_photo_path' => $this->storeProfilePhoto($request, null),
        ]);

        return redirect()
            ->route('owner.animals.show', $animal)
            ->with('success', 'Animal profile created successfully.');
    }

    public function show(Request $request, Animal $animal): Response
    {
        abort_unless($animal->owner_id === $request->user()->id, 403);

        $animal->load(['species', 'breed']);
        $recentCases = $animal->veterinaryCases()
            ->latest()
            ->get(['id', 'title', 'status', 'urgency_level', 'created_at']);

        return Inertia::render('Owner/Animals/Show', [
            'animal' => $this->presentAnimal($animal),
            'recentCases' => $recentCases,
        ]);
    }

    public function edit(Request $request, Animal $animal): Response
    {
        abort_unless($animal->owner_id === $request->user()->id, 403);

        return Inertia::render('Owner/Animals/Form', [
            'animal' => $animal,
            'species' => Species::orderBy('name')->get(['id', 'name']),
            'breeds' => Breed::orderBy('name')->get(['id', 'species_id', 'name']),
            'ageGroups' => ['young', 'adult', 'senior'],
            'genders' => ['male', 'female', 'unknown'],
            'vaccinationStatuses' => ['up_to_date', 'partial', 'not_vaccinated', 'unknown'],
            'mode' => 'edit',
        ]);
    }

    public function update(UpdateAnimalRequest $request, Animal $animal): RedirectResponse
    {
        abort_unless($animal->owner_id === $request->user()->id, 403);

        $validated = $request->validated();
        $profilePhotoPath = $animal->profile_photo_path;

        if ($request->hasFile('profile_photo')) {
            if ($profilePhotoPath) {
                Storage::disk('public')->delete($profilePhotoPath);
            }

            $profilePhotoPath = $this->storeProfilePhoto($request, $animal);
        }

        $animal->update([
            ...collect($validated)->except('profile_photo')->all(),
            'profile_photo_path' => $profilePhotoPath,
        ]);

        return redirect()
            ->route('owner.animals.show', $animal)
            ->with('success', 'Animal profile updated successfully.');
    }

    protected function storeProfilePhoto(Request $request, ?Animal $animal): ?string
    {
        if (! $request->hasFile('profile_photo')) {
            return $animal?->profile_photo_path;
        }

        return $request->file('profile_photo')->store('animal-photos', 'public');
    }

    protected function presentAnimal(Animal $animal): array
    {
        $latestCase = $animal->veterinaryCases()->latest('created_at')->first();
        $upcomingCase = $animal->veterinaryCases()
            ->whereNotNull('follow_up_date')
            ->orderBy('follow_up_date')
            ->first();

        return [
            ...$animal->toArray(),
            'last_consultation_at' => $latestCase?->created_at?->format('M j, Y'),
            'upcoming_follow_up_at' => $upcomingCase?->follow_up_date?->format('M j, Y'),
        ];
    }
}
