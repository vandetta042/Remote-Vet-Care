<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RiskFactor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function diseases(): BelongsToMany
    {
        return $this->belongsToMany(Disease::class, 'disease_risk_factor_rules')
            ->withPivot(['weight'])
            ->withTimestamps();
    }

    public function diseaseRules(): HasMany
    {
        return $this->hasMany(DiseaseRiskFactorRule::class);
    }

    public function veterinaryCases(): BelongsToMany
    {
        return $this->belongsToMany(VeterinaryCase::class, 'case_risk_factors')
            ->withTimestamps();
    }
}
