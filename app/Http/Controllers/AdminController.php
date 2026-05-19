<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Institution;
use App\Models\Student;
use App\Models\State;
use App\Models\Application;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        $pendingInstitutions = Institution::with('state')->where('status', 'pending')->get();
        $verifiedInstitutions = Institution::with('state')->where('status', 'verified')->get();
        
        $stats = [
            'states_count' => State::count(),
            'verified_institutions' => $verifiedInstitutions->count(),
            'active_students' => Student::count(),
            'total_disbursed' => Application::where('status', 'approved')
                ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
                ->sum('amount')
        ];

        return Inertia::render('Admin/Dashboard', [
            'pendingInstitutions' => $pendingInstitutions,
            'verifiedInstitutions' => $verifiedInstitutions,
            'stats' => $stats
        ]);
    }

    public function verifyInstitution($id)
    {
        $institution = Institution::findOrFail($id);
        
        $institution->update([
            'status' => 'verified',
            'verification_token' => 'VERIFIED-' . strtoupper(Str::random(10)),
        ]);

        return redirect()->back()->with('success', 'Institution verified successfully.');
    }
}
