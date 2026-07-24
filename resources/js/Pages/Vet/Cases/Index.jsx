import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import VetLayout from '@/Layouts/VetLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function matchesFilter(item, filter) {
    if (!filter || filter === 'all') {
        return true;
    }

    if (filter === 'emergency') {
        return item.urgency_level === 'high' || item.urgency_level === 'emergency';
    }

    if (filter === 'waiting') {
        return ['submitted', 'under_review'].includes(item.status);
    }

    if (filter === 'resolved') {
        return ['resolved', 'closed'].includes(item.status);
    }

    return true;
}

function filterTitle(filter) {
    switch (filter) {
        case 'emergency':
            return 'Emergency';
        case 'waiting':
            return 'Waiting for Vet Response';
        case 'resolved':
            return 'Resolved';
        default:
            return 'Care Requests';
    }
}

export default function Index({ cases }) {
    const { url } = usePage();
    const filter = new URLSearchParams(url.split('?')[1] ?? '').get('filter') ?? 'all';
    const visibleCases = cases.filter((item) => matchesFilter(item, filter));

    return (
        <VetLayout
            title="Care Requests"
            subtitle="Review new requests, spot emergencies quickly, and open the cases that need your attention first."
        >
            <Head title="Care Requests" />

            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'All Requests', filter: 'all' },
                        { label: 'Emergency', filter: 'emergency' },
                        { label: 'Waiting', filter: 'waiting' },
                        { label: 'Resolved', filter: 'resolved' },
                    ].map((item) => (
                        <Link
                            key={item.filter}
                            href={route('vet.cases.index', item.filter === 'all' ? {} : { filter: item.filter })}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                filter === item.filter
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-white text-stone-700 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {visibleCases.length === 0 ? (
                    <EmptyState
                        title={`No ${filterTitle(filter).toLowerCase()} cases right now`}
                        description="When owners submit care requests, they will appear here for review."
                    />
                ) : (
                    <div className="grid gap-4">
                        {visibleCases.map((item) => (
                            <Link
                                key={item.id}
                                href={route('vet.cases.show', item.id)}
                                className="block rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                                {item.animal?.name ?? 'Animal'}
                                                {' - '}
                                                {item.animal?.species?.name ?? 'Species'}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-stone-600">
                                                Owner: {item.owner?.name ?? 'Unknown owner'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                Signs reported: {item.symptoms?.length ? item.symptoms.slice(0, 3).map((symptom) => symptom.name).join(', ') : 'View details'}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                How Serious It Looks: {item.urgency_level}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                Status: {item.status.replaceAll('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-start gap-3">
                                        <StatusBadge value={item.status} />
                                        <StatusBadge value={item.urgency_level} />
                                        <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
                                            Review Request
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </VetLayout>
    );
}
