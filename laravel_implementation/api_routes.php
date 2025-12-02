<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for React CMS Integration
|--------------------------------------------------------------------------
|
| These routes handle the integration between Laravel and React CMS
|
*/

// Check if user is authenticated via Laravel session
Route::get('/check-laravel-auth', [AuthController::class, 'checkLaravelAuth']);

// Validate Laravel session and return React token
Route::post('/validate-laravel-session', [AuthController::class, 'validateLaravelSession']);

// Redirect to React CMS (this should be added to your web.php or existing routes)
// Route::get('/cms', [AuthController::class, 'redirectToCms'])->name('cms.cms'); 