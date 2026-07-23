<?php

namespace Tests\Feature;

use App\Models\Animal;
use App\Models\Species;
use App\Models\User;
use App\Models\VeterinaryCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VetCaseWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_vet_can_update_case_response_and_assignment(): void
    {
        $vet = User::factory()->create([
            'role' => User::ROLE_VET,
        ]);
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $species = Species::create([
            'name' => 'Dog',
        ]);
        $animal = Animal::create([
            'owner_id' => $owner->id,
            'name' => 'Bruno',
            'species_id' => $species->id,
        ]);
        $case = VeterinaryCase::create([
            'owner_id' => $owner->id,
            'animal_id' => $animal->id,
            'title' => 'Vomiting case',
            'description' => 'Owner reports vomiting and weakness with reduced feeding.',
            'status' => 'submitted',
            'urgency_level' => 'high',
        ]);

        $response = $this->actingAs($vet)->patch(route('vet.cases.update', $case), [
            'assigned_vet_id' => '',
            'vet_diagnosis' => 'Suspected parvoviral enteritis pending confirmatory testing.',
            'vet_advice' => 'Begin isolation, oral rehydration support, and urgent clinic review.',
            'follow_up_date' => '2026-07-15',
            'status' => 'vet_responded',
        ]);

        $response->assertRedirect(route('vet.cases.show', $case, false));
        $this->assertDatabaseHas('veterinary_cases', [
            'id' => $case->id,
            'assigned_vet_id' => $vet->id,
            'status' => 'vet_responded',
        ]);
    }

    public function test_owner_cannot_access_vet_case_queue(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);

        $response = $this->actingAs($owner)->get(route('vet.cases.index'));

        $response->assertForbidden();
    }
}
