import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const ROLE_COLORS = {
    admin: 'bg-brand-100 text-brand-700 border-brand-200',
    rider: 'bg-blue-100 text-blue-700 border-blue-200',
    customer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
                <h3 className="text-xl font-black text-brand-900 text-center mb-2">Confirm Delete</h3>
                <p className="text-brand-500 text-center text-sm mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers({ dbUsers = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const filtered = dbUsers.filter(u => {
        const q = search.toLowerCase();
        const matchQ = !q || 
            u.name.toLowerCase().includes(q) || 
            u.email.toLowerCase().includes(q) ||
            (u.phone && u.phone.toLowerCase().includes(q)) ||
            (u.address && u.address.toLowerCase().includes(q));
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchQ && matchRole;
    });

    const handleRoleChange = (userId, role) => {
        router.patch(`/admin/users/${userId}/role`, { role }, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        router.delete(`/admin/users/${id}`, { preserveScroll: true, onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <>
            <Head title="Users — Admin" />
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900 leading-tight">Users Management</h1>
                        <p className="text-brand-400 text-sm font-medium mt-1">Manage all {dbUsers.length} accounts, monitor contact details, and assign roles.</p>
                    </div>
                </div>

                {flash.success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm animate-fade-in">✓ {flash.success}</div>}
                {flash.error && <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 shadow-sm animate-fade-in">✗ {flash.error}</div>}

                {/* Role stat cards */}
                <div className="grid grid-cols-3 gap-4">
                    {['admin', 'rider', 'customer'].map(role => (
                        <button key={role} onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
                            className={`rounded-3xl border p-5 text-left capitalize transition-all hover:shadow-lg ${roleFilter === role ? 'border-brand-400 bg-brand-50 ring-4 ring-brand-100 shadow-md' : 'border-pink-200 bg-white'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-300">{role}s</p>
                            <p className="text-3xl font-black text-brand-800 mt-2">{dbUsers.filter(u => u.role === role).length}</p>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300 group-focus-within:text-brand-500 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone, or address..."
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-pink-200 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400 shadow-sm transition-all" />
                    </div>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="px-6 py-3.5 rounded-2xl border border-pink-200 bg-white text-sm font-black text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400 shadow-sm transition-all cursor-pointer">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>

                <div className="rounded-[2.5rem] border border-pink-200 bg-white shadow-xl shadow-pink-100/20 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <p className="text-brand-300 font-black tracking-tight text-xl">No users found.</p>
                            <p className="text-brand-200 text-sm mt-1">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-pink-100 bg-brand-50/50">
                                        <th className="text-left px-8 py-5 font-black text-brand-400 text-[10px] uppercase tracking-widest">User Details</th>
                                        <th className="text-left px-6 py-5 font-black text-brand-400 text-[10px] uppercase tracking-widest">Contact Info</th>
                                        <th className="text-left px-6 py-5 font-black text-brand-400 text-[10px] uppercase tracking-widest">Delivery Address</th>
                                        <th className="text-left px-6 py-5 font-black text-brand-400 text-[10px] uppercase tracking-widest">Role</th>
                                        <th className="text-left px-8 py-5 font-black text-brand-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-50">
                                    {filtered.map(user => (
                                        <tr key={user.id} className="hover:bg-brand-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
                                                        {user.name?.[0]?.toUpperCase() ?? '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-brand-900 text-base">{user.name}</p>
                                                        <p className="text-[11px] font-bold text-brand-400 uppercase tracking-tighter">Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-brand-800 font-bold">{user.email}</p>
                                                    <p className="text-brand-400 font-black text-[11px] tracking-tight">{user.phone || '—'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-brand-600 font-medium text-xs max-w-[200px] line-clamp-2 leading-relaxed">
                                                    {user.address || <span className="text-brand-200 italic">No address provided</span>}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                                                    className={`rounded-full border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:ring-4 focus:ring-brand-100 cursor-pointer shadow-sm transition-all ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    <option value="customer">Customer</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="rider">Rider</option>
                                                </select>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => setConfirmDelete({ id: user.id, name: user.name })}
                                                    className="rounded-full border-2 border-red-100 px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete?.id)}
                message={`Delete user "${confirmDelete?.name}"? This cannot be undone.`} />
        </>
    );
}

AdminUsers.layout = page => <AdminLayout>{page}</AdminLayout>;
