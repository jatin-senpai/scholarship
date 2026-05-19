<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['student_id', 'scholarship_id', 'institution_id', 'status', 'remarks'];

    public function student() { return $this->belongsTo(Student::class); }
    public function scholarship() { return $this->belongsTo(Scholarship::class); }
    public function institution() { return $this->belongsTo(Institution::class); }
}
