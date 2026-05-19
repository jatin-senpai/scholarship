<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = ['name', 'code', 'portal_url'];

    public function institutions() { return $this->hasMany(Institution::class); }
    public function studentsFromHere() { return $this->hasMany(Student::class, 'home_state_id'); }
    public function studentsStudyingHere() { return $this->hasMany(Student::class, 'studying_state_id'); }
    public function scholarships() { return $this->hasMany(Scholarship::class); }
    public function apiKeys() { return $this->hasMany(ApiKey::class); }
}
