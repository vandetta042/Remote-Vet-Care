import { Link } from '@inertiajs/react';

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
}) {
    return (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-stone-900">{title}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                {description}
            </p>
            {actionHref ? (
                <Link
                    href={actionHref}
                    className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                    {actionLabel}
                </Link>
            ) : null}
        </div>
    );
}
