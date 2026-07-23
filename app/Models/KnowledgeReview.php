<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'knowledge_submission_id',
        'reviewed_by',
        'decision',
        'comments',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function knowledgeSubmission(): BelongsTo
    {
        return $this->belongsTo(KnowledgeSubmission::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
