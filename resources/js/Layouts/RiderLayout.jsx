import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';

const navItems = [
    {
        href: '/rider/dashboard',
        label: 'Dashboard',
        exact: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM16.5 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 11.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm0-3a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
        ),
    },
    {
        href: '/messages',
        label: 'Messages',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.303.025-.607.047-.912.066a1.109 1.109 0 0 0-1.008 1.108 11.481 11.481 0 0 1-.467 3.29 1.188 1.188 0 0 1-1.316.886 12.038 12.038 0 0 1-3.827-1.14 1.125 1.125 0 0 0-1.101.01 11.954 11.954 0 0 1-4.812 1.225c-.357 0-.711-.023-1.058-.069a1.125 1.125 0 0 1-.957-1.123v-1.134c0-.522-.359-.966-.856-1.108a11.554 11.554 0 0 1-1.32-.451c-.433-.18-.63-.701-.457-1.135a11.033 11.033 0 0 1 .505-1.042 1.125 1.125 0 0 0-.611-1.563l-.133-.053a1.125 1.125 0 0 1-.611-1.563 11.233 11.233 0 0 1 .505-1.042c.173-.434-.024-.955-.457-1.135a11.554 11.554 0 0 1-1.32-.451c-.497-.142-.856-.586-.856-1.108v-1.134a1.125 1.125 0 0 1-.957-1.123c-.347-.046-.701-.069-1.058-.069a11.954 11.954 0 0 1-4.812-1.225 1.125 1.125 0 0 0-1.101-.01 12.038 12.038 0 0 1-3.827 1.14 1.188 1.188 0 0 1-1.316-.886 11.481 11.481 0 0 1-.467-3.29 1.109 1.109 0 0 0-1.008-1.108 11.71 11.71 0 0 1-.912-.066c-1.133-.093-1.98-.957-1.98-2.193V10.608c0-.969.616-1.813 1.5-2.097a47.93 47.93 0 0 1 21 0Z" />
            </svg>
        ),
    },
];

export default function RiderLayout({ children }) {
    const { url, props } = usePage();
    const authUser = props?.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

    const isActive = (item) => {
        if (item.exact) return url === item.href;
        return url.startsWith(item.href);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [msgRes, orderRes] = await Promise.all([
                    axios.get('/api/unread-messages-count'),
                    axios.get('/api/pending-orders-count')
                ]);
                setUnreadCount(msgRes.data.count);
                setPendingOrdersCount(orderRes.data.count);
            } catch (e) {}
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSignOut = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-brand-50 text-brand-900 font-sans selection:bg-brand-200 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-brand-100 flex flex-col fixed inset-y-0 left-0 z-50 shadow-lg transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-brand-100 shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18 18.75a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25ZM16.5 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 11.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm0-3a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-black text-lg tracking-tight text-brand-900">Velvet & Vine</span>
                            <p className="text-[10px] font-semibold text-brand-400 -mt-0.5">Rider Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-300 mb-3 px-2">Logistics</p>
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const active = isActive(item);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                        active
                                            ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-200'
                                            : 'text-brand-600 hover:bg-brand-50 hover:text-brand-800'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className={active ? 'opacity-100' : 'opacity-70'}>{item.icon}</span>
                                    {item.label}
                                    {item.label === 'Messages' && unreadCount > 0 && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-200" />
                                    )}
                                    {item.label === 'Dashboard' && pendingOrdersCount > 0 && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-200" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                </div>

                {/* User Info + Sign Out */}
                <div className="p-4 border-t border-brand-100 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-brand-50 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                            {authUser?.name?.[0]?.toUpperCase() ?? 'R'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-brand-800 truncate">{authUser?.name ?? 'Rider'}</p>
                            <p className="text-[10px] text-brand-400 truncate">{authUser?.email ?? ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar (mobile) */}
                <header className="lg:hidden h-16 bg-white border-b border-brand-100 flex items-center px-4 gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-brand-600 hover:bg-brand-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <span className="font-black text-brand-900">Velvet & Vine</span>
                </header>

                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
