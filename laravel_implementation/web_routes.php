<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes for React CMS Integration
|--------------------------------------------------------------------------
|
| These routes handle the web-based redirects to React CMS
|
*/

// Redirect to React CMS - this matches your existing route structure
Route::group(['prefix' => 'cms'], function () {
    // Final CMS redirect path (React app is hosted at /cms)
    $cmsPath = '/cms/Dashboard';
    Route::get('/', [AuthController::class, 'redirectToCms'])->name('cms.cms');
});

// Alternative route structure (if you prefer)
// Route::get('/cms', [AuthController::class, 'redirectToCms'])->name('cms.cms'); 