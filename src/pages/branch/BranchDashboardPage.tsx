import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import {
    CustomerIcon,
    PlusIcon,
    ChevronRightIcon,
    ClockIcon,
    TrendingUpIcon,
    CheckCircleIcon,
    UserSettingIcon,
    UsersIcon
} from '@/components/icons';
import { GET_LEADS } from '@/graphql/queries/leads';
import { GET_USERS } from '@/graphql/queries/users';
import { cn } from '@/lib/utils';
import { BranchLayout } from './BranchLayout';

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

/* ─── action card ────────────────────────────────── */
interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    accentColor: string;
    buttonLabel: string;
    onClick: () => void;
    id: string;
}

function ActionCard({
    title,
    description,
    icon,
    accentColor,
    buttonLabel,
    onClick,
    id,
}: ActionCardProps) {
    return (
        <button
            id={id}
            onClick={onClick}
            className={cn(
                'group relative flex flex-col items-start text-left w-full h-full',
                'rounded-2xl border border-border/50 bg-white dark:bg-white/[0.04] shadow-sm',
                'p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-primary/30',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'overflow-hidden cursor-pointer'
            )}
        >
            <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-xl mb-6 text-white shadow-lg',
                accentColor
            )}>
                {icon}
            </div>

            <h3 className="text-lg font-bold text-title mb-1 tracking-tight group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-xs text-subtitle leading-relaxed mb-4 flex-1">
                {description}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                <span>{buttonLabel}</span>
                <ChevronRightIcon size={16} />
            </div>
        </button>
    );
}

