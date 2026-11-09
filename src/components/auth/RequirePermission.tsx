import { useAuthStore } from '@/stores/useAuthStore';
import { ForbiddenPage } from '@/pages/ForbiddenPage';

interface RequirePermissionProps {
    children: React.ReactNode;
    menuCode: string;
}

/**
 * Light-weight permission check wrapper.
 * Use inside ProtectedRoute for routes that require specific menu permissions.
 * Authentication is assumed to be already handled by parent ProtectedRoute.
 */
export function RequirePermission({ children, menuCode }: RequirePermissionProps) {
    const { accessibleMenus, user } = useAuthStore();

    const hasAccess = user?.isMaster || accessibleMenus.some(
        menu => (menu.menuCode === menuCode || (menuCode === 'company_ref' && (menu.menuCode === 'document_types' || menu.menuCode === 'api_credentials'))) && menu.canView
    );

    if (!hasAccess) {
        return <ForbiddenPage />;
    }

    return <>{children}</>;
}
