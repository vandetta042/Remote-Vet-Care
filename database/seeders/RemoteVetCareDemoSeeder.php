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
        $cat = Species::create(['name' => 'Cat', 'description' => 'Domestic cats']);
        $goat = Species::create(['name' => 'Goat', 'description' => 'Goats']);
        $cattle = Species::create(['name' => 'Cattle', 'description' => 'Cattle']);
        $poultry = Species::create(['name' => 'Poultry', 'description' => 'Domestic birds']);
        $rabbit = Species::create(['name' => 'Rabbit', 'description' => 'Domestic rabbits']);
        $fish = Species::create(['name' => 'Fish', 'description' => 'Aquatic animals']);

        foreach ([
            [$dog, 'German Shepherd'],
            [$dog, 'Local Mixed Breed'],
            [$cat, 'Domestic Shorthair'],
            [$cat, 'Persian'],
            [$goat, 'West African Dwarf'],
            [$cattle, 'White Fulani'],
            [$poultry, 'Broiler'],
            [$rabbit, 'New Zealand White'],
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
            ['Ear discharge', 'moderate'],
            ['Head shaking', 'moderate'],
            ['Sneezing', 'moderate'],
            ['Runny nose', 'moderate'],
            ['Drooping wings', 'moderate'],
            ['Swollen abdomen', 'emergency'],
            ['Restlessness', 'moderate'],
            ['Recumbency', 'emergency'],
            ['White spots', 'moderate'],
            ['Lethargy', 'moderate'],
            ['Reduced feeding', 'moderate'],
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
            'Poor ventilation',
            'Late pregnancy',
            'Poor feed intake',
            'Lush pasture',
            'Rapid feed change',
            'Poor water quality',
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
            [
                'name' => 'Feline Panleukopenia',
                'species' => $cat,
                'severity' => 'emergency',
                'advice' => 'Keep the cat isolated, support hydration, and seek urgent veterinary care.',
                'lab' => true,
                'symptoms' => [['Vomiting', 4, true], ['Fever', 4, true], ['Loss of appetite', 3, true], ['Weakness', 3, false]],
                'risks' => [['Poor sanitation', 2], ['No recent vaccination', 3], ['Overcrowding', 2]],
            ],
            [
                'name' => 'Canine Otitis Externa',
                'species' => $dog,
                'severity' => 'moderate',
                'advice' => 'Keep the ears dry, avoid scratching, and arrange a vet ear examination.',
                'lab' => false,
                'symptoms' => [['Ear discharge', 4, true], ['Head shaking', 4, true], ['Itching', 2, false]],
                'risks' => [['Poor sanitation', 1], ['Wet housing conditions', 2]],
            ],
            [
                'name' => 'Pregnancy Toxemia',
                'species' => $goat,
                'severity' => 'emergency',
                'advice' => 'Provide calm handling, energy support, and urgent veterinary intervention.',
                'lab' => true,
                'symptoms' => [['Weakness', 4, true], ['Loss of appetite', 4, true], ['Recumbency', 5, true]],
                'risks' => [['Late pregnancy', 3], ['Poor feed intake', 3]],
            ],
            [
                'name' => 'Poultry Coccidiosis',
                'species' => $poultry,
                'severity' => 'high',
                'advice' => 'Improve litter dryness, isolate affected birds, and monitor the flock closely.',
                'lab' => true,
                'symptoms' => [['Bloody diarrhea', 4, true], ['Drooping wings', 3, true], ['Weakness', 3, false]],
                'risks' => [['Wet housing conditions', 3], ['Overcrowding', 2]],
            ],
            [
                'name' => 'Bovine Bloat',
                'species' => $cattle,
                'severity' => 'emergency',
                'advice' => 'Remove access to feed, walk the animal calmly, and call a veterinarian urgently.',
                'lab' => false,
                'symptoms' => [['Swollen abdomen', 5, true], ['Breathing difficulty', 4, true], ['Restlessness', 3, false]],
                'risks' => [['Lush pasture', 3], ['Rapid feed change', 3]],
            ],
            [
                'name' => 'Rabbit Snuffles',
                'species' => $rabbit,
                'severity' => 'moderate',
                'advice' => 'Separate the rabbit, keep the housing warm, and arrange veterinary review.',
                'lab' => false,
                'symptoms' => [['Sneezing', 4, true], ['Runny nose', 4, true], ['Reduced feeding', 2, false]],
                'risks' => [['Poor ventilation', 3], ['Overcrowding', 1]],
            ],
            [
                'name' => 'Fish White Spot Disease',
                'species' => $fish,
                'severity' => 'moderate',
                'advice' => 'Stabilize water quality, reduce stress, and monitor the tank closely.',
                'lab' => false,
                'symptoms' => [['White spots', 4, true], ['Lethargy', 3, false], ['Reduced feeding', 2, false]],
                'risks' => [['Poor water quality', 3], ['Overcrowding', 1]],
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

        $animalD = Animal::create([
            'owner_id' => $ownerA->id,
            'name' => 'Mimi',
            'species_id' => $cat->id,
            'breed_id' => Breed::where('name', 'Persian')->value('id'),
            'age' => '3 years',
            'age_group' => 'adult',
            'gender' => 'female',
            'weight' => 4.20,
            'vaccination_status' => 'unknown',
            'location' => 'Makurdi',
        ]);
        $animalE = Animal::create([
            'owner_id' => $ownerB->id,
            'name' => 'Bunny',
            'species_id' => $rabbit->id,
            'breed_id' => Breed::where('name', 'New Zealand White')->value('id'),
            'age' => '1 year',
            'age_group' => 'young',
            'gender' => 'female',
            'weight' => 2.80,
            'vaccination_status' => 'partial',
            'location' => 'Gboko',
        ]);

        $catDiagnosis = app(DiagnosisService::class)->analyze(
            speciesId: $cat->id,
            symptomIds: [$symptoms['Vomiting']->id, $symptoms['Fever']->id, $symptoms['Loss of appetite']->id],
            riskFactorIds: [$riskFactors['Poor sanitation']->id, $riskFactors['No recent vaccination']->id],
            animalDetails: ['name' => $animalD->name],
            caseDescription: 'Cat with vomiting, fever, and no appetite.',
        );

        $caseD = VeterinaryCase::create([
            'owner_id' => $ownerA->id,
            'animal_id' => $animalD->id,
            'assigned_vet_id' => $vetA->id,
            'title' => 'Vomiting and fever in cat',
            'description' => 'The cat is vomiting, has a fever, and will not eat.',
            'duration' => '1 day',
            'location' => 'Makurdi',
            'status' => 'vet_responded',
            'urgency_level' => $catDiagnosis['urgency_level'],
            'system_suggestion' => json_encode($catDiagnosis),
            'system_score' => $catDiagnosis['primary_score'],
            'system_explanation' => $catDiagnosis['system_explanation'],
            'vet_diagnosis' => 'Possible feline panleukopenia pending clinical review.',
            'vet_advice' => 'Keep the cat isolated and seek urgent veterinary attention.',
            'follow_up_date' => now()->addDays(2)->toDateString(),
        ]);
        $caseD->symptoms()->sync([$symptoms['Vomiting']->id, $symptoms['Fever']->id, $symptoms['Loss of appetite']->id]);
        $caseD->riskFactors()->sync([$riskFactors['Poor sanitation']->id, $riskFactors['No recent vaccination']->id]);

        $rabbitDiagnosis = app(DiagnosisService::class)->analyze(
            speciesId: $rabbit->id,
            symptomIds: [$symptoms['Sneezing']->id, $symptoms['Runny nose']->id, $symptoms['Reduced feeding']->id],
            riskFactorIds: [$riskFactors['Poor ventilation']->id, $riskFactors['Overcrowding']->id],
            animalDetails: ['name' => $animalE->name],
            caseDescription: 'Rabbit sneezing with runny nose and poor appetite.',
        );

        $caseE = VeterinaryCase::create([
            'owner_id' => $ownerB->id,
            'animal_id' => $animalE->id,
            'title' => 'Sneezing and runny nose',
            'description' => 'The rabbit is sneezing often and has a runny nose.',
            'duration' => '4 days',
            'location' => 'Gboko',
            'status' => 'submitted',
            'urgency_level' => $rabbitDiagnosis['urgency_level'],
            'system_suggestion' => json_encode($rabbitDiagnosis),
            'system_score' => $rabbitDiagnosis['primary_score'],
            'system_explanation' => $rabbitDiagnosis['system_explanation'],
        ]);
        $caseE->symptoms()->sync([$symptoms['Sneezing']->id, $symptoms['Runny nose']->id, $symptoms['Reduced feeding']->id]);
        $caseE->riskFactors()->sync([$riskFactors['Poor ventilation']->id, $riskFactors['Overcrowding']->id]);

        $bloatDiagnosis = app(DiagnosisService::class)->analyze(
            speciesId: $cattle->id,
            symptomIds: [$symptoms['Swollen abdomen']->id, $symptoms['Breathing difficulty']->id, $symptoms['Restlessness']->id],
            riskFactorIds: [$riskFactors['Lush pasture']->id, $riskFactors['Rapid feed change']->id],
            animalDetails: ['name' => $animalC->name],
            caseDescription: 'Cattle with swollen abdomen and breathing difficulty.',
        );

        $caseF = VeterinaryCase::create([
            'owner_id' => $ownerC->id,
            'animal_id' => $animalC->id,
            'assigned_vet_id' => $vetB->id,
            'title' => 'Swollen abdomen and breathing difficulty',
            'description' => 'The cow is bloated, restless, and breathing with effort.',
            'duration' => '6 hours',
            'location' => 'Lafia',
            'status' => 'under_review',
            'urgency_level' => $bloatDiagnosis['urgency_level'],
            'system_suggestion' => json_encode($bloatDiagnosis),
            'system_score' => $bloatDiagnosis['primary_score'],
            'system_explanation' => $bloatDiagnosis['system_explanation'],
        ]);
        $caseF->symptoms()->sync([$symptoms['Swollen abdomen']->id, $symptoms['Breathing difficulty']->id, $symptoms['Restlessness']->id]);
        $caseF->riskFactors()->sync([$riskFactors['Lush pasture']->id, $riskFactors['Rapid feed change']->id]);

        $draft = KnowledgeSubmission::create([
            'submitted_by' => $researcherA->id,
            'title' => 'Draft note on poultry respiratory distress',
            'disease_name' => 'Poultry respiratory syndrome',
            'species_id' => $poultry->id,
            'summary' => 'A draft summary covering breathing difficulty and flock exposure factors in poultry.',
            'status' => 'draft',
            'metadata' => [
                'care_advice' => 'Separate affected birds and improve ventilation.',
                'care_recommendations' => "Separate affected birds from the flock.\nImprove airflow and reduce dust.\nMonitor water intake and feeding behaviour.",
                'care_urgency_level' => 'high',
            ],
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
            'metadata' => [
                'care_advice' => 'Improve hygiene and inspect for mites.',
                'care_recommendations' => "Improve hygiene and inspect for mites.\nWash bedding regularly and reduce stress.",
                'care_urgency_level' => 'moderate',
            ],
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

        $approvedCat = KnowledgeSubmission::create([
            'submitted_by' => $researcherB->id,
            'title' => 'Cat panleukopenia field summary',
            'disease_name' => 'Feline Panleukopenia',
            'species_id' => $cat->id,
            'summary' => 'A vetted summary covering vomiting, fever, and anorexia in cats with high-risk exposure patterns.',
            'status' => 'approved',
            'reviewer_id' => $reviewer->id,
            'reviewed_at' => now()->subHours(4),
            'metadata' => [
                'care_advice' => 'Keep the cat isolated and monitor hydration.',
                'care_recommendations' => "Keep the cat isolated.\nSupport hydration carefully.\nSeek urgent veterinary care.",
                'care_urgency_level' => 'emergency',
            ],
        ]);
        $approvedCat->symptoms()->createMany([
            ['symptom_name' => 'Vomiting', 'symptom_weight' => 4, 'severity_level' => 'severe'],
            ['symptom_name' => 'Fever', 'symptom_weight' => 4, 'severity_level' => 'severe'],
            ['symptom_name' => 'Loss of appetite', 'symptom_weight' => 3, 'severity_level' => 'moderate'],
        ]);
        $approvedCat->riskFactors()->createMany([
            ['risk_factor_name' => 'Poor sanitation', 'weight' => 2],
            ['risk_factor_name' => 'No recent vaccination', 'weight' => 3],
        ]);
        $approvedCat->sources()->create([
            'source_title' => 'Feline internal medicine reference',
            'source_type' => 'textbook',
        ]);
        KnowledgeReview::create([
            'knowledge_submission_id' => $approvedCat->id,
            'reviewed_by' => $reviewer->id,
            'decision' => 'approved',
            'comments' => 'Strong fit for the curated feline emergency rule base.',
            'reviewed_at' => now()->subHours(4),
        ]);

        $submittedCattle = KnowledgeSubmission::create([
            'submitted_by' => $researcherA->id,
            'title' => 'Cattle bloat emergency note',
            'disease_name' => 'Bovine Bloat',
            'species_id' => $cattle->id,
            'summary' => 'Emergency field note describing swollen abdomen, breathing difficulty, and feed change risks in cattle.',
            'status' => 'submitted',
            'submitted_at' => now()->subHours(12),
            'metadata' => [
                'care_advice' => 'Stop feed access and seek urgent help.',
                'care_recommendations' => "Remove access to fresh feed.\nWalk the animal calmly.\nCall a veterinarian urgently.",
                'care_urgency_level' => 'emergency',
            ],
        ]);
        $submittedCattle->symptoms()->createMany([
            ['symptom_name' => 'Swollen abdomen', 'symptom_weight' => 5, 'severity_level' => 'emergency'],
            ['symptom_name' => 'Breathing difficulty', 'symptom_weight' => 4, 'severity_level' => 'emergency'],
        ]);
        $submittedCattle->riskFactors()->createMany([
            ['risk_factor_name' => 'Lush pasture', 'weight' => 3],
            ['risk_factor_name' => 'Rapid feed change', 'weight' => 3],
        ]);
        $submittedCattle->sources()->create([
            'source_title' => 'Ruminant emergency care guideline',
            'source_type' => 'guideline',
        ]);

        $draftRabbit = KnowledgeSubmission::create([
            'submitted_by' => $researcherB->id,
            'title' => 'Rabbit respiratory note',
            'disease_name' => 'Rabbit Snuffles',
            'species_id' => $rabbit->id,
            'summary' => 'A draft note about sneezing, runny nose, and ventilation concerns in domestic rabbits.',
            'status' => 'draft',
            'metadata' => [
                'care_advice' => 'Keep the rabbit warm and reduce dust.',
                'care_recommendations' => "Separate the rabbit.\nKeep the housing warm.\nImprove ventilation.",
                'care_urgency_level' => 'moderate',
            ],
        ]);
        $draftRabbit->symptoms()->createMany([
            ['symptom_name' => 'Sneezing', 'symptom_weight' => 4, 'severity_level' => 'moderate'],
            ['symptom_name' => 'Runny nose', 'symptom_weight' => 4, 'severity_level' => 'moderate'],
        ]);
        $draftRabbit->sources()->create([
            'source_title' => 'Small mammal husbandry note',
            'source_type' => 'field_report',
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
