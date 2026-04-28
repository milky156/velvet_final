import React from "react";
import { Head, usePage } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";
import BackButton from "@/Components/BackButton";

const STATUS_COLORS = {
  'In Arrangement': 'bg-amber-100 text-amber-800 border-amber-200',
  'Out for Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
  'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200',
};

export default function OrdersPage({ dbOrders = [] }) {
  const { props } = usePage();
  const flash = props.flash || {};

  return (
    <>
      <Head title="My Orders" />
      <section className="mx-auto max-w-6xl px-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-brand-900">My Orders</h1>
            <p className="text-brand-400 text-sm mt-1">{dbOrders.length} order{dbOrders.length !== 1 ? 's' : ''}</p>
          </div>
          <BackButton />
        </div>

        {flash.success && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm font-semibold text-emerald-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {flash.success}
          </div>
        )}

        {dbOrders.length === 0 ? (
          <div className="rounded-3xl border border-pink-200 bg-white p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <p className="text-brand-400 font-bold text-xl mb-2">No orders yet</p>
            <p className="text-brand-300 text-sm mb-6">When you place an order, it will appear here.</p>
            <a href="/home" className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {dbOrders.map((order) => (
              <article key={order.id} className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-black text-brand-900">Order #{order.id}</h2>
                    <p className="text-xs text-brand-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order items */}
                <div className="space-y-2 mb-4">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2 border-b border-pink-50 last:border-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-50 border border-pink-100 shrink-0">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-200 text-sm">🌸</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-800 text-sm">{item.product?.name || item.product_id}</p>
                        <div className="flex gap-3 text-xs text-brand-400">
                          {item.wrap && <span>Wrap: {item.wrap}</span>}
                          {item.note && <span>Note: {item.note}</span>}
                        </div>
                      </div>
                      <span className="font-black text-brand-600 text-sm shrink-0">× {item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-pink-100 pt-4">
                  <div>
                    <p className="font-bold text-brand-700">Delivery</p>
                    <p className="text-brand-400 mt-0.5">{order.delivery_option || order.deliveryOption}</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-700">Payment</p>
                    <p className="text-brand-400 mt-0.5">{order.payment_method || order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-700">Address</p>
                    <p className="text-brand-400 mt-0.5 truncate">{order.delivery_address || order.deliveryAddress || '—'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-700">Phone</p>
                    <p className="text-brand-400 mt-0.5">{order.contact_phone || order.contactPhone}</p>
                  </div>
                </div>

                {/* Total + map link */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-pink-100">
                  <p className="text-2xl font-black text-brand-900">₱{parseFloat(order.total).toFixed(2)}</p>
                  {(order.maps_url || order.mapsUrl) && (
                    <a href={order.maps_url || order.mapsUrl} target="_blank" rel="noreferrer"
                       className="rounded-full border border-pink-200 px-4 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-all">
                      📍 View on Map
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

OrdersPage.layout = page => <ShopLayout>{page}</ShopLayout>;
