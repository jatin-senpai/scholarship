<?php

namespace Tests\Feature;

use App\Models\State;
use App\Models\User;
use App\Models\Institution;
use App\Models\Scholarship;
use App\Models\Student;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ScholarshipEligibilityTest extends TestCase
{
    use RefreshDatabase;

    private $studentUser;
    private $institutionUser;
    private $institution;
    private $adminUser;
    private $stateMh;
    private $stateKa;
    private $scholarship;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        // Retrieve Pre-seeded States
        $this->stateMh = State::where('code', 'MH')->first();
        $this->stateKa = State::where('code', 'KA')->first();

        // Create Admin
        $this->adminUser = User::create([
            'name' => 'MH State Admin',
            'email' => 'admin@mh.gov.in',
            'password' => 'password',
            'role' => 'state_admin',
            'state_id' => $this->stateMh->id,
        ]);

        // Create Institution User & profile
        $this->institutionUser = User::create([
            'name' => 'VJTI',
            'email' => 'vjti@edu.in',
            'password' => 'password',
            'role' => 'institution',
            'state_id' => $this->stateMh->id,
        ]);

        $this->institution = Institution::create([
            'name' => 'VJTI',
            'state_id' => $this->stateMh->id,
            'reg_no' => 'REG12345',
            'status' => 'verified',
        ]);

        // Create Student User
        $this->studentUser = User::create([
            'name' => 'Jay Kumar',
            'email' => 'jay@student.com',
            'password' => 'password',
            'role' => 'student',
        ]);

        // Create Scholarship with constraints (Domicile: MH, Min Marks: 75%, Max Income: 2,00,000)
        $this->scholarship = Scholarship::create([
            'title' => 'MH Merit Scholarship',
            'description' => 'Merit scholarship for Maharashtra students.',
            'amount' => 50000.00,
            'deadline' => now()->addDays(30),
            'eligibility' => [
                'min_marks' => 75,
                'max_income' => 200000
            ],
            'state_id' => $this->stateMh->id,
        ]);
    }

    /**
     * Test eligibility: Domicile mismatch fails.
     */
    public function test_domicile_mismatch_fails_eligibility(): void
    {
        $response = $this->actingAs($this->studentUser)->post(route('student.apply'), [
            'home_state_id' => $this->stateKa->id, // Domicile: KA, but Scholarship requires MH
            'studying_state_id' => $this->stateMh->id,
            'institution_id' => $this->institution->id,
            'scholarship_id' => $this->scholarship->id,
            'marks_percentage' => 85,
            'annual_income' => 150000,
            'documents' => UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $response->assertSessionHasErrors(['home_state_id']);
        $this->assertEquals(0, Application::count());
    }

    /**
     * Test eligibility: Low academic performance fails.
     */
    public function test_insufficient_marks_fails_eligibility(): void
    {
        $response = $this->actingAs($this->studentUser)->post(route('student.apply'), [
            'home_state_id' => $this->stateMh->id,
            'studying_state_id' => $this->stateMh->id,
            'institution_id' => $this->institution->id,
            'scholarship_id' => $this->scholarship->id,
            'marks_percentage' => 70, // 70 < required 75
            'annual_income' => 150000,
            'documents' => UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $response->assertSessionHasErrors(['marks_percentage']);
        $this->assertEquals(0, Application::count());
    }

    /**
     * Test eligibility: Excess income fails.
     */
    public function test_excessive_income_fails_eligibility(): void
    {
        $response = $this->actingAs($this->studentUser)->post(route('student.apply'), [
            'home_state_id' => $this->stateMh->id,
            'studying_state_id' => $this->stateMh->id,
            'institution_id' => $this->institution->id,
            'scholarship_id' => $this->scholarship->id,
            'marks_percentage' => 80,
            'annual_income' => 250000, // 250,000 > required 200,000
            'documents' => UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $response->assertSessionHasErrors(['annual_income']);
        $this->assertEquals(0, Application::count());
    }

    /**
     * Test eligibility: Valid parameters submit successfully.
     */
    public function test_valid_eligibility_submits_successfully(): void
    {
        $response = $this->actingAs($this->studentUser)->post(route('student.apply'), [
            'home_state_id' => $this->stateMh->id,
            'studying_state_id' => $this->stateMh->id,
            'institution_id' => $this->institution->id,
            'scholarship_id' => $this->scholarship->id,
            'marks_percentage' => 85,
            'annual_income' => 120000,
            'documents' => UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $response->assertRedirect(route('student.dashboard'));
        $this->assertEquals(1, Application::count());

        $student = Student::where('user_id', $this->studentUser->id)->first();
        $this->assertNotNull($student);
        $this->assertEquals(85, $student->marks_percentage);
        $this->assertEquals(120000, $student->annual_income);

        $application = Application::first();
        $this->assertEquals('submitted', $application->status);
    }

    /**
     * Test application status transitions and student notifications.
     */
    public function test_application_workflow_transitions_and_notifications(): void
    {
        // 1. Submit a valid application
        $this->actingAs($this->studentUser)->post(route('student.apply'), [
            'home_state_id' => $this->stateMh->id,
            'studying_state_id' => $this->stateMh->id,
            'institution_id' => $this->institution->id,
            'scholarship_id' => $this->scholarship->id,
            'marks_percentage' => 85,
            'annual_income' => 120000,
            'documents' => UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $application = Application::first();

        // 2. Institution verification
        $this->actingAs($this->institutionUser)->post(route('institution.application.verify', $application->id), [
            'status' => 'institution_verified'
        ]);

        $application->refresh();
        $this->assertEquals('institution_verified', $application->status);
        
        // Assert student user received notification
        $this->assertEquals(1, $this->studentUser->unreadNotifications()->count());
        $notification = $this->studentUser->unreadNotifications()->first();
        $this->assertStringContainsString('verified by the Institution', $notification->data['message']);

        // 3. State verification
        $this->actingAs($this->adminUser)->post(route('admin.application.verifyState', $application->id));

        $application->refresh();
        $this->assertEquals('state_verified', $application->status);
        
        // Assert student user received second notification
        $this->assertEquals(2, $this->studentUser->unreadNotifications()->count());
        
        // 4. Admin approval & funds disbursal
        $this->actingAs($this->adminUser)->post(route('admin.application.disburse', $application->id));

        $application->refresh();
        $this->assertEquals('approved', $application->status);

        // Verify simulated disbursal details in remarks
        $remarks = json_decode($application->remarks, true);
        $this->assertArrayHasKey('transaction_id', $remarks);
        $this->assertArrayHasKey('disbursed_at', $remarks);
        $this->assertStringStartsWith('TXN-', $remarks['transaction_id']);

        // Assert congratulations notification sent to student
        $this->assertEquals(3, $this->studentUser->unreadNotifications()->count());
        
        // 5. Test student dismisses a notification
        $unreadNotificationId = $this->studentUser->unreadNotifications()->first()->id;
        $response = $this->actingAs($this->studentUser)->post(route('student.notifications.read', $unreadNotificationId));

        $this->assertEquals(2, $this->studentUser->unreadNotifications()->count());
    }
}
