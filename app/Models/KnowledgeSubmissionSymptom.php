<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeSubmissionSymptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'knowledge_submission_id',
        'symptom_name',
        'symptom_description',
        'symptom_weight',
        'severity_level',
    ];

    public function knowledgeSubmission(): BelongsTo
    {
        return $this->belongsTo(KnowledgeSubmission::class);
    }
}
