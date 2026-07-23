import EmptyState from '@/Components/EmptyState';
import SecondaryButton from '@/Components/SecondaryButton';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ animals }) {
    return (
        <PortalLayout
            title="My Animals"
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Animal Owner
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            My Animals
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            Keep animal profiles up to date before submitting remote care cases.
                        </p>
                    </div>
                    <Link href={route('owner.animals.create')}>
                        <SecondaryButton>Add Animal</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="My Animals" />

            {animals.length === 0 ? (
                <EmptyState
                    title="No animal profiles yet"
                    description="Create your first animal profile so you can submit veterinary care cases with the correct species, breed, history, and location."
                    actionLabel="Create Animal Profile"
                    actionHref={route('owner.animals.create')}
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {animals.map((animal) => (
                        <div
                            key={animal.id}
                            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                        >
                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                {animal.species?.name ?? 'Unknown species'}
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                                {animal.name}
                            </h3>
                            <div className="mt-4 space-y-2 text-sm text-stone-600">
                                <p>Breed: {animal.breed?.name ?? 'Not specified'}</p>
                                <p>Age group: {animal.age_group ?? 'Not specified'}</p>
                                <p>Gender: {animal.gender ?? 'Not specified'}</p>
                                <p>Location: {animal.location ?? 'Not specified'}</p>
                            </div>
                            <div className="mt-6 flex gap-3">
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
                    ))}
                </div>
            )}
        </PortalLayout>
    );
}
