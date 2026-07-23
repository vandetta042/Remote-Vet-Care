<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disease extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'species_id',
        'description',
        'severity_level',
        'transmission_mode',
        'general_care_advice',
        'requires_vet_attention',
        'requires_lab_test',
    ];

    protected function casts(): array
    {
        return [
            'requires_vet_attention' => 'boolean',
            'requires_lab_test' => 'boolean',
        ];
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    public function symptoms(): BelongsToMany
    {
        return $this->belongsToMany(Symptom::class, 'disease_symptom_rules')
            ->withPivot(['weight', 'is_required', 'notes'])
            ->withTimestamps();
    }

    public function riskFactors(): BelongsToMany
    {
        return $this->belongsToMany(RiskFactor::class, 'disease_risk_factor_rules')
            ->withPivot(['weight'])
            ->withTimestamps();
    }

    public function symptomRules(): HasMany
    {
        return $this->hasMany(DiseaseSymptomRule::class);
    }

    public function riskFactorRules(): HasMany
    {
        return $this->hasMany(DiseaseRiskFactorRule::class);
    }

    public function publishedRuleSets(): HasMany
    {
        return $this->hasMany(PublishedRuleSet::class);
    }
}
