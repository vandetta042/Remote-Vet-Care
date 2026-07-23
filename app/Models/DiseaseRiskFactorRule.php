<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseaseRiskFactorRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'disease_id',
        'risk_factor_id',
        'weight',
    ];

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }

    public function riskFactor(): BelongsTo
    {
        return $this->belongsTo(RiskFactor::class);
    }
}
