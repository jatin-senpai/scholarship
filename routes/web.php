<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Illuminate\Http\Request $request) {
    $role = $request->user()->role;
    $redirectUrl = match ($role) {
        'super_admin', 'state_admin' => route('admin.dashboard', absolute: false),
        'institution' => route('institution.dashboard', absolute: false),
        'student' => route('student.dashboard', absolute: false),
        default => '/',
    };
    return redirect($redirectUrl);
})->middleware(['auth', 'verified'])->name('dashboard');

// Public Institution Registration
Route::get('/register/institution', [App\Http\Controllers\InstitutionController::class, 'create'])->name('institution.register');
Route::post('/register/institution', [App\Http\Controllers\InstitutionController::class, 'store']);

// Student Routes
Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function (Illuminate\Http\Request $request) {
        $student = $request->user()->student;
        $applications = $student ? \App\Models\Application::with('scholarship')->where('student_id', $student->id)->get() : collect();
        return Inertia::render('Student/Dashboard', ['applications' => $applications]);
    })->name('dashboard');
    Route::get('/application/{application}/receipt', [\App\Http\Controllers\PdfController::class, 'downloadReceipt'])->name('application.receipt');
});

// Institution Routes
Route::middleware(['auth', 'verified', 'role:institution'])->prefix('institution')->name('institution.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Institution/Dashboard');
    })->name('dashboard');
});

// Admin Routes (State & Super Admin)
Route::middleware(['auth', 'verified', 'role:super_admin,state_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
    Route::post('/institution/{id}/verify', [\App\Http\Controllers\AdminController::class, 'verifyInstitution'])->name('institution.verify');
    Route::get('/institution/{institution}/report', [\App\Http\Controllers\PdfController::class, 'downloadInstitutionReport'])->name('institution.report');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
