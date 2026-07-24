import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'vet.dashboard', matches: ['vet.dashboard'] },
    { label: 'Care Requests', routeName: 'vet.cases.index', matches: ['vet.cases.index'] },
    { label: 'Emergency', routeName: 'vet.cases.index', params: { filter: 'emergency' }, matches: ['vet.cases.index'] },
    { label: 'Resolved', routeName: 'vet.cases.index', params: { filter: 'resolved' }, matches: ['vet.cases.index'] },
];

export default function VetLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="vet"
            badge="Veterinarian"
            brand="Vet Triage Center"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
