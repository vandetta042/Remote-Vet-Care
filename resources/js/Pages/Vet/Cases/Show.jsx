import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/StatusBadge';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ veterinaryCase, statusOptions, vetOptions }) {
    const { data, setData, patch, processing, errors } = useForm({
        assigned_vet_id: veterinaryCase.assigned_vet_id ?? '',
        vet_diagnosis: veterinaryCase.vet_diagnosis ?? '',
        vet_advice: veterinaryCase.vet_advice ?? '',
        follow_up_date: veterinaryCase.follow_up_date ?? '',
        status: veterinaryCase.status ?? 'submitted',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('vet.cases.update', veterinaryCase.id));
    };

    return (
        <PortalLayout
            title={veterinaryCase.title}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Veterinarian Workflow
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            Review Case
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            {veterinaryCase.animal?.name} {' • '}{veterinaryCase.animal?.species?.name}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <StatusBadge value={veterinaryCase.status} />
                        <StatusBadge value={veterinaryCase.urgency_level} />
                    </div>
                </div>
            }
        >
            <Head title="Review Case" />

            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <section className="space-y-6">
                    <Panel title="Owner and Animal Information">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Info label="Owner" value={veterinaryCase.owner?.name ?? 'Unknown'} />
                            <Info label="Owner Email" value={veterinaryCase.owner?.email ?? 'Not available'} />
                            <Info label="Phone" value={veterinaryCase.owner?.phone ?? 'Not available'} />
                            <Info label="Address" value={veterinaryCase.owner?.address ?? 'Not available'} />
                            <Info label="Breed" value={veterinaryCase.animal?.breed?.name ?? 'Not specified'} />
                            <Info label="Animal Age" value={veterinaryCase.animal?.age ?? 'Not specified'} />
                            <Info label="Gender" value={veterinaryCase.animal?.gender ?? 'Not specified'} />
                            <Info label="Weight" value={veterinaryCase.animal?.weight ? `${veterinaryCase.animal.weight} kg` : 'Not specified'} />
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Medical History
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.animal?.medical_history || 'No medical history provided.'}
                            </p>
                        </div>
                    </Panel>

                    <Panel title="Case Description">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Info label="Duration" value={veterinaryCase.duration ?? 'Not specified'} />
                            <Info label="Location" value={veterinaryCase.location ?? 'Not specified'} />
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-sm leading-6 text-stone-700">
                                {veterinaryCase.description}
                            </p>
                        </div>
                    </Panel>

                    <Panel title="System Suggestion">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
                                Preliminary system summary
                            </p>
                            <p className="mt-2 text-sm leading-6 text-amber-900">
                                {veterinaryCase.system_suggestion_summary}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-stone-700">
                                {veterinaryCase.system_explanation}
                            </p>
                        </div>
                        <div className="mt-4 space-y-4">
                            {veterinaryCase.system_matches.length === 0 ? (
                                <p className="text-sm text-stone-600">
                                    No system matches were stored for this case.
                                </p>
                            ) : (
                                veterinaryCase.system_matches.map((match) => (
                                    <div
                                        key={match.disease_id}
                                        className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
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
                                                    <StatusBadge value={match.severity} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Panel>

                    <Panel title="Symptoms, Risk Factors, and Attachments">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                    Symptoms
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {veterinaryCase.symptoms.map((item) => (
                                        <span
                                            key={item.id}
                                            className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                        >
                                            {item.name} ({item.severity_level})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                    Risk Factors
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {veterinaryCase.risk_factors.length === 0 ? (
                                        <span className="text-sm text-stone-600">
                                            No risk factors selected.
                                        </span>
                                    ) : (
                                        veterinaryCase.risk_factors.map((item) => (
                                            <span
                                                key={item.id}
                                                className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                            >
                                                {item.name}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                    Attachments
                                </p>
                                <div className="mt-3 space-y-3">
                                    {veterinaryCase.attachment_urls.length === 0 ? (
                                        <p className="text-sm text-stone-600">
                                            No attachments uploaded for this case.
                                        </p>
                                    ) : (
                                        veterinaryCase.attachment_urls.map((item) => (
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
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </Panel>
                </section>

                <section className="space-y-6">
                    <Panel title="Veterinary Response">
                        <form onSubmit={submit} className="space-y-4">
                            <Field label="Assigned Vet" error={errors.assigned_vet_id}>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.assigned_vet_id}
                                    onChange={(e) => setData('assigned_vet_id', e.target.value)}
                                >
                                    <option value="">Assign to me on save</option>
                                    {vetOptions.map((vet) => (
                                        <option key={vet.id} value={vet.id}>
                                            {vet.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Case Status" error={errors.status}>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Veterinary Diagnosis" error={errors.vet_diagnosis}>
                                <textarea
                                    className="mt-1 block min-h-40 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.vet_diagnosis}
                                    onChange={(e) => setData('vet_diagnosis', e.target.value)}
                                />
                            </Field>

                            <Field label="Veterinary Advice" error={errors.vet_advice}>
                                <textarea
                                    className="mt-1 block min-h-40 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.vet_advice}
                                    onChange={(e) => setData('vet_advice', e.target.value)}
                                />
                            </Field>

                            <Field label="Follow-up Date" error={errors.follow_up_date}>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.follow_up_date}
                                    onChange={(e) => setData('follow_up_date', e.target.value)}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
                            >
                                Save Veterinary Response
                            </button>
                        </form>
                    </Panel>

                    <Panel title="Current Response Snapshot">
                        <Info label="Assigned Vet" value={veterinaryCase.assigned_vet?.name ?? 'Not assigned'} />
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Current Diagnosis
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_diagnosis || 'No veterinary diagnosis recorded yet.'}
                            </p>
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Current Advice
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_advice || 'No veterinary advice recorded yet.'}
                            </p>
                        </div>
                    </Panel>

                    <div className="flex justify-end">
                        <Link
                            href={route('vet.cases.index')}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                            Back to Case Queue
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

function Field({ label, error, children }) {
    return (
        <div>
            <label className="text-sm font-semibold text-stone-900">{label}</label>
            {children}
            <InputError className="mt-2" message={error} />
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
