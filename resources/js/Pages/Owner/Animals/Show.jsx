import StatusBadge from '@/Components/StatusBadge';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ animal, recentCases }) {
    return (
        <OwnerLayout
            title={animal.name}
            subtitle="Review the animal profile and jump into a new care request if something looks wrong."
        >
            <Head title={animal.name} />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Animal Profile
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                        {animal.name}
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        {animal.species?.name}
                        {animal.breed ? ` - ${animal.breed.name}` : ''}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Info label="Age" value={animal.age ?? 'Not specified'} />
                        <Info label="Age Group" value={animal.age_group ?? 'Not specified'} />
                        <Info label="Gender" value={animal.gender ?? 'Not specified'} />
                        <Info label="Weight" value={animal.weight ? `${animal.weight} kg` : 'Not specified'} />
                        <Info label="Color" value={animal.color ?? 'Not specified'} />
                        <Info label="Vaccination" value={animal.vaccination_status ?? 'Not specified'} />
                        <Info label="Location" value={animal.location ?? 'Not specified'} />
                    </div>

                    <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                            Medical History
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-700">
                            {animal.medical_history || 'No medical history provided yet.'}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Recent Care Requests
                        </h3>
                        <Link
                            href={route('owner.cases.create')}
                            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                        >
                            Report a Sick Animal
                        </Link>
                    </div>
                    <div className="mt-5 space-y-4">
                        {recentCases.length === 0 ? (
                            <p className="text-sm leading-6 text-stone-600">
                                No care requests have been submitted for this animal yet.
                            </p>
                        ) : (
                            recentCases.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('owner.cases.show', item.id)}
                                    className="block rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-900 hover:bg-white"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h4 className="text-lg font-semibold text-stone-900">
                                            {item.title}
                                        </h4>
                                        <StatusBadge value={item.urgency_level} />
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
                                        <StatusBadge value={item.status} />
                                        <span>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </OwnerLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {label}
            </p>
            <p className="mt-2 text-sm text-stone-700">{value}</p>
        </div>
    );
}
