import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link } from '@inertiajs/react';

function seriousnessLabel(value) {
    switch (value) {
        case 'emergency':
            return 'Emergency';
        case 'high':
            return 'Very serious';
        case 'medium':
            return 'Needs attention';
        default:
            return 'Mild';
    }
}

export default function Index({ cases }) {
    return (
        <OwnerLayout
            title="My Care Requests"
            subtitle="See every report, what it looked like, and any reply from the vet."
        >
            <Head title="My Care Requests" />

            <div className="space-y-6">
                {cases.length === 0 ? (
                    <EmptyState
                        title="No care requests yet"
                        description="If one of your animals looks unwell, start with Report a Sick Animal and add the signs you noticed."
                        actionLabel="Report a Sick Animal"
                        actionHref={route('owner.cases.create')}
                    />
                ) : (
                <div className="grid gap-4">
                        {cases.map((item) => (
                            <Link
                                key={item.id}
                                href={route('owner.cases.show', item.id)}
                                className="block rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                                {item.animal?.name ?? 'Animal'}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-stone-600">
                                                {item.animal?.species?.name ?? 'Unknown species'}
                                                {' - '}
                                                {item.description?.slice(0, 120) ?? 'No details yet.'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                {item.animal?.name ?? 'Animal'}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                {item.animal?.species?.name ?? 'Species'}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                How Serious It Looks: {seriousnessLabel(item.urgency_level)}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                Signs: {item.symptoms?.length ? item.symptoms.slice(0, 3).map((symptom) => symptom.name).join(', ') : 'Not listed'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-start gap-3">
                                        <StatusBadge value={item.status} />
                                        <StatusBadge value={item.urgency_level} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}
