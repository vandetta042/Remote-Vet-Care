<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'severity_level',
        'body_system',
    ];

    public function diseases(): BelongsToMany
    {
        return $this->belongsToMany(Disease::class, 'disease_symptom_rules')
            ->withPivot(['weight', 'is_required', 'notes'])
            ->withTimestamps();
    }

    public function diseaseRules(): HasMany
    {
        return $this->hasMany(DiseaseSymptomRule::class);
    }

    public function veterinaryCases(): BelongsToMany
    {
        return $this->belongsToMany(VeterinaryCase::class, 'case_symptoms')
            ->withTimestamps();
    }
}
