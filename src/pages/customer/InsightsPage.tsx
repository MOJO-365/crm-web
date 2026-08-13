import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_DASHBOARD, GET_LEADS, GET_MONTHLY_ENROLLMENTS, GET_LEAD_SOURCE_DISTRIBUTION } from '@/graphql';
import {
    CustomerIcon, ActivityIcon, BatteryIcon,
    MailIcon, PencilIcon, LogOutIcon, SearchIcon,
} from '@/components/icons';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/common';
import { Select } from '@/components/ui/Select';
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker';
import { Tooltip } from '@/components/ui/Tooltip';

import { CUSTOMER_STATUS_MAP } from '@/lib/constants';

// Status badge config for customers
const getStatusBadge = (status: number | null) => {
    if (status === null || CUSTOMER_STATUS_MAP[status] === undefined) {
        return { label: 'Unknown', bg: 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground' };
    }

    const label = CUSTOMER_STATUS_MAP[status].label;

    switch (status) {
        case 0: return { label, bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
        case 1: return { label, bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
        case 2: return { label, bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' };
        case 3: return { label, bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
        case 6: return { label, bg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' };
        case 9: return { label, bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
        default: return { label, bg: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' };
    }
};

interface ExpandableCardProps {
    id: string;
    title: string;
    count: number;
    items?: any[];
    tabs?: { label: string; items: any[] }[];
    type: 'lead' | 'customer';
    icon: React.ReactNode;
    iconBgColor: string;
    iconTextColor: string;
    isExpanded: boolean;
    onToggle: () => void;
}
const ExpandableCard = ({ id, title, count, items, tabs, type, icon, iconBgColor, iconTextColor, isExpanded, onToggle }: ExpandableCardProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    const filterItems = (itemsToFilter: any[]) => {
        return itemsToFilter.filter(item => {
            let matchesSearch = true;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const idDisplay = type === 'customer' ? item.customerId : item.nmi;
                const name = type === 'customer'
                    ? [item.firstName, item.lastName].filter(Boolean).join(' ')
                    : [item.firstname, item.lastname].filter(Boolean).join(' ');

                matchesSearch = !!(
                    (idDisplay && idDisplay.toLowerCase().includes(q)) ||
                    (name && name.toLowerCase().includes(q)) ||
                    (item.email && item.email.toLowerCase().includes(q))
                );
            }

            let matchesDate = true;
            if (dateRange?.from && dateRange?.to) {
                let targetDate = item.createdAt;
                
                if (type === 'customer') {
                    targetDate = item.statusUpdatedAt;
                    if (item.statusTimeline) {
                        try {
                            const timeline = typeof item.statusTimeline === 'string' ? JSON.parse(item.statusTimeline) : item.statusTimeline;
                            if (timeline[String(item.status)]) {
                                targetDate = timeline[String(item.status)];
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }

                if (targetDate) {
                    let d;
                    if (typeof targetDate === 'string' && /^\d+$/.test(targetDate)) {
                        d = new Date(Number(targetDate));
                    } else {
                        d = new Date(targetDate);
                    }
                    
                    // Set hours to 0 to compare dates safely
                    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                    const fromDate = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate());
                    const toDate = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate());
                    
                    if (itemDate < fromDate || itemDate > toDate) {
                        matchesDate = false;
                    }
                } else {
                    matchesDate = false;
                }
            }

            return matchesSearch && matchesDate;
        });
    };

    const displayTabs = tabs ? tabs.map(tab => ({ ...tab, items: filterItems(tab.items) })) : undefined;
    const displayItems = displayTabs ? displayTabs[activeTab].items : filterItems(items || []);

    return (
        <div className="flex flex-col">
            <div
                className="bg-background border border-border px-5 py-4 h-[88px] rounded-xl shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center ${iconTextColor} shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
                        <h3 className="text-2xl font-extrabold text-foreground leading-none">{count}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {tabs && tabs.length > 0 && (
                        <div className="flex items-center gap-3 mr-2 border-r border-border pr-3">
                            {tabs.map((tab, idx) => {
                                const isVpp = tab.label.toLowerCase() === 'vpp';
                                return (
                                    <div key={idx} className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${isVpp ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500'}`} />
                                        <span className="text-xs font-semibold text-foreground">{tab.items.length}</span>
                                        <span className="text-[11px] text-muted-foreground">{tab.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <svg
                        className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Expanded list Modal */}
            <Modal
                isOpen={isExpanded}
                onClose={onToggle}
                title={title}
                size="4xl"
            >
                <div className="bg-card dark:bg-card rounded-xl overflow-hidden mt-4">
                    {displayTabs && displayTabs.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 px-2">
                            {displayTabs.map((tab, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === idx
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                >
                                    {tab.label} <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-background/20 text-xs">{tab.items.length}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder={`Search ${title.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="shrink-0 flex items-center">
                                <DateRangePicker 
                                    value={dateRange} 
                                    onChange={setDateRange} 
                                    placeholder={type === 'customer' ? (id === 'movedOn' ? 'Filter by moved on date' : 'Filter by status date') : 'Filter by created date'}
                                    isClearable={true}
                                />
                            </div>
                        </div>
                    </div>

                    {displayItems.length > 0 ? (
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-muted dark:bg-muted sticky top-0 z-10">
                                    <tr className="text-left text-xs font-medium text-subtitle dark:text-subtitle uppercase tracking-wider">
                                        <th className="px-4 py-3">Customer ID</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Created</th>
                                        {type === 'customer' && <th className="px-4 py-3">{id === 'movedOn' ? 'Moved On Date' : 'Status Changed'}</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border dark:divide-border/50">
                                    {displayItems.map((item, idx) => {
                                        const badge = type === 'customer'
                                            ? getStatusBadge(item.status)
                                            : { label: 'Pending', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };

                                        const name = type === 'customer'
                                            ? [item.firstName, item.lastName].filter(Boolean).join(' ') || '-'
                                            : [item.firstname, item.lastname].filter(Boolean).join(' ') || '-';

                                        const idDisplay = type === 'customer' ? item.customerId : item.nmi;
                                        const key = item.uid || idx;

                                        let dateDisplay = '-';
                                        if (item.createdAt) {
                                            const d = typeof item.createdAt === 'string' && /^\d+$/.test(item.createdAt) 
                                                ? new Date(Number(item.createdAt)) 
                                                : new Date(item.createdAt);
                                            dateDisplay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                                        }

                                        let statusDateDisplay = '-';
                                        let targetStatusDate = item.statusUpdatedAt;
                                        let parsedTimeline: Record<string, any> = {};

                                        if (item.statusTimeline) {
                                            try {
                                                parsedTimeline = typeof item.statusTimeline === 'string' ? JSON.parse(item.statusTimeline) : item.statusTimeline;
                                                if (parsedTimeline[String(item.status)]) {
                                                    targetStatusDate = parsedTimeline[String(item.status)];
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        }

                                        if (type === 'customer' && targetStatusDate) {
                                            const d = typeof targetStatusDate === 'string' && /^\d+$/.test(targetStatusDate) 
                                                ? new Date(Number(targetStatusDate)) 
                                                : new Date(targetStatusDate);
                                            statusDateDisplay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                                        }

                                        return (
                                            <tr key={key} className="hover:bg-accent/50 dark:hover:bg-accent/50 text-sm">
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground dark:text-muted-foreground">
                                                    {idDisplay || '-'}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-title dark:text-title">{name}</td>
                                                <td className="px-4 py-3 text-muted-foreground dark:text-muted-foreground">{item.email || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground dark:text-muted-foreground text-xs whitespace-nowrap">
                                                    {dateDisplay}
                                                </td>
                                                {type === 'customer' && (
                                                    <td className="px-4 py-3 text-muted-foreground dark:text-muted-foreground text-xs whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            {Object.keys(parsedTimeline).length > 0 ? (
                                                                <Tooltip
                                                                    position="bottom"
                                                                    content={
                                                                        <div className="p-2 min-w-[220px]">
                                                                            <div className="text-xs font-semibold mb-2.5 border-b border-border/50 pb-1.5 text-foreground">Status History</div>
                                                                            <div className="space-y-2">
                                                                                {Object.entries(parsedTimeline)
                                                                                    .sort(([, dateA], [, dateB]) => new Date(dateB as string).getTime() - new Date(dateA as string).getTime())
                                                                                    .map(([statusId, date]) => {
                                                                                        const d = typeof date === 'string' && /^\d+$/.test(date) ? new Date(Number(date)) : new Date(date as string);
                                                                                        const b = getStatusBadge(Number(statusId));
                                                                                        return (
                                                                                            <div key={statusId} className="flex items-center justify-between gap-4 text-xs">
                                                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${b.bg}`}>{b.label}</span>
                                                                                                <span className="text-muted-foreground font-mono text-[10px]">{d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                >
                                                                    <div className="p-1 rounded-full hover:bg-muted dark:hover:bg-muted/50 cursor-help transition-colors text-muted-foreground">
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                    </div>
                                                                </Tooltip>
                                                            ) : (
                                                                <span>{statusDateDisplay}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-sm text-subtitle dark:text-subtitle">No records found</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

const PerformanceChart = ({ enrollments }: { enrollments: { month: string; year: number; count: number }[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const maxCount = Math.max(...enrollments.map(e => e.count), 1);

    const chartData = enrollments.map((data, i) => ({
        label: data.month,
        enrollments: data.count,
        x: 40 + i * (920 / Math.max(enrollments.length - 1, 1)),
        y: 210 - (data.count / maxCount) * 160,
    }));

    const generatePath = () => {
        if (chartData.length === 0) return '';
        let path = `M ${chartData[0].x} ${chartData[0].y}`;
        for (let i = 1; i < chartData.length; i++) {
            const prev = chartData[i - 1];
            const curr = chartData[i];
            // Use a tighter bezier curve to prevent any extreme dipping or browser rendering glitches
            const cp1x = prev.x + (curr.x - prev.x) * 0.4;
            const cp1y = prev.y;
            const cp2x = curr.x - (curr.x - prev.x) * 0.4;
            const cp2y = curr.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
        return path;
    };

    const linePath = generatePath();
    const areaPath = `${linePath} L ${chartData[chartData.length - 1].x} 250 L ${chartData[0].x} 250 Z`;

    return (
        <div className="h-64 w-full relative pt-2 group">
            <svg key={chartData.length} className="w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--border)" strokeDasharray="4" />
                <line x1="0" y1="130" x2="1000" y2="130" stroke="var(--border)" strokeDasharray="4" />
                <line x1="0" y1="210" x2="1000" y2="210" stroke="var(--border)" strokeDasharray="4" />

                {/* Gradient Area */}
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5c8a1d" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#5c8a1d" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                <path
                    d={areaPath}
                    fill="url(#chartGrad)"
                    className="transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: animate ? 1 : 0 }}
                />

                {/* Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#5c8a1d"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="3000"
                    strokeDashoffset={animate ? 0 : 3000}
                    className="transition-all duration-1000 ease-out"
                />

                {/* Interactive Markers */}
                {chartData.map((point, index) => (
                    <g
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="cursor-pointer"
                    >
                        {/* Invisible larger circle for easier hovering */}
                        <circle cx={point.x} cy={point.y} r="20" fill="transparent" />

                        {/* Visible Marker */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? "7" : "5"}
                            fill="#5c8a1d"
                            stroke="var(--background)"
                            strokeWidth="2"
                            className="transition-all duration-300 ease-out"
                            style={{
                                opacity: animate ? 1 : 0,
                                transform: animate ? 'scale(1)' : 'scale(0)',
                                transformOrigin: `${point.x}px ${point.y}px`,
                                transitionDelay: `${index * 150}ms`
                            }}
                        />

                        {/* Highlight ring on hover */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="10"
                            fill="none"
                            stroke="#5c8a1d"
                            strokeWidth="2"
                            className="transition-all duration-300"
                            style={{
                                opacity: hoveredIndex === index ? 0.3 : 0,
                                transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.5)',
                                transformOrigin: `${point.x}px ${point.y}px`
                            }}
                        />

                        {/* Tooltip Overlay directly mapped to SVG coordinates */}
                        {hoveredIndex === index && (
                            <foreignObject
                                x={Math.max(0, Math.min(1000 - 110, point.x - 55))}
                                y={point.y - 50 < 0 ? point.y + 15 : point.y - 50}
                                width="110"
                                height="40"
                                className="pointer-events-none"
                            >
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md p-1.5 flex flex-col items-center justify-center h-full w-full">
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight m-0 p-0">{point.label}</span>
                                    <span className="text-[10px] font-semibold text-primary leading-tight m-0 p-0">{point.enrollments} Enrollments</span>
                                </div>
                            </foreignObject>
                        )}
                    </g>
                ))}

                {/* X-Axis Labels aligned perfectly with points */}
                {chartData.map((point, index) => (
                    <text
                        key={`label-${index}`}
                        x={point.x}
                        y="240"
                        textAnchor="middle"
                        className={`text-[9px] font-bold uppercase transition-colors duration-300 ${hoveredIndex === index ? 'fill-primary' : 'fill-muted-foreground'}`}
                    >
                        {point.label}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default function InsightsPage() {
    const { data: dashboardData, loading: dashLoading } = useQuery(GET_CUSTOMER_DASHBOARD, {
        fetchPolicy: 'network-only',
    });

    const { data: leadsData, loading: leadsLoading } = useQuery(GET_LEADS, {
        variables: { page: 1, limit: 50, isCustomerNow: false },
        fetchPolicy: 'network-only',
    });

    const [enrollmentInterval, setEnrollmentInterval] = useState<'last7days' | 'last15days' | 'monthly' | 'yearly'>('monthly');

    const { data: enrollmentData, loading: enrollmentLoading } = useQuery(GET_MONTHLY_ENROLLMENTS, {
        variables: {
            months: enrollmentInterval === 'last7days' ? 7 : enrollmentInterval === 'last15days' ? 15 : enrollmentInterval === 'yearly' ? 5 : 6,
            interval: enrollmentInterval.startsWith('last') ? 'daily' : enrollmentInterval
        },
        fetchPolicy: 'network-only',
    });

    const { data: distributionData, loading: distributionLoading } = useQuery(GET_LEAD_SOURCE_DISTRIBUTION, {
        fetchPolicy: 'network-only',
    });

    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

    const toggleCard = (cardId: string) => {
        setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const totalLeads = leadsData?.leads?.meta?.totalRecords || 0;

    // Filter active customers to only show status === 9
    const activeCustomersList = (dashboardData?.customerDashboard?.utilmateStatusSummary?.customers || []).filter((c: any) => c.status === 9);

    const activeVppCustomers = activeCustomersList.filter((c: any) => c.vpp === 1);
    const activeNonVppCustomers = activeCustomersList.filter((c: any) => c.vpp !== 1);

    const vppPending = dashboardData?.customerDashboard?.vppPendingSummary?.count || 0;
    const signaturePending = dashboardData?.customerDashboard?.signaturePendingSummary?.count || 0;
    const drafts = dashboardData?.customerDashboard?.draftSummary?.count || 0;
    const movedOn = dashboardData?.customerDashboard?.movedOnSummary?.count || 0;

    const isLoading = dashLoading || leadsLoading || enrollmentLoading || distributionLoading;

    const enrollments = enrollmentData?.monthlyEnrollments || [];
    const sourceDistribution: { source: string; count: number; percentage: number }[] = distributionData?.leadSourceDistribution || [];

    const barColors = ['bg-primary', 'bg-green-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Customer Insights</h1>
                <p className="text-muted-foreground">Comprehensive analytics, distributions, and growth metrics for your leads and customers.</p>
            </div>

            {isLoading ? (
                <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span>Loading insights & analytics...</span>
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <ExpandableCard
                            id="pendingLeads"
                            title="Pending Leads"
                            count={totalLeads}
                            items={leadsData?.leads?.data || []}
                            type="lead"
                            icon={<CustomerIcon size={24} />}
                            iconBgColor="bg-primary/10"
                            iconTextColor="text-primary"
                            isExpanded={expandedCards['pendingLeads'] || false}
                            onToggle={() => toggleCard('pendingLeads')}
                        />

                        <ExpandableCard
                            id="activeCustomers"
                            title="Active Customers"
                            count={activeCustomersList.length}
                            tabs={[
                                { label: 'VPP', items: activeVppCustomers },
                                { label: 'Non-VPP', items: activeNonVppCustomers }
                            ]}
                            type="customer"
                            icon={<ActivityIcon size={24} />}
                            iconBgColor="bg-blue-500/10"
                            iconTextColor="text-blue-600"
                            isExpanded={expandedCards['activeCustomers'] || false}
                            onToggle={() => toggleCard('activeCustomers')}
                        />

                        <ExpandableCard
                            id="vppPending"
                            title="VPP Pending"
                            count={vppPending}
                            items={dashboardData?.customerDashboard?.vppPendingSummary?.customers || []}
                            type="customer"
                            icon={<BatteryIcon size={24} />}
                            iconBgColor="bg-amber-500/10"
                            iconTextColor="text-amber-600"
                            isExpanded={expandedCards['vppPending'] || false}
                            onToggle={() => toggleCard('vppPending')}
                        />

                        <ExpandableCard
                            id="signaturePending"
                            title="Send For Sign"
                            count={signaturePending}
                            items={dashboardData?.customerDashboard?.signaturePendingSummary?.customers || []}
                            type="customer"
                            icon={<MailIcon size={24} />}
                            iconBgColor="bg-indigo-500/10"
                            iconTextColor="text-indigo-600"
                            isExpanded={expandedCards['signaturePending'] || false}
                            onToggle={() => toggleCard('signaturePending')}
                        />

                        <ExpandableCard
                            id="drafts"
                            title="Saved As Draft"
                            count={drafts}
                            items={dashboardData?.customerDashboard?.draftSummary?.customers || []}
                            type="customer"
                            icon={<PencilIcon size={24} />}
                            iconBgColor="bg-slate-500/10"
                            iconTextColor="text-slate-600"
                            isExpanded={expandedCards['drafts'] || false}
                            onToggle={() => toggleCard('drafts')}
                        />

                        <ExpandableCard
                            id="movedOn"
                            title="Moved On"
                            count={movedOn}
                            items={dashboardData?.customerDashboard?.movedOnSummary?.customers || []}
                            type="customer"
                            icon={<LogOutIcon size={24} />}
                            iconBgColor="bg-rose-500/10"
                            iconTextColor="text-rose-600"
                            isExpanded={expandedCards['movedOn'] || false}
                            onToggle={() => toggleCard('movedOn')}
                        />
                    </div>

                    {/* Chart & Distribution Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interactive Growth Chart */}
                        <div className="lg:col-span-2 bg-background border border-border p-6 rounded-xl shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-foreground">Enrollment Performance</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-[140px]">
                                        <Select
                                            options={[
                                                { value: 'last7days', label: 'Last 7 Days' },
                                                { value: 'last15days', label: 'Last 15 Days' },
                                                { value: 'monthly', label: 'Monthly' },
                                                { value: 'yearly', label: 'Yearly' }
                                            ]}
                                            value={enrollmentInterval}
                                            onChange={(val) => setEnrollmentInterval(val as any)}
                                            className="h-8"
                                        />
                                    </div>
                                    <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-full">Active Period</span>
                                </div>
                            </div>

                            {/* Interactive SVG Performance Chart */}
                            <PerformanceChart enrollments={enrollments} />
                        </div>

                        {/* Distribution details */}
                        <div className="bg-background border border-border p-6 rounded-xl shadow-sm space-y-5">
                            <h3 className="text-base font-bold text-foreground">Top Connection Channels</h3>

                            <div className="space-y-4">
                                {sourceDistribution.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No lead source data available.</p>
                                ) : (
                                    sourceDistribution.map((item, index) => (
                                        <div key={item.source} className="space-y-1">
                                            <div className="flex justify-between text-sm font-semibold">
                                                <span className="text-muted-foreground">{item.source}</span>
                                                <span className="text-foreground">{item.percentage}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div className={`h-full ${barColors[index % barColors.length]} rounded-full transition-all duration-700`} style={{ width: `${item.percentage}%` }} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {sourceDistribution.length > 0 && (
                                <div className="pt-4 border-t border-border mt-3 text-center">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Primary connection source is <strong className="text-foreground">{sourceDistribution[0]?.source}</strong>, yielding the highest onboarding efficiency.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
