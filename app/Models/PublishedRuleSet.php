<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublishedRuleSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'disease_id',
        'species_id',
        'version_number',
        'rules_json',
        'published_by',
        'is_active',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'rules_json' => 'array',
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
