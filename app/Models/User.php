<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_OWNER = 'owner';
    public const ROLE_VET = 'vet';
    public const ROLE_RESEARCHER = 'researcher';
    public const ROLE_REVIEWER = 'reviewer';
    public const ROLE_CURATOR = 'curator';
    public const ROLE_ADMIN = 'admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'status',
        'profile_photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function roles(): array
    {
        return [
            self::ROLE_OWNER,
            self::ROLE_VET,
            self::ROLE_RESEARCHER,
            self::ROLE_REVIEWER,
            self::ROLE_CURATOR,
            self::ROLE_ADMIN,
        ];
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class, 'owner_id');
    }

    public function ownedVeterinaryCases(): HasMany
    {
        return $this->hasMany(VeterinaryCase::class, 'owner_id');
    }

    public function assignedVeterinaryCases(): HasMany
    {
        return $this->hasMany(VeterinaryCase::class, 'assigned_vet_id');
    }

    public function knowledgeSubmissions(): HasMany
    {
        return $this->hasMany(KnowledgeSubmission::class, 'submitted_by');
    }

    public function knowledgeReviews(): HasMany
    {
        return $this->hasMany(KnowledgeReview::class, 'reviewed_by');
    }

    public function publishedRuleSets(): HasMany
    {
        return $this->hasMany(PublishedRuleSet::class, 'published_by');
    }

    public function userNotifications(): HasMany
    {
        return $this->hasMany(UserNotification::class);
    }
}
