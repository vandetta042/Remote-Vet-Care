import StatusBadge from '@/Components/StatusBadge';
import ReviewerLayout from '@/Layouts/ReviewerLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Show({ submission, decisionOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        decision: '',
        comments: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('reviewer.knowledge-reviews.store', submission.id));
    };

    return (
        <ReviewerLayout
            title={submission.title}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Reviewer Workflow
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            Review Submission
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            {submission.disease_name || 'General knowledge'}
                            {submission.species ? ` - ${submission.species.name}` : ''}
                        </p>
                    </div>
                    <StatusBadge value={submission.status} />
                </div>
            }
        >
            <Head title="Review Submission" />

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <section className="space-y-6">
                    <Panel title="Submission Summary">
                        <p className="text-sm leading-6 text-stone-700">
                            {submission.summary}
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <Info
                                label="Researcher"
                                value={submission.submitter?.name ?? 'Unknown'}
                            />
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
                        </div>
                    </Panel>

                    <Panel title="Signs and Risk Factors">
                        <div className="space-y-4">
                            {submission.symptoms.map((item) => (
                                <div
                                    key={`symptom-${item.id}`}
                                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-stone-900">
                                            {item.symptom_name}
                                        </h4>
                                        <div className="flex gap-2">
                                            {item.severity_level ? (
                                                <StatusBadge value={item.severity_level} />
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
                            ))}

                            {submission.risk_factors.length > 0 ? (
                                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                        Risk factors
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {submission.risk_factors.map((item) => (
                                            <span
                                                key={item.id}
                                                className="rounded-full bg-white px-3 py-2 text-sm text-stone-700 ring-1 ring-stone-200"
                                            >
                                                {item.risk_factor_name} (weight {item.weight})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Panel>

                    <Panel title="Evidence Sources">
                        <div className="space-y-4">
                            {submission.sources.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                >
                                    <h4 className="text-lg font-semibold text-stone-900">
                                        {item.source_title || 'Untitled source'}
                                    </h4>
                                    <p className="mt-2 text-sm text-stone-600">
                                        {item.source_author || 'Unknown author'}
                                        {item.source_year ? ` - ${item.source_year}` : ''}
                                        {item.source_type ? ` - ${item.source_type}` : ''}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-700">
                                        {item.notes || 'No notes provided.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </section>

                <section className="space-y-6">
                    <Panel title="Record Decision">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-stone-900">
                                    Decision
                                </label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.decision}
                                    onChange={(e) => setData('decision', e.target.value)}
                                >
                                    <option value="">Select decision</option>
                                    {decisionOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.decision ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.decision}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-stone-900">
                                    Review comments
                                </label>
                                <textarea
                                    className="mt-1 block min-h-40 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.comments}
                                    onChange={(e) => setData('comments', e.target.value)}
                                />
                                {errors.comments ? (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.comments}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
                            >
                                Save Decision
                            </button>
                        </form>
                    </Panel>

                    <Panel title="Decision History">
                        {submission.reviews.length === 0 ? (
                            <p className="text-sm text-stone-600">
                                No decision has been recorded yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {submission.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-stone-900">
                                                    {review.reviewer?.name ?? 'Reviewer'}
                                                </h4>
                                                <p className="mt-1 text-sm text-stone-600">
                                                    {review.reviewed_at ?? 'Review date not set'}
                                                </p>
                                            </div>
                                            <StatusBadge value={review.decision} />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-stone-700">
                                            {review.comments || 'No comments supplied.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>
                </section>
            </div>
        </ReviewerLayout>
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
