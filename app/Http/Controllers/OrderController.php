<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        // Admins see all; customers see their own
        $orders = $user && $user->role === 'admin'
            ? Order::with('items')->orderByDesc('created_at')->get()
            : Order::with('items')
                ->where('user_id', $user?->id)
                ->orderByDesc('created_at')
                ->get();

        return Inertia::render('Orders/Index', [
            'dbOrders' => $orders,
        ]);
    }
}
