import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BranchHeader } from './BranchHeader';
import { ChevronLeftIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface BranchLayoutProps {
    children: React.ReactNode;
    title?: string;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
}

export const BranchLayout: React.FC<BranchLayoutProps> = ({ children, title, actions, footer }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === '/branch-portal';

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">
            {/* ── background orbs ── */}
            <div className="absolute w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -top-64 -right-32 pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -bottom-32 -left-32 pointer-events-none" />

            {/* ── reusable header ── */}
            <BranchHeader title={title} actions={actions} />

            {/* ── main content ── */}
            <main className="relative z-10 flex-1 flex flex-col min-h-0">
                {!isDashboard && (
                    <div className="px-4 sm:px-6 lg:px-8 pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/branch-portal')}
                            className="text-subtitle hover:text-title hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl group transition-all"
                            leftIcon={<ChevronLeftIcon size={18} className="group-hover:-translate-x-1 transition-transform" />}
                        >
                            <span className="font-bold text-xs uppercase tracking-widest">Back to Dashboard</span>
                        </Button>
                    </div>
                )}
                {children}
            </main>

            {/* ── optional footer ── */}
            {footer && (
                <footer className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8 pt-4">
                    {footer}
                </footer>
            )}
        </div>
    );
};
