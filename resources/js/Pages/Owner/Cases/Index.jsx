import EmptyState from '@/Components/EmptyState';
import AnimalIllustration from '@/Components/AnimalIllustration';
import StatusBadge from '@/Components/StatusBadge';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { Head, Link } from '@inertiajs/react';

function seriousnessLabel(value) {
    switch (value) {
        case 'emergency':
            return 'Emergency';
        case 'high':
            return 'Very serious';
        case 'medium':
            return 'Needs attention';
        default:
            return 'Mild';
    }
}

export default function Index({ cases }) {
    return (
        <OwnerLayout
            title="My Care Requests"
            subtitle="See every report, what it looked like, and any reply from the vet."
        >
            <Head title="My Care Requests" />

            <div className="space-y-6">
                <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Care Requests
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold text-stone-900">
                            Keep track of every report in one place
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                            Read the vet's reply, review the possible health conditions, and
                            check what happens next for each animal.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={route('owner.cases.create')}
                                className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                            >
                                Report a Sick Animal
                            </Link>
                            <Link
                                href={route('owner.animals.index')}
                                className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                            >
                                View My Animals
                            </Link>
                        </div>
                    </div>

                    {/* <AnimalIllustration
                        species="Care Requests"
                        title="Your animal care timeline"
                        subtitle="Friendly updates, clear advice, and easy-to-read statuses help you stay calm while waiting."
                        imageSrc="/images/remote-vet/pets-group.png"
                    /> */}
                </section>

                {cases.length === 0 ? (
                    <EmptyState
                        title="No care requests yet"
                        description="If one of your animals looks unwell, start with Report a Sick Animal and add the signs you noticed."
                        actionLabel="Report a Sick Animal"
                        actionHref={route('owner.cases.create')}
                        illustration={
                            <AnimalIllustration
                                species="No requests yet"
                                title="Your animals are doing great!"
                                subtitle="When a care request is needed, it will appear here with the vet's response and next steps."
                                imageSrc="/images/remote-vet/pets-closeup.png"
                            />
                        }
                    />
                ) : (
                    <div className="grid gap-4">
                        {cases.map((item) => (
                            <Link
                                key={item.id}
                                href={route('owner.cases.show', item.id)}
                                className="block rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-900"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StatusBadge value={item.status} />
                                            <StatusBadge value={item.urgency_level} />
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                                {item.animal?.name ?? 'Animal'}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-stone-600">
                                                {item.animal?.species?.name ?? 'Unknown species'}
                                                {' - '}
                                                {item.description?.slice(0, 120) ?? 'No details yet.'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                {item.animal?.name ?? 'Animal'}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                {item.animal?.species?.name ?? 'Species'}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                How Serious It Looks: {seriousnessLabel(item.urgency_level)}
                                            </span>
                                            <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                                                Signs: {item.symptoms?.length ? item.symptoms.slice(0, 3).map((symptom) => symptom.name).join(', ') : 'Not listed'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700 lg:min-w-72">
                                        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                            What happens next
                                        </p>
                                        <p>{seriousnessLabel(item.urgency_level)} care request.</p>
                                        <p>Vet status: {item.status?.replaceAll('_', ' ')}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}

