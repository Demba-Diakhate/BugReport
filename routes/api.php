<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::post('/bugreport', function (Request $request) {

    $validated = $request->validate([
        'message'   => 'required|string|max:1000',
        'selector'  => 'nullable|string|max:500',
        'url'       => 'required|url',
        'userAgent' => 'nullable|string|max:1000',
        'timestamp' => 'nullable|date',
    ]);

    /*
    |--------------------------------------------------------------------------
    | Traitement (MVP)
    |--------------------------------------------------------------------------
    | Pour l’instant : log
    | Plus tard :
    | - DB
    | - Email
    | - Slack
    | - Dashboard
    */

    Log::info('BugReport reçu', [
        'message'   => $validated['message'],
        'selector'  => $validated['selector'] ?? null,
        'url'       => $validated['url'],
        'userAgent' => $validated['userAgent'] ?? null,
        'timestamp' => $validated['timestamp'] ?? now()->toISOString(),
        'ip'        => $request->ip(),
    ]);

    return response()->json([
        'status' => 'ok'
    ]);
});

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// Route::post('/bugreport', function (Request $request) {
//     return response()->json([
//         'status' => 'ok'
//     ]);
// });
