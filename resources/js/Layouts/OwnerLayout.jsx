import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Home', routeName: 'owner.dashboard', matches: ['owner.dashboard'] },
    { label: 'Report a Sick Animal', routeName: 'owner.cases.create', matches: ['owner.cases.create'] },
    { label: 'My Animals', routeName: 'owner.animals.index', matches: ['owner.animals.*'] },
    { label: 'My Care Requests', routeName: 'owner.cases.index', matches: ['owner.cases.index', 'owner.cases.show'] },
    { label: 'Vet Replies', routeName: 'owner.cases.index', matches: ['owner.cases.show'] },
];

export default function OwnerLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="owner"
            badge="Animal Owner"
            brand="Animal Care Center"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
