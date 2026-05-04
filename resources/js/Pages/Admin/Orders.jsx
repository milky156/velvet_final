import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MapPreview from '@/Components/MapPreview';

const STATUS_COLORS = {
    'Pending': 'bg-pink-100 text-pink-800 border-pink-200',
    'In Arrangement': 'bg-amber-100 text-amber-800 border-amber-200',
    'Out for Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
    'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
};
const STATUS_OPTIONS = ['Pending', 'In Arrangement', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders({ dbOrders = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

    const filtered = dbOrders.filter((o) => {
        const q = search.toLowerCase();
        const matchSearch = !q || (o.customer_name||'').toLowerCase().includes(q) || (o.customer_email||'').toLowerCase().includes(q) || String(o.id).includes(q);
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleStatusChange = (orderId, status) => {
        router.patch(`/admin/orders/${orderId}/status`, { status }, { preserveScroll: true });
    };

    const handleConfirm = (orderId) => {
        router.post(`/admin/orders/${orderId}/confirm`, {}, { preserveScroll: true });
    };

    const totalRevenue = dbOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Pending').reduce((s, o) => s + parseFloat(o.total || 0), 0);

    return (
        <>
            <Head title="Orders — Admin" />
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900">Orders</h1>
                        <p className="text-brand-400 text-sm mt-1">{dbOrders.length} total · ₱{totalRevenue.toFixed(2)} confirmed revenue</p>
                    </div>
                </div>

                {flash.success && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700">✓ {flash.success}</div>
                )}

                {/* Status stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <button onClick={() => setStatusFilter('all')}
                        className={`rounded-2xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === 'all' ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-300' : 'border-pink-200 bg-white'}`}>
                        <p className="text-xs font-semibold text-brand-400">All</p>
                        <p className="text-2xl font-black text-brand-800 mt-1">{dbOrders.length}</p>
                    </button>
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                            className={`rounded-2xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === s ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-300' : 'border-pink-200 bg-white'}`}>
                            <p className="text-xs font-semibold text-brand-400">{s}</p>
                            <p className="text-2xl font-black text-brand-800 mt-1">{dbOrders.filter(o => o.status === s).length}</p>
                        </button>
                    ))}
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, or order ID…"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-pink-200 bg-white text-sm font-semibold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400">
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="rounded-3xl border border-pink-200 bg-white shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center text-brand-300 font-semibold">No orders found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-pink-100 bg-brand-50">
                                        {['Order', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                                            <th key={h} className="text-left px-6 py-4 font-black text-brand-400 text-xs uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-50">
                                    {filtered.map(order => (
                                        <React.Fragment key={order.id}>
                                            <tr className="hover:bg-brand-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-black text-brand-700">#{order.id}</span>
                                                    <p className="text-xs text-brand-400 mt-0.5">{order.delivery_option}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-brand-800">{order.customer_name}</p>
                                                    <p className="text-xs text-brand-400">{order.customer_email}</p>
                                                </td>
                                                <td className="px-6 py-4 font-black text-brand-800">₱{parseFloat(order.total||0).toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}
                                                            className={`rounded-full border px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        {order.status === 'Pending' && (
                                                            <button onClick={() => handleConfirm(order.id)}
                                                                className="rounded-full bg-brand-600 text-white py-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-brand-700 transition-all shadow-sm">
                                                                Confirm Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-brand-500 text-xs whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                                        className="rounded-lg border border-pink-200 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-all">
                                                        {expandedId === order.id ? 'Collapse' : 'View Items'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedId === order.id && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 bg-brand-50/50">
                                                        <div className="rounded-2xl border border-pink-100 bg-white p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <p className="text-xs font-black text-brand-400 uppercase tracking-widest">Order Items</p>
                                                                <div className="flex gap-2">
                                                                    {order.status === 'Pending' && (
                                                                        <button onClick={() => handleConfirm(order.id)} className="bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-brand-700">Confirm Now</button>
                                                                    )}
                                                                    {order.status === 'In Arrangement' && (
                                                                        <button onClick={() => handleStatusChange(order.id, 'Out for Delivery')} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700">Ready for Delivery</button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {(order.items || []).map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-pink-50 last:border-0">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-50 border border-pink-100">
                                                                                {item.product?.image ? (
                                                                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                                                                ) : <div className="w-full h-full flex items-center justify-center text-sm">🌸</div>}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-bold text-brand-800 text-sm">{item.product?.name || item.product_id}</p>
                                                                                {item.note && <p className="text-[10px] text-brand-400 italic">"{item.note}"</p>}
                                                                                {item.wrap && <p className="text-[10px] text-brand-400 font-semibold">Wrap: {item.wrap}</p>}
                                                                            </div>
                                                                        </div>
                                                                        <span className="font-black text-brand-600">× {item.quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-4 pt-4 border-t border-pink-100 grid grid-cols-2 gap-4 text-xs text-brand-500">
                                                                <div className="space-y-1">
                                                                    <p><span className="font-bold text-brand-700">Address:</span> {order.delivery_address}</p>
                                                                    <p><span className="font-bold text-brand-700">Phone:</span> {order.contact_phone}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p><span className="font-bold text-brand-700">Payment:</span> {order.payment_method}</p>
                                                                    {order.maps_url && (
                                                                        <a href={order.maps_url.replace('google.com/maps', 'openstreetmap.org')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-600 font-bold hover:underline">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                                            </svg>
                                                                            View on Map
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {order.delivery_lat && order.delivery_lng && (
                                                                <div className="mt-4 rounded-xl border border-pink-100 overflow-hidden h-48 relative">
                                                                    <MapPreview 
                                                                        lat={order.delivery_lat} 
                                                                        lng={order.delivery_lng} 
                                                                        address={order.delivery_address} 
                                                                        height="100%"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminOrders.layout = page => <AdminLayout>{page}</AdminLayout>;
