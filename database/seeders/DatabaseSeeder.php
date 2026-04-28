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
        $catFlowers = Category::firstOrCreate(['name' => 'Flowers', 'type' => 'Product Type']);
        $catBouquets = Category::firstOrCreate(['name' => 'Bouquets', 'type' => 'Product Type']);
        $catPots = Category::firstOrCreate(['name' => 'Pots', 'type' => 'Product Type']);
        $catTools = Category::firstOrCreate(['name' => 'Tools', 'type' => 'Product Type']);
        $catSoil = Category::firstOrCreate(['name' => 'Soil', 'type' => 'Product Type']);

        // Seed Products
        $p1 = Product::firstOrCreate(['id' => 'blush-bloom'], [
            'name' => 'Blush Bloom',
            'description' => 'Soft pink roses with eucalyptus and baby s breath.',
            'price' => 59.00,
            'stock' => 12,
            'image' => '/bouquet1.jpg',
        ]);
        $p1->categories()->syncWithoutDetaching([$catBouquets->id, $catFlowers->id]);

        $p2 = Product::firstOrCreate(['id' => 'dune-beige'], [
            'name' => 'Dune Beige',
            'description' => 'Neutral tones with lilies and wildflowers for any celebration.',
            'price' => 49.00,
            'stock' => 8,
            'image' => '/bouquet2.jpg',
        ]);
        $p2->categories()->syncWithoutDetaching([$catBouquets->id, $catFlowers->id]);

        $p3 = Product::firstOrCreate(['id' => 'pretty-roses'], [
            'name' => 'Pretty Roses',
            'description' => 'A bouquet of classic red and pink roses for romance.',
            'price' => 85.00,
            'stock' => 3,
            'image' => '/bouquet3.jpg',
        ]);
        $p3->categories()->syncWithoutDetaching([$catBouquets->id, $catFlowers->id]);

        $p4 = Product::firstOrCreate(['id' => 'wild-whisper'], [
            'name' => 'Wild Whisper',
            'description' => 'Bright sunflowers and daisies bring cheerful energy.',
            'price' => 39.00,
            'stock' => 15,
            'image' => '/bouquet4.jpg',
        ]);
        $p4->categories()->syncWithoutDetaching([$catBouquets->id, $catFlowers->id]);
    }
}
