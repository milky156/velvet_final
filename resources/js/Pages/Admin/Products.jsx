import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-brand-900">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-50 text-brand-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
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
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.644c-1.73 0-2.813-1.874-1.948-3.374l7.107-12.748c.866-1.5 3.032-1.5 3.898 0l4.464 7.998M12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
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

const emptyForm = { id: '', name: '', description: '', price: '', stock: '', image: '', categories: [] };

export default function AdminProducts({ dbProducts = [], dbCategories = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const filtered = dbProducts.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setEditProduct(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
    const openEdit = (p) => {
        setEditProduct(p);
        setForm({ id: p.id, name: p.name, description: p.description, price: p.price, stock: p.stock, image: p.image || '', categories: p.categories?.map(c => c.id) || [] });
        setErrors({});
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
        if (editProduct) {
            router.put(`/admin/products/${editProduct.id}`, data, {
                onSuccess: () => setShowModal(false),
                onError: (e) => setErrors(e),
                preserveScroll: true,
            });
        } else {
            router.post('/admin/products', data, {
                onSuccess: () => setShowModal(false),
                onError: (e) => setErrors(e),
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(`/admin/products/${id}`, { preserveScroll: true, onSuccess: () => setConfirmDelete(null) });
    };

    const toggleCategory = (id) => {
        setForm(f => ({ ...f, categories: f.categories.includes(id) ? f.categories.filter(c => c !== id) : [...f.categories, id] }));
    };

    return (
        <>
            <Head title="Products — Admin" />
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900">Products</h1>
                        <p className="text-brand-400 text-sm mt-1">{dbProducts.length} products in catalog</p>
                    </div>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-bold text-white shadow-lg shadow-brand-200 hover:shadow-brand-300 transition-all text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Product
                    </button>
                </div>

                {flash.success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700">✓ {flash.success}</div>}

                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>

                <div className="rounded-3xl border border-pink-200 bg-white shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center text-brand-300 font-semibold">No products found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-pink-100 bg-brand-50">
                                        {['Product', 'Price', 'Stock', 'Categories', 'Actions'].map(h => (
                                            <th key={h} className="text-left px-6 py-4 font-black text-brand-400 text-xs uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-50">
                                    {filtered.map(product => (
                                        <tr key={product.id} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-50 border border-pink-100 shrink-0">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-brand-200">🌸</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-brand-800">{product.name}</p>
                                                        <p className="text-xs text-brand-400 truncate max-w-[200px]">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-brand-700">${parseFloat(product.price||0).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${product.stock <= 3 ? 'bg-red-100 text-red-700 border-red-200' : product.stock <= 8 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(product.categories || []).map(c => (
                                                        <span key={c.id} className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">{c.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(product)} className="rounded-lg border border-pink-200 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-all">Edit</button>
                                                    <button onClick={() => setConfirmDelete({ id: product.id, name: product.name })} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editProduct && (
                        <div>
                            <label className="block text-xs font-bold text-brand-700 mb-1">Product ID <span className="text-red-500">*</span></label>
                            <input value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value}))} placeholder="e.g. blush-bloom"
                                className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" required />
                            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
                        </div>
                    )}
                    {[{ key: 'name', label: 'Name', type: 'text' }, { key: 'price', label: 'Price ($)', type: 'number' }, { key: 'stock', label: 'Stock', type: 'number' }, { key: 'image', label: 'Image URL', type: 'text' }].map(field => (
                        <div key={field.key}>
                            <label className="block text-xs font-bold text-brand-700 mb-1">{field.label} {field.key !== 'image' && <span className="text-red-500">*</span>}</label>
                            <input value={form[field.key]} onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))} type={field.type} step={field.type === 'number' ? '0.01' : undefined}
                                className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" required={field.key !== 'image'} />
                            {errors[field.key] && <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-bold text-brand-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2}
                            className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-700 mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {dbCategories.map(cat => (
                                <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${form.categories.includes(cat.id) ? 'bg-brand-600 text-white border-brand-600' : 'border-pink-200 text-brand-600 hover:bg-brand-50'}`}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-3 font-bold text-white hover:opacity-90 transition-all">
                            {editProduct ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm */}
            <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete?.id)}
                message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`} />
        </>
    );
}

AdminProducts.layout = page => <AdminLayout>{page}</AdminLayout>;
