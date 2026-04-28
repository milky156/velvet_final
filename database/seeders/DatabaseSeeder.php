<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Users
        User::firstOrCreate(['email' => 'admin@velvetvine.com'], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::firstOrCreate(['email' => 'rider@velvetvine.com'], [
            'name' => 'Delivery Rider',
            'password' => Hash::make('password'),
            'role' => 'rider',
        ]);

        User::firstOrCreate(['email' => 'customer@velvetvine.com'], [
            'name' => 'Valued Customer',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Seed Categories
        Category::firstOrCreate(['name' => 'Flowers', 'type' => 'Product Type']);
        Category::firstOrCreate(['name' => 'Bouquets', 'type' => 'Product Type']);
        Category::firstOrCreate(['name' => 'Pots', 'type' => 'Product Type']);
        Category::firstOrCreate(['name' => 'Tools', 'type' => 'Product Type']);
        Category::firstOrCreate(['name' => 'Soil', 'type' => 'Product Type']);
    }
}
