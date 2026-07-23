import PortalLayout from '@/Layouts/PortalLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Show({ submission, defaults }) {
    const { data, setData, post, processing, errors } = useForm({
        ...defaults,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('curator.published-rules.publish', submission.id));
    };

    return (
        <PortalLayout
            title="Publish Rule Set"
            header={
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Curator Workflow
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        Publish Rule Set
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Structure this approved submission into disease and rule records that the diagnosis engine can use immediately.
                    </p>
                </div>
            }
        >
            <Head title="Publish Rule Set" />

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <section className="space-y-6">
                    <Panel title="Approved Submission">
                        <p className="text-sm leading-6 text-stone-700">
                            {submission.summary}
                        </p>
                        <div className="mt-4 space-y-3">
                            {submission.symptoms.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                >
                                    <p className="text-sm font-semibold text-stone-900">
                                        {item.symptom_name}
                                    </p>
                                    <p className="mt-1 text-sm text-stone-600">
                                        Weight {item.symptom_weight}
                                        {item.severity_level ? ` • ${item.severity_level}` : ''}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {submission.risk_factors.length > 0 ? (
                            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
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
                    </Panel>
                </section>

                <section>
                    <form
                        onSubmit={submit}
                        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                    >
                        <h3 className="text-xl font-semibold text-stone-900">
                            Publication Settings
                        </h3>
                        <div className="mt-6 grid gap-4">
                            <Field label="Disease Name" error={errors.name}>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </Field>
                            <Field label="Description" error={errors.description}>
                                <textarea
                                    className="mt-1 block min-h-28 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </Field>
                            <Field label="Severity Level" error={errors.severity_level}>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.severity_level}
                                    onChange={(e) => setData('severity_level', e.target.value)}
                                >
                                    {['mild', 'moderate', 'severe', 'emergency'].map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Transmission Mode" error={errors.transmission_mode}>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.transmission_mode}
                                    onChange={(e) => setData('transmission_mode', e.target.value)}
                                />
                            </Field>
                            <Field label="General Care Advice" error={errors.general_care_advice}>
                                <textarea
                                    className="mt-1 block min-h-28 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.general_care_advice}
                                    onChange={(e) => setData('general_care_advice', e.target.value)}
                                />
                            </Field>
                            <Field label="Version Number" error={errors.version_number}>
                                <input
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.version_number}
                                    onChange={(e) => setData('version_number', e.target.value)}
                                />
                            </Field>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={data.requires_vet_attention}
                                        onChange={(e) => setData('requires_vet_attention', e.target.checked)}
                                    />
                                    Requires vet attention
                                </label>
                                <label className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={data.requires_lab_test}
                                        onChange={(e) => setData('requires_lab_test', e.target.checked)}
                                    />
                                    Requires lab test
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
                        >
                            Publish Rule Set
                        </button>
                    </form>
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
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
