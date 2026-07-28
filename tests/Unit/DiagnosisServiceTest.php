<?php

namespace Tests\Unit;

use App\Models\Disease;
use App\Models\DiseaseRiskFactorRule;
use App\Models\DiseaseSymptomRule;
use App\Models\PublishedRuleSet;
use App\Models\RiskFactor;
use App\Models\Species;
use App\Models\Symptom;
use App\Models\User;
use App\Services\DiagnosisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiagnosisServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_ranked_matches_from_active_published_rules(): void
    {
        $species = Species::create(['name' => 'Dog']);
        $publisher = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $vomiting = Symptom::create([
            'name' => 'Vomiting',
            'severity_level' => 'severe',
        ]);
        $weakness = Symptom::create([
            'name' => 'Weakness',
            'severity_level' => 'moderate',
        ]);
        $itching = Symptom::create([
            'name' => 'Itching',
            'severity_level' => 'mild',
        ]);

        $unsanitary = RiskFactor::create(['name' => 'Poor sanitation']);

        $parvo = Disease::create([
            'name' => 'Canine Parvovirus',
            'species_id' => $species->id,
            'severity_level' => 'severe',
            'general_care_advice' => 'Immediate isolation and hydration support.',
            'requires_vet_attention' => true,
            'requires_lab_test' => true,
        ]);
        $mange = Disease::create([
            'name' => 'Mange',
            'species_id' => $species->id,
            'severity_level' => 'moderate',
            'general_care_advice' => 'Skin care and prompt veterinary review.',
            'requires_vet_attention' => true,
            'requires_lab_test' => false,
        ]);

        DiseaseSymptomRule::create([
            'disease_id' => $parvo->id,
            'symptom_id' => $vomiting->id,
            'weight' => 4,
            'is_required' => true,
        ]);
        DiseaseSymptomRule::create([
            'disease_id' => $parvo->id,
            'symptom_id' => $weakness->id,
            'weight' => 2,
        ]);
        DiseaseRiskFactorRule::create([
            'disease_id' => $parvo->id,
            'risk_factor_id' => $unsanitary->id,
            'weight' => 1,
        ]);

        DiseaseSymptomRule::create([
            'disease_id' => $mange->id,
            'symptom_id' => $itching->id,
            'weight' => 3,
        ]);

        PublishedRuleSet::create([
            'disease_id' => $parvo->id,
            'species_id' => $species->id,
            'version_number' => '1.0',
            'published_by' => $publisher->id,
            'is_active' => true,
            'published_at' => now(),
        ]);
        PublishedRuleSet::create([
            'disease_id' => $mange->id,
            'species_id' => $species->id,
            'version_number' => '1.0',
            'published_by' => $publisher->id,
            'is_active' => true,
            'published_at' => now(),
        ]);

        $result = app(DiagnosisService::class)->analyze(
            speciesId: $species->id,
            symptomIds: [$vomiting->id, $weakness->id],
            riskFactorIds: [$unsanitary->id],
            animalDetails: ['name' => 'Bruno'],
            caseDescription: 'Repeated vomiting and weakness',
        );

        $this->assertSame('high', $result['urgency_level']);
        $this->assertSame('HIGH', $result['urgency_label']);
        $this->assertSame('Canine Parvovirus', $result['top_matches'][0]['disease_name']);
        $this->assertEquals(100.0, $result['top_matches'][0]['score']);
        $this->assertStringContainsString('Canine Parvovirus', $result['system_suggestion']);
        $this->assertStringContainsString('professional diagnosis', $result['system_explanation']);
        $this->assertNotEmpty($result['possible_conditions']);
        $this->assertNotEmpty($result['care_recommendations']);
        $this->assertContains('Immediate isolation and hydration support', array_column($result['care_recommendations'], 'recommendation'));
        $this->assertNotEmpty($result['warnings']);
    }

    public function test_it_handles_missing_published_rules_gracefully(): void
    {
        $species = Species::create(['name' => 'Goat']);
        $symptom = Symptom::create([
            'name' => 'Twisted neck',
            'severity_level' => 'emergency',
        ]);

        $result = app(DiagnosisService::class)->analyze(
            speciesId: $species->id,
            symptomIds: [$symptom->id],
            animalDetails: ['name' => 'Nana'],
            caseDescription: 'Sudden neck twist and collapse',
        );

        $this->assertSame([], $result['top_matches']);
        $this->assertSame('emergency', $result['urgency_level']);
        $this->assertStringContainsString('No published rule-based suggestions', $result['system_suggestion']);
        $this->assertSame('EMERGENCY', $result['urgency_label']);
        $this->assertNotEmpty($result['care_recommendations']);
        $this->assertNotEmpty($result['warnings']);
    }
}
