<?php

namespace App\Http\Requests\Curator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublishKnowledgeSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'severity_level' => ['required', Rule::in(['mild', 'moderate', 'severe', 'emergency'])],
            'transmission_mode' => ['nullable', 'string', 'max:255'],
            'general_care_advice' => ['nullable', 'string'],
            'care_recommendations' => ['nullable', 'string'],
            'care_urgency_level' => ['nullable', Rule::in(['low', 'moderate', 'high', 'emergency'])],
            'requires_vet_attention' => ['required', 'boolean'],
            'requires_lab_test' => ['required', 'boolean'],
            'version_number' => ['required', 'string', 'max:50'],
        ];
    }
}
