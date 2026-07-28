import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const highlights = [
    'Friendly for animal owners',
    'Built for vets and care teams',
    'Supportive suggestions only',
];

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_22%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
                <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-2xl shadow-stone-200/70 backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
                    <aside className="flex flex-col justify-between bg-stone-900 p-8 text-white sm:p-10 lg:p-12">
                        <div className="space-y-8">
                            <Link href="/" className="inline-flex items-center gap-4">
                                <ApplicationLogo className="h-12 w-12 fill-current text-white" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                                        Remote Vet Care
                                    </p>
                                    <h1 className="mt-1 text-2xl font-semibold">
                                        Remote Veterinary Care Center
                                    </h1>
                                </div>
                            </Link>

                            <div className="max-w-md space-y-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                                    Simple access for the care team
                                </p>
                                <h2 className="text-3xl font-semibold tracking-tight">
                                    Sign in to report, review, and respond to animal care requests.
                                </h2>
                                <p className="text-sm leading-7 text-white/75">
                                    The platform keeps owner language friendly, vet tools focused, and
                                    diagnosis support tied to validated veterinary knowledge.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-3">
                            {highlights.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </aside>

                    <main className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-lg">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
