import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ cases }) {
    return (
        <PortalLayout
            title="My Cases"
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Remote Care Cases
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            My Cases
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            Track submitted cases, urgency level, system suggestions, and veterinarian responses.
                        </p>
                    </div>
                    <Link
                        href={route('owner.cases.create')}
                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                        Submit New Case
                    </Link>
                </div>
            }
        >
            <Head title="My Cases" />

            {cases.length === 0 ? (
                <EmptyState
                    title="No veterinary cases yet"
                    description="When one of your animals shows symptoms, submit a remote care case with symptoms, risk factors, and optional attachments."
                    actionLabel="Submit First Case"
                    actionHref={route('owner.cases.create')}
                />
            ) : (
                <div className="space-y-4">
                    {cases.map((item) => (
                        <Link
                            key={item.id}
                            href={route('owner.cases.show', item.id)}
                            className="block rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-900"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                        {item.animal?.name ?? 'Animal'}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-stone-600">
                                        {item.description.length > 140
                                            ? `${item.description.slice(0, 140)}...`
                                            : item.description}
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
