<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'address',
        'total_price',
        'payment_method',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(order_items::class);
    }
}
