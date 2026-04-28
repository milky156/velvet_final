<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RiderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', fn() => Inertia::render('Landing'))->name('landing');
Route::get('/cart', [CartController::class, 'index'])->name('cart');

// API Routes for Chat Smart Search
Route::get('/api/products', function (Illuminate\Http\Request $request) {
    $query = App\Models\Product::query();
    
    if ($search = $request->query('search')) {
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
    }
    
    return response()->json($query->take(5)->get());
});

// Checkout (guests allowed)
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout');

// Orders (auth optional – guests see empty list)
Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', [PageController::class, 'index'])->name('home');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::patch('/orders/{order}/status', [AdminController::class, 'updateStatus'])->name('orders.status');
    });

    // Rider routes
    Route::prefix('rider')->name('rider.')->group(function () {
        Route::get('/', [RiderController::class, 'index'])->name('index');
        Route::patch('/orders/{order}/status', [RiderController::class, 'updateStatus'])->name('orders.status');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
