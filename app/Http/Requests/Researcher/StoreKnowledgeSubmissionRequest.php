<?php

namespace App\Http\Requests\Researcher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKnowledgeSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'disease_name' => ['nullable', 'string', 'max:255'],
            'species_id' => ['nullable', 'exists:species,id'],
            'summary' => ['required', 'string', 'min:30'],
            'source_type' => ['nullable', Rule::in(['journal', 'textbook', 'field_report', 'guideline', 'other'])],
            'source_reference' => ['nullable', 'string', 'max:255'],
            'evidence_level' => ['nullable', Rule::in(['high', 'moderate', 'low', 'preliminary'])],
            'status' => ['required', Rule::in(['draft', 'correction_requested'])],
            'metadata' => ['nullable', 'array'],
            'metadata.affected_species_note' => ['nullable', 'string', 'max:255'],
            'metadata.severity_note' => ['nullable', 'string', 'max:255'],
            'metadata.care_advice' => ['nullable', 'string'],
            'symptoms' => ['nullable', 'array'],
            'symptoms.*.symptom_name' => ['nullable', 'string', 'max:255'],
            'symptoms.*.symptom_description' => ['nullable', 'string'],
            'symptoms.*.symptom_weight' => ['nullable', 'integer', 'min:1', 'max:10'],
            'symptoms.*.severity_level' => ['nullable', Rule::in(['mild', 'moderate', 'severe', 'emergency'])],
            'risk_factors' => ['nullable', 'array'],
            'risk_factors.*.risk_factor_name' => ['nullable', 'string', 'max:255'],
            'risk_factors.*.weight' => ['nullable', 'integer', 'min:1', 'max:10'],
            'sources' => ['nullable', 'array'],
            'sources.*.source_title' => ['nullable', 'string', 'max:255'],
            'sources.*.source_author' => ['nullable', 'string', 'max:255'],
            'sources.*.source_year' => ['nullable', 'string', 'max:20'],
            'sources.*.source_url' => ['nullable', 'url', 'max:255'],
            'sources.*.source_type' => ['nullable', Rule::in(['journal', 'textbook', 'field_report', 'guideline', 'other'])],
            'sources.*.notes' => ['nullable', 'string'],
        ];
    }
}
