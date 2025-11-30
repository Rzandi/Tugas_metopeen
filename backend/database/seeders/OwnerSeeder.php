<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Try to find user with username 'owner'
        $user = User::where('username', 'owner')->first();

        if ($user) {
            $user->update([
                'role' => 'owner',
                'is_approved' => true,
                'password' => Hash::make('password'), // Reset password to ensure access
            ]);
            $this->command->info('Updated existing user "owner" to role "owner". Password reset to "password".');
        } else {
            User::create([
                'name' => 'Owner System',
                'username' => 'owner',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'is_approved' => true,
            ]);
            $this->command->info('Created new user "owner" with role "owner".');
        }
    }
}
