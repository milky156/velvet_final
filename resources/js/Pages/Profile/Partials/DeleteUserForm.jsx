import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8 border-b border-red-50 pb-6">
                <h2 className="text-3xl font-black text-red-600 leading-tight">
                    Danger Zone
                </h2>
                <p className="text-sm font-medium text-red-400 mt-2 italic">
                    Once your account is deleted, all of its resources and data will be permanently deleted. This action is irreversible.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="px-10 py-3 rounded-full text-sm font-black tracking-widest uppercase bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100">
                Permanently Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-white rounded-3xl">
                    <h2 className="text-2xl font-black text-brand-900 mb-4">
                        Confirm Account Deletion
                    </h2>

                    <p className="text-sm font-medium text-brand-500 mb-6">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Enter your password to confirm"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="px-6 rounded-xl">
                            Cancel
                        </SecondaryButton>

                        <DangerButton className="px-6 rounded-xl bg-red-600 hover:bg-red-700" disabled={processing}>
                            Delete My Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
