import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ submission, canEdit, canSubmit }) {
    const submitForReview = () => {
        router.post(
            route('researcher.knowledge-submissions.submit', submission.id),
        );
    };

    return (
        <PortalLayout
            title={submission.title}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Knowledge Submission
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            {submission.title}
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            {submission.disease_name || 'General knowledge'}
                            {submission.species
                                ? ` - ${submission.species.name}`
                                : ''}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <StatusBadge value={submission.status} />
                        {canEdit ? (
                            <Link
                                href={route(
                                    'researcher.knowledge-submissions.edit',
                                    submission.id,
                                )}
                                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                Edit Draft
                            </Link>
                        ) : null}
                        {canSubmit ? (
                            <button
                                type="button"
                                onClick={submitForReview}
                                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                Submit for Review
                            </button>
                        ) : null}
                    </div>
                </div>
            }
        >
            <Head title={submission.title} />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-6">
                    <Panel title="Submission Summary">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Info
                                label="Evidence Level"
                                value={submission.evidence_level ?? 'Not set'}
                            />
                            <Info
                                label="Primary Source Type"
                                value={submission.source_type ?? 'Not set'}
                            />
                            <Info
                                label="Source Reference"
                                value={submission.source_reference ?? 'Not set'}
                            />
                            <Info
                                label="Reviewer"
                                value={submission.reviewer?.name ?? 'Not assigned'}
                            />
                            <Info
                                label="Curator"
                                value={submission.curator?.name ?? 'Not assigned'}
                            />
                            <Info
                                label="Submitted At"
                                value={submission.submitted_at ?? 'Not submitted yet'}
                            />
                        </div>
                        <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Summary
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {submission.summary}
                            </p>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <Info
                                label="Affected Species Note"
                                value={
                                    submission.metadata?.affected_species_note ??
                                    'Not set'
                                }
                            />
                            <Info
                                label="Severity Note"
                                value={submission.metadata?.severity_note ?? 'Not set'}
                            />
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                General Care Advice
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {submission.metadata?.care_advice ||
                                    'Not provided'}
                            </p>
                        </div>
                    </Panel>

                    <Panel title="Symptoms">
                        <ListOrEmpty
                            items={submission.symptoms}
                            emptyText="No symptoms added yet."
                            renderItem={(item) => (
                                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-stone-900">
                                            {item.symptom_name}
                                        </h4>
                                        <div className="flex gap-2">
                                            {item.severity_level ? (
                                                <StatusBadge
                                                    value={item.severity_level}
                                                />
                                            ) : null}
                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 ring-1 ring-stone-200">
                                                weight {item.symptom_weight}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-stone-700">
                                        {item.symptom_description ||
                                            'No description provided.'}
                                    </p>
                                </div>
                            )}
                        />
                    </Panel>
                </section>

                <section className="space-y-6">
                    <Panel title="Risk Factors">
                        <ListOrEmpty
                            items={submission.risk_factors}
                            emptyText="No risk factors added yet."
                            renderItem={(item) => (
                                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-stone-900">
                                            {item.risk_factor_name}
                                        </h4>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 ring-1 ring-stone-200">
                                            weight {item.weight}
                                        </span>
                                    </div>
                                </div>
                            )}
                        />
                    </Panel>

                    <Panel title="Evidence Sources">
                        <ListOrEmpty
                            items={submission.sources}
                            emptyText="No evidence sources added yet."
                            renderItem={(item) => (
                                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <h4 className="text-lg font-semibold text-stone-900">
                                        {item.source_title || 'Untitled source'}
                                    </h4>
                                    <p className="mt-2 text-sm text-stone-600">
                                        {item.source_author || 'Unknown author'}
                                        {item.source_year
                                            ? ` - ${item.source_year}`
                                            : ''}
                                        {item.source_type
                                            ? ` - ${item.source_type}`
                                            : ''}
                                    </p>
                                    {item.source_url ? (
                                        <a
                                            href={item.source_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex text-sm font-semibold text-stone-900 underline"
                                        >
                                            Open source
                                        </a>
                                    ) : null}
                                    <p className="mt-3 text-sm leading-6 text-stone-700">
                                        {item.notes || 'No notes provided.'}
                                    </p>
                                </div>
                            )}
                        />
                    </Panel>

                    <Panel title="Review Feedback">
                        <ListOrEmpty
                            items={submission.reviews}
                            emptyText="No reviewer feedback yet."
                            renderItem={(item) => (
                                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h4 className="text-lg font-semibold text-stone-900">
                                                {item.reviewer?.name || 'Reviewer'}
                                            </h4>
                                            <p className="mt-1 text-sm text-stone-600">
                                                {item.reviewed_at ||
                                                    'Review date not set'}
                                            </p>
                                        </div>
                                        <StatusBadge value={item.decision} />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-stone-700">
                                        {item.comments || 'No comments supplied.'}
                                    </p>
                                </div>
                            )}
                        />
                    </Panel>
                </section>
            </div>
        </PortalLayout>
    );
}

function Panel({ title, children }) {
    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{value}</p>
        </div>
    );
}

function ListOrEmpty({ items, emptyText, renderItem }) {
    if (!items.length) {
        return <p className="text-sm text-stone-600">{emptyText}</p>;
    }

    return <div className="space-y-4">{items.map(renderItem)}</div>;
}
