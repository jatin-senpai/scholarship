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
            'marks_percentage' => 'required|numeric|min:0|max:100',
            'annual_income' => 'required|numeric|min:0',
            'documents' => 'required|file|mimes:pdf,jpg,png|max:5120',
        ]);

        $scholarship = Scholarship::findOrFail($request->scholarship_id);

        // Automated Eligibility Checks
        // 1. Domicile check
        if (intval($request->home_state_id) !== intval($scholarship->state_id)) {
            return redirect()->back()->withErrors([
                'home_state_id' => 'You are ineligible for this scholarship due to domicile state restriction.'
            ]);
        }

        // 2. Academic marks check
        $minMarks = $scholarship->eligibility['min_marks'] ?? 0;
        if (floatval($request->marks_percentage) < floatval($minMarks)) {
            return redirect()->back()->withErrors([
                'marks_percentage' => "Your academic marks do not meet the minimum requirement of {$minMarks}%."
            ]);
        }

        // 3. Family income check
        $maxIncome = $scholarship->eligibility['max_income'] ?? INF;
        if (floatval($request->annual_income) > floatval($maxIncome)) {
            return redirect()->back()->withErrors([
                'annual_income' => "Your annual family income exceeds the maximum allowed limit of ₹" . number_format($maxIncome) . "."
            ]);
        }

        $user = $request->user();

        // Handle document upload
        $path = $request->file('documents')->store('student_documents', 'public');

        // Create or update student profile
        $student = Student::updateOrCreate(
            ['user_id' => $user->id],
            [
                'home_state_id' => $request->home_state_id,
                'studying_state_id' => $request->studying_state_id,
                'institution_id' => $request->institution_id,
                'marks_percentage' => $request->marks_percentage,
                'annual_income' => $request->annual_income,
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

    public function readNotification(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return redirect()->back()->with('success', 'Notification marked as read.');
    }
}
