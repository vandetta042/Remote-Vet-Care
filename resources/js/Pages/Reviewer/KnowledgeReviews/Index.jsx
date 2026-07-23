import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ submissions }) {
    return (
        <PortalLayout
            title="Pending Knowledge Reviews"
            header={
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Reviewer Workflow
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        Pending Knowledge Reviews
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Review researcher submissions, validate their evidence, and decide whether each entry should be approved, rejected, or corrected.
                    </p>
                </div>
            }
        >
            <Head title="Pending Knowledge Reviews" />

            {submissions.length === 0 ? (
                <EmptyState
                    title="No submissions awaiting review"
                    description="Once researchers submit knowledge, it will appear here for structured review."
                />
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <Link
                            key={submission.id}
                            href={route('reviewer.knowledge-reviews.show', submission.id)}
                            className="block rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-900"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                        {submission.species?.name ?? 'Species not set'}
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                        {submission.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-stone-600">
                                        Submitted by {submission.submitter?.name ?? 'Researcher'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <StatusBadge value={submission.status} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
