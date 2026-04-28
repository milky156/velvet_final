import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-brand-900">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-50 text-brand-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
                <h3 className="text-xl font-black text-brand-900 text-center mb-2">Delete Confirmation</h3>
                <p className="text-brand-500 text-center text-sm mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

const TYPE_OPTIONS = ['Product Type', 'Occasion', 'FlowerType', 'Price Range', 'Season', 'Other'];
const emptyForm = { name: '', type: '' };

export default function AdminCategories({ dbCategories = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [showModal, setShowModal] = useState(false);
    const [editCat, setEditCat] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState('');

    const filtered = dbCategories.filter(c =>
        !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.type||'').toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setEditCat(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
    const openEdit = (c) => { setEditCat(c); setForm({ name: c.name, type: c.type || '' }); setErrors({}); setShowModal(true); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editCat) {
            router.put(`/admin/categories/${editCat.id}`, form, {
                onSuccess: () => setShowModal(false), onError: e => setErrors(e), preserveScroll: true,
            });
        } else {
            router.post('/admin/categories', form, {
                onSuccess: () => setShowModal(false), onError: e => setErrors(e), preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(`/admin/categories/${id}`, { preserveScroll: true, onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <>
            <Head title="Categories — Admin" />
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900">Categories</h1>
                        <p className="text-brand-400 text-sm mt-1">{dbCategories.length} categories total</p>
                    </div>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-bold text-white shadow-lg shadow-brand-200 hover:opacity-90 transition-all text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Add Category
                    </button>
                </div>

                {flash.success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700">✓ {flash.success}</div>}

                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(cat => (
                        <div key={cat.id} className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0">
                                            <span className="text-brand-600 font-black text-sm">{cat.name[0]}</span>
                                        </div>
                                        <p className="font-black text-brand-800 text-base truncate">{cat.name}</p>
                                    </div>
                                    {cat.type && (
                                        <span className="inline-block rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-600">{cat.type}</span>
                                    )}
                                </div>
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                    <span className="text-xs font-bold text-brand-400">{cat.products_count ?? 0} products</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-pink-100">
                                <button onClick={() => openEdit(cat)} className="flex-1 rounded-lg border border-pink-200 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-all">Edit</button>
                                <button onClick={() => setConfirmDelete({ id: cat.id, name: cat.name })} className="flex-1 rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-3 py-20 text-center text-brand-300 font-semibold rounded-3xl border border-pink-200 bg-white">No categories found.</div>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCat ? 'Edit Category' : 'Add Category'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-700 mb-1">Name <span className="text-red-500">*</span></label>
                        <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Bouquets"
                            className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-700 mb-1">Type</label>
                        <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                            className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                            <option value="">None</option>
                            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-3 font-bold text-white hover:opacity-90 transition-all">
                            {editCat ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete?.id)}
                message={`Delete "${confirmDelete?.name}"? All product associations will also be removed.`} />
        </>
    );
}

AdminCategories.layout = page => <AdminLayout>{page}</AdminLayout>;
