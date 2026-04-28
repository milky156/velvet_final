import React from 'react';
import { usePage } from '@inertiajs/react';
import { ShopProvider } from '@/context/ShopContext';
import { SiteHeader } from '@/Components/SiteHeader';
import ChatWidget from '@/Components/ChatWidget';

export default function ShopLayout({ children }) {
    const { props } = usePage();
    const dbProducts = props.dbProducts;
    const dbOrders = props.dbOrders;

    return (
        <div className="min-h-screen bg-brand-50 text-brand-900 antialiased selection:bg-brand-200 relative">
            <ShopProvider dbProducts={dbProducts} dbOrders={dbOrders}>
                <SiteHeader />
                <main className="min-h-screen pt-24 pb-20">
                    {children}
                </main>
                <footer className="bg-white border-t border-brand-100 py-12">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <div className="flex justify-center mb-6">
                            <img src="/velvet-vine-logo.png" alt="Velvet & Vine" className="h-10 w-10 object-contain grayscale opacity-50" />
                        </div>
                        <p className="text-brand-400 font-bold text-sm tracking-widest uppercase mb-2">Velvet & Vine</p>
                        <p className="text-brand-300 text-xs font-medium">&copy; {new Date().getFullYear()} Velvet & Vine Floral Boutique. All rights reserved.</p>
                    </div>
                </footer>
                
                <ChatWidget />
            </ShopProvider>
        </div>
    );
}

