<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Institution;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function downloadReceipt(Application $application)
    {
        // Ensure the logged-in user owns the application (Student)
        if (auth()->user()->role === 'student' && $application->student->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access.');
        }

        $application->load(['student.user', 'student.homeState', 'scholarship', 'institution']);

        $pdf = Pdf::loadView('pdf.receipt', compact('application'));
        
        return $pdf->download('application_receipt_' . $application->id . '.pdf');
    }

    public function downloadInstitutionReport(Institution $institution)
    {
        // Ensure user is admin
        if (!in_array(auth()->user()->role, ['super_admin', 'state_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        $institution->load(['state']);
        // Load applications for this institution
        $applications = Application::with(['student.user', 'scholarship'])->where('institution_id', $institution->id)->get();

        $pdf = Pdf::loadView('pdf.report', compact('institution', 'applications'));

        return $pdf->download('institution_report_' . $institution->id . '.pdf');
    }

    public function downloadSystemReport()
    {
        // Ensure user is admin
        if (!in_array(auth()->user()->role, ['super_admin', 'state_admin'])) {
            abort(403, 'Unauthorized access.');
        }

        $user = auth()->user();
        
        if ($user->role === 'state_admin') {
            $statesCount = 1;
            $verifiedInstitutions = Institution::with('state')
                ->where('state_id', $user->state_id)
                ->where('status', 'verified')
                ->get();
            $activeStudentsCount = \App\Models\Student::where('home_state_id', $user->state_id)->count();
            
            $applications = Application::with(['student.user', 'student.homeState', 'scholarship', 'institution'])
                ->whereHas('student', function ($query) use ($user) {
                    $query->where('home_state_id', $user->state_id);
                })
                ->get();
                
            $totalDisbursed = Application::where('status', 'approved')
                ->whereHas('student', function ($query) use ($user) {
                    $query->where('home_state_id', $user->state_id);
                })
                ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
                ->sum('amount');
                
            $scope = $user->state ? $user->state->name . ' State Scope' : 'State Admin Scope';
        } else {
            // Super Admin
            $statesCount = \App\Models\State::count();
            $verifiedInstitutions = Institution::with('state')->where('status', 'verified')->get();
            $activeStudentsCount = \App\Models\Student::count();
            
            $applications = Application::with(['student.user', 'student.homeState', 'scholarship', 'institution'])->get();
            
            $totalDisbursed = Application::where('status', 'approved')
                ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
                ->sum('amount');
                
            $scope = 'System-Wide Global Scope';
        }

        $pdf = Pdf::loadView('pdf.system_report', compact(
            'statesCount',
            'verifiedInstitutions',
            'activeStudentsCount',
            'applications',
            'totalDisbursed',
            'scope'
        ));

        return $pdf->download('system_report_' . now()->format('Y_m_d') . '.pdf');
    }
}
