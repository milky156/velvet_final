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
        const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
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
                        <h1 className="text-3xl font-black text-brand-900">Users</h1>
                        <p className="text-brand-400 text-sm mt-1">{dbUsers.length} registered users</p>
                    </div>
                </div>

                {flash.success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700">✓ {flash.success}</div>}
                {flash.error && <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">✗ {flash.error}</div>}

                {/* Role stat cards */}
                <div className="grid grid-cols-3 gap-4">
                    {['admin', 'rider', 'customer'].map(role => (
                        <button key={role} onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
                            className={`rounded-2xl border p-4 text-left capitalize transition-all hover:shadow-md ${roleFilter === role ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-300' : 'border-pink-200 bg-white'}`}>
                            <p className="text-xs font-semibold text-brand-400 capitalize">{role}s</p>
                            <p className="text-2xl font-black text-brand-800 mt-1">{dbUsers.filter(u => u.role === role).length}</p>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                    </div>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-pink-200 bg-white text-sm font-semibold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>

                <div className="rounded-3xl border border-pink-200 bg-white shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center text-brand-300 font-semibold">No users found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-pink-100 bg-brand-50">
                                        {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                                            <th key={h} className="text-left px-6 py-4 font-black text-brand-400 text-xs uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-50">
                                    {filtered.map(user => (
                                        <tr key={user.id} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                        {user.name?.[0]?.toUpperCase() ?? '?'}
                                                    </div>
                                                    <p className="font-bold text-brand-800">{user.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-brand-500">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                                                    className={`rounded-full border px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer capitalize ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    <option value="customer">Customer</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="rider">Rider</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-brand-400 text-xs">
                                                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => setConfirmDelete({ id: user.id, name: user.name })}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
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
