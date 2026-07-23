<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KnowledgeSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'submitted_by',
        'title',
        'disease_name',
        'species_id',
        'summary',
        'source_type',
        'source_reference',
        'evidence_level',
        'metadata',
        'status',
        'reviewer_id',
        'curator_id',
        'submitted_at',
        'reviewed_at',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function curator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'curator_id');
    }

    public function symptoms(): HasMany
    {
        return $this->hasMany(KnowledgeSubmissionSymptom::class);
    }

    public function riskFactors(): HasMany
    {
        return $this->hasMany(KnowledgeSubmissionRiskFactor::class);
    }

    public function sources(): HasMany
    {
        return $this->hasMany(KnowledgeSource::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(KnowledgeReview::class);
    }
}
