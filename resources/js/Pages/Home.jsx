import React, { useMemo, useState } from "react";
import { useShop } from "@/context/ShopContext";
import ShopLayout from "@/Layouts/ShopLayout";

const wrapOptions = ["Classic", "Eco", "Vintage", "Lux"];

export default function Home() {
  const {
    products,
    cart,
    addToCart,
  } = useShop();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Flowers", "Bouquets", "Pots", "Tools", "Soil"];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.categories.some((c) => c.name === selectedCategory));
  }, [products, selectedCategory]);

  return (
    <section className="relative overflow-hidden bg-pink-50 pb-12 pt-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 text-sm text-pink-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-pink-600" />
              New Bouquet Style
            </p>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-pink-800 lg:text-6xl">
              Curated Florals that <br /> Speak to the Soul
            </h1>
            <p className="max-w-2xl text-lg text-pink-600">
              Each flower to evoke feeling and draw hearts closer.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-pink-700 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-pink-800">
                Order Now
              </button>
              <button className="rounded-full border border-pink-500 px-6 py-3 text-lg font-semibold text-pink-700 transition hover:bg-pink-100">
                Customize Bouquet
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-lg font-bold text-pink-700">36K+</p>
                <p className="text-xs text-pink-500">Monthly Users</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-lg font-bold text-pink-700">120K</p>
                <p className="text-xs text-pink-500">Bouquets Delivered</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-pink-200 blur-3xl" />
            <div className="relative rounded-[2rem] border border-pink-100 bg-white p-5 shadow-xl">
              <img
                src="https://www.gardenia.net/wp-content/uploads/2023/05/types-of-flowers-780x520.webp"
                alt="Signature bouquet"
                className="h-72 w-full rounded-xl object-cover"
              />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">New Bouquet Style</p>
                  <p className="text-lg font-bold text-pink-800">Crafting by Loves</p>
                </div>
                <button className="rounded-full bg-pink-600 px-4 py-2 text-white">View Demo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-10 max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-pink-700">Order with Confidence</h2>

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-pink-600 text-white shadow-md' : 'bg-white border border-pink-200 text-pink-600 hover:bg-pink-50'}`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group rounded-3xl border border-pink-200 bg-white p-4 shadow-sm transition hover:shadow-lg">
              <div className="relative h-48 overflow-hidden rounded-2xl border border-pink-100 bg-pink-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-40">🌸</span>
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-xl font-bold text-pink-800">{product.name}</h3>
              <p className="mt-1 text-sm text-pink-600">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold text-pink-700">₱{product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product.id, 1, "Dedication: ", "Paper wrap (Korean style)")}
                  className="rounded-full bg-pink-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>



      <section className="mx-auto mt-10 max-w-7xl px-6 text-center">
        <p className="text-sm uppercase text-pink-500">Gifting made effortless, by Bloom</p>
        <p className="mt-2 text-3xl font-bold text-pink-700">Handcrafted bouquets to doorstep delivery</p>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
              <h4 className="text-lg font-bold text-pink-700">{product.name}</h4>
              <p className="text-sm text-pink-500">Add to Cart</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

Home.layout = page => <ShopLayout>{page}</ShopLayout>;
