import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

function CaseCard({ item }) {
    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                            {item.animal?.name ?? 'Animal'} -{' '}
                            {item.animal?.species ?? 'Species not set'}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-stone-600">
                            Owner: {item.owner?.name ?? 'Unknown owner'}
                            {item.assigned_vet ? ` • Vet: ${item.assigned_vet}` : ''}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Signs: {item.signs.length > 0 ? item.signs.join(', ') : 'Not listed'}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Score: {item.system_score ?? 'N/A'}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Follow-up: {item.follow_up_date ?? 'Not set'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <StatusBadge value={item.status} />
                    <StatusBadge value={item.urgency_level} />
                </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 lg:grid-cols-[1.4fr_0.9fr]">
                <p>{item.description ?? 'No additional description provided.'}</p>
                <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        System Suggestion
                    </p>
                    <p className="mt-2 text-stone-700">
                        {item.system_suggestion ?? 'No suggestion available yet.'}
                    </p>
                    <p className="mt-3 text-xs text-stone-500">
                        Attachments: {item.attachments_count}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Index({ cases, stats }) {
    return (
        <AdminLayout
            title="Care Requests"
            subtitle="Monitor the animal care queue, serious cases, and response progress."
        >
            <Head title="Admin Care Requests" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                {stat.label}
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {cases.length === 0 ? (
                    <EmptyState
                        title="No care requests yet"
                        description="When owners submit cases, the admin oversight list will show the newest requests here."
                    />
                ) : (
                    <div className="space-y-4">
                        {cases.map((item) => (
                            <CaseCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
