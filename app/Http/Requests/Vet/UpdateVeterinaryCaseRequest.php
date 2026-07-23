<?php

namespace App\Http\Requests\Vet;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVeterinaryCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assigned_vet_id' => [
                'nullable',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role', User::ROLE_VET)),
            ],
            'vet_diagnosis' => ['nullable', 'string'],
            'vet_advice' => ['nullable', 'string'],
            'follow_up_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['submitted', 'under_review', 'vet_responded', 'resolved', 'referred', 'closed'])],
        ];
    }
}
