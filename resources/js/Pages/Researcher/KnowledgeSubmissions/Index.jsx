import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import ResearchLayout from '@/Layouts/ResearchLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ submissions }) {
    return (
        <ResearchLayout
            title="My Knowledge Drafts"
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Researcher Workflow
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            My Knowledge Drafts
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            Build structured disease knowledge with signs, risk
                            factors, and evidence sources before sending it for
                            veterinary review.
                        </p>
                    </div>
                    <Link
                        href={route('researcher.knowledge-submissions.create')}
                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                        New Draft
                    </Link>
                </div>
            }
        >
            <Head title="My Knowledge Drafts" />

            {submissions.length === 0 ? (
                <EmptyState
                    title="No drafts yet"
                    description="Create your first structured knowledge draft to begin feeding the veterinary rule base."
                    actionLabel="Create Draft"
                    actionHref={route('researcher.knowledge-submissions.create')}
                />
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <Link
                            key={submission.id}
                            href={route('researcher.knowledge-submissions.show', submission.id)}
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
                                        {submission.disease_name ||
                                            'General knowledge submission'}
                                        {submission.reviewer?.name
                                            ? ` - Reviewer: ${submission.reviewer.name}`
                                            : ''}
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
        </ResearchLayout>
    );
}
