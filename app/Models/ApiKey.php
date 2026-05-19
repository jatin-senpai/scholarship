<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    protected $fillable = ['state_id', 'key', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function state() { return $this->belongsTo(State::class); }
}
