<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        // Return all users except owner
        $users = User::where('role', '!=', 'owner')->get();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'last_login_at' => $user->last_login_at,
                    'profile_picture' => $user->profile_picture ? url('storage/' . $user->profile_picture) : null,
                ];
            })
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'password' => 'nullable|min:6',
            'profile_picture' => 'nullable|image|max:2048' // Max 2MB
        ]);

        $data = ['name' => $request->name];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Store new profile picture
            $path = $request->file('profile_picture')->store('profiles', 'public');
            $data['profile_picture'] = $path;
        }

        $user->update($data);

        // Return the updated user data including the full URL for the profile picture
        $user->profile_picture = $user->profile_picture ? url('storage/' . $user->profile_picture) : null;

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'owner') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun pemilik'
            ], 403);
        }

        // Delete profile picture if exists
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus'
        ]);
    }
}