<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $orders   = Order::with('items')->orderByDesc('created_at')->get();
        $products = Product::with('categories')->get();

        return Inertia::render('Admin/Index', [
            'dbOrders'   => $orders,
            'dbProducts' => $products,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->input('status')]);
        return back()->with('success', 'Order status updated.');
    }
}
