import PortalLayout from '@/Layouts/PortalLayout';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <PortalLayout
            title={`${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Workspace`}
            header={header}
        >
            {children}
        </PortalLayout>
    );
}
