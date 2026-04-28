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

    public function confirmOrder(Order $order)
    {
        $order->update(['status' => 'In Arrangement']);
        return back()->with('success', 'Order confirmed and moved to arrangement.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|string|in:Pending,In Arrangement,Out for Delivery,Delivered,Cancelled',
        ]);

        $order->update(['status' => $data['status']]);
        return back()->with('success', 'Order status updated to ' . $data['status']);
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
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'categories'  => 'nullable|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = '/storage/' . $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'id'          => $data['id'],
            'name'        => $data['name'],
            'description' => $data['description'],
            'price'       => $data['price'],
            'stock'       => $data['stock'],
            'image'       => $imagePath,
        ]);

        if (!empty($data['categories'])) {
            $categoryIds = array_filter(explode(',', $data['categories']));
            $product->categories()->sync($categoryIds);
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
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'categories'  => 'nullable|string',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            // Delete old image if it exists in storage
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $product->image);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $imagePath = '/storage/' . $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name'        => $data['name'],
            'description' => $data['description'],
            'price'       => $data['price'],
            'stock'       => $data['stock'],
            'image'       => $imagePath,
        ]);

        $categoryIds = !empty($data['categories']) ? array_filter(explode(',', $data['categories'])) : [];
        $product->categories()->sync($categoryIds);

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
}
