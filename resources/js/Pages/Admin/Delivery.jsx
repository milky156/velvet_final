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
                <h3 className="text-xl font-black text-brand-900 text-center mb-2">Confirm Delete</h3>
                <p className="text-brand-500 text-center text-sm mb-8">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
}

const emptyForm = { name: '', area: '', fee: '', estimated_time: '', is_active: true };

export default function AdminDelivery({ dbZones = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [showModal, setShowModal] = useState(false);
    const [editZone, setEditZone] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const openCreate = () => { setEditZone(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
    const openEdit = (z) => {
        setEditZone(z);
        setForm({ name: z.name, area: z.area || '', fee: z.fee, estimated_time: z.estimated_time || '', is_active: z.is_active });
        setErrors({});
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...form, fee: parseFloat(form.fee), is_active: form.is_active === true || form.is_active === 'true' };
        if (editZone) {
            router.put(`/admin/delivery/${editZone.id}`, data, { onSuccess: () => setShowModal(false), onError: e => setErrors(e), preserveScroll: true });
        } else {
            router.post('/admin/delivery', data, { onSuccess: () => setShowModal(false), onError: e => setErrors(e), preserveScroll: true });
        }
    };

    const handleToggle = (zone) => {
        router.put(`/admin/delivery/${zone.id}`, { ...zone, is_active: !zone.is_active }, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        router.delete(`/admin/delivery/${id}`, { preserveScroll: true, onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <>
            <Head title="Delivery Zones — Admin" />
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-brand-900">Delivery Zones</h1>
                        <p className="text-brand-400 text-sm mt-1">{dbZones.length} zones configured · {dbZones.filter(z => z.is_active).length} active</p>
                    </div>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-bold text-white shadow-lg shadow-brand-200 hover:opacity-90 transition-all text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Add Zone
                    </button>
                </div>

                {flash.success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700">✓ {flash.success}</div>}

                {dbZones.length === 0 ? (
                    <div className="rounded-3xl border border-pink-200 bg-white p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <p className="font-bold text-brand-400 mb-4">No delivery zones yet.</p>
                        <button onClick={openCreate} className="rounded-full bg-brand-600 px-6 py-2.5 font-bold text-white text-sm hover:bg-brand-700 transition-all">Create First Zone</button>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-pink-200 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-pink-100 bg-brand-50">
                                        {['Zone', 'Area', 'Fee', 'Est. Time', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="text-left px-6 py-4 font-black text-brand-400 text-xs uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-50">
                                    {dbZones.map(zone => (
                                        <tr key={zone.id} className="hover:bg-brand-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-brand-800">{zone.name}</td>
                                            <td className="px-6 py-4 text-brand-500">{zone.area || '—'}</td>
                                            <td className="px-6 py-4 font-black text-brand-700">₱{parseFloat(zone.fee||0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-brand-500">{zone.estimated_time || '—'}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleToggle(zone)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${zone.is_active ? 'bg-brand-600' : 'bg-brand-200'}`}>
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${zone.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <span className={`ml-2 text-xs font-bold ${zone.is_active ? 'text-brand-600' : 'text-brand-300'}`}>{zone.is_active ? 'Active' : 'Inactive'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(zone)} className="rounded-lg border border-pink-200 px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-all">Edit</button>
                                                    <button onClick={() => setConfirmDelete({ id: zone.id, name: zone.name })} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editZone ? 'Edit Zone' : 'Add Delivery Zone'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { key: 'name', label: 'Zone Name', placeholder: 'e.g. Downtown', required: true },
                        { key: 'area', label: 'Area / Coverage', placeholder: 'e.g. City Center, 5km radius' },
                        { key: 'fee', label: 'Delivery Fee (₱)', placeholder: '0.00', type: 'number' },
                        { key: 'estimated_time', label: 'Estimated Time', placeholder: 'e.g. 30-45 mins' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="block text-xs font-bold text-brand-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                            <input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} type={f.type || 'text'} step={f.type === 'number' ? '0.01' : undefined} required={!!f.required}
                                className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                            {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                        </div>
                    ))}
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setForm(f => ({...f, is_active: !f.is_active}))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-brand-600' : 'bg-brand-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-sm font-bold text-brand-700">{form.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-brand-200 py-3 font-bold text-brand-600 hover:bg-brand-50">Cancel</button>
                        <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-3 font-bold text-white hover:opacity-90">
                            {editZone ? 'Save Changes' : 'Create Zone'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete?.id)}
                message={`Delete zone "${confirmDelete?.name}"?`} />
        </>
    );
}

AdminDelivery.layout = page => <AdminLayout>{page}</AdminLayout>;
