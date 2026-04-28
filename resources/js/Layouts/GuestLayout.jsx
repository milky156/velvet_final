import { Link } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-brand-50 via-white to-brand-100 selection:bg-brand-200">
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>

            <div className="flex flex-col items-center mb-8 animate-fade-in">
                <Link href="/">
                    <img
                        src="/velvet-vine-logo.png"
                        alt="Velvet & Vine"
                        className="h-24 w-24 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                </Link>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-900">
                    Velvet <span className="text-brand-500">&amp;</span> Vine
                </h1>
                <p className="text-brand-400 font-medium text-sm mt-1">Gifting made effortless.</p>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 glass sm:rounded-3xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {children}
            </div>
        </div>
    );
}
