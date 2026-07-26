import EmptyState from '@/Components/EmptyState';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const roleLabels = {
    owner: 'Animal Owner',
    vet: 'Veterinarian',
    researcher: 'Researcher',
    reviewer: 'Reviewer',
    curator: 'Curator',
    admin: 'Administrator',
};

const roleTone = {
    owner: 'bg-stone-100 text-stone-700 ring-stone-200',
    vet: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    researcher: 'bg-amber-50 text-amber-700 ring-amber-200',
    reviewer: 'bg-blue-50 text-blue-700 ring-blue-200',
    curator: 'bg-violet-50 text-violet-700 ring-violet-200',
    admin: 'bg-slate-100 text-slate-700 ring-slate-200',
};

function UserCard({ user }) {
    return (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        {roleLabels[user.role] ?? user.role}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                        {user.name}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600">{user.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Animals: {user.animals_count}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Care Requests: {user.cases_count}
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                            Knowledge: {user.knowledge_submissions_count}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${
                            roleTone[user.role] ?? roleTone.owner
                        }`}
                    >
                        {roleLabels[user.role] ?? user.role}
                    </span>
                    <span className="inline-flex rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        {user.status}
                    </span>
                </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-stone-600 md:grid-cols-2">
                <p>Phone: {user.phone ?? 'Not set'}</p>
                <p>Joined: {user.created_at ?? 'Unknown'}</p>
                <p className="md:col-span-2">
                    Location: {user.address ?? 'Not set'}
                </p>
            </div>
        </div>
    );
}

export default function Index({ users, stats }) {
    return (
        <AdminLayout
            title="Users"
            subtitle="Review every account in the system, grouped by role."
        >
            <Head title="Admin Users" />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                                {stat.label}
                            </p>
                            <p className="mt-4 text-4xl font-semibold text-stone-900">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {users.length === 0 ? (
                    <EmptyState
                        title="No users found"
                        description="As accounts are added, they will appear here for admin oversight."
                    />
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
