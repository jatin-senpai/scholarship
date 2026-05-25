<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert States if they don't exist
        $states = [
            ['name' => 'Maharashtra', 'code' => 'MH', 'portal_url' => 'https://mahadbt.maharashtra.gov.in'],
            ['name' => 'Karnataka', 'code' => 'KA', 'portal_url' => 'https://ssp.karnataka.gov.in'],
            ['name' => 'Delhi', 'code' => 'DL', 'portal_url' => 'https://edistrict.delhigovt.nic.in'],
        ];

        foreach ($states as $state) {
            DB::table('states')->updateOrInsert(['code' => $state['code']], $state);
        }

        // Get state IDs dynamically
        $maharashtraId = DB::table('states')->where('code', 'MH')->value('id');
        $karnatakaId = DB::table('states')->where('code', 'KA')->value('id');
        $delhiId = DB::table('states')->where('code', 'DL')->value('id');

        // Insert Default Scholarships
        $scholarships = [
            [
                'title' => 'Post Matric Scholarship for Minorities',
                'description' => 'Scholarship for minority community students studying in Class 11 to Ph.D.',
                'amount' => 15000.00,
                'deadline' => now()->addMonths(3),
                'eligibility' => json_encode(['min_marks' => 50, 'max_income' => 200000]),
                'state_id' => $maharashtraId,
            ],
            [
                'title' => 'Merit-cum-Means Scholarship for Professional and Technical Courses',
                'description' => 'Scholarship for students pursuing technical and professional courses at UG/PG level.',
                'amount' => 30000.00,
                'deadline' => now()->addMonths(2),
                'eligibility' => json_encode(['min_marks' => 60, 'max_income' => 250000]),
                'state_id' => $karnatakaId,
            ],
            [
                'title' => 'Central Sector Scheme of Scholarships for College and University Students',
                'description' => 'Financial assistance to meritorious students from low income families.',
                'amount' => 12000.00,
                'deadline' => now()->addMonths(1),
                'eligibility' => json_encode(['min_marks' => 80, 'max_income' => 450000]),
                'state_id' => $delhiId,
            ],
        ];

        foreach ($scholarships as $scholarship) {
            DB::table('scholarships')->updateOrInsert(['title' => $scholarship['title']], $scholarship);
        }

        // Create default Super Admin user if not exists
        if (!DB::table('users')->where('email', 'admin@scholarship.com')->exists()) {
            DB::table('users')->insert([
                'name' => 'Super Admin',
                'email' => 'admin@scholarship.com',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('scholarships')->whereIn('title', [
            'Post Matric Scholarship for Minorities',
            'Merit-cum-Means Scholarship for Professional and Technical Courses',
            'Central Sector Scheme of Scholarships for College and University Students'
        ])->delete();
    }
};
