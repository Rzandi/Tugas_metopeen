<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default owner account
        User::create([
            'username' => 'owner',
            'name' => 'Pemilik',
            'password' => Hash::make('owner123'),
            'role' => 'owner',
        ]);

        // Create default staff account
        User::create([
            'username' => 'staff',
            'name' => 'Karyawan',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
        ]);
    }
}