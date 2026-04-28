<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items')->orderByDesc('created_at')->get();
        return Inertia::render('Rider/Index', [
            'dbOrders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->input('status')]);
        return back()->with('success', 'Status updated.');
    }
}
