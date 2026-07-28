import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const roleConfig = {
    owner: {
        label: 'Owner Portal',
        dashboardRoute: 'owner.dashboard',
        links: [
            { label: 'Home', routeName: 'owner.dashboard', matches: ['owner.dashboard'] },
            { label: 'Report a Sick Animal', routeName: 'owner.cases.create', matches: ['owner.cases.create'] },
            { label: 'My Animals', routeName: 'owner.animals.index', matches: ['owner.animals.*'] },
            { label: 'My Care Requests', routeName: 'owner.cases.index', matches: ['owner.cases.*'] },
            { label: 'Vet Replies', routeName: 'owner.cases.index', matches: ['owner.cases.show'] },
        ],
    },
    vet: {
        label: 'Vet Portal',
        dashboardRoute: 'vet.dashboard',
        links: [
            { label: 'Dashboard', routeName: 'vet.dashboard', matches: ['vet.dashboard'] },
            { label: 'Case Queue', routeName: 'vet.cases.index', matches: ['vet.cases.*'] },
            { label: 'Follow-ups', routeName: 'vet.cases.index', matches: [] },
        ],
    },
    researcher: {
        label: 'Research Portal',
        dashboardRoute: 'researcher.dashboard',
        links: [
            { label: 'Dashboard', routeName: 'researcher.dashboard', matches: ['researcher.dashboard'] },
            { label: 'My Submissions', routeName: 'researcher.knowledge-submissions.index', matches: ['researcher.knowledge-submissions.*'] },
            { label: 'New Draft', routeName: 'researcher.knowledge-submissions.create', matches: [] },
        ],
    },
    reviewer: {
        label: 'Review Portal',
        dashboardRoute: 'reviewer.dashboard',
        links: [
            { label: 'Dashboard', routeName: 'reviewer.dashboard', matches: ['reviewer.dashboard'] },
            { label: 'Pending Reviews', routeName: 'reviewer.knowledge-reviews.index', matches: ['reviewer.knowledge-reviews.*'] },
            { label: 'Decision History', routeName: 'reviewer.knowledge-reviews.index', matches: [] },
        ],
    },
    curator: {
        label: 'Curation Portal',
        dashboardRoute: 'curator.dashboard',
        links: [
            { label: 'Dashboard', routeName: 'curator.dashboard', matches: ['curator.dashboard'] },
            { label: 'Approved Queue', routeName: 'curator.published-rules.index', matches: ['curator.published-rules.*'] },
            { label: 'Published Rules', routeName: 'curator.published-rules.index', matches: [] },
        ],
    },
    admin: {
        label: 'Admin Portal',
        dashboardRoute: 'admin.dashboard',
        links: [
            { label: 'Dashboard', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
            { label: 'Users', routeName: 'admin.users.index', matches: ['admin.users.*'] },
            { label: 'Cases', routeName: 'admin.cases.index', matches: ['admin.cases.*'] },
            { label: 'Knowledge', routeName: 'admin.knowledge.index', matches: ['admin.knowledge.*'] },
        ],
    },
};

function toneClasses(role) {
    switch (role) {
        case 'admin':
            return 'from-slate-900 via-slate-800 to-slate-700 text-white';
        case 'vet':
            return 'from-emerald-900 via-emerald-800 to-teal-700 text-white';
        case 'researcher':
            return 'from-amber-900 via-orange-800 to-rose-700 text-white';
        case 'reviewer':
            return 'from-blue-900 via-indigo-800 to-sky-700 text-white';
        case 'curator':
            return 'from-violet-900 via-fuchsia-800 to-pink-700 text-white';
        default:
            return 'from-stone-900 via-stone-800 to-orange-700 text-white';
    }
}

export default function PortalLayout({ title, header, children }) {
    const { auth, notifications } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const user = auth.user;
    const config = roleConfig[user.role] ?? roleConfig.owner;
    const gradient = toneClasses(user.role);
    const isActiveLink = (link) =>
        Array.isArray(link.matches) &&
        link.matches.length > 0 &&
        link.matches.some((pattern) => route().current(pattern));

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900">
            <div className={`sticky top-0 z-40 bg-gradient-to-r ${gradient}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route(config.dashboardRoute)}
                            className="flex items-center gap-3"
                        >
                            <ApplicationLogo className="h-10 w-auto fill-current text-white" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                                    Remote Vet Care
                                </p>
                                <h1 className="text-lg font-semibold">
                                    {title ?? config.label}
                                </h1>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link
                            href={route('notifications.index')}
                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                        >
                            Notifications
                            {notifications?.unreadCount ? (
                                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-stone-900">
                                    {notifications.unreadCount}
                                </span>
                            ) : null}
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                        >
                            Profile
                        </Link>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-full">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none"
                                    >
                                        <span className="text-start">
                                            <span className="block">
                                                {user.name}
                                            </span>
                                            <span className="block text-xs uppercase tracking-[0.2em] text-white/70">
                                                {config.label}
                                            </span>
                                        </span>
                                        <svg
                                            className="h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content contentClasses="py-1 bg-white">
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile Settings
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <button
                        onClick={() =>
                            setShowingNavigationDropdown((current) => !current)
                        }
                        className="rounded-full border border-white/20 p-2 text-white md:hidden"
                    >
                        <svg
                            className="h-6 w-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                className={
                                    !showingNavigationDropdown
                                        ? 'inline-flex'
                                        : 'hidden'
                                }
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                className={
                                    showingNavigationDropdown
                                        ? 'inline-flex'
                                        : 'hidden'
                                }
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
                <aside className="w-full shrink-0 lg:w-72">
                    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                        <div className={`bg-gradient-to-br ${gradient} px-6 py-6`}>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                                Signed in as
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-white">
                                {user.name}
                            </h2>
                            <p className="mt-1 text-sm text-white/75">
                                {user.email}
                            </p>
                        </div>

                        <div className="space-y-2 p-4">
                            {config.links.map((link) => (
                                <Link
                                    key={`${config.label}-${link.label}`}
                                    href={route(link.routeName)}
                                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        isActiveLink(link)
                                            ? 'bg-stone-900 text-white'
                                            : 'text-stone-700 hover:bg-stone-100'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-stone-200 px-4 py-4">
                            <Link
                                href={route('notifications.index')}
                                className="block rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                            >
                                Notifications
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="block rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                            >
                                Edit Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="mt-2 block w-full rounded-2xl px-4 py-3 text-start text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>

                    <div
                        className={`${
                            showingNavigationDropdown ? 'block' : 'hidden'
                        } mt-4 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:hidden`}
                    >
                        <div className="space-y-1 p-2">
                            {config.links.map((link) => (
                                <ResponsiveNavLink
                                    key={`mobile-${link.label}`}
                                    href={route(link.routeName)}
                                    active={isActiveLink(link)}
                                >
                                    {link.label}
                                </ResponsiveNavLink>
                            ))}
                            <ResponsiveNavLink
                                href={route('notifications.index')}
                                active={route().current('notifications.*')}
                            >
                                Notifications
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {header ? (
                        <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                            {header}
                        </div>
                    ) : null}
                    {children}
                </div>
            </div>
        </div>
    );
}
