import RoleLayout from '@/Layouts/RoleLayout';

const navItems = [
    { label: 'Dashboard', routeName: 'researcher.dashboard', matches: ['researcher.dashboard'] },
    { label: 'My Drafts', routeName: 'researcher.knowledge-submissions.index', matches: ['researcher.knowledge-submissions.*'] },
    { label: 'New Draft', routeName: 'researcher.knowledge-submissions.create', matches: ['researcher.knowledge-submissions.create'] },
];

export default function ResearchLayout({ title, subtitle, children }) {
    return (
        <RoleLayout
            variant="researcher"
            badge="Researcher"
            brand="Research Studio"
            title={title}
            subtitle={subtitle}
            navItems={navItems}
        >
            {children}
        </RoleLayout>
    );
}
