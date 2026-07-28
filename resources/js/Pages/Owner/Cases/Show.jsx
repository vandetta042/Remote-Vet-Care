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
            return 'High';
        case 'medium':
            return 'Moderate';
        default:
            return 'Low';
    }
}

function urgencyTone(value) {
    switch (value) {
        case 'emergency':
            return 'bg-red-50 text-red-700 ring-red-200';
        case 'high':
            return 'bg-orange-50 text-orange-700 ring-orange-200';
        case 'medium':
            return 'bg-amber-50 text-amber-700 ring-amber-200';
        default:
            return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }
}

function normalizeRecommendations(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => {
            if (typeof item === 'string') {
                return { recommendation: item, priority: 'supportive' };
            }

            return item;
        })
        .filter((item) => Boolean(item?.recommendation));
}

export default function Show({ veterinaryCase, diagnosis, disclaimer }) {
    const possibleConditions = diagnosis?.possible_conditions ?? veterinaryCase.system_matches ?? [];
    const careRecommendations = normalizeRecommendations(
        diagnosis?.care_recommendations ?? [],
    );
    const warnings = Array.isArray(diagnosis?.warnings) ? diagnosis.warnings : [];
    const urgencyLevel = diagnosis?.urgency_level ?? veterinaryCase.urgency_level;
    const urgencyLabel = diagnosis?.urgency_label ?? seriousnessLabel(urgencyLevel).toUpperCase();

    return (
        <OwnerLayout
            title={veterinaryCase.title}
            subtitle="Read the possible cause, see how serious it looks, and review the vet's advice in one place."
        >
            <Head title={veterinaryCase.title} />

            <section className="mb-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        Care Request Review
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-stone-900">
                        We have your request in view
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                        Here you can see the possible health conditions, what you can do
                        now, and the veterinarian's advice in one friendly place.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <StatusBadge value={urgencyLevel} />
                        <StatusBadge value={veterinaryCase.status} />
                    </div>
                </div>

                {/* <AnimalIllustration
                    species={veterinaryCase.animal?.species?.name ?? 'Animal'}
                    title={`${veterinaryCase.animal?.name ?? 'Your animal'} care request`}
                    subtitle="Clear updates help you understand what the system is seeing before the vet finishes the review."
                    imageSrc="/images/remote-vet/pets-closeup.png"
                /> */}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                            <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-gradient-to-br from-amber-50 via-white to-stone-50">
                                {veterinaryCase.animal?.profile_photo_url ? (
                                    <img
                                        src={veterinaryCase.animal.profile_photo_url}
                                        alt={veterinaryCase.animal?.name ?? 'Animal'}
                                        className="h-72 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-72 w-full bg-stone-200" />
                                )}
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                    Care Request
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                                    {veterinaryCase.title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-stone-600">
                                    {veterinaryCase.animal?.name}
                                    {' - '}
                                    {veterinaryCase.animal?.species?.name}
                                </p>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <Info
                                        label="How Soon Your Animal Needs Care"
                                        value={seriousnessLabel(urgencyLevel)}
                                        tone={urgencyTone(urgencyLevel)}
                                    />
                                    <Info
                                        label="Check Again On"
                                        value={veterinaryCase.follow_up_date ?? 'Not set yet'}
                                    />
                                    <Info
                                        label="Current Status"
                                        value={veterinaryCase.status.replaceAll('_', ' ')}
                                    />
                                    <Info
                                        label="Location"
                                        value={veterinaryCase.location ?? 'Not specified'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                                What You Reported
                            </p>
                            <p className="mt-2 text-sm leading-6 text-stone-700">
                                {veterinaryCase.description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Possible Health Conditions
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                            Possible cause
                        </h3>

                        {possibleConditions.length === 0 ? (
                            <div className="mt-4">
                                <EmptyState
                                    title="No possible condition yet"
                                    description="The system will list likely conditions after it compares the reported signs with published veterinary rules."
                                />
                            </div>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {possibleConditions.map((item) => (
                                    <div
                                        key={item.disease_id ?? item.disease_name}
                                        className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-stone-900">
                                                    {item.disease_name ?? item.name ?? 'Possible condition'}
                                                </p>
                                                <p className="mt-1 text-sm text-stone-600">
                                                    Confidence {Math.round(item.confidence ?? item.score ?? 0)}%
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${urgencyTone(item.urgency_level ?? 'low')}`}>
                                                {seriousnessLabel(item.urgency_level ?? 'low')}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            <MiniList
                                                title="Signs matched"
                                                items={item.matched_symptoms ?? []}
                                            />
                                            <MiniList
                                                title="Signs missing"
                                                items={item.missing_symptoms ?? []}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            What You Can Do Now
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                            Supportive care suggestions
                        </h3>

                        {careRecommendations.length === 0 ? (
                            <p className="mt-4 text-sm leading-6 text-stone-600">
                                No care suggestions were generated yet.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {careRecommendations.map((item) => (
                                    <div
                                        key={`${item.priority_order ?? 'rec'}-${item.recommendation}`}
                                        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                                    >
                                        <p className="text-sm leading-6 text-stone-700">
                                            {item.recommendation}
                                        </p>
                                        {item.warning_notes ? (
                                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-emerald-700">
                                                {item.warning_notes}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
                            Safety Note
                        </p>
                        <p className="mt-3 text-sm leading-6 text-amber-900">
                            {disclaimer}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Vet&apos;s Advice
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                            What the vet said
                        </h3>
                        <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                            <p className="text-sm leading-6 text-stone-700">
                                {veterinaryCase.vet_advice ||
                                    'A veterinarian has not added advice yet.'}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <Panel title="Signs You Noticed">
                        {veterinaryCase.symptoms.length === 0 ? (
                            <EmptyState
                                title="No signs were saved"
                                description="This care request does not have any signs attached yet."
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {veterinaryCase.symptoms.map((item) => (
                                    <span
                                        key={item.id}
                                        className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                    >
                                        {item.name} ({item.severity_level})
                                    </span>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Attachments">
                        {veterinaryCase.attachment_urls.length === 0 ? (
                            <EmptyState
                                title="No files attached"
                                description="If you uploaded a photo or document, it will appear here."
                            />
                        ) : (
                            <div className="space-y-3">
                                {veterinaryCase.attachment_urls.map((item) => (
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
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Risk Factors">
                        {veterinaryCase.risk_factors.length === 0 ? (
                            <EmptyState
                                title="No risk factors selected"
                                description="Risk factors help the vet understand the case better."
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {veterinaryCase.risk_factors.map((item) => (
                                    <span
                                        key={item.id}
                                        className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                                    >
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Panel>

                    {warnings.length > 0 ? (
                        <Panel title={`Warnings (${urgencyLabel})`}>
                            <div className="space-y-3">
                                {warnings.map((warning) => (
                                    <div
                                        key={warning}
                                        className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-stone-700"
                                    >
                                        {warning}
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    ) : null}

                    <div className="flex justify-end">
                        <Link
                            href={route('owner.cases.index')}
                            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                            Back to My Care Requests
                        </Link>
                    </div>
                </section>
            </div>
        </OwnerLayout>
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

function Info({ label, value, tone = 'bg-stone-50 text-stone-700 ring-stone-200' }) {
    return (
        <div className={`rounded-2xl border p-4 ring-1 ${tone}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {label}
            </p>
            <p className="mt-2 text-sm leading-6 font-medium">{value}</p>
        </div>
    );
}

function MiniList({ title, items }) {
    return (
        <div className="rounded-2xl bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                {title}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {items.length === 0 ? (
                    <span className="text-sm text-stone-600">None listed</span>
                ) : (
                    items.map((item) => (
                        <span
                            key={item}
                            className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                        >
                            {item}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
}
