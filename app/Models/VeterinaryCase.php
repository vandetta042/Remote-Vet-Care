<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VeterinaryCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'animal_id',
        'assigned_vet_id',
        'title',
        'description',
        'duration',
        'location',
        'status',
        'urgency_level',
        'system_suggestion',
        'system_score',
        'system_explanation',
        'vet_diagnosis',
        'vet_advice',
        'follow_up_date',
    ];

    protected function casts(): array
    {
        return [
            'system_score' => 'decimal:2',
            'follow_up_date' => 'date',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function assignedVet(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_vet_id');
    }

    public function symptoms(): BelongsToMany
    {
        return $this->belongsToMany(Symptom::class, 'case_symptoms')
            ->withTimestamps();
    }

    public function riskFactors(): BelongsToMany
    {
        return $this->belongsToMany(RiskFactor::class, 'case_risk_factors')
            ->withTimestamps();
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(CaseAttachment::class);
    }
}
