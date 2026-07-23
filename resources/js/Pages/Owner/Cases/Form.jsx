import Checkbox from '@/Components/Checkbox';
import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import PortalLayout from '@/Layouts/PortalLayout';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ animals, symptoms, riskFactors }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        animal_id: '',
        title: '',
        description: '',
        duration: '',
        location: '',
        symptom_ids: [],
        risk_factor_ids: [],
        attachments: [],
    });

    if (animals.length === 0) {
        return (
            <PortalLayout title="Submit Case">
                <Head title="Submit Case" />
                <EmptyState
                    title="Create an animal profile first"
                    description="A veterinary case must be attached to one of your animals. Add an animal profile before submitting symptoms and case details."
                    actionLabel="Add Animal"
                    actionHref={route('owner.animals.create')}
                />
            </PortalLayout>
        );
    }

    const toggleValue = (key, value) => {
        const collection = data[key];

        if (collection.includes(value)) {
            setData(
                key,
                collection.filter((item) => item !== value),
            );
            return;
        }

        setData(key, [...collection, value]);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('owner.cases.store'));
    };

    return (
        <PortalLayout
            title="Submit New Case"
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Remote Veterinary Care
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            Submit a new case
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                            Share the animal, symptoms, risk factors, case description, and optional attachments. A system suggestion will be integrated in Phase 4.
                        </p>
                    </div>
                    <Link
                        href={route('owner.cases.index')}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        Back to Cases
                    </Link>
                </div>
            }
        >
            <Head title="Submit New Case" />

            <form
                onSubmit={submit}
                className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="animal_id" value="Animal" />
                        <select
                            id="animal_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.animal_id}
                            onChange={(e) => setData('animal_id', e.target.value)}
                        >
                            <option value="">Select animal</option>
                            {animals.map((animal) => (
                                <option key={animal.id} value={animal.id}>
                                    {animal.name} ({animal.species?.name ?? 'Unknown species'})
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.animal_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Case Title" />
                        <TextInput
                            id="title"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Sudden vomiting and weakness"
                        />
                        <InputError className="mt-2" message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="duration" value="Duration" />
                        <TextInput
                            id="duration"
                            className="mt-1 block w-full"
                            value={data.duration}
                            onChange={(e) => setData('duration', e.target.value)}
                            placeholder="e.g. 2 days"
                        />
                        <InputError className="mt-2" message={errors.duration} />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Case Location" />
                        <TextInput
                            id="location"
                            className="mt-1 block w-full"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="Farm, home, or community"
                        />
                        <InputError className="mt-2" message={errors.location} />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="description" value="Case Description" />
                        <textarea
                            id="description"
                            className="mt-1 block min-h-40 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe when the signs started, how serious they are, feeding changes, behavior changes, and anything you observed."
                        />
                        <InputError
                            className="mt-2"
                            message={errors.description}
                        />
                    </div>
                </div>

                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <h3 className="text-lg font-semibold text-stone-900">
                        Select Symptoms
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">
                        Choose all symptoms that best match the animal&apos;s condition.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {symptoms.map((symptom) => (
                            <label
                                key={symptom.id}
                                className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                            >
                                <Checkbox
                                    checked={data.symptom_ids.includes(symptom.id)}
                                    onChange={() =>
                                        toggleValue('symptom_ids', symptom.id)
                                    }
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-stone-900">
                                        {symptom.name}
                                    </span>
                                    <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-stone-500">
                                        {symptom.severity_level}
                                        {symptom.body_system
                                            ? ` • ${symptom.body_system}`
                                            : ''}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                    <InputError className="mt-3" message={errors.symptom_ids} />
                </section>

                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <h3 className="text-lg font-semibold text-stone-900">
                        Risk Factors
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">
                        Add any known environmental or exposure risks.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {riskFactors.map((riskFactor) => (
                            <label
                                key={riskFactor.id}
                                className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                            >
                                <Checkbox
                                    checked={data.risk_factor_ids.includes(
                                        riskFactor.id,
                                    )}
                                    onChange={() =>
                                        toggleValue(
                                            'risk_factor_ids',
                                            riskFactor.id,
                                        )
                                    }
                                />
                                <span className="text-sm font-semibold text-stone-900">
                                    {riskFactor.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <h3 className="text-lg font-semibold text-stone-900">
                        Optional Attachments
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">
                        Upload up to 5 image or document files to support the case.
                    </p>
                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="mt-4 block w-full text-sm text-stone-600"
                        onChange={(e) =>
                            setData('attachments', Array.from(e.target.files))
                        }
                    />
                    <InputError className="mt-2" message={errors.attachments} />
                    <InputError
                        className="mt-2"
                        message={errors['attachments.0']}
                    />
                    {progress ? (
                        <p className="mt-3 text-sm text-stone-600">
                            Uploading: {progress.percentage}%
                        </p>
                    ) : null}
                </section>

                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm leading-6 text-amber-900">
                        This case will be saved now, but the rule-based diagnosis engine is scheduled for Phase 4. For this phase, the system explanation will clearly state that diagnosis processing is pending integration.
                    </p>
                </div>

                <div className="flex justify-end">
                    <PrimaryButton disabled={processing}>
                        Submit Case
                    </PrimaryButton>
                </div>
            </form>
        </PortalLayout>
    );
}
