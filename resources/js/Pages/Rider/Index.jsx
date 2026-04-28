import React from "react";
import { Link } from "@inertiajs/react";
import { useShop } from "@/context/ShopContext";
import ShopLayout from "@/Layouts/ShopLayout";
import BackButton from "@/Components/BackButton";

export default function RiderPage() {
  const { orders, advanceOrderStatus, setOrderStatus, currentUserRole } = useShop();

  if (currentUserRole !== "rider") {
    return (
        <section className="mx-auto max-w-5xl rounded-3xl border border-brand-200 bg-white p-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM16.5 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 11.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm0-3a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-brand-900 mb-2">Unauthorized</h1>
          <p className="text-brand-400 font-bold mb-8">Delivery Driver access only.</p>
          <BackButton href="/" />
        </section>
    );
  }

  const pendingOrders = orders.filter((o) => o.status !== "Delivered");
  const completedOrders = orders.filter((o) => o.status === "Delivered");

  return (
      <section className="mx-auto max-w-6xl px-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-brand-900">Driver Dashboard</h1>
            <BackButton />
        </div>
        <p className="mt-2 text-sm text-brand-400 font-medium">
          Rider panel: orders and delivery progress.
        </p>

        <div className="mt-6 space-y-4">
          <section className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-pink-700">Delivery List</h2>
            {pendingOrders.length === 0 ? (
              <p className="mt-2 text-pink-600">No pending deliveries at the moment.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingOrders.map((order) => (
                  <li key={order.id} className="rounded-lg border border-pink-100 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-pink-700">Order {order.id}</p>
                        <p className="text-sm text-pink-600">{order.deliveryAddress}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={order.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-pink-600 px-3 py-1 text-xs text-white hover:bg-pink-700"
                        >
                          Map
                        </a>
                        <button
                          className="rounded-full bg-pink-200 px-3 py-1 text-xs text-pink-700 hover:bg-pink-300"
                          onClick={() => advanceOrderStatus(order.id)}
                        >
                          Next status
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl border border-pink-200 bg-white">
                      <iframe
                        title={`Map for ${order.id}`}
                        className="h-[240px] w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          order.deliveryLat !== undefined && order.deliveryLng !== undefined
                            ? `${order.deliveryLat},${order.deliveryLng}`
                            : order.deliveryAddress,
                        )}&output=embed`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-pink-700">Delivery Details</h2>
            {pendingOrders.map((order) => (
              <div key={order.id} className="mt-3 rounded-lg border border-pink-100 p-3">
                <p className="text-sm font-semibold text-pink-700">Order {order.id}</p>
                <div className="mt-1 flex items-center gap-2">
                  <label className="text-sm text-pink-600" htmlFor={`status-${order.id}`}>
                    Status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) => setOrderStatus(order.id, e.target.value)}
                    className="rounded-lg border border-pink-300 px-2 py-1 text-sm text-pink-700"
                  >
                    <option>In Arrangement</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Canceled</option>
                    <option>Returned</option>
                  </select>
                </div>
                <p className="text-sm text-pink-600">Option: {order.deliveryOption}</p>
                <p className="text-sm text-pink-600">Address: {order.deliveryAddress}</p>
                <p className="text-sm text-pink-600">Phone: {order.contactPhone}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-pink-700">Progress</h2>
            {pendingOrders.length === 0 ? (
              <p className="mt-2 text-pink-600">No progress updates yet.</p>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.id} className="mt-3">
                  <p className="text-sm font-semibold text-pink-700">Order {order.id}</p>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-pink-100">
                    <div
                      className="h-full bg-pink-600"
                      style={{ width: order.status === "In Arrangement" ? "25%" : order.status === "Out for Delivery" ? "65%" : "100%" }}
                    />
                  </div>
                  <p className="text-xs text-pink-500 mt-1">{order.status}</p>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm font-semibold text-pink-700 underline">
            Return to client store
          </Link>
        </div>
      </section>
  );
}

RiderPage.layout = page => <ShopLayout>{page}</ShopLayout>;
