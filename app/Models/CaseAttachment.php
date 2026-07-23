<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'veterinary_case_id',
        'file_path',
        'file_type',
        'original_name',
    ];

    public function veterinaryCase(): BelongsTo
    {
        return $this->belongsTo(VeterinaryCase::class);
    }
}
