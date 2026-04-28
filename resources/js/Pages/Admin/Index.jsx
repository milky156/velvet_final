import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useShop } from "@/context/ShopContext";
import { BouquetHeroIllustration } from "@/Components/admin/AdminIllustration";
import { BestSellerBouquets, DeviceTypeDonut, InventoryStockWarnings, MiniStat, MonthlyRevenueBars, SalesLineChart } from "@/Components/admin/AdminCharts";
import AdminLayout from "@/Layouts/AdminLayout";
import BackButton from "@/Components/BackButton";

export default function AdminPage() {
  const { products, orders, profile, lowStockAlert, currentUserRole, messages, sendMessage } = useShop();
  const [reply, setReply] = useState("");

  if (currentUserRole !== "admin") {
    return (
        <section className="mx-auto max-w-5xl rounded-3xl border border-brand-200 bg-white p-12 text-center animate-fade-in mt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-brand-900 mb-2">Unauthorized</h1>
          <p className="text-brand-400 font-bold mb-8">Admin access only. Please sign in with appropriate credentials.</p>
          <BackButton href="/" />
        </section>
    );
  }

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const yday = new Date(now);
  yday.setDate(now.getDate() - 1);
  const ydayKey = yday.toISOString().slice(0, 10);

  const isSameDay = (iso, dayKey) => iso.slice(0, 10) === dayKey;

  const todaysOrders = orders.filter((o) => isSameDay(o.createdAt, todayKey));
  const ydayOrders = orders.filter((o) => isSameDay(o.createdAt, ydayKey));

  const todaysSales = todaysOrders.reduce((s, o) => s + o.total, 0);
  const ydaySales = ydayOrders.reduce((s, o) => s + o.total, 0);
  const growthRate = ydaySales > 0 ? ((todaysSales - ydaySales) / ydaySales) * 100 : todaysSales > 0 ? 100 : 0;

  const uniqueUsers = new Set(orders.map((o) => o.customerEmail)).size;

  const hourBuckets = (() => {
    const base = Array.from({ length: 9 }, (_, i) => {
      const hour = 9 + i;
      const label = `${hour.toString().padStart(2, "0")}:00`;
      return { xLabel: label, value: 0 };
    });
    if (todaysOrders.length === 0) {
      const seed = [0, 120, 240, 180, 420, 260, 520, 430, 610];
      return base.map((p, i) => ({ ...p, value: seed[i] ?? 0 }));
    }
    for (const o of todaysOrders) {
      const h = new Date(o.createdAt).getHours();
      const idx = h - 9;
      if (idx >= 0 && idx < base.length) base[idx] = { ...base[idx], value: base[idx].value + o.total };
    }
    return base;
  })();

  const monthly = (() => {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (6 - i));
      return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString(undefined, { month: "short" }) };
    });

    const map = new Map();
    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, (map.get(key) ?? 0) + o.total);
    }

    const hasAny = orders.length > 0;
    const fallback = [8200, 9100, 7600, 9800, 11200, 10300, 12400];

    return labels.map((m, idx) => {
      const key = `${m.year}-${m.month}`;
      const val = map.get(key) ?? (hasAny ? 0 : fallback[idx] ?? 0);
      return { label: m.label, value: Math.round(val) };
    });
  })();

  const bestSellers = (() => {
    const countByProduct = new Map();
    for (const o of orders) {
      for (const it of o.items) {
        countByProduct.set(it.productId, (countByProduct.get(it.productId) ?? 0) + it.quantity);
      }
    }
    const list = products
      .map((p) => ({ label: p.name, value: countByProduct.get(p.id) ?? 0 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const has = list.some((x) => x.value > 0);
    if (!has) {
      return [
        { label: "Blush Bloom Bouquet", value: 42 },
        { label: "Pretty Roses", value: 36 },
        { label: "Wild Whisper", value: 31 },
        { label: "Dune Beige", value: 27 },
        { label: "Sunlit Peony", value: 22 },
      ];
    }
    return list;
  })();

  const stockWarnings = products
    .map((p) => ({ label: p.name, stock: p.stock }))
    .sort((a, b) => a.stock - b.stock);

  return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-brand-900">Overview</h1>
            <p className="text-sm font-semibold text-brand-400">{profile.email || "admin@velvetvine.com"}</p>
        </div>

        <section id="analysis" className="grid gap-4 xl:grid-cols-12">
            <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm xl:col-span-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <p className="text-sm font-semibold text-pink-700/80">Welcome back</p>
                <h2 className="mt-1 text-2xl font-bold text-pink-800">Admin Dashboard</h2>
                <p className="mt-2 text-sm text-pink-700/80">
                    Today’s sales and growth rate at a glance.
                </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-pink-200 bg-brand-50 p-4">
                    <p className="text-xs font-semibold text-pink-700/80">Today’s Sales</p>
                    <p className="mt-2 text-2xl font-bold text-pink-800">
                    ${todaysSales.toFixed(0)}
                    </p>
                    <p className="mt-1 text-xs text-pink-700/80">{todaysOrders.length} orders</p>
                </div>
                <div className="rounded-2xl border border-pink-200 bg-brand-50 p-4">
                    <p className="text-xs font-semibold text-pink-700/80">Growth Rate</p>
                    <p className="mt-2 text-2xl font-bold text-pink-800">
                    {growthRate >= 0 ? "+" : ""}
                    {growthRate.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-pink-700/80">vs yesterday</p>
                </div>
                </div>
            </div>

            <div className="mt-6">
                <BouquetHeroIllustration className="h-[240px] w-full" />
            </div>
            </div>

            <div className="grid gap-4 xl:col-span-5">
            <MiniStat
                label="Total Users"
                value={uniqueUsers > 0 ? uniqueUsers.toLocaleString() : "—"}
                subValue={orders.length > 0 ? "Unique buyer emails in orders" : "No order data yet"}
            />
            <MiniStat
                label="Total Orders"
                value={orders.length.toLocaleString()}
                subValue={`${products.length} products in catalog`}
            />
            </div>
        </section>

        <section id="charts" className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
            <SalesLineChart points={hourBuckets} />
            </div>
            <div className="xl:col-span-5">
            <DeviceTypeDonut
                items={[
                { label: "Desktop", value: 35, color: "#ff4fa3" },
                { label: "Tablet", value: 18, color: "#ff86bf" },
                { label: "Mobile", value: 47, color: "#b81b63" },
                ]}
            />
            </div>

            <div className="xl:col-span-7">
            <MonthlyRevenueBars months={monthly} />
            </div>
            <div className="xl:col-span-5">
            <BestSellerBouquets items={bestSellers} />
            </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
            <InventoryStockWarnings items={stockWarnings} />
            
            <section id="chat" className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm flex flex-col h-[400px]">
                <div className="flex items-baseline justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-pink-800">Admin Chat</h2>
                        <p className="mt-1 text-xs text-pink-700/80">Respond to customer messages</p>
                    </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-pink-100 bg-brand-50 p-4 mb-4">
                    {messages.length === 0 ? (
                        <p className="text-sm text-pink-700/80 text-center mt-4">No messages yet.</p>
                    ) : (
                        messages.map((msg) => (
                        <div key={msg.id} className={msg.from === "admin" ? "text-right" : "text-left"}>
                            <p
                            className={`inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                msg.from === "admin" ? "bg-brand-600 text-white" : "bg-white text-brand-900 shadow-sm"
                            }`}
                            >
                            <span className={`block text-xs font-bold mb-0.5 ${msg.from === "admin" ? "text-brand-200" : "text-brand-400"}`}>
                                {msg.from === "admin" ? "You" : "Customer"}
                            </span>
                            {msg.text}
                            </p>
                        </div>
                        ))
                    )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row mt-auto">
                    <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type reply..."
                        className="flex-1 rounded-full border border-brand-200 bg-white px-4 py-2 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && reply.trim()) {
                                sendMessage(reply.trim(), "admin");
                                setReply("");
                            }
                        }}
                    />
                    <button
                        className="rounded-full bg-brand-600 px-6 py-2 font-black text-white hover:bg-brand-700 transition-all"
                        onClick={() => {
                            if (!reply.trim()) return;
                            sendMessage(reply.trim(), "admin");
                            setReply("");
                        }}
                    >
                        Send
                    </button>
                </div>
            </section>
        </div>
      </div>
  );
}

AdminPage.layout = page => <AdminLayout>{page}</AdminLayout>;
