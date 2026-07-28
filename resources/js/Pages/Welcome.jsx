import { Head, Link } from '@inertiajs/react';

const workflowSteps = [
    'Report a sick animal in a few simple steps.',
    'The system compares signs with validated veterinary knowledge.',
    'A veterinarian reviews the request and gives final advice.',
];

const roleCards = [
    {
        title: 'Animal Owners',
        description:
            'Report sick animals, track care requests, and read vet advice in plain language.',
    },
    {
        title: 'Veterinarians',
        description:
            'Triage requests, review signs, and update diagnosis and care guidance quickly.',
    },
    {
        title: 'Researchers and Reviewers',
        description:
            'Submit, review, and curate validated veterinary knowledge for the rule base.',
    },
];

function FeatureCard({ title, description, tone = 'stone' }) {
    const toneClasses = {
        stone: 'border-stone-200 bg-white',
        amber: 'border-amber-200 bg-amber-50/80',
        emerald: 'border-emerald-200 bg-emerald-50/80',
        sky: 'border-sky-200 bg-sky-50/80',
    };

    return (
        <div className={`rounded-3xl border p-5 shadow-sm ${toneClasses[tone]}`}>
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
        </div>
    );
}

export default function Welcome({ auth }) {
    const signedIn = Boolean(auth?.user);

    return (
        <>
            <Head title="Remote Veterinary Care" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_26%),linear-gradient(180deg,_#fffdf7_0%,_#f8fafc_100%)] text-stone-900">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                    <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-5 py-3 shadow-sm backdrop-blur">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                                Remote Veterinary Diagnosis and Care System
                            </p>
                            <h1 className="mt-1 text-lg font-semibold text-stone-900">
                                Remote Vet Care Center
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {signedIn ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </header>

                    <main className="grid flex-1 gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <section className="space-y-8">
                            <div className="max-w-3xl">
                                <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                                    Friendly care for animals, not a technical dashboard
                                </p>
                                <h2 className="mt-6 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                                    Fast remote diagnosis support and care guidance for
                                    sick animals.
                                </h2>
                                <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
                                    Owners can report signs in simple language, veterinarians
                                    can review care requests quickly, and the system uses
                                    published veterinary knowledge to generate possible
                                    conditions, urgency levels, and supportive care advice.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                                >
                                    Start as an animal owner
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                                >
                                    I already have an account
                                </Link>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <FeatureCard
                                    title="Report quickly"
                                    description="Capture signs noticed, photos, and basic animal details in a short step-by-step flow."
                                    tone="amber"
                                />
                                <FeatureCard
                                    title="See clear guidance"
                                    description="View possible health conditions, what you can do now, and how soon care is needed."
                                    tone="sky"
                                />
                                <FeatureCard
                                    title="Vet review included"
                                    description="Every suggestion stays under veterinarian oversight for final diagnosis and treatment."
                                    tone="emerald"
                                />
                            </div>
                        </section>

                        <aside className="space-y-5">
                            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/50">
                                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                    How it works
                                </p>
                                <div className="mt-5 space-y-4">
                                    {workflowSteps.map((step, index) => (
                                        <div
                                            key={step}
                                            className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                                                {index + 1}
                                            </span>
                                            <p className="pt-1 text-sm leading-6 text-stone-700">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-stone-200 bg-stone-900 p-6 text-white shadow-xl shadow-stone-200/50">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                                    Safety Note
                                </p>
                                <p className="mt-4 text-sm leading-7 text-white/85">
                                    These suggestions are generated automatically from validated
                                    veterinary knowledge and are intended to support
                                    decision-making. Final diagnosis and treatment remain the
                                    responsibility of the attending veterinarian.
                                </p>
                            </div>
                        </aside>
                    </main>

                    <section className="grid gap-4 pb-8 lg:grid-cols-3">
                        {roleCards.map((card) => (
                            <FeatureCard
                                key={card.title}
                                title={card.title}
                                description={card.description}
                            />
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}
