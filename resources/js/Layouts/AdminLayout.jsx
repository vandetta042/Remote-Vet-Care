import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
    { label: 'Users', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
    { label: 'Cases', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
    { label: 'Knowledge', routeName: 'admin.dashboard', matches: ['admin.dashboard'] },
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
