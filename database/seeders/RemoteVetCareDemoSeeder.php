<?php

namespace Database\Seeders;

use App\Models\Animal;
use App\Models\Breed;
use App\Models\Disease;
use App\Models\KnowledgeReview;
use App\Models\KnowledgeSubmission;
use App\Models\PublishedRuleSet;
use App\Models\RiskFactor;
use App\Models\Species;
use App\Models\Symptom;
use App\Models\User;
use App\Models\VeterinaryCase;
use App\Services\DiagnosisService;
use Illuminate\Database\Seeder;

class RemoteVetCareDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->createUser('System Admin', 'admin@remotevet.test', User::ROLE_ADMIN);
        $vetA = $this->createUser('Dr. Ada Bello', 'vet1@remotevet.test', User::ROLE_VET);
        $vetB = $this->createUser('Dr. Musa Adeyemi', 'vet2@remotevet.test', User::ROLE_VET);
        $researcherA = $this->createUser('Grace Okafor', 'researcher1@remotevet.test', User::ROLE_RESEARCHER);
        $researcherB = $this->createUser('Daniel Yusuf', 'researcher2@remotevet.test', User::ROLE_RESEARCHER);
        $reviewer = $this->createUser('Dr. Nneka Ibe', 'reviewer@remotevet.test', User::ROLE_REVIEWER);
        $curator = $this->createUser('Miriam John', 'curator@remotevet.test', User::ROLE_CURATOR);
        $ownerA = $this->createUser('Samuel Tersoo', 'owner1@remotevet.test', User::ROLE_OWNER);
        $ownerB = $this->createUser('Ruth Yakubu', 'owner2@remotevet.test', User::ROLE_OWNER);
        $ownerC = $this->createUser('Ibrahim Audu', 'owner3@remotevet.test', User::ROLE_OWNER);

        $dog = Species::create(['name' => 'Dog', 'description' => 'Domestic dogs']);
        $goat = Species::create(['name' => 'Goat', 'description' => 'Goats']);
        $cattle = Species::create(['name' => 'Cattle', 'description' => 'Cattle']);
        $poultry = Species::create(['name' => 'Poultry', 'description' => 'Domestic birds']);

        foreach ([
            [$dog, 'German Shepherd'],
            [$dog, 'Local Mixed Breed'],
            [$goat, 'West African Dwarf'],
            [$cattle, 'White Fulani'],
            [$poultry, 'Broiler'],
        ] as [$species, $name]) {
            Breed::create([
                'species_id' => $species->id,
                'name' => $name,
            ]);
        }

        $symptoms = collect([
            ['Vomiting', 'severe'],
            ['Bloody diarrhea', 'emergency'],
            ['Loss of appetite', 'moderate'],
            ['Weakness', 'moderate'],
            ['Fever', 'moderate'],
            ['Coughing', 'moderate'],
            ['Lameness', 'moderate'],
            ['Swollen hoof', 'severe'],
            ['Hair loss', 'mild'],
            ['Itching', 'moderate'],
            ['Greenish diarrhea', 'severe'],
            ['Twisted neck', 'emergency'],
            ['Swollen udder', 'severe'],
            ['Reduced milk production', 'moderate'],
            ['Breathing difficulty', 'emergency'],
        ])->mapWithKeys(fn (array $item) => [
            $item[0] => Symptom::create([
                'name' => $item[0],
                'severity_level' => $item[1],
            ]),
        ]);

        $riskFactors = collect([
            'Poor sanitation',
            'No recent vaccination',
            'Tick infestation',
            'Wet housing conditions',
            'Poor udder hygiene',
            'Overcrowding',
        ])->mapWithKeys(fn (string $name) => [
            $name => RiskFactor::create(['name' => $name]),
        ]);

        $diseaseRows = [
            [
                'name' => 'Canine Parvovirus',
                'species' => $dog,
                'severity' => 'severe',
                'advice' => 'Immediate isolation, hydration support, and urgent veterinary care.',
                'lab' => true,
                'symptoms' => [['Vomiting', 4, true], ['Bloody diarrhea', 5, true], ['Loss of appetite', 2, false], ['Weakness', 2, false]],
                'risks' => [['Poor sanitation', 2], ['No recent vaccination', 3]],
            ],
            [
                'name' => 'Mange',
                'species' => $dog,
                'severity' => 'moderate',
                'advice' => 'Skin management, hygiene improvement, and veterinary treatment.',
                'lab' => false,
                'symptoms' => [['Hair loss', 3, true], ['Itching', 4, true], ['Weakness', 1, false]],
                'risks' => [['Poor sanitation', 1]],
            ],
            [
                'name' => 'Tick Fever',
                'species' => $dog,
                'severity' => 'severe',
                'advice' => 'Tick control and urgent veterinary evaluation.',
                'lab' => true,
                'symptoms' => [['Fever', 4, true], ['Loss of appetite', 2, false], ['Weakness', 3, false]],
                'risks' => [['Tick infestation', 3]],
            ],
            [
                'name' => 'Foot Rot',
                'species' => $goat,
                'severity' => 'severe',
                'advice' => 'Dry housing, hoof treatment, and veterinary intervention.',
                'lab' => false,
                'symptoms' => [['Lameness', 4, true], ['Swollen hoof', 4, true]],
                'risks' => [['Wet housing conditions', 3]],
            ],
            [
                'name' => 'Mastitis',
                'species' => $cattle,
                'severity' => 'severe',
                'advice' => 'Milk hygiene management and prompt veterinary treatment.',
                'lab' => true,
                'symptoms' => [['Swollen udder', 4, true], ['Reduced milk production', 3, true], ['Fever', 2, false]],
                'risks' => [['Poor udder hygiene', 3]],
            ],
            [
                'name' => 'Newcastle Disease',
                'species' => $poultry,
                'severity' => 'emergency',
                'advice' => 'Immediate isolation and urgent flock-level veterinary response.',
                'lab' => true,
                'symptoms' => [['Greenish diarrhea', 3, true], ['Twisted neck', 5, true], ['Breathing difficulty', 4, true]],
                'risks' => [['Overcrowding', 2], ['No recent vaccination', 3]],
            ],
        ];

        foreach ($diseaseRows as $index => $data) {
            $disease = Disease::create([
                'name' => $data['name'],
                'species_id' => $data['species']->id,
                'severity_level' => $data['severity'],
                'general_care_advice' => $data['advice'],
                'requires_vet_attention' => true,
                'requires_lab_test' => $data['lab'],
            ]);

            $disease->symptoms()->sync(collect($data['symptoms'])->mapWithKeys(
                fn (array $row) => [
                    $symptoms[$row[0]]->id => [
                        'weight' => $row[1],
                        'is_required' => $row[2],
                        'notes' => null,
                    ],
                ]
            )->all());

            $disease->riskFactors()->sync(collect($data['risks'])->mapWithKeys(
                fn (array $row) => [
                    $riskFactors[$row[0]]->id => ['weight' => $row[1]],
                ]
            )->all());

            PublishedRuleSet::create([
                'disease_id' => $disease->id,
                'species_id' => $data['species']->id,
                'version_number' => '1.0',
                'rules_json' => ['seeded' => true],
                'published_by' => $admin->id,
                'is_active' => true,
                'published_at' => now()->subDays(8 - $index),
            ]);
        }

        $animalA = Animal::create([
            'owner_id' => $ownerA->id,
            'name' => 'Bingo',
            'species_id' => $dog->id,
            'breed_id' => Breed::where('name', 'Local Mixed Breed')->value('id'),
            'age' => '8 months',
            'age_group' => 'young',
            'gender' => 'male',
            'weight' => 9.50,
            'vaccination_status' => 'partial',
            'medical_history' => 'Occasional appetite loss.',
            'location' => 'Makurdi',
        ]);
        $animalB = Animal::create([
            'owner_id' => $ownerB->id,
            'name' => 'Nana',
            'species_id' => $goat->id,
            'breed_id' => Breed::where('name', 'West African Dwarf')->value('id'),
            'age' => '2 years',
            'age_group' => 'adult',
            'gender' => 'female',
            'weight' => 24.00,
            'vaccination_status' => 'unknown',
            'location' => 'Gboko',
        ]);
        $animalC = Animal::create([
            'owner_id' => $ownerC->id,
            'name' => 'White Bell',
            'species_id' => $cattle->id,
            'breed_id' => Breed::where('name', 'White Fulani')->value('id'),
            'age' => '4 years',
            'age_group' => 'adult',
            'gender' => 'female',
            'weight' => 320.00,
            'vaccination_status' => 'up_to_date',
            'location' => 'Lafia',
        ]);

        $diagnosis = app(DiagnosisService::class)->analyze(
            speciesId: $dog->id,
            symptomIds: [$symptoms['Vomiting']->id, $symptoms['Bloody diarrhea']->id, $symptoms['Weakness']->id],
            riskFactorIds: [$riskFactors['Poor sanitation']->id, $riskFactors['No recent vaccination']->id],
            animalDetails: ['name' => $animalA->name],
            caseDescription: 'Young dog with vomiting, bloody diarrhea, and weakness.',
        );

        $caseA = VeterinaryCase::create([
            'owner_id' => $ownerA->id,
            'animal_id' => $animalA->id,
            'assigned_vet_id' => $vetA->id,
            'title' => 'Vomiting, bloody diarrhea, and weakness',
            'description' => 'The dog became weak yesterday and is now vomiting with bloody stool.',
            'duration' => '2 days',
            'location' => 'Makurdi',
            'status' => 'vet_responded',
            'urgency_level' => $diagnosis['urgency_level'],
            'system_suggestion' => json_encode($diagnosis['top_matches']),
            'system_score' => $diagnosis['primary_score'],
            'system_explanation' => $diagnosis['system_explanation'],
            'vet_diagnosis' => 'Likely canine parvoviral enteritis pending laboratory confirmation.',
            'vet_advice' => 'Isolate immediately, maintain hydration, and present at the clinic urgently.',
            'follow_up_date' => now()->addDays(3)->toDateString(),
        ]);
        $caseA->symptoms()->sync([$symptoms['Vomiting']->id, $symptoms['Bloody diarrhea']->id, $symptoms['Weakness']->id]);
        $caseA->riskFactors()->sync([$riskFactors['Poor sanitation']->id, $riskFactors['No recent vaccination']->id]);

        $caseB = VeterinaryCase::create([
            'owner_id' => $ownerB->id,
            'animal_id' => $animalB->id,
            'title' => 'Lameness and swollen hoof',
            'description' => 'Goat refuses to walk well and the hoof is visibly swollen.',
            'duration' => '5 days',
            'location' => 'Gboko',
            'status' => 'submitted',
            'urgency_level' => 'high',
        ]);
        $caseB->symptoms()->sync([$symptoms['Lameness']->id, $symptoms['Swollen hoof']->id]);

        $caseC = VeterinaryCase::create([
            'owner_id' => $ownerC->id,
            'animal_id' => $animalC->id,
            'assigned_vet_id' => $vetB->id,
            'title' => 'Reduced milk production and udder swelling',
            'description' => 'Milk output has dropped and the udder looks swollen and warm.',
            'duration' => '3 days',
            'location' => 'Lafia',
            'status' => 'under_review',
            'urgency_level' => 'high',
        ]);
        $caseC->symptoms()->sync([$symptoms['Swollen udder']->id, $symptoms['Reduced milk production']->id]);

        $draft = KnowledgeSubmission::create([
            'submitted_by' => $researcherA->id,
            'title' => 'Draft note on poultry respiratory distress',
            'disease_name' => 'Poultry respiratory syndrome',
            'species_id' => $poultry->id,
            'summary' => 'A draft summary covering breathing difficulty and flock exposure factors in poultry.',
            'status' => 'draft',
            'metadata' => ['care_advice' => 'Separate affected birds and improve ventilation.'],
        ]);
        $draft->symptoms()->create([
            'symptom_name' => 'Breathing difficulty',
            'symptom_weight' => 4,
            'severity_level' => 'emergency',
        ]);
        $draft->sources()->create([
            'source_title' => 'Internal draft source',
            'source_type' => 'field_report',
        ]);

        $submitted = KnowledgeSubmission::create([
            'submitted_by' => $researcherB->id,
            'title' => 'Goat hoof infection literature summary',
            'disease_name' => 'Foot Rot',
            'species_id' => $goat->id,
            'summary' => 'A structured note describing lameness, swollen hoof, and wet housing exposure.',
            'status' => 'submitted',
            'submitted_at' => now()->subDay(),
        ]);
        $submitted->symptoms()->createMany([
            ['symptom_name' => 'Lameness', 'symptom_weight' => 4, 'severity_level' => 'moderate'],
            ['symptom_name' => 'Swollen hoof', 'symptom_weight' => 4, 'severity_level' => 'severe'],
        ]);
        $submitted->riskFactors()->create([
            'risk_factor_name' => 'Wet housing conditions',
            'weight' => 3,
        ]);
        $submitted->sources()->create([
            'source_title' => 'Goat management guide',
            'source_type' => 'guideline',
        ]);

        $approved = KnowledgeSubmission::create([
            'submitted_by' => $researcherA->id,
            'title' => 'Canine skin infestation curated note',
            'disease_name' => 'Canine Skin Infestation',
            'species_id' => $dog->id,
            'summary' => 'An approved note on hair loss and itching prepared for publication.',
            'status' => 'approved',
            'reviewer_id' => $reviewer->id,
            'reviewed_at' => now()->subHours(8),
            'metadata' => ['care_advice' => 'Improve hygiene and inspect for mites.'],
        ]);
        $approved->symptoms()->createMany([
            ['symptom_name' => 'Hair loss', 'symptom_weight' => 3, 'severity_level' => 'mild'],
            ['symptom_name' => 'Itching', 'symptom_weight' => 4, 'severity_level' => 'moderate'],
        ]);
        $approved->sources()->create([
            'source_title' => 'Veterinary dermatology note',
            'source_type' => 'journal',
        ]);
        KnowledgeReview::create([
            'knowledge_submission_id' => $approved->id,
            'reviewed_by' => $reviewer->id,
            'decision' => 'approved',
            'comments' => 'Sufficient evidence to move to curation.',
            'reviewed_at' => now()->subHours(8),
        ]);

        $ownerA->userNotifications()->create([
            'title' => 'Vet response received',
            'message' => 'Dr. Ada Bello has responded to your case on Bingo.',
        ]);
        $vetA->userNotifications()->create([
            'title' => 'New emergency case',
            'message' => 'A high-priority canine case has been submitted and may require urgent review.',
        ]);
        $reviewer->userNotifications()->create([
            'title' => 'Knowledge submission awaiting review',
            'message' => 'A goat hoof infection knowledge submission is ready for review.',
        ]);
        $curator->userNotifications()->create([
            'title' => 'Approved knowledge ready',
            'message' => 'A canine skin infestation submission has been approved and is waiting for curation.',
        ]);
        $admin->userNotifications()->create([
            'title' => 'Emergency case alert',
            'message' => 'An emergency-level owner case has entered the platform.',
        ]);
    }

    protected function createUser(string $name, string $email, string $role): User
    {
        return User::factory()->create([
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'phone' => '08000000000',
            'address' => 'Benue State, Nigeria',
            'status' => 'active',
        ]);
    }
}
