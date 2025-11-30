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

        return response()->json($pendingUsers);
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->is_approved = true;
        $user->save();

        // Send email notification to user (simulated)

        return response()->json(['message' => 'User approved successfully']);
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User rejected and removed']);
    }
}
