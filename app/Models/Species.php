<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Species extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function breeds(): HasMany
    {
        return $this->hasMany(Breed::class);
    }

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }

    public function diseases(): HasMany
    {
        return $this->hasMany(Disease::class);
    }

    public function knowledgeSubmissions(): HasMany
    {
        return $this->hasMany(KnowledgeSubmission::class);
    }

    public function publishedRuleSets(): HasMany
    {
        return $this->hasMany(PublishedRuleSet::class);
    }
}
