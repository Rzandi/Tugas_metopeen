<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function index()
    {
        // Get all users with role 'admin' who are NOT approved
        $pendingUsers = User::where('role', 'admin')
            ->where('is_approved', false)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pendingUsers
        ]);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);

        // Validate user is admin and not approved
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admin users can be approved'
            ], 400);
        }

        if ($user->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'User already approved'
            ], 400);
        }

        $user->is_approved = true;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User approved successfully',
            'data' => $user
        ]);
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);

        // Validate user is admin
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admin users can be rejected'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User rejected and removed'
        ]);
    }
}
