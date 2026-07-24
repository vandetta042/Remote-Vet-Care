import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({
    animal,
    species,
    breeds,
    ageGroups,
    genders,
    vaccinationStatuses,
    mode,
}) {
    const isEdit = mode === 'edit';
    const { data, setData, post, processing, errors, patch } = useForm({
        name: animal?.name ?? '',
        species_id: animal?.species_id ?? '',
        breed_id: animal?.breed_id ?? '',
        age: animal?.age ?? '',
        age_group: animal?.age_group ?? '',
        gender: animal?.gender ?? '',
        weight: animal?.weight ?? '',
        color: animal?.color ?? '',
        vaccination_status: animal?.vaccination_status ?? '',
        medical_history: animal?.medical_history ?? '',
        location: animal?.location ?? '',
    });

    const filteredBreeds = breeds.filter(
        (breed) => String(breed.species_id) === String(data.species_id),
    );

    const submit = (e) => {
        e.preventDefault();

        const action = isEdit
            ? () => patch(route('owner.animals.update', animal.id))
            : () => post(route('owner.animals.store'));

        action();
    };

    return (
        <OwnerLayout
            title={isEdit ? 'Edit Animal' : 'Add Animal'}
            subtitle={
                isEdit
                    ? 'Update the animal profile so future care requests stay accurate.'
                    : 'Create a simple profile for the animal you want to monitor.'
            }
        >
            <Head title={isEdit ? 'Edit Animal' : 'Add Animal'} />

            <div className="mb-6 flex justify-end">
                <Link
                    href={route('owner.animals.index')}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                    Back to My Animals
                </Link>
            </div>

            <form
                onSubmit={submit}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Animal Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="species_id" value="Species" />
                        <select
                            id="species_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.species_id}
                            onChange={(e) => {
                                setData('species_id', e.target.value);
                                setData('breed_id', '');
                            }}
                        >
                            <option value="">Select species</option>
                            {species.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.species_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="breed_id" value="Breed" />
                        <select
                            id="breed_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.breed_id}
                            onChange={(e) => setData('breed_id', e.target.value)}
                        >
                            <option value="">Select breed</option>
                            {filteredBreeds.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.breed_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="age" value="Age" />
                        <TextInput
                            id="age"
                            className="mt-1 block w-full"
                            value={data.age}
                            onChange={(e) => setData('age', e.target.value)}
                            placeholder="e.g. 2 years"
                        />
                        <InputError className="mt-2" message={errors.age} />
                    </div>

                    <div>
                        <InputLabel htmlFor="age_group" value="Age Group" />
                        <select
                            id="age_group"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.age_group}
                            onChange={(e) => setData('age_group', e.target.value)}
                        >
                            <option value="">Select age group</option>
                            {ageGroups.map((item) => (
                                <option key={item} value={item}>
                                    {item.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.age_group} />
                    </div>

                    <div>
                        <InputLabel htmlFor="gender" value="Gender" />
                        <select
                            id="gender"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="">Select gender</option>
                            {genders.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.gender} />
                    </div>

                    <div>
                        <InputLabel htmlFor="weight" value="Weight (kg)" />
                        <TextInput
                            id="weight"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.weight}
                            onChange={(e) => setData('weight', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.weight} />
                    </div>

                    <div>
                        <InputLabel htmlFor="color" value="Color" />
                        <TextInput
                            id="color"
                            className="mt-1 block w-full"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.color} />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="vaccination_status"
                            value="Vaccination Status"
                        />
                        <select
                            id="vaccination_status"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.vaccination_status}
                            onChange={(e) =>
                                setData('vaccination_status', e.target.value)
                            }
                        >
                            <option value="">Select vaccination status</option>
                            {vaccinationStatuses.map((item) => (
                                <option key={item} value={item}>
                                    {item.replaceAll('_', ' ')}
                                </option>
                            ))}
                        </select>
                        <InputError
                            className="mt-2"
                            message={errors.vaccination_status}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="location" value="Location" />
                        <TextInput
                            id="location"
                            className="mt-1 block w-full"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.location} />
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel
                            htmlFor="medical_history"
                            value="Medical History"
                        />
                        <textarea
                            id="medical_history"
                            className="mt-1 block min-h-36 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.medical_history}
                            onChange={(e) =>
                                setData('medical_history', e.target.value)
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={errors.medical_history}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <PrimaryButton disabled={processing}>
                        {isEdit ? 'Save Changes' : 'Create Animal'}
                    </PrimaryButton>
                </div>
            </form>
        </OwnerLayout>
    );
}
