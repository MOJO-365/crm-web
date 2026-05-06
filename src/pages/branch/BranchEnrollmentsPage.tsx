import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { GET_LEADS } from '@/graphql/queries/leads';
import { GET_USERS } from '@/graphql/queries/users';
import { Input } from '@/components/ui/Input';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EyeIcon, MapPinIcon, UserIcon, ClockIcon, PlusIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useUser } from '@/stores/useAuthStore';
import { CUSTOMER_STATUS_MAP } from '@/lib/constants';
import { BranchLayout } from './BranchLayout';

interface Lead {
    uid: string;
    title?: string;
    firstname: string;
    lastname: string;
    email?: string;
    number?: string;
    source?: string;
    notes?: string;
    fullAddress?: string;
    isCustomerNow: boolean;
    customerUid?: string;
    customer?: {
        status: number;
    };
    createdAt: string;
    nmi?: string;
    createdByUser?: {
        uid: string;
        name: string;
    };
}

interface LeadsResponse {
    leads: {
        data: Lead[];
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
    };
}

interface SearchFilters {
    name: string;
    status: string;
    portal: string;
    staff: string;
}

const INITIAL_FILTERS: SearchFilters = {
    name: '',
    status: '',
    portal: '',
    staff: ''
};

export function BranchEnrollmentsPage() {
    const user = useUser();
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('--- ENROLLMENTS PAGE DEBUG ---');
    console.log('User UID:', user?.uid);
    console.log('Is Master:', user?.isMaster);
    console.log('Branch Tenant:', user?.branchTenant);
    console.log('------------------------------');

    // Filter logic: Master sees everything in branch, staff sees only their own
    const leadFilter = useMemo(() => {
        if (!user) return {};
        if (user.isMaster === 1) {
            return { branchTenant: user.branchTenant };
        }
        return { searchCreatedBy: user.uid };
    }, [user]);

    // Debounce filters
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);



    const { data, loading } = useQuery<LeadsResponse>(GET_LEADS, {
        variables: {
            page,
            limit,
            ...leadFilter,
            search: debouncedFilters.name || undefined,
            source: debouncedFilters.portal || undefined,
            isCustomerNow: debouncedFilters.status === '' ? undefined : (debouncedFilters.status === '1' ? false : true),
            customerStatus: (debouncedFilters.status !== '' && debouncedFilters.status !== '1') ? parseInt(debouncedFilters.status, 10) : undefined,
            searchCreatedBy: (user?.isMaster === 1 && debouncedFilters.staff) ? debouncedFilters.staff : leadFilter.searchCreatedBy
        },
        fetchPolicy: 'network-only',
        skip: !user
    });

    const { data: staffData, error: staffError } = useQuery(GET_USERS, {
        variables: {
            page: 1,
            limit: 100,
            branchTenant: user?.branchTenant
        },
        skip: !user || user?.isMaster !== 1
    });

    if (staffError) {
        console.error('Staff Query Error:', staffError);
    }

    const staffList = staffData?.users?.data || [];

    const leads = data?.leads?.data || [];
    const meta = data?.leads?.meta;

    const handleView = (lead: Lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const columns: Column<Lead>[] = useMemo(() => {
        const baseColumns: Column<Lead>[] = [
            {
                key: 'createdAt',
                header: 'Date Submitted',
                render: (row) => <span className="text-sm text-subtitle">{new Date(row.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            },
            {
                key: 'name',
                header: 'Lead Name',
                render: (row) => {
                    const fullName = [row.title, row.firstname, row.lastname].filter(Boolean).join(' ');
                    return <span className="font-semibold text-title">{fullName || '-'}</span>;
                }
            },
            {
                key: 'email',
                header: 'Email Address',
                render: (row) => <span className="text-sm text-subtitle">{row.email || '-'}</span>
            },
            {
                key: 'nmi',
                header: 'NMI',
                render: (row) => <span className="text-xs font-mono font-bold bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">{row.nmi || '-'}</span>
            },
            {
                key: 'source',
                header: 'Source',
                render: (row) => (
                    <span className="text-[10px] font-bold text-subtitle uppercase tracking-wider opacity-60">{row.source || 'Branch Portal'}</span>
                )
            },
            {
                key: 'status',
                header: 'Status',
                render: (row: Lead) => (
                    <div className="flex flex-col gap-1">
                        {row.isCustomerNow ? (
                            <StatusField 
                                value={row.customer?.status} 
                                type="customer_status" 
                                mode="badge"
                                className="scale-90 origin-left"
                            />
                        ) : (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Lead
                            </div>
                        )}
                        {row.isCustomerNow && row.customerUid && (
                            <span className="text-[10px] text-primary font-bold opacity-70 italic ml-1">
                                Linked
                            </span>
                        )}
                    </div>
                )
            },
            ...(user?.isMaster === 1 ? [{
                key: 'createdBy',
                header: 'Created By',
                render: (row: Lead) => (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon size={12} className="text-primary" />
                        </div>
                        <span className="text-sm text-subtitle">{row.createdByUser?.name || 'System'}</span>
                    </div>
                )
            }] : []),
            {
                key: 'actions',
                header: '',
                render: (row) => (
                    <Button variant="ghost" size="icon" onClick={() => handleView(row)} className="hover:bg-primary/10 text-primary">
                        <EyeIcon size={18} />
                    </Button>
                )
            }
        ];

        return baseColumns;
    }, []);



    const navigate = useNavigate();

    return (
        <BranchLayout
            title="My Enrollments"
            actions={
                <Button
                    onClick={() => navigate('/branch-portal/enroll')}
                    className="gap-2 shadow-lg shadow-primary/20"
                >
                    <PlusIcon size={16} />
                    New Enrollment
                </Button>
            }
        >
            <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 min-h-0">
                <div className="flex-1 bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                    {/* Filters Row */}
                    <div className="px-6 py-4 border-b border-border/40 bg-gray-50/30 dark:bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-2 p-1 bg-white dark:bg-white/[0.05] rounded-xl border border-border/60 shadow-sm">
                            <Input
                                placeholder="Search name..."
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                                className="w-48 sm:w-64 h-9 text-sm border-none bg-transparent shadow-none focus-visible:ring-0"
                            />
                            <div className="w-px h-5 bg-border/60" />
                            <Select
                                options={[
                                    { value: '', label: 'All Status' },
                                    { value: '1', label: 'Lead' },
                                    ...Object.entries(CUSTOMER_STATUS_MAP).filter(([k]) => k !== '1').map(([k, v]) => ({
                                        value: k,
                                        label: v.label
                                    }))
                                ]}
                                value={filters.status}
                                onChange={(val) => handleFilterChange('status', val as string)}
                                className="w-44 sm:w-56 h-9 text-sm border-none bg-transparent shadow-none focus:ring-0"
                            />
                            {user?.isMaster === 1 && (
                                <>
                                    <div className="w-px h-5 bg-border/60" />
                                    <Select
                                        options={[
                                            { value: '', label: 'All Staff' },
                                            ...staffList.map((s: any) => ({ value: s.uid, label: s.name || s.email }))
                                        ]}
                                        value={filters.staff}
                                        onChange={(val) => handleFilterChange('staff', val as string)}
                                        className="w-36 sm:w-48 h-9 text-sm border-none bg-transparent shadow-none focus:ring-0"
                                    />
                                </>
                            )}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-subtitle opacity-50">
                            Total: {meta?.totalRecords || 0} ({leads.length})
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={leads}
                        loading={loading}
                        rowKey={(row) => row.uid}
                        pagination={{
                            currentPage: page,
                            pageSize: limit,
                            totalCount: meta?.totalRecords || 0,
                            onPageChange: setPage,
                            onPageSizeChange: setLimit,
                            hasNextPage: page < (meta?.totalPages || 1),
                            hasPreviousPage: page > 1
                        }}
                        containerHeightClass="flex-1"
                        className="flex-1"
                    />
                </div>

                {/* Info footer */}
                <div className="mt-6 flex items-center justify-between text-subtitle text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                    <span>Showing {leads.length} of {meta?.totalRecords || 0} Records</span>
                    <span>System Sync Active</span>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Lead Details"
                size="3xl"
            >
                {selectedLead && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-border/40">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg",
                                    selectedLead.isCustomerNow ? "bg-emerald-500 shadow-emerald-500/20" : "bg-amber-500 shadow-amber-500/20"
                                )}>
                                    {selectedLead.firstname?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-title tracking-tight">{selectedLead.firstname} {selectedLead.lastname}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs font-medium text-subtitle flex items-center gap-2">
                                            <ClockIcon size={12} className="opacity-50" />
                                            Submitted {new Date(selectedLead.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                                selectedLead.isCustomerNow ? "bg-emerald-500" : "bg-amber-500"
                            )}>
                                {selectedLead.isCustomerNow ? 'Onboarded' : 'Lead'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <UserIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Personal Details</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'Full Name', value: `${selectedLead.title || ''} ${selectedLead.firstname || ''} ${selectedLead.lastname || ''}`.trim() },
                                        { label: 'Email', value: selectedLead.email },
                                        { label: 'Mobile', value: selectedLead.number },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className="text-sm font-bold text-title text-right truncate">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <MapPinIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Service Property</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'Address', value: selectedLead.fullAddress },
                                        { label: 'NMI', value: selectedLead.nmi },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className="text-sm font-bold text-title text-right truncate">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedLead.notes && (
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Additional Notes</h3>
                                </div>
                                <div className="p-4 text-sm text-title whitespace-pre-wrap">
                                    {selectedLead.notes}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-border/40">
                            {!selectedLead.isCustomerNow && (
                                <Button 
                                    onClick={() => navigate('/branch-portal/enroll', { state: { prefillData: selectedLead } })}
                                    className="gap-2 rounded-xl shadow-lg shadow-primary/20"
                                >
                                    <PlusIcon size={16} />
                                    Enroll Now
                                </Button>
                            )}
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="px-8 h-10 font-bold text-subtitle hover:text-title hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">Close Details</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </BranchLayout>
    );
}
