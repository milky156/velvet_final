import { Link } from '@inertiajs/react';

export default function BackButton({ className = '', href, ...props }) {
    const handleBack = (e) => {
        if (!href) {
            e.preventDefault();
            window.history.back();
        }
    };

    return (
        <Link
            href={href || '#'}
            onClick={handleBack}
            className={
                `inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors duration-200 group ` +
                className
            }
            {...props}
        >
            <div className="p-1.5 rounded-full bg-brand-100 group-hover:bg-brand-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </div>
            <span>Back</span>
        </Link>
    );
}
