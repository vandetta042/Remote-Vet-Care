import AdminLayout from '@/Layouts/AdminLayout';
import CuratorLayout from '@/Layouts/CuratorLayout';
import PortalLayout from '@/Layouts/PortalLayout';
import ResearchLayout from '@/Layouts/ResearchLayout';
import ReviewerLayout from '@/Layouts/ReviewerLayout';
import OwnerLayout from '@/Layouts/OwnerLayout';
import VetLayout from '@/Layouts/VetLayout';
import { Head, Link } from '@inertiajs/react';

function statToneClasses(tone) {
    switch (tone) {
        case 'success':
            return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
        case 'warning':
            return 'bg-amber-50 text-amber-700 ring-amber-200';
        case 'danger':
            return 'bg-red-50 text-red-700 ring-red-200';
        default:
            return 'bg-stone-100 text-stone-700 ring-stone-200';
    }
}

function ActionCard({ item }) {
    const classes =
        'group block rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900';

    if (typeof item.href === 'string' && item.href.startsWith('#')) {
        return (
            <a href={item.href} className={classes}>
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-stone-900">
                        {item.label}
                    </h3>
                    <span className="text-stone-400 transition group-hover:text-stone-900">
                        {'->'}
                    </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                    {item.description}
                </p>
            </a>
        );
    }

    return (
        <Link href={item.href} className={classes}>
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-stone-900">
                    {item.label}
                </h3>
                <span className="text-stone-400 transition group-hover:text-stone-900">
                    {'->'}
                </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-600">
                {item.description}
            </p>
        </Link>
    );
}

export default function Dashboard({
    title,
    roleLabel,
    description,
    stats,
    quickLinks,
    spotlight,
}) {
    const isOwner = roleLabel === 'Animal Owner';
    const isVet = roleLabel === 'Veterinarian';

    const sharedStats = (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${statToneClasses(stat.tone)}`}
                    >
                        {stat.label}
                    </span>
                    <p className="mt-5 text-4xl font-semibold text-stone-900">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );

    if (isOwner) {
        return (
            <OwnerLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Start Here
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Choose what you want to do next
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                The buttons below lead to the most common animal
                                care tasks. Pick one and continue from there.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section
                        id="emergency-signs"
                        className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                                Emergency Signs
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Call for urgent help right away if you notice these
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-700">
                                These signs do not replace a vet, but they are a
                                strong reason to seek immediate care.
                            </p>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {[
                                'Trouble breathing or noisy breathing',
                                'Can not stand, collapse, or extreme weakness',
                                'Seizures, convulsions, or sudden confusion',
                                'Heavy bleeding or deep wounds',
                                'Repeated vomiting, diarrhea, or swelling',
                                'Not eating or drinking for a long time',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-6 text-stone-700"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </OwnerLayout>
        );
    }

    if (isVet) {
        return (
            <VetLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Triage
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Jump into the right queue
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                Use these actions to open the queue, find
                                emergencies, or check which cases still need a
                                response.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </VetLayout>
        );
    }

    if (roleLabel === 'Researcher') {
        return (
            <ResearchLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Drafting
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Keep evidence moving forward
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                Start a draft when you have a clear disease idea,
                                then fill it with signs, risk factors, and
                                supporting sources.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </ResearchLayout>
        );
    }

    if (roleLabel === 'Veterinary Reviewer') {
        return (
            <ReviewerLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Review Queue
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Decide what should move forward
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                Open the pending review list, inspect the
                                evidence, and record a clear decision with
                                comments.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </ReviewerLayout>
        );
    }

    if (roleLabel === 'Data Curator') {
        return (
            <CuratorLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Publication Workbench
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Turn approved knowledge into rule sets
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                Move from approved submission to a structured
                                disease record and keep the live rule set current.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </CuratorLayout>
        );
    }

    if (roleLabel === 'Administrator') {
        return (
            <AdminLayout title={title} subtitle={description}>
                <Head title={title} />

                <div className="space-y-6">
                    {sharedStats}

                    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Oversight
                            </p>
                            <h3 className="text-2xl font-semibold text-stone-900">
                                Open the admin screens you need
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-stone-600">
                                Use these shortcuts to move between users, care
                                requests, and the knowledge pipeline without
                                returning to the dashboard.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {quickLinks.map((item) => (
                                <ActionCard key={item.label} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-3">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </AdminLayout>
        );
    }

    return (
        <PortalLayout
            title={title}
            header={
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            {roleLabel}
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            {title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                            {description}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-stone-900 px-5 py-4 text-sm text-stone-100">
                        Admin users now have dedicated screens for users, care
                        requests, and knowledge oversight.
                    </div>
                </div>
            }
        >
            <Head title={title} />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                    >
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${statToneClasses(stat.tone)}`}
                        >
                            {stat.label}
                        </span>
                        <p className="mt-5 text-4xl font-semibold text-stone-900">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                Quick Access
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-stone-900">
                                Role-aligned workspace
                            </h3>
                        </div>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                            Current Phase
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {quickLinks.map((item) => (
                            <ActionCard key={item.label} item={item} />
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Build Notes
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-stone-900">
                        What this phase unlocks
                    </h3>
                    <div className="mt-6 space-y-4">
                        {spotlight.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                            >
                                <p className="text-sm leading-6 text-stone-700">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PortalLayout>
    );
}
