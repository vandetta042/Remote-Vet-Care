import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ veterinaryCase, disclaimer }) {
    return (
        <PortalLayout
            title={veterinaryCase.title}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Veterinary Case
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            {veterinaryCase.title}
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            {veterinaryCase.animal?.name}
                            {' - '}
                            {veterinaryCase.animal?.species?.name}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <StatusBadge value={veterinaryCase.status} />
                        <StatusBadge value={veterinaryCase.urgency_level} />
                    </div>
                </div>
            }
        >
            <Head title={veterinaryCase.title} />

            <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Case Summary
                        </h3>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <Info
                                label="Duration"
                                value={veterinaryCase.duration ?? 'Not specified'}
                            />
                            <Info
                                label="Location"
                                value={veterinaryCase.location ?? 'Not specified'}
                            />
                            <Info
                                label="Assigned Vet"
                                value={
                                    veterinaryCase.assigned_vet?.name ??
                                    'Not assigned yet'
                                }
                            />
                            <Info
                                label="Follow-up Date"
                                value={veterinaryCase.follow_up_date ?? 'Not set'}
                            />
                        </div>
                        <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Description
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
                            Preliminary Safety Notice
                        </p>
                        <p className="mt-3 text-sm leading-6 text-amber-900">
                            {disclaimer}
                        </p>
                        <div className="mt-5 rounded-2xl bg-white/80 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                System Explanation
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.system_explanation ||
                                    'System suggestion has not been generated yet.'}
                            </p>
                        </div>
                        <div className="mt-4 rounded-2xl bg-white/80 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                System Summary
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.system_suggestion_summary}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                            Veterinarian Response
                        </p>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <Info
                                label="Assigned Vet"
                                value={
                                    veterinaryCase.assigned_vet?.name ??
                                    'Not assigned yet'
                                }
                            />
                            <Info
                                label="Follow-up Date"
                                value={veterinaryCase.follow_up_date ?? 'Not set'}
                            />
                        </div>
                        <div className="mt-4 rounded-2xl bg-white/80 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Vet Diagnosis
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_diagnosis ||
                                    'A veterinarian has not recorded a diagnosis yet.'}
                            </p>
                        </div>
                        <div className="mt-4 rounded-2xl bg-white/80 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Vet Advice
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_advice ||
                                    'Veterinary care advice has not been added yet.'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <Panel title="Preliminary Matches">
                        {veterinaryCase.system_matches.length === 0 ? (
                            <p className="text-sm text-stone-600">
                                No published rule-based matches were found for
                                this case yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {veterinaryCase.system_matches.map((match) => (
                                    <div
                                        key={match.disease_id}
                                        className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="max-w-2xl">
                                                <h4 className="text-lg font-semibold text-stone-900">
                                                    {match.disease_name}
                                                </h4>
                                                <p className="mt-2 text-sm leading-6 text-stone-600">
                                                    {match.explanation}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-2xl font-semibold text-stone-900">
                                                    {match.score}%
                                                </p>
                                                <div className="mt-2">
                                                    <StatusBadge
                                                        value={match.severity}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            <Info
                                                label="Care Advice"
                                                value={
                                                    match.care_advice ||
                                                    'No care guidance stored for this rule.'
                                                }
                                            />
                                            <Info
                                                label="Lab Test"
                                                value={
                                                    match.requires_lab_test
                                                        ? 'Recommended'
                                                        : 'Not specifically required by this rule'
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Selected Symptoms">
                        {veterinaryCase.symptoms.length === 0 ? (
                            <p className="text-sm text-stone-600">
                                No symptoms linked to this case.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {veterinaryCase.symptoms.map((item) => (
                                    <span
                                        key={item.id}
                                        className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                    >
                                        {item.name} ({item.severity_level})
                                    </span>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Risk Factors">
                        {veterinaryCase.risk_factors.length === 0 ? (
                            <p className="text-sm text-stone-600">
                                No risk factors selected.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {veterinaryCase.risk_factors.map((item) => (
                                    <span
                                        key={item.id}
                                        className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                    >
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Attachments">
                        {veterinaryCase.attachment_urls.length === 0 ? (
                            <p className="text-sm text-stone-600">
                                No attachments uploaded for this case.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {veterinaryCase.attachment_urls.map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-900 hover:bg-white"
                                    >
                                        <p className="text-sm font-semibold text-stone-900">
                                            {item.original_name}
                                        </p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
                                            {item.file_type ?? 'attachment'}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <div className="flex justify-end">
                        <Link
                            href={route('owner.cases.index')}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                            Back to Cases
                        </Link>
                    </div>
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
