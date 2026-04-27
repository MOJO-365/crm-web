import { useState, useEffect, useMemo } from 'react';
import { useUser, useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LogOutIcon, CustomerIcon, PlusIcon, ZapIcon, ChevronRightIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

/* ─── helpers ────────────────────────────────────── */
function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
}

function useCurrentTime() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);
    return now;
}

/* ─── animated floating orb (decorative) ─────────── */
function FloatingOrb({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'absolute rounded-full opacity-20 blur-3xl pointer-events-none',
                className,
            )}
        />
    );
}

/* ─── action card ────────────────────────────────── */
interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    accentFrom: string;
    accentTo: string;
    accentGlow: string;
    buttonLabel: string;
    onClick: () => void;
    id: string;
}

function ActionCard({
    title,
    description,
    icon,
    accentFrom,
    accentTo,
    accentGlow,
    buttonLabel,
    onClick,
    id,
}: ActionCardProps) {
    return (
        <button
            id={id}
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-start text-left w-full',
                'rounded-2xl sm:rounded-3xl border border-border/60',
                'bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl',
                'p-5 sm:p-6',
                'transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)]',
                'hover:shadow-2xl hover:-translate-y-1',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'overflow-hidden cursor-pointer',
            )}
        >
            {/* gradient glow on hover */}
            <div
                className={cn(
                    'absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl',
                    'transition-opacity duration-700 opacity-0 group-hover:opacity-30',
                    accentGlow,
                )}
            />

            {/* top accent line */}
            <div
                className={cn(
                    'absolute top-0 inset-x-0 h-[3px] rounded-t-3xl',
                    'bg-gradient-to-r',
                    accentFrom,
                    accentTo,
                    'opacity-80 group-hover:opacity-100 transition-opacity duration-300',
                )}
            />

            {/* icon */}
            <div
                className={cn(
                    'relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl mb-4',
                    'bg-gradient-to-br',
                    accentFrom,
                    accentTo,
                    'text-white shadow-lg',
                    'transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3',
                )}
            >
                {icon}
            </div>

            {/* text */}
            <h3 className="text-lg sm:text-xl font-bold text-title mb-1.5 sm:mb-2 tracking-tight">
                {title}
            </h3>
            <p className="text-sm text-subtitle leading-relaxed mb-4 sm:mb-5 flex-1">
                {description}
            </p>

            {/* CTA */}
            <span
                className={cn(
                    'inline-flex items-center gap-2 text-sm font-semibold',
                    'transition-all duration-300',
                    'group-hover:gap-3',
                )}
                style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                }}
            >
                <span
                    className={cn(
                        'bg-gradient-to-r bg-clip-text text-transparent',
                        accentFrom,
                        accentTo,
                    )}
                >
                    {buttonLabel}
                </span>
                <ChevronRightIcon
                    size={16}
                    className={cn(
                        'transition-transform duration-300 group-hover:translate-x-1',
                        // colour fallback
                        'text-primary',
                    )}
                />
            </span>
        </button>
    );
}

/* ─── stat pill ──────────────────────────────────── */
function StatPill({
    icon,
    label,
    id,
}: {
    icon: React.ReactNode;
    label: string;
    id: string;
}) {
    return (
        <div
            id={id}
            className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl',
                'bg-white/60 dark:bg-white/[0.06] backdrop-blur-md',
                'border border-border/40',
                'transition-all duration-300 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm',
            )}
        >
            <span className="text-primary">{icon}</span>
            <span className="text-xs sm:text-sm font-medium text-subtitle whitespace-nowrap">
                {label}
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   BranchDashboardPage
   ═══════════════════════════════════════════════════ */
export function BranchDashboardPage() {
    const user = useUser();
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const now = useCurrentTime();

    const greeting = useMemo(() => getGreeting(), [now]);
    const formattedDate = useMemo(
        () =>
            now.toLocaleDateString('en-AU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        [now],
    );


    /* ─── render ─────────────────────────────────── */
    return (
        <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-[#0a0a0a] dark:via-[#0d0d0d] dark:to-[#0a0a0a] overflow-hidden">
            {/* ── decorative background orbs ── */}
            <FloatingOrb className="w-[500px] h-[500px] bg-primary/40 -top-40 -left-40 animate-pulse" />
            <FloatingOrb className="w-[400px] h-[400px] bg-emerald-400/30 -bottom-32 -right-32 animate-pulse [animation-delay:2s]" />
            <FloatingOrb className="w-[250px] h-[250px] bg-blue-400/20 top-1/3 right-1/4 animate-pulse [animation-delay:4s]" />

            {/* ── top bar ── */}
            <header className="relative z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                            <ZapIcon size={18} className="text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-title tracking-tight hidden sm:inline">
                            Branch&nbsp;Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <Button
                            id="branch-logout-btn"
                            variant="ghost"
                            onClick={logout}
                            leftIcon={<LogOutIcon size={16} />}
                            className="text-subtitle hover:text-title hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                            <span className="hidden sm:inline">Log&nbsp;out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── main content ── */}
            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex-1">
                {/* hero section */}
                <section className="pb-4 sm:pb-5">
                    <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-primary mb-1.5">
                        {formattedDate}
                    </p>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-title leading-tight">
                        {greeting},{' '}
                        <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                            {user?.name}
                        </span>
                    </h1>

                    <p className="mt-1.5 text-sm sm:text-base text-subtitle max-w-lg leading-relaxed">
                        Manage your branch enrollments, submit new customers and track
                        their progress — all in one place.
                    </p>

                    {/* quick stat pills */}
                    <div className="flex flex-wrap gap-2.5 mt-3">
                        <StatPill
                            id="stat-portal"
                            icon={<ZapIcon size={15} />}
                            label={user?.name ?? 'Branch Portal'}
                        />
                        <StatPill
                            id="stat-role"
                            icon={<CustomerIcon size={15} />}
                            label={user?.roleName ?? 'Branch User'}
                        />
                    </div>
                </section>

                {/* action cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ActionCard
                        id="card-enrollments"
                        title="My Enrollments"
                        description="View, search, and track the real-time status of every customer enrollment submitted through this branch."
                        icon={<CustomerIcon size={24} className="drop-shadow-md" />}
                        accentFrom="from-blue-500"
                        accentTo="to-indigo-600"
                        accentGlow="bg-blue-500"
                        buttonLabel="View Enrollments"
                        onClick={() => navigate('/branch-portal/enrollments')}
                    />

                    <ActionCard
                        id="card-new-enrollment"
                        title="New Enrollment"
                        description="Start a fresh customer enrollment — enter their details, verify their NMI, and submit for approval in minutes."
                        icon={<PlusIcon size={24} className="drop-shadow-md" />}
                        accentFrom="from-emerald-500"
                        accentTo="to-teal-600"
                        accentGlow="bg-emerald-500"
                        buttonLabel="Start New Enrollment"
                        onClick={() => navigate('/branch-portal/enroll')}
                    />
                </section>

            </main>

            {/* footer tagline — pinned to bottom */}
            <footer className="relative z-10 py-4 text-center">
                <p className="text-[11px] sm:text-xs text-subtitle/60 tracking-wider uppercase font-medium">
                    Powered by&nbsp;
                    <span className="text-primary font-bold">GEE Energy</span>
                </p>
            </footer>
        </div>
    );
}
