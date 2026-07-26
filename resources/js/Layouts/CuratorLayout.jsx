import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'curator.dashboard', matches: ['curator.dashboard'] },
    { label: 'Approved Queue', routeName: 'curator.published-rules.index', matches: ['curator.published-rules.*'] },
    { label: 'Published Rules', routeName: 'curator.published-rules.index', matches: ['curator.published-rules.show'] },
];

export default function CuratorLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="curator"
            badge="Curator"
            brand="Curation Desk"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
