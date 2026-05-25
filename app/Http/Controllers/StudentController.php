<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Scholarship;
use App\Models\Institution;
use App\Models\State;
use App\Models\Student;
use App\Models\Application;

class StudentController extends Controller
{
    public function create()
    {
        return Inertia::render('Student/Apply', [
            'scholarships' => Scholarship::all(),
            'institutions' => Institution::where('status', 'verified')->get(),
            'states' => State::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'home_state_id' => 'required|exists:states,id',
            'studying_state_id' => 'required|exists:states,id',
            'institution_id' => 'required|exists:institutions,id',
            'scholarship_id' => 'required|exists:scholarships,id',
            'documents' => 'required|file|mimes:pdf,jpg,png|max:5120',
        ]);

        $user = $request->user();

        // Handle document upload
        $path = $request->file('documents')->store('student_documents', 'public');

        // Create or update student profile
        $student = Student::firstOrCreate(
            ['user_id' => $user->id],
            [
                'home_state_id' => $request->home_state_id,
                'studying_state_id' => $request->studying_state_id,
                'institution_id' => $request->institution_id,
                'documents' => ['identity' => $path]
            ]
        );

        // Create the application
        Application::create([
            'student_id' => $student->id,
            'scholarship_id' => $request->scholarship_id,
            'institution_id' => $request->institution_id,
            'status' => 'submitted',
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Application submitted successfully.');
    }
}
