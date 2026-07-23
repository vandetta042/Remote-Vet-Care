<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'knowledge_submission_id',
        'source_title',
        'source_author',
        'source_year',
        'source_url',
        'source_type',
        'notes',
    ];

    public function knowledgeSubmission(): BelongsTo
    {
        return $this->belongsTo(KnowledgeSubmission::class);
    }
}
