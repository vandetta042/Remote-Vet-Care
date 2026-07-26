import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
    { label: 'Users', routeName: 'admin.users.index', matches: ['admin.users.*'] },
    { label: 'Cases', routeName: 'admin.cases.index', matches: ['admin.cases.*'] },
    { label: 'Knowledge', routeName: 'admin.knowledge.index', matches: ['admin.knowledge.*'] },
];

export default function AdminLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="admin"
            badge="Administrator"
            brand="Operations Center"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
