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
    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'state_admin') {
            $pendingInstitutions = Institution::with('state')
                ->where('state_id', $user->state_id)
                ->where('status', 'pending')
                ->get();
                
            $verifiedInstitutions = Institution::with('state')
                ->where('state_id', $user->state_id)
                ->where('status', 'verified')
                ->get();

            $applications = Application::with(['student.user', 'student.homeState', 'scholarship', 'institution'])
                ->whereHas('student', function ($query) use ($user) {
                    $query->where('home_state_id', $user->state_id);
                })
                ->get();

            $stats = [
                'states_count' => State::count(),
                'verified_institutions' => $verifiedInstitutions->count(),
                'active_students' => Student::where('home_state_id', $user->state_id)->count(),
                'total_disbursed' => Application::where('status', 'approved')
                    ->whereHas('student', function ($query) use ($user) {
                        $query->where('home_state_id', $user->state_id);
                    })
                    ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
                    ->sum('amount')
            ];
        } else {
            // Super Admin
            $pendingInstitutions = Institution::with('state')->where('status', 'pending')->get();
            $verifiedInstitutions = Institution::with('state')->where('status', 'verified')->get();
            
            $applications = Application::with(['student.user', 'student.homeState', 'scholarship', 'institution'])->get();

            $stats = [
                'states_count' => State::count(),
                'verified_institutions' => $verifiedInstitutions->count(),
                'active_students' => Student::count(),
                'total_disbursed' => Application::where('status', 'approved')
                    ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
                    ->sum('amount')
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'pendingInstitutions' => $pendingInstitutions,
            'verifiedInstitutions' => $verifiedInstitutions,
            'applications' => $applications,
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

    public function verifyApplication($id)
    {
        $application = Application::findOrFail($id);
        $user = auth()->user();

        if ($user->role === 'state_admin' && intval($application->student->home_state_id) !== intval($user->state_id)) {
            abort(403, 'Unauthorized access to this state\'s applications.');
        }

        $application->update([
            'status' => 'state_verified',
            'remarks' => 'Verified at State Level by ' . $user->name
        ]);

        $studentUser = $application->student->user;
        if ($studentUser) {
            $studentUser->notify(new \App\Notifications\ApplicationStatusChanged(
                $application,
                "Your application for '{$application->scholarship->title}' has been verified at the State level by {$user->name}."
            ));
        }

        return redirect()->back()->with('success', 'Application verified at State Level.');
    }

    public function approveAndDisburse(Request $request, $id)
    {
        $application = Application::findOrFail($id);
        $user = auth()->user();

        if ($user->role === 'state_admin' && intval($application->student->home_state_id) !== intval($user->state_id)) {
            abort(403, 'Unauthorized access to this state\'s applications.');
        }

        $transactionId = 'TXN-' . strtoupper(Str::random(12));
        $disbursedAt = now()->toDateTimeString();

        $remarks = json_encode([
            'transaction_id' => $transactionId,
            'disbursed_at' => $disbursedAt,
            'approved_by' => $user->name,
        ]);

        $application->update([
            'status' => 'approved',
            'remarks' => $remarks
        ]);

        $studentUser = $application->student->user;
        if ($studentUser) {
            $studentUser->notify(new \App\Notifications\ApplicationStatusChanged(
                $application,
                "Congratulations! Your application for '{$application->scholarship->title}' has been approved. A payment of ₹" . number_format($application->scholarship->amount) . " was disbursed. Transaction ID: {$transactionId}."
            ));
            
            \Illuminate\Support\Facades\Log::info("Simulated Email Sent to {$studentUser->email}: Scholarship Approved & Disbursed. Txn ID: {$transactionId}");
        }

        return redirect()->back()->with('success', 'Application approved and funds disbursed successfully.');
    }
}
