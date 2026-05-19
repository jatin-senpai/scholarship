<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Institution;
use App\Models\ApiKey;

class ApiController extends Controller
{
    public function verifyInstitution(Request $request)
    {
        $apiKey = $request->header('X-API-KEY');

        if (!$apiKey) {
            return response()->json([
                'status' => 'error',
                'message' => 'API Key is missing.'
            ], 401);
        }

        $keyRecord = ApiKey::where('key', $apiKey)->where('is_active', true)->first();

        if (!$keyRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or inactive API Key.'
            ], 401);
        }

        $regNo = $request->query('reg_no');
        $token = $request->query('verification_token');

        if (!$regNo && !$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please provide reg_no or verification_token to query.'
            ], 400);
        }

        $query = Institution::with('state');

        if ($regNo) {
            $query->where('reg_no', $regNo);
        }
        if ($token) {
            $query->where('verification_token', $token);
        }

        $institution = $query->first();

        if (!$institution) {
            return response()->json([
                'status' => 'success',
                'message' => 'Institution not found.',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Institution verification details retrieved.',
            'data' => [
                'name' => $institution->name,
                'reg_no' => $institution->reg_no,
                'state' => $institution->state->name,
                'is_verified' => $institution->status === 'verified',
                'verification_token' => $institution->verification_token,
                'verified_at' => $institution->status === 'verified' ? $institution->updated_at : null
            ]
        ], 200);
    }
}
