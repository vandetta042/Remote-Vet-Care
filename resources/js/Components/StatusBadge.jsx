const tones = {
    submitted: 'bg-amber-50 text-amber-700 ring-amber-200',
    under_review: 'bg-blue-50 text-blue-700 ring-blue-200',
    vet_responded: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    resolved: 'bg-green-50 text-green-700 ring-green-200',
    referred: 'bg-rose-50 text-rose-700 ring-rose-200',
    closed: 'bg-stone-100 text-stone-700 ring-stone-200',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rejected: 'bg-red-50 text-red-700 ring-red-200',
    correction_requested: 'bg-amber-50 text-amber-700 ring-amber-200',
    low: 'bg-stone-100 text-stone-700 ring-stone-200',
    medium: 'bg-amber-50 text-amber-700 ring-amber-200',
    high: 'bg-orange-50 text-orange-700 ring-orange-200',
    emergency: 'bg-red-50 text-red-700 ring-red-200',
};

function formatLabel(value) {
    return value.replaceAll('_', ' ');
}

export default function StatusBadge({ value }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${
                tones[value] ?? tones.low
            }`}
        >
            {formatLabel(value)}
        </span>
    );
}
