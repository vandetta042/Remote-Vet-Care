<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('species', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('breeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('species_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['species_id', 'name']);
        });

        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->foreignId('species_id')->constrained()->restrictOnDelete();
            $table->foreignId('breed_id')->nullable()->constrained()->nullOnDelete();
            $table->string('age')->nullable();
            $table->string('age_group')->nullable();
            $table->string('gender')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('color')->nullable();
            $table->string('vaccination_status')->nullable();
            $table->text('medical_history')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });

        Schema::create('symptoms', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('severity_level');
            $table->string('body_system')->nullable();
            $table->timestamps();
        });

        Schema::create('diseases', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('species_id')->constrained()->restrictOnDelete();
            $table->text('description')->nullable();
            $table->string('severity_level');
            $table->string('transmission_mode')->nullable();
            $table->text('general_care_advice')->nullable();
            $table->boolean('requires_vet_attention')->default(true);
            $table->boolean('requires_lab_test')->default(false);
            $table->timestamps();

            $table->unique(['species_id', 'name']);
        });

        Schema::create('risk_factors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('knowledge_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submitted_by')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('disease_name')->nullable();
            $table->foreignId('species_id')->nullable()->constrained()->nullOnDelete();
            $table->text('summary');
            $table->string('source_type')->nullable();
            $table->string('source_reference')->nullable();
            $table->string('evidence_level')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status')->default('draft');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('curator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('knowledge_submission_symptoms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_submission_id')->constrained()->cascadeOnDelete();
            $table->string('symptom_name');
            $table->text('symptom_description')->nullable();
            $table->integer('symptom_weight')->default(1);
            $table->string('severity_level')->nullable();
            $table->timestamps();
        });

        Schema::create('knowledge_submission_risk_factors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_submission_id')->constrained()->cascadeOnDelete();
            $table->string('risk_factor_name');
            $table->integer('weight')->default(1);
            $table->timestamps();
        });

        Schema::create('knowledge_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_submission_id')->constrained()->cascadeOnDelete();
            $table->string('source_title')->nullable();
            $table->string('source_author')->nullable();
            $table->string('source_year')->nullable();
            $table->string('source_url')->nullable();
            $table->string('source_type')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('knowledge_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_submission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewed_by')->constrained('users')->cascadeOnDelete();
            $table->string('decision');
            $table->text('comments')->nullable();
            $table->timestamp('reviewed_at');
            $table->timestamps();
        });

        Schema::create('disease_symptom_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disease_id')->constrained()->cascadeOnDelete();
            $table->foreignId('symptom_id')->constrained()->cascadeOnDelete();
            $table->integer('weight')->default(1);
            $table->boolean('is_required')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['disease_id', 'symptom_id']);
        });

        Schema::create('disease_risk_factor_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disease_id')->constrained()->cascadeOnDelete();
            $table->foreignId('risk_factor_id')->constrained()->cascadeOnDelete();
            $table->integer('weight')->default(1);
            $table->timestamps();

            $table->unique(['disease_id', 'risk_factor_id']);
        });

        Schema::create('published_rule_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disease_id')->constrained()->cascadeOnDelete();
            $table->foreignId('species_id')->constrained()->cascadeOnDelete();
            $table->string('version_number');
            $table->json('rules_json')->nullable();
            $table->foreignId('published_by')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at');
            $table->timestamps();
        });

        Schema::create('veterinary_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('animal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assigned_vet_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('duration')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->default('submitted');
            $table->string('urgency_level')->default('low');
            $table->text('system_suggestion')->nullable();
            $table->decimal('system_score', 5, 2)->nullable();
            $table->text('system_explanation')->nullable();
            $table->text('vet_diagnosis')->nullable();
            $table->text('vet_advice')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->timestamps();
        });

        Schema::create('case_symptoms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('veterinary_case_id')->constrained()->cascadeOnDelete();
            $table->foreignId('symptom_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['veterinary_case_id', 'symptom_id']);
        });

        Schema::create('case_risk_factors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('veterinary_case_id')->constrained()->cascadeOnDelete();
            $table->foreignId('risk_factor_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['veterinary_case_id', 'risk_factor_id']);
        });

        Schema::create('case_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('veterinary_case_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->string('original_name')->nullable();
            $table->timestamps();
        });

        Schema::create('user_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notifications');
        Schema::dropIfExists('case_attachments');
        Schema::dropIfExists('case_risk_factors');
        Schema::dropIfExists('case_symptoms');
        Schema::dropIfExists('veterinary_cases');
        Schema::dropIfExists('published_rule_sets');
        Schema::dropIfExists('disease_risk_factor_rules');
        Schema::dropIfExists('disease_symptom_rules');
        Schema::dropIfExists('knowledge_reviews');
        Schema::dropIfExists('knowledge_sources');
        Schema::dropIfExists('knowledge_submission_risk_factors');
        Schema::dropIfExists('knowledge_submission_symptoms');
        Schema::dropIfExists('knowledge_submissions');
        Schema::dropIfExists('risk_factors');
        Schema::dropIfExists('diseases');
        Schema::dropIfExists('symptoms');
        Schema::dropIfExists('animals');
        Schema::dropIfExists('breeds');
        Schema::dropIfExists('species');
    }
};
