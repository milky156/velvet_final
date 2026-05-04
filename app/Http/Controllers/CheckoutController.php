<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items'            => 'required|array|min:1',
            'items.*.productId'=> 'required|string|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'deliveryAddress'  => 'required|string',
            'contactPhone'     => 'required|string',
            'deliveryOption'   => 'required|string|in:Standard,Express,Same-day',
            'paymentMethod'    => 'required|string|in:Cash on Delivery',
        ]);

        return \DB::transaction(function() use ($request) {
            $items = $request->input('items');
            $total = 0;

            // Calculate total and check stock
            foreach ($items as $item) {
                $product = Product::find($item['productId']);
                if (!$product || $product->stock < $item['quantity']) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'stock' => "Insufficient stock for {$product?->name}"
                    ]);
                }
                $total += $product->price * $item['quantity'];
            }

            $user = $request->user();
            $lat  = $request->input('deliveryLat');
            $lng  = $request->input('deliveryLng');
            $mapsUrl = $lat && $lng
                ? "https://www.openstreetmap.org/?mlat={$lat}&mlon={$lng}#map=16/{$lat}/{$lng}"
                : null;

            $order = Order::create([
                'user_id'          => $user?->id,
                'customer_name'    => $user?->name ?? $request->input('customerName', 'Guest'),
                'customer_email'   => $user?->email ?? $request->input('customerEmail', 'guest@order.com'),
                'total'            => $total,
                'status'           => 'Pending',
                'delivery_address' => $request->input('deliveryAddress'),
                'delivery_lat'     => $lat,
                'delivery_lng'     => $lng,
                'contact_phone'    => $request->input('contactPhone'),
                'delivery_option'  => $request->input('deliveryOption'),
                'payment_method'   => $request->input('paymentMethod'),
                'maps_url'         => $mapsUrl,
            ]);

            // Create order items & deduct stock
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['productId'],
                    'quantity'   => $item['quantity'],
                    'note'       => $item['note'] ?? null,
                    'wrap'       => $item['wrap'] ?? null,
                ]);

                $product = Product::find($item['productId']);
                $product->decrement('stock', $item['quantity']);
            }

            return redirect()->route('orders.index')->with('success', 'Order placed successfully!');
        });
    }
}
