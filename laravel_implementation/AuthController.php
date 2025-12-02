<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Check if user is authenticated via Laravel session
     */
    public function checkLaravelAuth(Request $request)
    {
        try {
            if (Auth::check()) {
                $user = Auth::user();
                
                // Generate a React token for the user
                $reactToken = $this->generateReactToken($user);
                
                return response()->json([
                    'status' => true,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name ?? $user->username ?? $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'username' => $user->username ?? null,
                        'first_name' => $user->first_name ?? null,
                        'last_name' => $user->last_name ?? null,
                        'source' => 'Laravel',
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'token' => $reactToken
                ]);
            }
            
            return response()->json([
                'status' => false,
                'message' => 'Not authenticated'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in checkLaravelAuth', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Authentication check failed'
            ], 500);
        }
    }
    
    /**
     * Validate Laravel session token and return React token
     */
    public function validateLaravelSession(Request $request)
    {
        try {
            $laravelToken = $request->input('laravel_token');
            
            if (!$laravelToken) {
                return response()->json([
                    'status' => false,
                    'message' => 'No token provided'
                ]);
            }
            
            // Validate the Laravel token
            $user = $this->validateLaravelToken($laravelToken);
            
            if ($user) {
                // Generate a React token for the user
                $reactToken = $this->generateReactToken($user);
                
                return response()->json([
                    'status' => true,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name ?? $user->username ?? $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'username' => $user->username ?? null,
                        'first_name' => $user->first_name ?? null,
                        'last_name' => $user->last_name ?? null,
                        'source' => 'Laravel',
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ],
                    'token' => $reactToken
                ]);
            }
            
            return response()->json([
                'status' => false,
                'message' => 'Invalid token'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in validateLaravelSession', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => false,
                'message' => 'Token validation failed'
            ], 500);
        }
    }
    
    /**
     * Redirect to React CMS
     */
    public function redirectToCms(Request $request)
    {
        try {
            // Check if user is authenticated
            if (!Auth::check()) {
                Log::warning('User not authenticated, redirecting to login');
                return redirect()->route('login')->with('error', 'Please login first');
            }
            
            $user = Auth::user();
            $reactToken = $this->generateReactToken($user);
            
            // Generate the React CMS URL - update this to match your React URL
            $reactUrl = config('app.react_cms_url', 'http://localhost:3001/admin/cms');
            $redirectUrl = $reactUrl . '/laravel-redirect?' . http_build_query([
                'token' => $reactToken,
                'redirect' => $request->get('redirect', '/Dashboard')
            ]);
            
            Log::info('Redirecting to React CMS', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'redirect_url' => $redirectUrl
            ]);
            
            return redirect($redirectUrl);
            
        } catch (\Exception $e) {
            Log::error('Error in redirectToCms', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Failed to redirect to CMS. Please try again.');
        }
    }
    
    /**
     * Generate a React token for the user
     */
    private function generateReactToken($user)
    {
        // Create a payload with user information
        $payload = [
            'user_id' => $user->id,
            'email' => $user->email,
            'name' => $user->name ?? $user->username ?? $user->first_name . ' ' . $user->last_name,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'source' => 'Laravel'
        ];
        
        // For now, we'll create a simple base64 encoded token
        // In production, you should use JWT or a more secure method
        return base64_encode(json_encode($payload));
    }
    
    /**
     * Validate Laravel token
     */
    private function validateLaravelToken($token)
    {
        try {
            $payload = json_decode(base64_decode($token), true);
            
            if (!$payload || !isset($payload['user_id'])) {
                return null;
            }
            
            // Check if token is expired
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return null;
            }
            
            // Get user from database
            $user = User::find($payload['user_id']);
            
            if (!$user) {
                return null;
            }
            
            return $user;
            
        } catch (\Exception $e) {
            Log::error('Error validating Laravel token', [
                'error' => $e->getMessage(),
                'token' => $token
            ]);
            return null;
        }
    }
} 