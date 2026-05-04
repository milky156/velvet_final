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
    <div className="bg-brand-50">
      <section className="relative overflow-hidden bg-pink-50 pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs text-pink-700 font-black uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
                  </span>
                  Smart Floral Solutions
                </p>
                <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-brand-900 lg:text-7xl">
                  Floral Artistry <br /> <span className="text-pink-600">Perfectly Delivered.</span>
                </h1>
                <p className="max-w-xl text-lg text-brand-400 font-medium leading-relaxed">
                  Experience the future of gifting with our Smart AI assistance and premium shop-to-door delivery. Every petal tells a story.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full bg-brand-900 px-10 py-4 text-base font-black text-white shadow-xl shadow-brand-200 transition hover:bg-brand-800 hover:-translate-y-1 active:translate-y-0"
                >
                  Shop Collections
                </button>
                <button className="rounded-full border-2 border-brand-200 bg-white px-10 py-4 text-base font-black text-brand-900 transition hover:bg-brand-50 hover:border-brand-300">
                  Track Delivery
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-brand-50">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">🤖</div>
                  <div>
                    <p className="text-sm font-black text-brand-900">Smart AI Support</p>
                    <p className="text-[11px] font-bold text-brand-400 uppercase tracking-tighter">Real-time Assistance</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-brand-50">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">🚚</div>
                  <div>
                    <p className="text-sm font-black text-brand-900">Doorstep Delivery</p>
                    <p className="text-[11px] font-bold text-brand-400 uppercase tracking-tighter">Butuan City Wide</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:ml-10">
              <div className="absolute -inset-4 rounded-[3rem] bg-pink-200 blur-3xl opacity-30 animate-pulse" />
              <div className="relative rounded-[2.5rem] border-8 border-white bg-white shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop"
                  alt="Premium Floral Arrangement"
                  className="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="glass p-6 rounded-2xl border border-white/20">
                    <p className="text-xs font-black text-pink-300 uppercase tracking-widest mb-1">Visit our walk-in shop</p>
                    <p className="text-lg font-bold text-white">Beside the New Barangay Hall <br /> San Vicente, Butuan City</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop-section" className="mx-auto mt-24 max-w-7xl px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-brand-900 tracking-tight">Our Floral Catalogue</h2>
            <p className="text-brand-400 font-medium">Hand-picked, freshly cut, and artistically arranged.</p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-brand-900 text-white shadow-lg' : 'bg-white border border-brand-200 text-brand-400 hover:bg-brand-50 hover:text-brand-900'}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="group relative rounded-[2rem] border border-brand-100 bg-white p-5 shadow-sm transition hover:shadow-2xl hover:border-pink-100 hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-brand-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">🌸</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <div className="glass rounded-full px-3 py-1 text-[10px] font-black text-brand-900 uppercase">New</div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <h3 className="text-xl font-black text-brand-900">{product.name}</h3>
                <p className="text-sm text-brand-400 font-medium line-clamp-2">{product.description}</p>
                <div className="pt-4 flex items-center justify-between border-t border-brand-50">
                  <p className="text-xl font-black text-brand-900">₱{Number(product.price).toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product.id, 1, "Dedication: ", "Paper wrap (Korean style)")}
                    className="rounded-xl bg-pink-50 px-4 py-2 text-xs font-black text-pink-600 transition hover:bg-pink-600 hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Banner Section */}
      <section className="bg-brand-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[3rem] bg-gradient-to-r from-pink-600 to-pink-500 p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <svg className="w-64 h-64" viewBox="0 0 200 200" fill="white">
                <path d="M100 0L130 70L200 100L130 130L100 200L70 130L0 100L70 70Z" />
              </svg>
            </div>
            <div className="relative z-10 max-w-2xl space-y-6">
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Need help choosing the perfect gift?</h2>
              <p className="text-pink-100 text-lg font-medium">Talk to our Smart AI Assistant for personalized recommendations based on your occasion and budget.</p>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="rounded-full bg-white px-10 py-4 text-brand-900 font-black shadow-xl hover:scale-105 transition"
              >
                Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Home.layout = page => <ShopLayout>{page}</ShopLayout>;
