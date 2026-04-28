<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    protected $fillable = ['name', 'area', 'fee', 'estimated_time', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'fee'       => 'decimal:2',
    ];
}
