<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;

// ─── Public (anyone) ─────────────────────────────────────────────
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// ─── Guest cart & checkout (session-based, no login needed) ──────
Route::get('/cart', [CartController::class, 'viewCart']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::delete('/cart/{productId}', [CartController::class, 'removeFromCart']);
Route::patch('/cart/{productId}', [CartController::class, 'updateQuantity']);
Route::post('/orders', [OrderController::class, 'store']); // guest checkout

// ─── Admin login (public, obviously) ─────────────────────────────
Route::post('/admin/login', [AuthController::class, 'login']);

// ─── Admin only (must be logged in) ──────────────────────────────
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Products CRUD
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Categories CRUD
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});