/* ─── dash stat ──────────────────────────────────── */
function DashStat({
    icon,
    label,
    value,
    color,
    loading,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    loading?: boolean;
}) {
    return (
        <div className="flex flex-col p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-border/50 shadow-sm">
            <div className={cn('flex items-center justify-center w-7 h-7 rounded-lg mb-2 text-white', color)}>
                {icon}
            </div>
            <div className="flex flex-col">
                {loading ? (
                    <div className="h-5 w-10 bg-gray-100 dark:bg-white/10 animate-pulse rounded mb-1" />
                ) : (
                    <span className="text-lg font-bold text-title leading-none mb-1">
                        {value}
                    </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-subtitle opacity-70">
                    {label}
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   BranchDashboardPage
   ═══════════════════════════════════════════════════ */
export function BranchDashboardPage() {
    const user = useUser();
    const navigate = useNavigate();
    const now = useCurrentTime();

    console.log('--- BRANCH DASHBOARD DEBUG ---');
    console.log('User UID:', user?.uid);
    console.log('Is Master:', user?.isMaster);
    console.log('Branch Tenant:', user?.branchTenant);
    console.log('------------------------------');

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

    // Filter logic: Master sees everything in branch, staff sees only their own
    const leadFilter = useMemo(() => {
        if (!user) return {};
        if (user.isMaster === 1) {
            return { branchTenant: user.branchTenant };
        }
        return { searchCreatedBy: user.uid };
    }, [user]);

    // Fetch stats - focusing on leads
    const { data: statsData, loading: statsLoading } = useQuery(GET_LEADS, {
        variables: {
            page: 1,
            limit: 5,
            ...leadFilter,
            isCustomerNow: false
        },
        skip: !user
    });

    const { data: pendingData } = useQuery(GET_LEADS, {
        variables: {
            page: 1,
            limit: 1,
            ...leadFilter,
            isCustomerNow: false
        },
        skip: !user
    });

    const { data: processedData } = useQuery(GET_LEADS, {
        variables: {
            page: 1,
            limit: 1,
            ...leadFilter,
            isCustomerNow: true // Count those that became customers as processed
        },
        skip: !user
    });

    const { data: staffData } = useQuery(GET_USERS, {
        variables: {
            page: 1,
            limit: 1,
            status: 'ACTIVE',
            onlyVisibleRoles: true
        },
        skip: !user || user?.isMaster !== 1
    });

    const stats = {
        total: (statsData?.leads?.meta?.totalRecords || 0) + (processedData?.leads?.meta?.totalRecords || 0),
        pending: pendingData?.leads?.meta?.totalRecords || 0,
        processed: processedData?.leads?.meta?.totalRecords || 0,
        staff: Math.max(0, (staffData?.users?.meta?.totalRecords || 0) - 1),
    };

    /* ─── render ─────────────────────────────────── */
    const footer = (
        <div className="flex items-center justify-between  border-t border-border/40 text-subtitle text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">
            <span>© {new Date().getFullYear()} GEE Energy</span>
        </div>
    );

    return (
        <BranchLayout footer={footer}>
            <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-10 w-full">
                {/* Hero Section */}
                <section className="mb-8">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">
                        {formattedDate}
                    </p>
                    <h1 className="text-3xl font-bold text-title tracking-tight mb-1">
                        {greeting}, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="text-xs text-subtitle max-w-2xl">
                        Welcome back to your branch dashboard. Monitor submissions and manage new customer enrollments.
                    </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left side: Stats & Cards */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Stats Grid */}
                        <div className={cn(
                            "grid gap-4",
                            user?.isMaster === 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"
                        )}>
                            <DashStat
                                icon={<TrendingUpIcon size={18} />}
                                label="Submissions"
                                value={stats.total}
                                color="bg-blue-500 shadow-blue-500/20"
                                loading={statsLoading}
                            />
                            <DashStat
                                icon={<ClockIcon size={18} />}
                                label="Pending"
                                value={stats.pending}
                                color="bg-amber-500 shadow-amber-500/20"
                                loading={statsLoading}
                            />
                            <DashStat
                                icon={<CheckCircleIcon size={18} />}
                                label="Processed"
                                value={stats.processed}
                                color="bg-emerald-500 shadow-emerald-500/20"
                                loading={statsLoading}
                            />
                            {user?.isMaster === 1 && (
                                <DashStat
                                    icon={<UsersIcon size={18} />}
                                    label="Total Staff"
                                    value={stats.staff}
                                    color="bg-indigo-500 shadow-indigo-500/20"
                                    loading={statsLoading}
                                />
                            )}
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ActionCard
                                id="card-new-enrollment"
                                title="New Enrollment"
                                description="Start a fresh application. Capture lead details to be reviewed in CRM."
                                icon={<PlusIcon size={24} />}
                                accentColor="bg-primary"
                                buttonLabel="Start Application"
                                onClick={() => navigate('/branch-portal/enroll')}
                            />

                            <ActionCard
                                id="card-enrollments"
                                title="My Enrollments"
                                description="Track all submissions and manage customer history."
                                icon={<CustomerIcon size={24} />}
                                accentColor="bg-blue-600"
                                buttonLabel="View All Submissions"
                                onClick={() => navigate('/branch-portal/enrollments')}
                            />

                            {user?.isMaster === 1 && (
                                <ActionCard
                                    id="card-staff-management"
                                    title="Staff Management"
                                    description="Manage your branch staff accounts, roles and permissions."
                                    icon={<UserSettingIcon size={24} />}
                                    accentColor="bg-amber-600"
                                    buttonLabel="Manage Team"
                                    onClick={() => navigate('/branch-portal/staff')}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right side: Recent Activity */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-border/40 flex items-center justify-between">
                                <h2 className="font-bold text-title tracking-tight">Recent Submissions</h2>
                            </div>

                            <div className="p-4 space-y-3">
                                {statsLoading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-14 bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />
                                    ))
                                ) : statsData?.leads?.data?.length > 0 ? (
                                    statsData.leads.data.map((item: any) => {
                                        const name = `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'New Lead';

                                        return (
                                            <div
                                                key={item.uid}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-border/50"
                                                onClick={() => navigate(`/branch-portal/enrollments?search=${item.firstname || ''}`)}
                                            >
                                                <div className={cn(
                                                    'w-2 h-2 rounded-full shrink-0',
                                                    item.isCustomerNow ? 'bg-emerald-500' : 'bg-amber-500'
                                                )} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-title truncate">{name}</p>
                                                    <p className="text-[10px] text-subtitle font-medium uppercase tracking-wider truncate">
                                                        {item.nmi || 'No NMI'} • {new Date(item.createdAt).toLocaleDateString()}
                                                        {user?.isMaster === 1 && item.createdByUser?.name && (
                                                            <span className="ml-1 opacity-60">• By {item.createdByUser.name}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-white/[0.02] border border-border/40 flex items-center justify-center text-subtitle opacity-30 mb-4 shadow-inner">
                                            <TrendingUpIcon size={28} />
                                        </div>
                                        <h4 className="text-sm font-black text-title uppercase tracking-wider opacity-60">Activity Waiting</h4>
                                        <p className="text-[11px] text-subtitle font-medium opacity-40 max-w-[200px] mt-1 leading-relaxed">
                                            Your branch's recent enrollment activity will be automatically tracked and displayed here.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-border/40">
                                <Button
                                    variant="ghost"
                                    className="w-full text-xs font-bold text-primary h-8 hover:bg-white dark:hover:bg-white/5"
                                    onClick={() => navigate('/branch-portal/enrollments')}
                                >
                                    View Detailed List
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BranchLayout>
    );
}
