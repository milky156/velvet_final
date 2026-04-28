<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Product;

class PageController extends Controller
{
    public function index()
    {
        $products = Product::with('categories')->get();
        return Inertia::render('Home', [
            'dbProducts' => $products
        ]);
    }
}
