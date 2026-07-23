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
            'animals' => $animals,
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
        $animal = Animal::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
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
            'animal' => $animal,
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

        $animal->update($request->validated());

        return redirect()
            ->route('owner.animals.show', $animal)
            ->with('success', 'Animal profile updated successfully.');
    }
}
