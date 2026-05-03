<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class carts extends Model
{
    protected $fillable = [
        'session_id',
    ];

    public function items()
    {
        return $this->hasMany(cart_items::class);
    }
}
