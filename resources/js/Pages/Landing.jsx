import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';

export default function Landing() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Do you offer same-day delivery?",
            answer: "Yes! We offer same-day delivery for orders placed before 2:00 PM local time. Express delivery options are also available at checkout."
        },
        {
            question: "Can I customize a bouquet?",
            answer: "Absolutely. While we offer curated artisan arrangements, you can always leave a note during checkout with specific color or flower preferences, and our florists will do their best to accommodate."
        },
        {
            question: "How long will my flowers last?",
            answer: "Our farm-fresh flowers typically last 7-10 days with proper care. We include a care guide and flower food packet with every delivery."
        },
        {
            question: "Do you deliver on weekends?",
            answer: "Yes, we deliver 7 days a week, including weekends and most major holidays, to ensure your special moments are always celebrated."
        }
    ];

    return (
        <ShopLayout>
            <Head title="Welcome to Velvet & Vine" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-brand-50 pt-16 sm:pt-24 lg:pt-32 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-brand-600 ring-1 ring-brand-200 hover:ring-brand-300">
                                Spring Collection is now available.{' '}
                                <Link href="/login" className="font-semibold text-brand-700">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Shop now <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-brand-900 sm:text-6xl">
                            Artisan florals for life's beautiful moments
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-brand-600">
                            Velvet & Vine brings you hand-crafted, farm-fresh bouquets designed to elevate every occasion. Discover our premium collections and experience the art of gifting.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/login"
                                className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-200 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all"
                            >
                                Sign In to Shop
                            </Link>
                            <Link href="/register" className="text-sm font-semibold leading-6 text-brand-900 hover:text-brand-700">
                                Create an Account <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-brand-600">Premium Quality</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
                            Everything you need for the perfect gift
                        </p>
                        <p className="mt-6 text-lg leading-8 text-brand-600">
                            We pride ourselves on sourcing the freshest blooms and designing arrangements that speak volumes.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-brand-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                                        <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                        </svg>
                                    </div>
                                    Farm Fresh Blooms
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-brand-600">Sourced directly from sustainable farms, ensuring your flowers arrive vibrant and last longer.</dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-brand-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                                        <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                        </svg>
                                    </div>
                                    Same-Day Delivery
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-brand-600">Need it fast? We offer same-day delivery for those last-minute, unforgettable surprises.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-brand-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl divide-y divide-brand-200">
                        <h2 className="text-2xl font-bold leading-10 tracking-tight text-brand-900">Frequently asked questions</h2>
                        <dl className="mt-10 space-y-6 divide-y divide-brand-200">
                            {faqs.map((faq, index) => (
                                <div key={index} className="pt-6">
                                    <dt>
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="flex w-full items-start justify-between text-left text-brand-900 focus:outline-none"
                                        >
                                            <span className="text-base font-semibold leading-7">{faq.question}</span>
                                            <span className="ml-6 flex h-7 items-center">
                                                {openFaq === index ? (
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    </dt>
                                    {openFaq === index && (
                                        <dd className="mt-2 pr-12">
                                            <p className="text-base leading-7 text-brand-600">{faq.answer}</p>
                                        </dd>
                                    )}
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
