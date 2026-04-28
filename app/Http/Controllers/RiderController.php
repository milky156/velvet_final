<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RiderController extends Controller
{
    public function index()
    {
        // Riders see all orders to know what's coming
        $orders = Order::with('items.product')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Rider/Dashboard', [
            'dbOrders' => $orders,
        ]);
    }

    public function pickup(Order $order)
    {
        // Only allow pickup if confirmed by admin
        if ($order->status !== 'In Arrangement') {
            return back()->withErrors(['status' => 'Order must be confirmed by admin before pickup.']);
        }

        $order->update([
            'status' => 'Out for Delivery',
            'picked_up_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Order marked as Picked Up.');
    }

    public function dropoff(Order $order)
    {
        if ($order->status !== 'Out for Delivery') {
            return back()->withErrors(['status' => 'Order must be picked up before drop off.']);
        }

        $order->update([
            'status' => 'Delivered',
            'dropped_off_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Order marked as Delivered.');
    }
}
