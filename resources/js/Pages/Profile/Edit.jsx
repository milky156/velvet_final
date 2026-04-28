import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ShopLayout from '@/Layouts/ShopLayout';
import BackButton from '@/Components/BackButton';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, dbProducts, dbOrders }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const content = (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-pink-100 pb-10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[10px] font-black uppercase tracking-widest text-pink-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        Security & Identity
                    </div>
                    <h1 className="text-5xl font-black text-brand-900 tracking-tight">Account Settings</h1>
                    <p className="text-lg text-brand-500 font-medium max-w-2xl leading-relaxed">
                        Manage your digital presence, contact information, and security preferences.
                    </p>
                </div>
                <div className="shrink-0 mb-2">
                    <BackButton />
                </div>
            </div>

            <div className="space-y-10">
                {/* Profile Info Card */}
                <div className="group relative overflow-hidden rounded-[2.5rem] border border-pink-200 bg-white p-1 shadow-xl shadow-pink-100/20 transition-all hover:shadow-2xl hover:shadow-pink-200/30">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 text-pink-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                    <div className="rounded-[2.4rem] bg-gradient-to-br from-white to-pink-50/20 p-8 sm:p-12 relative z-10">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Password Card */}
                    <div className="rounded-[2.5rem] border border-pink-200 bg-white p-8 sm:p-12 shadow-xl shadow-pink-100/10 transition-all hover:shadow-2xl">
                        <UpdatePasswordForm />
                    </div>

                    {/* Danger Zone Card */}
                    <div className="rounded-[2.5rem] border border-red-100 bg-red-50/10 p-8 sm:p-12 shadow-xl shadow-red-100/10 transition-all hover:shadow-2xl">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </div>
    );

    // Determine Layout
    if (user.role === 'admin') {
        return (
            <AdminLayout>
                <Head title="Profile Settings" />
                {content}
            </AdminLayout>
        );
    }

    return (
        <ShopLayout>
            <Head title="My Account" />
            <div className="bg-brand-50 min-h-screen">
                {content}
            </div>
        </ShopLayout>
    );
}
