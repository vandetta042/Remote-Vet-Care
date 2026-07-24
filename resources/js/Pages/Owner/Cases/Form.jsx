import Checkbox from '@/Components/Checkbox';
import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import OwnerLayout from '@/Layouts/OwnerLayout';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

function stepLabel(step, title) {
    return `${step}. ${title}`;
}

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

    if (animals.length === 0) {
        return (
            <OwnerLayout
                title="Report a Sick Animal"
                subtitle="Start by creating an animal profile so the care request can be linked to the right animal."
            >
                <Head title="Report a Sick Animal" />
                <EmptyState
                    title="Create an animal profile first"
                    description="We need an animal profile before a care request can be sent."
                    actionLabel="Add Animal"
                    actionHref={route('owner.animals.create')}
                />
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout
            title="Report a Sick Animal"
            subtitle="Use these steps to send a simple care request for one of your animals."
        >
            <Head title="Report a Sick Animal" />

            <form onSubmit={submit} className="space-y-6">
                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <StepHeading step={1} title="Choose animal" />
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Pick the animal that needs help.
                    </p>
                    <div className="mt-4">
                        <InputLabel htmlFor="animal_id" value="Animal" />
                        <select
                            id="animal_id"
                            className="mt-1 block w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
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
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <StepHeading step={2} title="Select signs noticed" />
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Choose every sign that matches what you observed.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {symptoms.map((symptom) => (
                            <label
                                key={symptom.id}
                                className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
                            >
                                <Checkbox
                                    checked={data.symptom_ids.includes(symptom.id)}
                                    onChange={() => toggleValue('symptom_ids', symptom.id)}
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-stone-900">
                                        {symptom.name}
                                    </span>
                                    <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-stone-500">
                                        {symptom.severity_level}
                                        {symptom.body_system
                                            ? ` - ${symptom.body_system}`
                                            : ''}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                    <InputError className="mt-3" message={errors.symptom_ids} />
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <StepHeading step={3} title="Add details" />
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Tell the vet when the problem started and anything else you noticed.
                    </p>

                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="title" value="Care Request Title" />
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
                            <InputLabel htmlFor="duration" value="How long it has been happening" />
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
                            <InputLabel htmlFor="location" value="Where the animal is" />
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
                            <InputLabel htmlFor="description" value="What you noticed" />
                            <textarea
                                id="description"
                                className="mt-1 block min-h-40 w-full rounded-xl border-stone-300 shadow-sm focus:border-stone-900 focus:ring-stone-900"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the signs, feeding changes, behavior changes, and anything else that might help the vet."
                            />
                            <InputError className="mt-2" message={errors.description} />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <StepHeading step={4} title="Upload optional photo or document" />
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Add a photo, scan, or document if it will help the vet understand the problem.
                    </p>
                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="mt-4 block w-full text-sm text-stone-600"
                        onChange={(e) => setData('attachments', Array.from(e.target.files))}
                    />
                    <InputError className="mt-2" message={errors.attachments} />
                    <InputError className="mt-2" message={errors['attachments.0']} />
                    {progress ? (
                        <p className="mt-3 text-sm text-stone-600">
                            Uploading: {progress.percentage}%
                        </p>
                    ) : null}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                        <StepHeading step={5} title="Review and submit" />
                        <p className="mt-2 text-sm leading-6 text-amber-900">
                            Check the summary before sending. After you submit,
                            the system will suggest a possible cause, how serious
                            it looks, and a safety note for the vet to review.
                        </p>

                        <div className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
                            <ReviewLine label="Animal" value={animals.find((animal) => String(animal.id) === String(data.animal_id))?.name ?? 'Not selected'} />
                            <ReviewLine label="Signs noticed" value={data.symptom_ids.length > 0 ? `${data.symptom_ids.length} selected` : 'None selected'} />
                            <ReviewLine label="Details" value={data.title || 'No title yet'} />
                            <ReviewLine label="Attachments" value={data.attachments.length > 0 ? `${data.attachments.length} file(s) ready` : 'No file attached'} />
                        </div>

                        <div className="mt-5 rounded-2xl bg-white/80 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                Safety Note
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                This is a system-generated suggestion and should not replace a veterinarian's professional diagnosis.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Signs You Selected
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {data.symptom_ids.length === 0 ? (
                                <span className="text-sm text-stone-600">No signs selected yet.</span>
                            ) : (
                                symptoms
                                    .filter((symptom) => data.symptom_ids.includes(symptom.id))
                                    .map((symptom) => (
                                        <span
                                            key={symptom.id}
                                            className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                        >
                                            {symptom.name}
                                        </span>
                                    ))
                            )}
                        </div>

                        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-stone-500">
                            Risk Factors
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {riskFactors.map((riskFactor) => (
                                <label
                                    key={riskFactor.id}
                                    className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2"
                                >
                                    <Checkbox
                                        checked={data.risk_factor_ids.includes(riskFactor.id)}
                                        onChange={() => toggleValue('risk_factor_ids', riskFactor.id)}
                                    />
                                    <span className="text-sm font-medium text-stone-700">
                                        {riskFactor.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <InputError className="mt-3" message={errors.risk_factor_ids} />
                    </div>
                </section>

                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={route('owner.cases.index')}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        Back to My Care Requests
                    </Link>
                    <PrimaryButton disabled={processing}>
                        Send Care Request
                    </PrimaryButton>
                </div>
            </form>
        </OwnerLayout>
    );
}

function StepHeading({ step, title }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                {step}
            </span>
            <h2 className="text-xl font-semibold text-stone-900">
                {stepLabel(step, title)}
            </h2>
        </div>
    );
}

function ReviewLine({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-white p-4">
            <span className="text-sm font-semibold text-stone-900">{label}</span>
            <span className="text-right text-sm text-stone-700">{value}</span>
        </div>
    );
}
