<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeSubmissionRiskFactor extends Model
{
    use HasFactory;

    protected $fillable = [
        'knowledge_submission_id',
        'risk_factor_name',
        'weight',
    ];

    public function knowledgeSubmission(): BelongsTo
    {
        return $this->belongsTo(KnowledgeSubmission::class);
    }
}
