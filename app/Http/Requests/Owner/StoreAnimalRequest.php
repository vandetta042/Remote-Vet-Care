<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'species_id' => ['required', 'exists:species,id'],
            'breed_id' => ['nullable', 'exists:breeds,id'],
            'age' => ['nullable', 'string', 'max:255'],
            'age_group' => ['nullable', Rule::in(['young', 'adult', 'senior'])],
            'gender' => ['nullable', Rule::in(['male', 'female', 'unknown'])],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:255'],
            'vaccination_status' => ['nullable', Rule::in(['up_to_date', 'partial', 'not_vaccinated', 'unknown'])],
            'medical_history' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'profile_photo' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
