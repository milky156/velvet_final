<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'customer_name', 'customer_email', 'total', 'status',
        'delivery_address', 'delivery_lat', 'delivery_lng',
        'contact_phone', 'delivery_option', 'payment_method', 'maps_url',
        'picked_up_at', 'dropped_off_at',
    ];

    protected $casts = [
        'picked_up_at' => 'datetime',
        'dropped_off_at' => 'datetime',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
