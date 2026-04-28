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

        if ($user && $user->role === 'admin') {
            $orders = Order::with('items.product')->orderByDesc('created_at')->get();
        } elseif ($user) {
            // Show orders tied to this user_id OR matching their email (for guest-placed orders)
            $orders = Order::with('items.product')
                ->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhere('customer_email', $user->email);
                })
                ->orderByDesc('created_at')
                ->get();
        } else {
            $orders = collect([]);
        }

        return Inertia::render('Orders/Index', [
            'dbOrders' => $orders,
        ]);
    }
    public function pendingCount()
    {
        // Admin sees all pending/in arrangement orders
        // Rider sees orders that are either unassigned or assigned to them but not delivered
        $user = auth()->user();
        if (!$user) return response()->json(['count' => 0]);

        if ($user->role === 'admin') {
            $count = Order::whereIn('status', ['Pending', 'In Arrangement'])->count();
        } elseif ($user->role === 'rider') {
            $count = Order::whereIn('status', ['In Arrangement', 'Out for Delivery'])
                ->where(function($q) use ($user) {
                    $q->whereNull('rider_id')->orWhere('rider_id', $user->id);
                })->count();
        } else {
            $count = 0;
        }

        return response()->json(['count' => $count]);
    }
}
