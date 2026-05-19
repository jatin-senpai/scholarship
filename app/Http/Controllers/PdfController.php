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
}
