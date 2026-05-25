<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\State;
use App\Models\User;
use App\Models\Institution;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InstitutionController extends Controller
{
    public function create()
    {
        $states = State::all();
        return Inertia::render('Institution/Register', ['states' => $states]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'state_id' => 'required|exists:states,id',
            'reg_no' => 'required|string|unique:institutions,reg_no',
            'documents' => 'required|file|mimes:pdf,jpg,png|max:5120', // 5MB max
        ]);

        // 1. Create User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'institution',
            'state_id' => $request->state_id,
        ]);

        // 2. Upload Document
        $path = null;
        if ($request->hasFile('documents')) {
            $path = $request->file('documents')->store('institution_documents', 'public');
        }

        // 3. Create Institution Profile
        Institution::create([
            'name' => $request->name,
            'state_id' => $request->state_id,
            'reg_no' => $request->reg_no,
            'documents' => ['accreditation' => $path],
            'status' => 'pending', // Wait for Admin approval to get verification_token
        ]);

        Auth::login($user);

        return redirect()->route('institution.dashboard');
    }

    public function dashboard(Request $request)
    {
        $institution = Institution::where('name', $request->user()->name)
                                  ->where('state_id', $request->user()->state_id)
                                  ->first();

        $applications = [];
        if ($institution) {
            $applications = \App\Models\Application::with(['student.user', 'scholarship'])
                ->where('institution_id', $institution->id)
                ->get();
        }

        return Inertia::render('Institution/Dashboard', [
            'institution' => $institution,
            'applications' => $applications,
        ]);
    }

    public function verifyApplication(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:institution_verified,rejected']);
        
        $application = \App\Models\Application::findOrFail($id);
        $application->status = $request->status;
        $application->save();

        return redirect()->route('institution.dashboard')->with('success', 'Application status updated.');
    }
}
