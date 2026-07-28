import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ResearchLayout from '@/Layouts/ResearchLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function blankSymptom() {
    return {
        symptom_name: '',
        symptom_description: '',
        symptom_weight: 1,
        severity_level: '',
    };
}

function blankRiskFactor() {
    return {
        risk_factor_name: '',
        weight: 1,
    };
}

function blankSource() {
    return {
        source_title: '',
        source_author: '',
        source_year: '',
        source_url: '',
        source_type: '',
        notes: '',
    };
}

export default function Form({
    submission,
    species,
    sourceTypes,
    evidenceLevels,
    severityLevels,
    mode,
}) {
    const isEdit = mode === 'edit';
    const { data, setData, post, patch, processing, errors } = useForm({
        title: submission?.title ?? '',
        disease_name: submission?.disease_name ?? '',
        species_id: submission?.species_id ?? '',
        summary: submission?.summary ?? '',
        source_type: submission?.source_type ?? '',
        source_reference: submission?.source_reference ?? '',
        evidence_level: submission?.evidence_level ?? '',
        status:
            submission?.status && submission.status !== 'submitted'
                ? submission.status
                : 'draft',
        metadata: {
            affected_species_note: submission?.metadata?.affected_species_note ?? '',
            severity_note: submission?.metadata?.severity_note ?? '',
            care_advice: submission?.metadata?.care_advice ?? '',
            care_recommendations:
                submission?.metadata?.care_recommendations ??
                submission?.metadata?.care_advice ??
                '',
            care_urgency_level: submission?.metadata?.care_urgency_level ?? '',
        },
        symptoms:
            submission?.symptoms?.length > 0
                ? submission.symptoms.map((item) => ({
                      symptom_name: item.symptom_name ?? '',
                      symptom_description: item.symptom_description ?? '',
                      symptom_weight: item.symptom_weight ?? 1,
                      severity_level: item.severity_level ?? '',
                  }))
                : [blankSymptom()],
        risk_factors:
            submission?.risk_factors?.length > 0
                ? submission.risk_factors.map((item) => ({
                      risk_factor_name: item.risk_factor_name ?? '',
                      weight: item.weight ?? 1,
                  }))
                : [blankRiskFactor()],
        sources:
            submission?.sources?.length > 0
                ? submission.sources.map((item) => ({
                      source_title: item.source_title ?? '',
                      source_author: item.source_author ?? '',
                      source_year: item.source_year ?? '',
                      source_url: item.source_url ?? '',
                      source_type: item.source_type ?? '',
                      notes: item.notes ?? '',
                  }))
                : [blankSource()],
    });

    const updateArrayItem = (key, index, field, value) => {
        const next = [...data[key]];
        next[index] = { ...next[index], [field]: value };
        setData(key, next);
    };

    const addArrayItem = (key, factory) => {
        setData(key, [...data[key], factory()]);
    };

    const removeArrayItem = (key, index) => {
        if (data[key].length === 1) {
            setData(key, [
                key === 'symptoms'
                    ? blankSymptom()
                    : key === 'risk_factors'
                      ? blankRiskFactor()
                      : blankSource(),
            ]);
            return;
        }

        setData(
            key,
            data[key].filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route('researcher.knowledge-submissions.update', submission.id));
            return;
        }

        post(route('researcher.knowledge-submissions.store'));
    };

    return (
        <ResearchLayout
            title={isEdit ? 'Edit Knowledge Draft' : 'Create Knowledge Draft'}
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Researcher Workflow
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            {isEdit
                                ? 'Update knowledge draft'
                                : 'Create a knowledge draft'}
                        </h2>
                    </div>
                    <Link
                        href={route('researcher.knowledge-submissions.index')}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        Back to Drafts
                    </Link>
                </div>
            }
        >
            <Head title={isEdit ? 'Edit Knowledge Draft' : 'Create Knowledge Draft'} />

            <form
                onSubmit={submit}
                className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Draft Title" error={errors.title}>
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                    </Field>

                    <Field label="Disease Name" error={errors.disease_name}>
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.disease_name}
                            onChange={(e) => setData('disease_name', e.target.value)}
                        />
                    </Field>

                    <Field label="Species" error={errors.species_id}>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.species_id}
                            onChange={(e) => setData('species_id', e.target.value)}
                        >
                            <option value="">Select species</option>
                            {species.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Evidence Level" error={errors.evidence_level}>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.evidence_level}
                            onChange={(e) => setData('evidence_level', e.target.value)}
                        >
                            <option value="">Select evidence level</option>
                            {evidenceLevels.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Source Type" error={errors.source_type}>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.source_type}
                            onChange={(e) => setData('source_type', e.target.value)}
                        >
                            <option value="">Select source type</option>
                            {sourceTypes.map((item) => (
                                <option key={item} value={item}>
                                    {item.replaceAll('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Source Reference" error={errors.source_reference}>
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.source_reference}
                            onChange={(e) => setData('source_reference', e.target.value)}
                            placeholder="Citation or reference tag"
                        />
                    </Field>

                    <Field label="Draft Status" error={errors.status}>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="draft">draft</option>
                            <option value="correction_requested">correction_requested</option>
                        </select>
                    </Field>

                    <div className="md:col-span-2">
                        <Field label="Knowledge Summary" error={errors.summary}>
                            <textarea
                                className="mt-1 block min-h-40 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.summary}
                                onChange={(e) => setData('summary', e.target.value)}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Affected Species Note"
                        error={errors['metadata.affected_species_note']}
                    >
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.metadata.affected_species_note}
                            onChange={(e) =>
                                setData('metadata', {
                                    ...data.metadata,
                                    affected_species_note: e.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field
                        label="Severity Note"
                        error={errors['metadata.severity_note']}
                    >
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.metadata.severity_note}
                            onChange={(e) =>
                                setData('metadata', {
                                    ...data.metadata,
                                    severity_note: e.target.value,
                                })
                            }
                        />
                    </Field>

                    <div className="md:col-span-2">
                        <Field
                            label="General Care Advice"
                            error={errors['metadata.care_advice']}
                        >
                            <textarea
                                className="mt-1 block min-h-28 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.metadata.care_advice}
                                onChange={(e) =>
                                    setData('metadata', {
                                        ...data.metadata,
                                        care_advice: e.target.value,
                                    })
                                }
                            />
                        </Field>
                    </div>

                    <div className="md:col-span-2">
                        <Field
                            label="Care Recommendations"
                            error={errors['metadata.care_recommendations']}
                        >
                            <textarea
                                className="mt-1 block min-h-28 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.metadata.care_recommendations}
                                onChange={(e) =>
                                    setData('metadata', {
                                        ...data.metadata,
                                        care_recommendations: e.target.value,
                                    })
                                }
                                placeholder="Write one or more supportive care steps."
                            />
                        </Field>
                    </div>

                    <Field
                        label="Care Urgency"
                        error={errors['metadata.care_urgency_level']}
                    >
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.metadata.care_urgency_level}
                            onChange={(e) =>
                                setData('metadata', {
                                    ...data.metadata,
                                    care_urgency_level: e.target.value,
                                })
                            }
                        >
                            <option value="">Select urgency</option>
                            {['low', 'moderate', 'high', 'emergency'].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <DynamicSection
                    title="Signs"
                    description="Add weighted signs that support this knowledge draft."
                    onAdd={() => addArrayItem('symptoms', blankSymptom)}
                >
                    {data.symptoms.map((symptom, index) => (
                        <div
                            key={`symptom-${index}`}
                            className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-2"
                        >
                            <Field
                                label="Sign Name"
                                error={errors[`symptoms.${index}.symptom_name`]}
                            >
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={symptom.symptom_name}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'symptoms',
                                            index,
                                            'symptom_name',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Weight"
                                error={errors[`symptoms.${index}.symptom_weight`]}
                            >
                                <TextInput
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={symptom.symptom_weight}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'symptoms',
                                            index,
                                            'symptom_weight',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Severity"
                                error={errors[`symptoms.${index}.severity_level`]}
                            >
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={symptom.severity_level}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'symptoms',
                                            index,
                                            'severity_level',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Select severity</option>
                                    {severityLevels.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <div className="md:col-span-2">
                                <Field
                                    label="Sign Description"
                                    error={errors[`symptoms.${index}.symptom_description`]}
                                >
                                    <textarea
                                        className="mt-1 block min-h-24 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={symptom.symptom_description}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                'symptoms',
                                                index,
                                                'symptom_description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    onClick={() => removeArrayItem('symptoms', index)}
                                >
                                    Remove sign
                                </button>
                            </div>
                        </div>
                    ))}
                </DynamicSection>

                <DynamicSection
                    title="Risk Factors"
                    description="Add environmental or exposure risks tied to this knowledge draft."
                    onAdd={() => addArrayItem('risk_factors', blankRiskFactor)}
                >
                    {data.risk_factors.map((riskFactor, index) => (
                        <div
                            key={`risk-factor-${index}`}
                            className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-2"
                        >
                            <Field
                                label="Risk Factor Name"
                                error={errors[`risk_factors.${index}.risk_factor_name`]}
                            >
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={riskFactor.risk_factor_name}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'risk_factors',
                                            index,
                                            'risk_factor_name',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Weight"
                                error={errors[`risk_factors.${index}.weight`]}
                            >
                                <TextInput
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={riskFactor.weight}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'risk_factors',
                                            index,
                                            'weight',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    onClick={() => removeArrayItem('risk_factors', index)}
                                >
                                    Remove risk factor
                                </button>
                            </div>
                        </div>
                    ))}
                </DynamicSection>

                <DynamicSection
                    title="Evidence Sources"
                    description="Track the evidence behind the draft. At least one source is required before submission for review."
                    onAdd={() => addArrayItem('sources', blankSource)}
                >
                    {data.sources.map((source, index) => (
                        <div
                            key={`source-${index}`}
                            className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-2"
                        >
                            <Field
                                label="Source Title"
                                error={errors[`sources.${index}.source_title`]}
                            >
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={source.source_title}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'sources',
                                            index,
                                            'source_title',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Source Author"
                                error={errors[`sources.${index}.source_author`]}
                            >
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={source.source_author}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'sources',
                                            index,
                                            'source_author',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Source Year"
                                error={errors[`sources.${index}.source_year`]}
                            >
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={source.source_year}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'sources',
                                            index,
                                            'source_year',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                label="Source Type"
                                error={errors[`sources.${index}.source_type`]}
                            >
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={source.source_type}
                                    onChange={(e) =>
                                        updateArrayItem(
                                            'sources',
                                            index,
                                            'source_type',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Select source type</option>
                                    {sourceTypes.map((item) => (
                                        <option key={item} value={item}>
                                            {item.replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <div className="md:col-span-2">
                                <Field
                                    label="Source URL"
                                    error={errors[`sources.${index}.source_url`]}
                                >
                                    <TextInput
                                        className="mt-1 block w-full"
                                        value={source.source_url}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                'sources',
                                                index,
                                                'source_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2">
                                <Field
                                    label="Notes"
                                    error={errors[`sources.${index}.notes`]}
                                >
                                    <textarea
                                        className="mt-1 block min-h-24 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={source.notes}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                'sources',
                                                index,
                                                'notes',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    onClick={() => removeArrayItem('sources', index)}
                                >
                                    Remove source
                                </button>
                            </div>
                        </div>
                    ))}
                </DynamicSection>

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>
                        {isEdit ? 'Save Draft' : 'Create Draft'}
                    </PrimaryButton>
                </div>
            </form>
        </ResearchLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <InputLabel value={label} />
            {children}
            <InputError className="mt-2" message={error} />
        </div>
    );
}

function DynamicSection({ title, description, onAdd, children }) {
    return (
        <section className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">{description}</p>
                </div>
                <button
                    type="button"
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    onClick={onAdd}
                >
                    Add row
                </button>
            </div>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}
