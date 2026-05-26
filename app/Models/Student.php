<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['user_id', 'home_state_id', 'studying_state_id', 'institution_id', 'documents', 'marks_percentage', 'annual_income'];
    protected $casts = ['documents' => 'array'];

    public function user() { return $this->belongsTo(User::class); }
    public function homeState() { return $this->belongsTo(State::class, 'home_state_id'); }
    public function studyingState() { return $this->belongsTo(State::class, 'studying_state_id'); }
    public function institution() { return $this->belongsTo(Institution::class); }
    public function applications() { return $this->hasMany(Application::class); }
}
