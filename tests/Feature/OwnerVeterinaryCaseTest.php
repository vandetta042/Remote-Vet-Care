<?php

namespace Tests\Feature;

use App\Models\Animal;
use App\Models\Disease;
use App\Models\DiseaseRiskFactorRule;
use App\Models\DiseaseSymptomRule;
use App\Models\PublishedRuleSet;
use App\Models\RiskFactor;
use App\Models\Species;
use App\Models\Symptom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OwnerVeterinaryCaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_submit_a_veterinary_case_with_attachments(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $species = Species::create([
            'name' => 'Dog',
        ]);
        $animal = Animal::create([
            'owner_id' => $owner->id,
            'name' => 'Sparky',
            'species_id' => $species->id,
            'location' => 'Abuja',
        ]);
        $symptom = Symptom::create([
            'name' => 'Vomiting',
            'severity_level' => 'severe',
        ]);
        $riskFactor = RiskFactor::create([
            'name' => 'Poor sanitation',
        ]);
        $disease = Disease::create([
            'name' => 'Canine Parvovirus',
            'species_id' => $species->id,
            'severity_level' => 'severe',
            'general_care_advice' => 'Provide hydration and urgent vet assessment.',
            'requires_vet_attention' => true,
            'requires_lab_test' => true,
        ]);
        DiseaseSymptomRule::create([
            'disease_id' => $disease->id,
            'symptom_id' => $symptom->id,
            'weight' => 4,
            'is_required' => true,
        ]);
        DiseaseRiskFactorRule::create([
            'disease_id' => $disease->id,
            'risk_factor_id' => $riskFactor->id,
            'weight' => 1,
        ]);
        PublishedRuleSet::create([
            'disease_id' => $disease->id,
            'species_id' => $species->id,
            'version_number' => '1.0',
            'published_by' => User::factory()->create(['role' => User::ROLE_ADMIN])->id,
            'is_active' => true,
            'published_at' => now(),
        ]);

        $response = $this->actingAs($owner)->post(route('owner.cases.store'), [
            'animal_id' => $animal->id,
            'title' => 'Vomiting and weakness',
            'description' => 'The dog has been vomiting repeatedly since yesterday and is much weaker than normal.',
            'duration' => '1 day',
            'location' => 'Abuja',
            'symptom_ids' => [$symptom->id],
            'risk_factor_ids' => [$riskFactor->id],
            'attachments' => [
                UploadedFile::fake()->create('symptom.jpg', 120, 'image/jpeg'),
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('veterinary_cases', [
            'owner_id' => $owner->id,
            'animal_id' => $animal->id,
            'title' => 'Vomiting and weakness',
            'urgency_level' => 'high',
        ]);
        $this->assertNotNull(\App\Models\VeterinaryCase::first()->system_suggestion);
        $this->assertEquals(100.0, (float) \App\Models\VeterinaryCase::first()->system_score);
        $this->assertDatabaseCount('case_attachments', 1);
        Storage::disk('public')->assertExists('case-attachments/'.basename(\App\Models\CaseAttachment::first()->file_path));
    }

    public function test_owner_cannot_submit_case_for_another_owner_animal(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $otherOwner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);
        $species = Species::create([
            'name' => 'Cattle',
        ]);
        $animal = Animal::create([
            'owner_id' => $otherOwner->id,
            'name' => 'Bella',
            'species_id' => $species->id,
        ]);
        $symptom = Symptom::create([
            'name' => 'Fever',
            'severity_level' => 'moderate',
        ]);

        $response = $this->actingAs($owner)->post(route('owner.cases.store'), [
            'animal_id' => $animal->id,
            'title' => 'Another owner animal',
            'description' => 'Trying to submit a case for an animal the user does not own for security validation.',
            'symptom_ids' => [$symptom->id],
        ]);

        $response->assertNotFound();
    }
}
