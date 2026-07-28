import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

function joinClasses(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function RoleLayout({
    brand,
    title,
    subtitle,
    badge,
    navItems = [],
    children,
    variant = 'owner',
}) {
    const page = usePage();
    const { auth, notifications } = page.props;
    const currentUrl = page.url;
    const user = auth.user;

    const currentParams = new URLSearchParams(currentUrl.split('?')[1] ?? '');

    const activeItem = (item) => {
        const matches =
            Array.isArray(item.matches) &&
            item.matches.length > 0 &&
            item.matches.some((pattern) => route().current(pattern));

        if (!matches) {
            return false;
        }

        if (item.params?.filter) {
            return currentParams.get('filter') === item.params.filter;
        }

        return true;
    };

    const theme =
        variant === 'vet'
            ? {
                  shell: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 text-stone-900',
                  banner: 'from-emerald-900 via-teal-800 to-cyan-800',
                  card: 'border-emerald-200 bg-white/90',
                  navActive: 'bg-emerald-900 text-white shadow-sm',
                  navIdle: 'text-stone-700 hover:bg-emerald-50',
              }
            : {
                  shell: 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-stone-900',
                  banner: 'from-amber-900 via-orange-800 to-rose-800',
                  card: 'border-amber-200 bg-white/90',
                  navActive: 'bg-stone-900 text-white shadow-sm',
                  navIdle: 'text-stone-700 hover:bg-amber-50',
              };

    return (
        <div className={joinClasses('min-h-screen', theme.shell)}>
            <div className={`sticky top-0 z-40 bg-gradient-to-r ${theme.banner} text-white`}>
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Link href={route('dashboard')} className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-auto fill-current text-white" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                                    Remote Vet Care
                                </p>
                                <h1 className="text-xl font-semibold">{brand}</h1>
                            </div>
                        </Link>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href={route('notifications.index')}
                                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                            >
                                Alerts
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
                                                    {badge}
                                                </span>
                                            </span>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content contentClasses="bg-white py-1">
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
                    </div>

                    <div className={`rounded-3xl border border-white/15 ${theme.card} p-5 text-stone-900 shadow-sm backdrop-blur`}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                                    {badge}
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-stone-900">
                                    {title}
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={route(item.routeName, item.params ?? {})}
                                className={joinClasses(
                                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                                    activeItem(item) ? theme.navActive : theme.navIdle,
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
