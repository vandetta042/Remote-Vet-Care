import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'reviewer.dashboard', matches: ['reviewer.dashboard'] },
    { label: 'Pending Reviews', routeName: 'reviewer.knowledge-reviews.index', matches: ['reviewer.knowledge-reviews.*'] },
    { label: 'Decision History', routeName: 'reviewer.knowledge-reviews.index', matches: ['reviewer.knowledge-reviews.show'] },
];

export default function ReviewerLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="reviewer"
            badge="Reviewer"
            brand="Review Desk"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
