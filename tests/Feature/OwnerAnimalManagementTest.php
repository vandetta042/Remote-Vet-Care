<?php

namespace Tests\Feature;

use App\Models\Animal;
use App\Models\Breed;
use App\Models\Species;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerAnimalManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_an_animal_profile(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $species = Species::create([
            'name' => 'Dog',
        ]);
        $breed = Breed::create([
            'species_id' => $species->id,
            'name' => 'Mixed Breed',
        ]);

        $response = $this->actingAs($owner)->post(route('owner.animals.store'), [
            'name' => 'Bingo',
            'species_id' => $species->id,
            'breed_id' => $breed->id,
            'age' => '2 years',
            'age_group' => 'adult',
            'gender' => 'male',
            'weight' => 12.5,
            'color' => 'Brown',
            'vaccination_status' => 'up_to_date',
            'medical_history' => 'Recovered from mild cough.',
            'location' => 'Makurdi',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('animals', [
            'owner_id' => $owner->id,
            'name' => 'Bingo',
            'species_id' => $species->id,
        ]);
    }

    public function test_owner_cannot_view_another_owner_animal_profile(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $otherOwner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $species = Species::create([
            'name' => 'Goat',
        ]);
        $animal = Animal::create([
            'owner_id' => $otherOwner->id,
            'name' => 'Nanny',
            'species_id' => $species->id,
        ]);

        $response = $this->actingAs($owner)->get(route('owner.animals.show', $animal));

        $response->assertForbidden();
    }
}
