import React, { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import RiderLayout from "@/Layouts/RiderLayout";
import MapPreview from "@/Components/MapPreview";

const STATUS_COLORS = {
    'Pending': 'bg-pink-100 text-pink-800 border-pink-200',
    'In Arrangement': 'bg-amber-100 text-amber-800 border-amber-200',
    'Out for Delivery': 'bg-brand-100 text-brand-800 border-brand-200',
    'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
};

export default function RiderDashboard({ dbOrders = [] }) {
  const { props } = usePage();
  const flash = props.flash || {};

  const handlePickup = (id) => {
    router.patch(`/rider/orders/${id}/pickup`, {}, { preserveScroll: true });
  };

  const handleDropoff = (id) => {
    router.patch(`/rider/orders/${id}/dropoff`, {}, { preserveScroll: true });
  };

  const formatTime = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeOrders = useMemo(() => dbOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled'), [dbOrders]);
  const completedOrders = useMemo(() => dbOrders.filter(o => o.status === 'Delivered'), [dbOrders]);

  // Calculate Insights
  const insights = useMemo(() => {
    const total = completedOrders.length;
    let totalMinutes = 0;
    let ordersWithTime = 0;

    completedOrders.forEach(o => {
      if (o.picked_up_at && o.dropped_off_at) {
        const pickup = new Date(o.picked_up_at);
        const dropoff = new Date(o.dropped_off_at);
        totalMinutes += (dropoff - pickup) / (1000 * 60);
        ordersWithTime++;
      }
    });

    const avgTime = ordersWithTime > 0 ? Math.round(totalMinutes / ordersWithTime) : 0;
    
    return {
      total,
      avgTime: avgTime > 0 ? `${avgTime} mins` : "N/A",
      todayCount: completedOrders.filter(o => new Date(o.updated_at).toDateString() === new Date().toDateString()).length
    };
  }, [completedOrders]);

  return (
    <>
      <Head title="Rider Dashboard" />
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-brand-900">Delivery Dashboard</h1>
                <p className="text-brand-400 text-sm mt-1">Manage your active pickups and check your performance insights.</p>
            </div>
        </div>

        {flash.success && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {flash.success}
          </div>
        )}

        {/* Insights Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-brand-700/80">Active Tasks</p>
                <p className="mt-2 text-2xl font-black text-brand-800">{activeOrders.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-emerald-700/80">Completed Today</p>
                <p className="mt-2 text-2xl font-black text-emerald-800">{insights.todayCount}</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-brand-700/80">Total Deliveries</p>
                <p className="mt-2 text-2xl font-black text-brand-800">{insights.total}</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-brand-700/80">Avg. Delivery Time</p>
                <p className="mt-2 text-2xl font-black text-brand-800">{insights.avgTime}</p>
            </div>
        </div>

        {/* Active Deliveries Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-brand-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
            Active Deliveries
          </h2>
          <div className="grid gap-6">
            {activeOrders.length === 0 ? (
              <div className="rounded-3xl border border-brand-200 bg-white p-16 text-center shadow-sm">
                  <p className="text-brand-400 font-bold text-xl">No active deliveries</p>
                  <p className="text-brand-300 text-sm mt-1">Waiting for admin to command new orders.</p>
              </div>
            ) : (
              activeOrders.map((order) => (
                <article key={order.id} className="rounded-3xl border border-brand-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                              <div className="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-brand-700 text-lg border border-brand-100">
                                  #{order.id}
                              </div>
                              <div>
                                  <h2 className="font-black text-brand-900 text-lg">{order.customer_name}</h2>
                                  <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider">{order.delivery_option} Delivery</p>
                              </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                              <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-black ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                  {order.status === 'Pending' ? 'Waiting for Confirmation' : order.status}
                              </span>
                          </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <div className="rounded-2xl bg-brand-50/30 p-4 border border-brand-50">
                                  <p className="text-xs font-black text-brand-400 uppercase tracking-widest mb-3">Delivery Destination</p>
                                  <div className="space-y-2 text-sm">
                                      <p className="flex items-start gap-2">
                                          <span className="text-brand-700 font-medium">{order.delivery_address}</span>
                                      </p>
                                      <p className="flex items-center gap-2 text-brand-600 font-bold">
                                          {order.contact_phone}
                                      </p>
                                  </div>
                              </div>

                              <div className="rounded-2xl border border-brand-100 p-4 bg-gray-50/50">
                                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Timeline</p>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 rounded-xl bg-white border border-gray-100">
                                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Picked Up</p>
                                          <p className="font-black text-brand-700">{formatTime(order.picked_up_at)}</p>
                                      </div>
                                      <div className="text-center p-3 rounded-xl bg-white border border-gray-100">
                                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dropped Off</p>
                                          <p className="font-black text-emerald-700">{formatTime(order.dropped_off_at)}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="flex flex-col justify-between gap-4">
                              <div className="rounded-2xl border border-brand-200 overflow-hidden h-48 sm:h-full relative shadow-inner bg-gray-100">
                                 <MapPreview 
                                   lat={order.delivery_lat} 
                                   lng={order.delivery_lng} 
                                   address={order.delivery_address} 
                                   height="100%"
                                 />
                              </div>

                              <div className="flex gap-3">
                                  {order.status === 'In Arrangement' ? (
                                      <button onClick={() => handlePickup(order.id)} className="flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 py-4 text-white font-black shadow-lg shadow-brand-100 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider">
                                          Confirm Pick Up
                                      </button>
                                  ) : order.status === 'Out for Delivery' ? (
                                      <button onClick={() => handleDropoff(order.id)} className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-800 py-4 text-white font-black shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider">
                                          Mark as Delivered
                                      </button>
                                  ) : (
                                      <div className="flex-1 py-4 text-center rounded-2xl bg-brand-50 border border-brand-200 text-brand-400 text-xs font-bold italic flex items-center justify-center gap-2">
                                          Awaiting admin approval...
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Recent Deliveries Section */}
        <section className="space-y-4 pt-4 border-t border-brand-100">
            <h2 className="text-xl font-black text-brand-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Recent Deliveries
            </h2>
            <div className="bg-white rounded-3xl border border-brand-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-50/50 border-b border-brand-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-brand-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-xs font-black text-brand-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-brand-400 uppercase tracking-widest">Destination</th>
                                <th className="px-6 py-4 text-xs font-black text-brand-400 uppercase tracking-widest">Duration</th>
                                <th className="px-6 py-4 text-xs font-black text-brand-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-50">
                            {completedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-brand-300 font-semibold italic">No recent deliveries to show.</td>
                                </tr>
                            ) : (
                                completedOrders.map(o => {
                                    const pickup = new Date(o.picked_up_at);
                                    const dropoff = new Date(o.dropped_off_at);
                                    const diff = Math.round((dropoff - pickup) / (1000 * 60));
                                    
                                    return (
                                        <tr key={o.id} className="hover:bg-brand-50/20 transition-colors">
                                            <td className="px-6 py-4 font-black text-brand-700">#{o.id}</td>
                                            <td className="px-6 py-4 font-bold text-brand-900">{o.customer_name}</td>
                                            <td className="px-6 py-4 text-brand-500 text-sm truncate max-w-[200px]">{o.delivery_address}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                                    {diff} mins
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs font-bold text-brand-400">{new Date(o.updated_at).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </div>
    </>
  );
}

RiderDashboard.layout = page => <RiderLayout>{page}</RiderLayout>;
