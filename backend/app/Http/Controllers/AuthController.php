<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'=> 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user= Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;
        $isProduction = app()->environment('production');

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ])->cookie('admin_token', $token, 60 * 8,'/', null, $isProduction, true, false, 'Lax'       
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' =>'Logged out'])->cookie('admin_token', '', -1);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => [
                'name'=> $request->user()->name,
                'email' => $request->user()->email,
            ],
        ]);
    }
}