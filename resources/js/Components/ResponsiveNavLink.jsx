import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-3 pe-4 ps-3 rounded-r-xl ${
                active
                    ? 'border-brand-500 bg-brand-100 text-brand-900 font-black'
                    : 'border-transparent text-brand-500 font-bold hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
            } text-base transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
