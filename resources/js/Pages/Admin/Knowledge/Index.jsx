import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

function SubmissionCard({ submission }) {
    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        {submission.species ?? 'Species not set'}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                        {submission.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">
                        {submission.disease_name ?? 'No disease name provided'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Submitter: {submission.submitter ?? 'Unknown'}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Reviewer: {submission.reviewer ?? 'Not assigned'}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Curator: {submission.curator ?? 'Not assigned'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <StatusBadge value={submission.status} />
                </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 lg:grid-cols-[1.35fr_0.95fr]">
                <p>{submission.summary ?? 'No summary provided.'}</p>
                <div className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        Metadata
                    </p>
                    <div className="mt-2 space-y-1">
                        <p>Source: {submission.source_type ?? 'Not set'}</p>
                        <p>Evidence level: {submission.evidence_level ?? 'Not set'}</p>
                        <p>Reviews: {submission.reviews_count}</p>
                        <p>Submitted: {submission.submitted_at ?? 'Not set'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RuleSetCard({ ruleSet }) {
    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        {ruleSet.species ?? 'Species'}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                        {ruleSet.disease ?? 'Untitled disease'}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">
                        Version {ruleSet.version_number}
                        {ruleSet.publisher ? ` • Published by ${ruleSet.publisher}` : ''}
                    </p>
                </div>
                <StatusBadge value={ruleSet.is_active ? 'approved' : 'closed'} />
            </div>

            <p className="mt-5 text-sm text-stone-600">
                Published: {ruleSet.published_at ?? 'Not set'}
            </p>
        </div>
    );
}

export default function Index({ submissions, publishedRuleSets, stats }) {
    return (
        <AdminLayout
            title="Knowledge Oversight"
            subtitle="Follow the research, review, and publication pipeline end to end."
        >
            <Head title="Admin Knowledge" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
                    <section className="space-y-4">
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-stone-900">
                                Knowledge Submissions
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                Track the research records moving through submission, review, and publication.
                            </p>
                        </div>

                        {submissions.length === 0 ? (
                            <EmptyState
                                title="No knowledge submissions"
                                description="Research submissions will appear here once the knowledge pipeline starts receiving entries."
                            />
                        ) : (
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <SubmissionCard
                                        key={submission.id}
                                        submission={submission}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-stone-900">
                                Published Rule Sets
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-stone-600">
                                These records power the diagnosis engine after curation is complete.
                            </p>
                        </div>

                        {publishedRuleSets.length === 0 ? (
                            <EmptyState
                                title="No published rule sets"
                                description="Once curators publish validated knowledge, the live rule list will appear here."
                            />
                        ) : (
                            <div className="space-y-4">
                                {publishedRuleSets.map((ruleSet) => (
                                    <RuleSetCard
                                        key={ruleSet.id}
                                        ruleSet={ruleSet}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
