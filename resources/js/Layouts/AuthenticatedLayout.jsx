import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-brand-50 selection:bg-brand-200">
            <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2 group transition-all active:scale-95">
                                    <img src="/velvet-vine-logo.png" alt="Velvet & Vine" className="h-10 w-10 object-contain group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="hidden sm:block text-lg font-black tracking-tight text-brand-900">
                                        Velvet <span className="text-brand-500">&amp;</span> Vine
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Store
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition duration-150 ease-in-out hover:bg-brand-50 hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48" contentClasses="py-1 bg-white rounded-2xl shadow-xl border border-brand-100">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="font-semibold text-brand-700 hover:bg-brand-50 hover:text-brand-900"
                                        >
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-brand-400 transition duration-150 ease-in-out hover:bg-brand-50 hover:text-brand-500 focus:bg-brand-50 focus:text-brand-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden animate-fade-in'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2 px-4">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Store
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-brand-100 pb-1 pt-4 px-4 mb-4">
                        <div className="px-4 mb-3">
                            <div className="text-base font-black text-brand-900">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-brand-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-red-600 hover:bg-red-50"
                            >
                                Sign Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
            </nav>

            <main className="pt-20">
                {header && (
                    <header className="bg-white/50 backdrop-blur-sm border-b border-brand-100 mb-8">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <div className="pb-12">{children}</div>
            </main>
        </div>
    );
}
