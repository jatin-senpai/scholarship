<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $states = [
            ['name' => 'Maharashtra', 'code' => 'MH', 'portal_url' => 'https://mahadbt.maharashtra.gov.in'],
            ['name' => 'Karnataka', 'code' => 'KA', 'portal_url' => 'https://ssp.karnataka.gov.in'],
            ['name' => 'Delhi', 'code' => 'DL', 'portal_url' => 'https://edistrict.delhigovt.nic.in'],
        ];

        foreach ($states as $stateData) {
            \App\Models\State::create($stateData);
        }

        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@scholarship.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        // State Admin (MH)
        User::create([
            'name' => 'MH State Admin',
            'email' => 'mh_admin@scholarship.com',
            'password' => bcrypt('password'),
            'role' => 'state_admin',
            'state_id' => 1,
        ]);

        // Institution User
        User::create([
            'name' => 'Demo Institution',
            'email' => 'institution@demo.com',
            'password' => bcrypt('password'),
            'role' => 'institution',
            'state_id' => 2, // KA
        ]);

        // Student User
        User::create([
            'name' => 'Demo Student',
            'email' => 'student@demo.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);
    }
}
