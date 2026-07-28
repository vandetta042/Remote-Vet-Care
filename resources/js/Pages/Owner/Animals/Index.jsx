import EmptyState from '@/Components/EmptyState';
import AnimalIllustration from '@/Components/AnimalIllustration';
import SecondaryButton from '@/Components/SecondaryButton';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ animals }) {
    return (
        <OwnerLayout
            title="My Animals"
            subtitle="Keep animal profiles up to date before sending a care request."
        >
            <Head title="My Animals" />

            <section className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Animal Profiles
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-stone-900">
                        Keep every animal ready for care
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                        Add each animal here so it is easy to report signs, share details,
                        and follow up with the veterinarian when needed.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={route('owner.animals.create')}>
                            <SecondaryButton>Add Animal</SecondaryButton>
                        </Link>
                        <Link
                            href={route('owner.cases.create')}
                            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                        >
                            Report a Sick Animal
                        </Link>
                    </div>
                </div>

                {/* <AnimalIllustration
                    species="Pets and Livestock"
                    title="Healthy animals start here"
                    subtitle="A friendly profile for each animal helps the care request feel simpler and more personal."
                    imageSrc="/images/remote-vet/dogs-lineup.png"
                /> */}
            </section>

            {animals.length === 0 ? (
                <EmptyState
                    title="No animal profiles yet"
                    description="Create your first animal profile so you can submit veterinary care cases with the correct species, breed, history, and location."
                    actionLabel="Create Animal Profile"
                    actionHref={route('owner.animals.create')}
                    illustration={
                        <AnimalIllustration
                            species="Empty Profile"
                            title="Nothing to show yet"
                            subtitle="Once you add an animal, you will see its profile here with quick access to care requests."
                            imageSrc="/images/remote-vet/pets-group.png"
                        />
                    }
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {animals.map((animal) => (
                        <div
                            key={animal.id}
                            className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900"
                        >
                            <div className="h-44 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-stone-50">
                                {animal.profile_photo_url ? (
                                    <img
                                        src={animal.profile_photo_url}
                                        alt={animal.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-6 text-center">
                                        <div>
                                            <p className="text-sm font-semibold text-stone-900">
                                                No photo yet
                                            </p>
                                            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">
                                                Add one from the animal form
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 via-white to-stone-50 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                            {animal.species?.name ?? 'Unknown species'}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                                            {animal.name}
                                        </h3>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 ring-1 ring-stone-200">
                                        {animal.gender ?? 'Unspecified'}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <Info label="Breed" value={animal.breed?.name ?? 'Not specified'} />
                                    <Info label="Age" value={animal.age ?? animal.age_group ?? 'Not specified'} />
                                    <Info label="Weight" value={animal.weight ? `${animal.weight} kg` : 'Not specified'} />
                                    <Info label="Location" value={animal.location ?? 'Not specified'} />
                                </div>
                            </div>

                            <div className="space-y-3 p-5">
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                        Health profile ready
                                    </span>
                                    <span className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700">
                                        Last consultation: {animal.last_consultation_at ?? 'Not available'}
                                    </span>
                                    <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                                        Follow-up: {animal.upcoming_follow_up_at ?? 'Not scheduled'}
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                <Link
                                    href={route('owner.animals.show', animal.id)}
                                    className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                                >
                                    View
                                </Link>
                                <Link
                                    href={route('owner.animals.edit', animal.id)}
                                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                                >
                                    Edit
                                </Link>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </OwnerLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-stone-500">
                {label}
            </p>
            <p className="mt-2 text-sm font-medium text-stone-800">{value}</p>
        </div>
    );
}
