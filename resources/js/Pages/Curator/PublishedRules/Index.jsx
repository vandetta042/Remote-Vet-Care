import EmptyState from '@/Components/EmptyState';
import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ approvedSubmissions, publishedRuleSets }) {
    return (
        <PortalLayout
            title="Approved Knowledge Queue"
            header={
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Curator Workflow
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        Approved Knowledge Queue
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Convert approved submissions into structured disease, symptom, risk factor, and published rule records.
                    </p>
                </div>
            }
        >
            <Head title="Approved Knowledge Queue" />

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <section className="space-y-4">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Approved Submissions
                        </h3>
                        <div className="mt-4 space-y-4">
                            {approvedSubmissions.length === 0 ? (
                                <EmptyState
                                    title="No approved submissions"
                                    description="Approved researcher submissions will appear here for curation and rule publication."
                                />
                            ) : (
                                approvedSubmissions.map((submission) => (
                                    <Link
                                        key={submission.id}
                                        href={route('curator.published-rules.show', submission.id)}
                                        className="block rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-900 hover:bg-white"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-stone-900">
                                                    {submission.title}
                                                </h4>
                                                <p className="mt-1 text-sm text-stone-600">
                                                    {submission.species?.name ?? 'Species not set'} • {submission.submitter?.name ?? 'Researcher'}
                                                </p>
                                            </div>
                                            <StatusBadge value={submission.status} />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Recently Published Rule Sets
                        </h3>
                        <div className="mt-4 space-y-4">
                            {publishedRuleSets.length === 0 ? (
                                <p className="text-sm text-stone-600">
                                    No rule sets have been published yet.
                                </p>
                            ) : (
                                publishedRuleSets.map((ruleSet) => (
                                    <div
                                        key={ruleSet.id}
                                        className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-stone-900">
                                                    {ruleSet.disease?.name}
                                                </h4>
                                                <p className="mt-1 text-sm text-stone-600">
                                                    {ruleSet.species?.name ?? 'Species'} • version {ruleSet.version_number}
                                                </p>
                                            </div>
                                            {ruleSet.is_active ? (
                                                <StatusBadge value="approved" />
                                            ) : (
                                                <StatusBadge value="closed" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PortalLayout>
    );
}
