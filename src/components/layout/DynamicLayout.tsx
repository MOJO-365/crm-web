import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { useUser } from '@/stores/useAuthStore';

export function DynamicLayout({ children }: { children?: React.ReactNode }) {
    const user = useUser();
    const location = useLocation();
    
    // Check if the user is a branch user (Independent UI)
    const isBranchUser = user?.isIndependentUi;

    if (isBranchUser) {
        // If they try to access standard CRM routes, redirect them to the branch portal
        // except if they are already on branch routes
        if (!location.pathname.startsWith('/branch-portal')) {
             return <Navigate to="/branch-portal" replace />;
        }
        
        return (
            <div className="w-full h-screen bg-gray-50 overflow-auto">
                {children || <Outlet />}
            </div>
        );
    }

    // Standard CRM Layout
    // Protect CRM users from branch portal routes
    if (location.pathname.startsWith('/branch-portal')) {
        return <Navigate to="/" replace />;
    }

    return (
        <MainLayout>
            {children || <Outlet />}
        </MainLayout>
    );
}
