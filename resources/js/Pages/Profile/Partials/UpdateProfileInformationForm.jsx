import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-6 mb-8">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-brand-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-brand-400">{user.name[0].toUpperCase()}</span>
                        )}
                    </div>
                    {user.google_id && (
                        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-brand-50">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-brand-900 leading-tight">
                        Profile Details
                    </h2>
                    <p className="text-sm font-medium text-brand-400">
                        Manage your personal information and contact details.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <InputLabel htmlFor="first_name" value="First Name" />
                    <TextInput
                        id="first_name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        autoComplete="given-name"
                        placeholder="e.g. Jane"
                    />
                    <InputError className="mt-2" message={errors.first_name} />
                </div>

                <div>
                    <InputLabel htmlFor="last_name" value="Last Name" />
                    <TextInput
                        id="last_name"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        autoComplete="family-name"
                        placeholder="e.g. Doe"
                    />
                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Display Name (Username)" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="How you'll appear on the site"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone Number" />
                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="e.g. 0912 345 6789"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor="address" value="Delivery Address" />
                    <textarea
                        id="address"
                        className="mt-1 block w-full rounded-2xl border-brand-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-brand-900 font-medium p-4 transition-all"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        rows={3}
                        placeholder="Room, House Number, Street, Barangay, City, Province"
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-brand-600 bg-brand-50 p-4 rounded-xl border border-brand-100 font-medium">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold text-brand-700 underline hover:text-brand-900"
                            >
                                Re-send verification email
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="md:col-span-2 flex items-center gap-4 pt-6 border-t border-pink-100">
                    <PrimaryButton disabled={processing} className="px-10 py-3 rounded-full text-sm font-black tracking-widest uppercase">
                        {processing ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-500"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-500"
                        leaveTo="opacity-0 -translate-y-1"
                    >
                        <p className="text-sm font-black text-emerald-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Changes saved successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
