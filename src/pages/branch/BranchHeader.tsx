import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, ChevronDownIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import logo from '@/assets/main-logo-dark-1.png';

interface BranchHeaderProps {
    title?: string;
    actions?: React.ReactNode;
}

const getInitials = (name: string) => {
    if (!name) return '??';
    return name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const BranchHeader: React.FC<BranchHeaderProps> = ({ title, actions }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="relative z-30 px-4 sm:px-6 lg:px-8 py-4 border-b border-border/40 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md">
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

                <div className="flex items-center gap-6">
                    {actions}
                    <div className="flex items-center gap-5">
                        <ThemeToggle />
                        
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-9 h-9 rounded-full border-2 border-[#86a73c] bg-[#f2f6e9] dark:bg-[#86a73c]/10 flex items-center justify-center transition-all group-hover:shadow-sm">
                                        <span className="text-sm font-bold text-[#86a73c]">
                                            {getInitials(user.name || '')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-bold text-title tracking-tight">
                                            {user.name}
                                        </span>
                                        <ChevronDownIcon 
                                            size={14} 
                                            className={`text-subtitle opacity-60 mt-0.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                        />
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0f0f0f] border border-border/60 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-border/40 mb-1">
                                            <p className="text-xs font-black text-title uppercase tracking-widest">{user.name}</p>
                                            <p className="text-[10px] text-subtitle lowercase opacity-70 mt-0.5 truncate">{user.email || 'Branch Account'}</p>
                                        </div>
                                        
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-subtitle hover:text-rose-500 hover:bg-rose-500/5 transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                                <LogOutIcon size={16} />
                                            </div>
                                            <span className="font-bold">Log out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
