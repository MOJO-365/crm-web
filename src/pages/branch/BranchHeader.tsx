import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, UserIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import logo from '@/assets/main-logo-dark-1.png';

interface BranchHeaderProps {
    title?: string;
    actions?: React.ReactNode;
}

export const BranchHeader: React.FC<BranchHeaderProps> = ({ title, actions }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();

    return (
        <header className="relative z-20 px-4 sm:px-6 lg:px-8 py-4 border-b border-border/40 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/branch-portal')}
                        className="flex items-center gap-3 group transition-all"
                    >
                        <div className="flex flex-col items-start">
                            <img src={logo} alt="GEE Energy" className="h-10 dark:invert" />
                        </div>
                    </button>

                    {title && (
                        <>
                            <div className="w-px h-6 bg-border/60 mx-2 hidden sm:block" />
                            <h2 className="text-base font-semibold text-title hidden sm:block tracking-tight">
                                {title}
                            </h2>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {actions}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-border/40">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                    <UserIcon size={16} />
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <p className="text-[11px] font-black text-title uppercase ">{user.name}</p>
                                    <p className="text-[10px] font-medium text-subtitle lowercase opacity-70">{user.email || 'Branch User'}</p>
                                </div>
                            </div>
                        )}
                        <ThemeToggle />
                        <div className="w-px h-6 bg-border/60" />
                        <Button
                            id="branch-logout-btn"
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="text-subtitle hover:text-title hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all h-9"
                        >
                            <LogOutIcon size={16} className="mr-2" />
                            <span className="font-bold text-xs uppercase tracking-wider">Log out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
