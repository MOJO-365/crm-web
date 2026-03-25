// Route definitions with lazy loading for code splitting
import { useEffect, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet, useSearchParams } from 'react-router-dom';
import { ProtectedRoute, RequirePermission } from '@/components/auth';
import { MainLayout } from '@/components/layout';
import { lazyWithRetry, clearLazyRetryFlag } from '@/lib/lazy-with-retry';

// Lazy load pages for code splitting
const LoginPage = lazyWithRetry(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazyWithRetry(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazyWithRetry(() => import('@/pages/user/UsersPage').then(m => ({ default: m.UsersPage })));
const ChangePasswordPage = lazyWithRetry(() => import('@/pages/user/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const CustomersPage = lazyWithRetry(() => import('@/pages/customer/CustomersPage').then(m => ({ default: m.CustomersPage })));
const CustomerFormPage = lazyWithRetry(() => import('@/pages/customer/CustomerFormPage').then(m => ({ default: m.CustomerFormPage })));
const CustomerDetailsPage = lazyWithRetry(() => import('@/pages/customer/CustomerDetailsPage').then(m => ({ default: m.CustomerDetailsPage })));
const RatesPage = lazyWithRetry(() => import('@/pages/rates/RatesPage').then(m => ({ default: m.RatesPage })));
const OfferAccessPage = lazyWithRetry(() => import('@/pages/OfferAccessPage').then(m => ({ default: m.OfferAccessPage })));
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const RolePage = lazyWithRetry(() => import('@/pages/role/RolePage').then(m => ({ default: m.RolePage })));
const AuditLogsPage = lazyWithRetry(() => import('@/pages/logs/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const EmailTemplatesPage = lazyWithRetry(() => import('@/pages/email/EmailTemplatesPage').then(m => ({ default: m.EmailTemplatesPage })));
const EmailLogsPage = lazyWithRetry(() => import('@/pages/email/EmailLogsPage').then(m => ({ default: m.EmailLogsPage })));
const EmailSendPage = lazyWithRetry(() => import('@/pages/email/EmailSendPage').then(m => ({ default: m.EmailSendPage })));
const ProfilePage = lazyWithRetry(() => import('@/pages/user/ProfilePage').then(m => ({ default: m.ProfilePage })));
const DocumentTypesPage = lazyWithRetry(() => import('@/pages/master/DocumentTypesPage').then(m => ({ default: m.DocumentTypesPage })));
const NoteTypesPage = lazyWithRetry(() => import('@/pages/master/NoteTypesPage').then(m => ({ default: m.NoteTypesPage })));
const NotificationEntitiesPage = lazyWithRetry(() => import('@/pages/master/NotificationEntitiesPage').then(m => ({ default: m.NotificationEntitiesPage })));
const RiskStatusesPage = lazyWithRetry(() => import('@/pages/master/RiskStatusesPage').then(m => ({ default: m.RiskStatusesPage })));
const PdfTermsPage = lazyWithRetry(() => import('@/pages/pdf/PdfTermsPage').then(m => ({ default: m.PdfTermsPage })));
const CustomerBillingPage = lazyWithRetry(() => import('@/pages/customer/CustomerBillingPage').then(m => ({ default: m.CustomerBillingPage })));
const BonusMasterPage = lazyWithRetry(() => import('@/pages/master/BonusMasterPage').then(m => ({ default: m.BonusMasterPage })));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

const RootRouteHandler = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get('offer')) {
        return <OfferAccessPage />;
    }
    return (
        <ProtectedRoute>
            <MainLayout>
                <DashboardPage />
            </MainLayout>
        </ProtectedRoute>
    );
};

const LayoutWithSuspense = () => (
    <Suspense fallback={<PageLoader />}>
        <Outlet />
    </Suspense>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<LayoutWithSuspense />}>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Root handler for Offer Page (public) vs Dashboard (protected) */}
            <Route path="/" element={<RootRouteHandler />} />

            {/* Other protected routes - single ProtectedRoute wrapper with MainLayout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                {/* Dashboard route is now handled by RootRouteHandler at '/' */}

                {/* Routes with specific menu permissions */}
                <Route path="/customers" element={<RequirePermission menuCode="customers"><CustomersPage /></RequirePermission>} />
                <Route path="/customers/new" element={<RequirePermission menuCode="customers"><CustomerFormPage /></RequirePermission>} />
                <Route path="/customers/:uid" element={<RequirePermission menuCode="customers"><CustomerDetailsPage /></RequirePermission>} />
                <Route path="/customers/:uid/edit" element={<RequirePermission menuCode="customers"><CustomerFormPage /></RequirePermission>} />
                <Route path="/users" element={<RequirePermission menuCode="users"><UsersPage /></RequirePermission>} />
                <Route path="/roles" element={<RequirePermission menuCode="roles"><RolePage /></RequirePermission>} />
                <Route path="/rates" element={<RequirePermission menuCode="rates"><RatesPage /></RequirePermission>} />
                <Route path="/audit-logs" element={<RequirePermission menuCode="audit_logs"><AuditLogsPage /></RequirePermission>} />
                <Route path="/email-templates" element={<RequirePermission menuCode="email_templates"><EmailTemplatesPage /></RequirePermission>} />
                <Route path="/email-logs" element={<RequirePermission menuCode="email_logs"><EmailLogsPage /></RequirePermission>} />
                <Route path="/email-send" element={<RequirePermission menuCode="email_templates"><EmailSendPage /></RequirePermission>} />

                {/* Master Routes */}
                <Route path="/document-types" element={<RequirePermission menuCode="document_types"><DocumentTypesPage /></RequirePermission>} />
                <Route path="/note-types" element={<RequirePermission menuCode="note_types"><NoteTypesPage /></RequirePermission>} />
                <Route path="/notification_entity" element={<RequirePermission menuCode="notification_entity"><NotificationEntitiesPage /></RequirePermission>} />
                <Route path="/risk-statuses" element={<RequirePermission menuCode="risk_statuses"><RiskStatusesPage /></RequirePermission>} />
                <Route path="/pdf-terms" element={<RequirePermission menuCode="pdf_terms"><PdfTermsPage /></RequirePermission>} />
                <Route path="/customer-billing" element={<RequirePermission menuCode="customer_billing"><CustomerBillingPage /></RequirePermission>} />
                <Route path="/bonus_master" element={<RequirePermission menuCode="bonus_master"><BonusMasterPage /></RequirePermission>} />

                {/* General authenticated routes */}
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Route>
    )
);

export function AppRoutes() {
    useEffect(() => {
        // Clear the retry flag when the app routes successfully mount
        clearLazyRetryFlag();
    }, []);

    return <RouterProvider router={router} />;
}

