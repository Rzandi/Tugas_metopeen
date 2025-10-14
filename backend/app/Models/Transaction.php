<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'id',
        'type',
        'date',
        'product',
        'quantity',
        'price',
        'total',
        'note',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}