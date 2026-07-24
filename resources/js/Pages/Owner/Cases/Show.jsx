import EmptyState from '@/Components/EmptyState';
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

export default function Show({ veterinaryCase, disclaimer }) {
    return (
        <OwnerLayout
            title={veterinaryCase.title}
            subtitle="Read the possible cause, see how serious it looks, and review the vet's advice in one place."
        >
            <Head title={veterinaryCase.title} />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
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
                            <Info label="How Serious It Looks" value={seriousnessLabel(veterinaryCase.urgency_level)} />
                            <Info label="Check Again On" value={veterinaryCase.follow_up_date ?? 'Not set yet'} />
                            <Info label="Current Status" value={veterinaryCase.status.replaceAll('_', ' ')} />
                            <Info label="Location" value={veterinaryCase.location ?? 'Not specified'} />
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
                            Possible Cause
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                            System suggestion
                        </h3>
                        <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <p className="text-sm leading-6 text-stone-700">
                                {veterinaryCase.system_suggestion_summary ||
                                    'No possible cause has been suggested yet.'}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-stone-600">
                                {veterinaryCase.system_explanation ||
                                    'The system will show a summary here after your report is processed.'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Vet's Advice
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

function Info({ label, value }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{value}</p>
        </div>
    );
}
