<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        // Return all users except owner
        $users = User::where('role', '!=', 'owner')->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'password' => 'nullable|min:6'
        ]);

        $data = ['name' => $request->name];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

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

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus'
        ]);
    }
}