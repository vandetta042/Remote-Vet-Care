import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ cases }) {
    return (
        <PortalLayout
            title="Case Queue"
            header={
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Veterinarian Workflow
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        Case Queue
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Review owner-submitted cases, compare the system suggestion against clinical judgment, and respond with formal veterinary care advice.
                    </p>
                </div>
            }
        >
            <Head title="Case Queue" />

            {cases.length === 0 ? (
                <EmptyState
                    title="No cases available"
                    description="Submitted veterinary cases will appear here for review."
                />
            ) : (
                <div className="space-y-4">
                    {cases.map((item) => (
                        <Link
                            key={item.id}
                            href={route('vet.cases.show', item.id)}
                            className="block rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-900"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                        {item.animal?.species?.name ?? 'Species'} • {item.owner?.name ?? 'Owner'}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-stone-600">
                                        {item.animal?.name ?? 'Animal'}{item.assigned_vet?.name ? ` • Assigned to ${item.assigned_vet.name}` : ' • Unassigned'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <StatusBadge value={item.status} />
                                    <StatusBadge value={item.urgency_level} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
