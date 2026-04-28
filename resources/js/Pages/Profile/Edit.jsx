import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-brand-900">
                        Profile Settings
                    </h2>
                    <BackButton />
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="glass p-6 sm:p-10 sm:rounded-3xl animate-fade-in">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="glass p-6 sm:p-10 sm:rounded-3xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="glass p-6 sm:p-10 sm:rounded-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
