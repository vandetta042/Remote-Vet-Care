import InputError from '@/Components/InputError';
import StatusBadge from '@/Components/StatusBadge';
import VetLayout from '@/Layouts/VetLayout';
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
        <VetLayout
            title="Review Request"
            subtitle="Check the owner report, compare the possible cause, and enter your clinical response."
        >
            <Head title="Review Request" />

            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Care Request
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            {veterinaryCase.title}
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                            {veterinaryCase.animal?.name}
                            {' - '}
                            {veterinaryCase.animal?.species?.name}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <StatusBadge value={veterinaryCase.status} />
                            <StatusBadge value={veterinaryCase.urgency_level} />
                        </div>
                    </div>

                    <Panel title="Animal Profile">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Info label="Owner" value={veterinaryCase.owner?.name ?? 'Unknown'} />
                            <Info label="Owner Email" value={veterinaryCase.owner?.email ?? 'Not available'} />
                            <Info label="Phone" value={veterinaryCase.owner?.phone ?? 'Not available'} />
                            <Info label="Address" value={veterinaryCase.owner?.address ?? 'Not available'} />
                            <Info label="Breed" value={veterinaryCase.animal?.breed?.name ?? 'Not specified'} />
                            <Info label="Age" value={veterinaryCase.animal?.age ?? 'Not specified'} />
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

                    <Panel title="Owner Complaint">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Info label="How long it has been happening" value={veterinaryCase.duration ?? 'Not specified'} />
                            <Info label="Where the animal is" value={veterinaryCase.location ?? 'Not specified'} />
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-sm leading-6 text-stone-700">
                                {veterinaryCase.description}
                            </p>
                        </div>
                    </Panel>

                    <Panel title="Possible Cause Suggested by System">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
                                Summary
                            </p>
                            <p className="mt-2 text-sm leading-6 text-amber-900">
                                {veterinaryCase.system_suggestion_summary || 'No possible cause was generated yet.'}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-stone-700">
                                {veterinaryCase.system_explanation || 'The full explanation will appear here once the case is processed.'}
                            </p>
                        </div>
                        <div className="mt-4 space-y-4">
                            {veterinaryCase.system_matches.length === 0 ? (
                                <p className="text-sm text-stone-600">
                                    No rule-based matches were stored for this request.
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

                    <Panel title="Signs, Risk Factors, and Files">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                    Signs noticed
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {veterinaryCase.symptoms.length === 0 ? (
                                        <span className="text-sm text-stone-600">
                                            No signs were selected.
                                        </span>
                                    ) : (
                                        veterinaryCase.symptoms.map((item) => (
                                            <span
                                                key={item.id}
                                                className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                            >
                                                {item.name} ({item.severity_level})
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                    Risk factors
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
                                    Uploaded files
                                </p>
                                <div className="mt-3 space-y-3">
                                    {veterinaryCase.attachment_urls.length === 0 ? (
                                        <p className="text-sm text-stone-600">
                                            No files were uploaded.
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
                    <Panel title="Vet Response">
                        <form onSubmit={submit} className="space-y-4">
                            <Field label="Assigned Vet" error={errors.assigned_vet_id}>
                                <select
                                    className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
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

                            <Field label="Status update" error={errors.status}>
                                <select
                                    className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status.replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Vet's diagnosis" error={errors.vet_diagnosis}>
                                <textarea
                                    className="mt-1 block min-h-36 w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                                    value={data.vet_diagnosis}
                                    onChange={(e) => setData('vet_diagnosis', e.target.value)}
                                />
                            </Field>

                            <Field label="Vet's advice" error={errors.vet_advice}>
                                <textarea
                                    className="mt-1 block min-h-36 w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                                    value={data.vet_advice}
                                    onChange={(e) => setData('vet_advice', e.target.value)}
                                />
                            </Field>

                            <Field label="Check again on" error={errors.follow_up_date}>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                                    value={data.follow_up_date}
                                    onChange={(e) => setData('follow_up_date', e.target.value)}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
                            >
                                Save Vet Response
                            </button>
                        </form>
                    </Panel>

                    <Panel title="Current Response">
                        <Info label="Assigned Vet" value={veterinaryCase.assigned_vet?.name ?? 'Not assigned'} />
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Diagnosis
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_diagnosis || 'No diagnosis recorded yet.'}
                            </p>
                        </div>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Advice
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_advice || 'No advice recorded yet.'}
                            </p>
                        </div>
                    </Panel>

                    <div className="flex justify-end">
                        <Link
                            href={route('vet.cases.index')}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                            Back to Care Requests
                        </Link>
                    </div>
                </section>
            </div>
        </VetLayout>
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
