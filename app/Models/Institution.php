<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    protected $fillable = ['name', 'state_id', 'reg_no', 'verification_token', 'status', 'documents'];
    protected $casts = ['documents' => 'array'];

    public function state() { return $this->belongsTo(State::class); }
    public function students() { return $this->hasMany(Student::class); }
    public function applications() { return $this->hasMany(Application::class); }
}
