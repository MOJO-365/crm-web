import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_DASHBOARD, GET_LEADS, GET_MONTHLY_ENROLLMENTS, GET_LEAD_SOURCE_DISTRIBUTION } from '@/graphql';
import { ActivityIcon, CustomerIcon, BatteryIcon } from '@/components/icons';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/common';

// Status badge config for customers
const getStatusBadge = (status: number | null) => {
    switch (status) {
        case 0: return { label: 'Pending', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
        case 1: return { label: 'In Progress', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
        case 2: return { label: 'Submitted', bg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
        case 3: return { label: 'Signed', bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
        case 9: return { label: 'Active', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
        default: return { label: 'Unknown', bg: 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground' };
    }
};

interface ExpandableCardProps {
    id: string;
    title: string;
    count: number;
    items: any[];
    type: 'lead' | 'customer';
    icon: React.ReactNode;
    iconBgColor: string;
    iconTextColor: string;
    isExpanded: boolean;
    onToggle: () => void;
}

const ExpandableCard = ({ title, count, items, type, icon, iconBgColor, iconTextColor, isExpanded, onToggle }: ExpandableCardProps) => {
    return (
        <div className="flex flex-col">
            <div
                className="bg-background border border-border p-5 rounded-xl shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center ${iconTextColor} shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                        <h3 className="text-2xl font-extrabold text-foreground mt-0.5">{count}</h3>
                    </div>
                </div>
                <div className="flex items-center">
                    <svg
                        className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform"
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
                    {items.length > 0 ? (
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 dark:bg-muted/50 sticky top-0 z-10">
                                    <tr className="text-left text-xs font-medium text-subtitle dark:text-subtitle uppercase tracking-wider">
                                        <th className="px-4 py-3">ID / NMI</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border dark:divide-border/50">
                                    {items.map((item, idx) => {
                                        const badge = type === 'customer'
                                            ? getStatusBadge(item.status)
                                            : { label: 'Pending', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };

                                        const name = type === 'customer'
                                            ? [item.firstName, item.lastName].filter(Boolean).join(' ') || '-'
                                            : [item.firstname, item.lastname].filter(Boolean).join(' ') || '-';

                                        const idDisplay = type === 'customer' ? item.customerId : item.nmi;
                                        const key = item.uid || idx;

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

    const { data: enrollmentData, loading: enrollmentLoading } = useQuery(GET_MONTHLY_ENROLLMENTS, {
        variables: { months: 6 },
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
                            id="activeCustomersVpp"
                            title="Active Customers (VPP)"
                            count={activeVppCustomers.length}
                            items={activeVppCustomers}
                            type="customer"
                            icon={<ActivityIcon size={24} />}
                            iconBgColor="bg-green-500/10"
                            iconTextColor="text-green-600"
                            isExpanded={expandedCards['activeCustomersVpp'] || false}
                            onToggle={() => toggleCard('activeCustomersVpp')}
                        />

                        <ExpandableCard
                            id="activeCustomersNonVpp"
                            title="Active Customers (Non-VPP)"
                            count={activeNonVppCustomers.length}
                            items={activeNonVppCustomers}
                            type="customer"
                            icon={<ActivityIcon size={24} />}
                            iconBgColor="bg-blue-500/10"
                            iconTextColor="text-blue-600"
                            isExpanded={expandedCards['activeCustomersNonVpp'] || false}
                            onToggle={() => toggleCard('activeCustomersNonVpp')}
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
                    </div>

                    {/* Chart & Distribution Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interactive Growth Chart */}
                        <div className="lg:col-span-2 bg-background border border-border p-6 rounded-xl shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-foreground">Monthly Enrollment Performance</h3>
                                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-full">Active Period</span>
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
