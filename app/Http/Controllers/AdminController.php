<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // ─── Dashboard ──────────────────────────────────────────────────────────────

    public function index()
    {
        $orders     = Order::with('items')->orderByDesc('created_at')->get();
        $products   = Product::with('categories')->get();
        $users      = User::orderByDesc('created_at')->get();
        $categories = Category::withCount('products')->get();

        $totalRevenue  = $orders->where('status', '!=', 'Cancelled')->sum('total');
        $pendingOrders = $orders->whereIn('status', ['In Arrangement', 'Out for Delivery'])->count();
        $lowStock      = $products->where('stock', '<=', 5)->count();

        return Inertia::render('Admin/Index', [
            'dbOrders'     => $orders,
            'dbProducts'   => $products,
            'dbUsers'      => $users,
            'dbCategories' => $categories,
            'stats' => [
                'totalRevenue'  => $totalRevenue,
                'totalOrders'   => $orders->count(),
                'totalUsers'    => $users->count(),
                'totalProducts' => $products->count(),
                'pendingOrders' => $pendingOrders,
                'lowStock'      => $lowStock,
            ],
        ]);
    }

    // ─── Orders ─────────────────────────────────────────────────────────────────

    public function ordersIndex()
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Orders', [
            'dbOrders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|string|in:In Arrangement,Out for Delivery,Delivered,Cancelled']);
        $order->update(['status' => $request->input('status')]);
        return back()->with('success', 'Order status updated.');
    }

    // ─── Products ───────────────────────────────────────────────────────────────

    public function productsIndex()
    {
        $products   = Product::with('categories')->get();
        $categories = Category::all();

        return Inertia::render('Admin/Products', [
            'dbProducts'   => $products,
            'dbCategories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $data = $request->validate([
            'id'          => 'required|string|unique:products,id',
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
            'categories'  => 'array',
            'categories.*'=> 'integer|exists:categories,id',
        ]);

        $product = Product::create([
            'id'          => $data['id'],
            'name'        => $data['name'],
            'description' => $data['description'],
            'price'       => $data['price'],
            'stock'       => $data['stock'],
            'image'       => $data['image'] ?? null,
        ]);

        if (!empty($data['categories'])) {
            $product->categories()->sync($data['categories']);
        }

        return back()->with('success', 'Product created successfully.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|string',
            'categories'  => 'array',
            'categories.*'=> 'integer|exists:categories,id',
        ]);

        $product->update([
            'name'        => $data['name'],
            'description' => $data['description'],
            'price'       => $data['price'],
            'stock'       => $data['stock'],
            'image'       => $data['image'] ?? $product->image,
        ]);

        $product->categories()->sync($data['categories'] ?? []);

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroyProduct(Product $product)
    {
        $product->categories()->detach();
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    // ─── Categories ─────────────────────────────────────────────────────────────

    public function categoriesIndex()
    {
        $categories = Category::withCount('products')->orderBy('name')->get();
        return Inertia::render('Admin/Categories', [
            'dbCategories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
        ]);
        Category::create($data);
        return back()->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
        ]);
        $category->update($data);
        return back()->with('success', 'Category updated.');
    }

    public function destroyCategory(Category $category)
    {
        $category->products()->detach();
        $category->delete();
        return back()->with('success', 'Category deleted.');
    }

    // ─── Users ──────────────────────────────────────────────────────────────────

    public function usersIndex()
    {
        $users = User::orderByDesc('created_at')->get();
        return Inertia::render('Admin/Users', [
            'dbUsers' => $users,
        ]);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:customer,admin,rider']);
        $user->update(['role' => $request->input('role')]);
        return back()->with('success', 'User role updated.');
    }

    public function destroyUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }
        $user->delete();
        return back()->with('success', 'User deleted.');
    }

    // ─── Delivery Zones ─────────────────────────────────────────────────────────

    public function deliveryIndex()
    {
        $zones = DeliveryZone::orderBy('name')->get();
        return Inertia::render('Admin/Delivery', [
            'dbZones' => $zones,
        ]);
    }

    public function storeDelivery(Request $request)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'area'           => 'nullable|string|max:255',
            'fee'            => 'required|numeric|min:0',
            'estimated_time' => 'nullable|string|max:100',
            'is_active'      => 'boolean',
        ]);
        DeliveryZone::create($data);
        return back()->with('success', 'Delivery zone created.');
    }

    public function updateDelivery(Request $request, DeliveryZone $zone)
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'area'           => 'nullable|string|max:255',
            'fee'            => 'required|numeric|min:0',
            'estimated_time' => 'nullable|string|max:100',
            'is_active'      => 'boolean',
        ]);
        $zone->update($data);
        return back()->with('success', 'Delivery zone updated.');
    }

    public function destroyDelivery(DeliveryZone $zone)
    {
        $zone->delete();
        return back()->with('success', 'Delivery zone deleted.');
    }
}
