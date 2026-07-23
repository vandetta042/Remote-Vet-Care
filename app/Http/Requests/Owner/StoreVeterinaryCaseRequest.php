<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVeterinaryCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'animal_id' => ['required', 'exists:animals,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:20'],
            'duration' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'symptom_ids' => ['required', 'array', 'min:1'],
            'symptom_ids.*' => ['integer', 'exists:symptoms,id'],
            'risk_factor_ids' => ['nullable', 'array'],
            'risk_factor_ids.*' => ['integer', 'exists:risk_factors,id'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'symptom_ids.min' => 'Select at least one symptom for this case.',
        ];
    }
}
