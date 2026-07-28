import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Welcome back
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        Log in to continue caring for animals
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                        Use the email address linked to your account to open your
                        dashboard, care requests, and role-specific tools.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-2xl border-stone-300 bg-stone-50 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-2xl border-stone-300 bg-stone-50 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-3 text-sm text-stone-600">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            Remember me on this device
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton
                        className="w-full justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-emerald-500 focus:bg-emerald-500 focus:ring-emerald-500"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </form>

                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                    New here?{' '}
                    <Link href={route('register')} className="font-semibold text-stone-900 underline-offset-4 hover:underline">
                        Create an account
                    </Link>{' '}
                    to report a sick animal.
                </div>
            </section>
        </GuestLayout>
    );
}
