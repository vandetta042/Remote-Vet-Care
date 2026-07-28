<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Animal extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'species_id',
        'breed_id',
        'age',
        'age_group',
        'gender',
        'weight',
        'color',
        'vaccination_status',
        'medical_history',
        'location',
        'profile_photo_path',
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
        ];
    }

    protected $appends = [
        'profile_photo_url',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function veterinaryCases(): HasMany
    {
        return $this->hasMany(VeterinaryCase::class);
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo_path
            ? Storage::disk('public')->url($this->profile_photo_path)
            : null;
    }
}
