import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';

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

export default function Dashboard({
    title,
    roleLabel,
    description,
    stats,
    quickLinks,
    spotlight,
}) {
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
                        This portal foundation is live, and the linked
                        workflow pages are ready for use.
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
                            Phase 2
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {quickLinks.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="group rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:border-stone-900 hover:bg-white"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className="text-lg font-semibold text-stone-900">
                                        {item.label}
                                    </h4>
                                    <span className="text-stone-400 transition group-hover:text-stone-900">
                                        {'->'}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-stone-600">
                                    {item.description}
                                </p>
                            </a>
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
