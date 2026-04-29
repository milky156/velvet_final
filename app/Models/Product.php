<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'description', 'price', 'stock', 'image'];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
