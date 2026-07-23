import PortalLayout from '@/Layouts/PortalLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ notifications }) {
    return (
        <PortalLayout
            title="Notifications"
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                            Internal Alerts
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                            Notifications
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            Workflow alerts for cases, reviews, publications, and platform activity appear here.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post(route('notifications.read-all'))}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        Mark All Read
                    </button>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
                        <h3 className="text-2xl font-semibold text-stone-900">
                            No notifications yet
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-stone-600">
                            Alerts will appear here as records move through the platform workflow.
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-3xl border p-5 shadow-sm ${
                                notification.read_at
                                    ? 'border-stone-200 bg-white'
                                    : 'border-amber-200 bg-amber-50'
                            }`}
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-stone-900">
                                        {notification.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-700">
                                        {notification.message}
                                    </p>
                                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-500">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.read_at ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(
                                                route('notifications.read', notification.id),
                                            )
                                        }
                                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                                    >
                                        Mark Read
                                    </button>
                                ) : (
                                    <span className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                                        Read
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PortalLayout>
    );
}
