import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useShop } from '@/context/ShopContext';

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const { signOut } = useShop();

    return (
        <div className="min-h-screen bg-brand-50 text-brand-900 font-sans selection:bg-brand-200 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-brand-100 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-20 flex items-center px-8 border-b border-brand-100">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/velvet-vine-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-xl tracking-tighter text-brand-900">Velvet & Vine</span>
                    </Link>
                </div>
                
                <div className="px-6 py-6">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-400 mb-4">Admin Panel</p>
                    <nav className="flex flex-col gap-2">
                        <Link 
                            href="/admin" 
                            className={`px-4 py-3 rounded-xl font-bold transition-all ${url === '/admin' ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'text-brand-600 hover:bg-brand-50'}`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            href="/admin/products" 
                            className={`px-4 py-3 rounded-xl font-bold transition-all ${url.startsWith('/admin/products') ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'text-brand-600 hover:bg-brand-50'}`}
                        >
                            Products
                        </Link>
                        <Link 
                            href="/admin/categories" 
                            className={`px-4 py-3 rounded-xl font-bold transition-all ${url.startsWith('/admin/categories') ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'text-brand-600 hover:bg-brand-50'}`}
                        >
                            Categories
                        </Link>
                        <Link 
                            href="/admin/orders" 
                            className={`px-4 py-3 rounded-xl font-bold transition-all ${url.startsWith('/admin/orders') ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'text-brand-600 hover:bg-brand-50'}`}
                        >
                            Orders
                        </Link>
                        <Link 
                            href="/admin/delivery" 
                            className={`px-4 py-3 rounded-xl font-bold transition-all ${url.startsWith('/admin/delivery') ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'text-brand-600 hover:bg-brand-50'}`}
                        >
                            Delivery Zones
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-brand-100">
                    <button 
                        onClick={signOut}
                        className="w-full text-left px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10 min-h-screen">
                {children}
            </main>
        </div>
    );
}
