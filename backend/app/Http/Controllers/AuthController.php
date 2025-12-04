<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah'],
            ]);
        }

        if (!$user->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda menunggu persetujuan Owner.'
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'name' => $user->name,
                    'role' => $user->role
                ]
            ]
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required|min:6',
            'name' => 'required',
            'role' => 'in:admin,staff'
        ]);

        $role = $request->role ?? 'staff';
        $isApproved = $role === 'staff';

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'role' => $role,
            'is_approved' => $isApproved
        ]);

        // Create notification for admins requiring approval
        if (!$isApproved) {
            $owners = User::where('role', 'owner')->get();
            foreach ($owners as $owner) {
                Notification::create([
                    'user_id' => $owner->id,
                    'type' => 'approval',
                    'title' => 'Permintaan Persetujuan Admin Baru',
                    'message' => "Pengguna {$user->name} ({$user->username}) meminta persetujuan sebagai admin.",
                    'data' => ['user_id' => $user->id],
                    'action_url' => '/approvals'
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => $isApproved ? 'Registrasi berhasil' : 'Registrasi berhasil. Menunggu persetujuan Owner.',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'role' => $user->role,
                'is_approved' => $user->is_approved
            ]
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout'
        ]);
    }
}