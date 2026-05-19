<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    protected $fillable = ['title', 'description', 'amount', 'deadline', 'eligibility', 'state_id'];
    protected $casts = ['deadline' => 'date', 'amount' => 'decimal:2'];

    public function state() { return $this->belongsTo(State::class); }
    public function applications() { return $this->hasMany(Application::class); }
}
