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
Route::get('/', fn() => Inertia::render('Landing'))->name('landing')->middleware('role_redirect');
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

Route::middleware(['auth', 'verified', 'role_redirect'])->group(function () {
    Route::get('/home', [PageController::class, 'index'])->name('home');

    // Admin routes – protected by admin role middleware
    Route::prefix('admin')->name('admin.')->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        // Dashboard
        Route::get('/', [AdminController::class, 'index'])->name('index');

        // Orders
        Route::get('/orders', [AdminController::class, 'ordersIndex'])->name('orders.index');
        Route::patch('/orders/{order}/status', [AdminController::class, 'updateStatus'])->name('orders.status');
        Route::post('/orders/{order}/confirm', [AdminController::class, 'confirmOrder'])->name('orders.confirm');

        // Products
        Route::get('/products', [AdminController::class, 'productsIndex'])->name('products.index');
        Route::post('/products', [AdminController::class, 'storeProduct'])->name('products.store');
        Route::put('/products/{product}', [AdminController::class, 'updateProduct'])->name('products.update');
        Route::delete('/products/{product}', [AdminController::class, 'destroyProduct'])->name('products.destroy');

        // Categories
        Route::get('/categories', [AdminController::class, 'categoriesIndex'])->name('categories.index');
        Route::post('/categories', [AdminController::class, 'storeCategory'])->name('categories.store');
        Route::put('/categories/{category}', [AdminController::class, 'updateCategory'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminController::class, 'destroyCategory'])->name('categories.destroy');

        // Users
        Route::get('/users', [AdminController::class, 'usersIndex'])->name('users.index');
        Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
    });

    // Rider routes
    Route::prefix('rider')->name('rider.')->middleware('rider')->group(function () {
        Route::get('/dashboard', [RiderController::class, 'index'])->name('index');
        Route::patch('/orders/{order}/pickup', [RiderController::class, 'pickup'])->name('orders.pickup');
        Route::patch('/orders/{order}/dropoff', [RiderController::class, 'dropoff'])->name('orders.dropoff');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Messages
    Route::get('/messages', [\App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
    Route::get('/api/messages/{contactId}', [\App\Http\Controllers\MessageController::class, 'fetchMessages']);
    Route::get('/api/unread-messages-count', [\App\Http\Controllers\MessageController::class, 'unreadCount']);
    Route::get('/api/pending-orders-count', [OrderController::class, 'pendingCount']);
    Route::post('/api/messages', [\App\Http\Controllers\MessageController::class, 'store']);
});

require __DIR__.'/auth.php';
