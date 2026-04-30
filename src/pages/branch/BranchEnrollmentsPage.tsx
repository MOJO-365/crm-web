import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import { GET_WEB_ENROLLMENTS } from '@/graphql/queries/customers';
import { Input } from '@/components/ui/Input';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EyeIcon, CheckIcon, MapPinIcon, UserIcon, IdCardIcon, ClockIcon, ZapIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useUser } from '@/stores/useAuthStore';
import { BranchLayout } from './BranchLayout';

interface WebEnrollment {
    id: string;
    uid: string;
    payload: any;
    processed: number;
    createdAt: string;
}

interface WebEnrollmentsResponse {
    webEnrollments: {
        data: WebEnrollment[];
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
}

const INITIAL_FILTERS: SearchFilters = {
    name: '',
    status: '',
    portal: ''
};

export function BranchEnrollmentsPage() {
    const user = useUser();
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedEnrollment, setSelectedEnrollment] = useState<WebEnrollment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce filters
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);



    const { data, loading } = useQuery<WebEnrollmentsResponse>(GET_WEB_ENROLLMENTS, {
        variables: {
            page,
            limit,
            searchName: debouncedFilters.name || undefined,
            processed: debouncedFilters.status !== '' ? parseInt(debouncedFilters.status) : undefined,
            branchTenant: user?.branchTenant || undefined,
            searchPortal: debouncedFilters.portal || (!user?.branchTenant ? (user?.name || 'Branch Portal') : undefined)
        },
        fetchPolicy: 'network-only',
        skip: !user || !GET_WEB_ENROLLMENTS
    });


    const enrollments = data?.webEnrollments?.data || [];
    const meta = data?.webEnrollments?.meta;

    const handleView = (enrollment: WebEnrollment) => {
        setSelectedEnrollment(enrollment);
        setIsModalOpen(true);
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const columns: Column<WebEnrollment>[] = useMemo(() => {
        const baseColumns: Column<WebEnrollment>[] = [
            {
                key: 'createdAt',
                header: 'Date Submitted',
                render: (row) => <span className="text-sm text-subtitle">{new Date(row.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            },
            {
                key: 'name',
                header: 'Customer Name',
                render: (row) => {
                    const { title, firstname, lastname } = row.payload || {};
                    const fullName = [title, firstname, lastname].filter(v => v && typeof v !== 'object').join(' ');
                    return <span className="font-semibold text-title">{fullName || '-'}</span>;
                }
            },
            {
                key: 'email',
                header: 'Email Address',
                render: (row) => <span className="text-sm text-subtitle">{row.payload?.email || '-'}</span>
            },
            {
                key: 'nmi',
                header: 'NMI',
                render: (row) => <span className="text-xs font-mono font-bold bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">{row.payload?.nmi || '-'}</span>
            },
            {
                key: 'isVpp',
                header: 'VPP',
                render: (row) => row.payload?.isVpp ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                        <ZapIcon size={12} fill="currentColor" />
                        Enrolled
                    </div>
                ) : (
                    <span className="text-[10px] font-bold text-subtitle uppercase tracking-wider opacity-40">Standard</span>
                )
            }
        ];

        // Add "Submitted By" column for Master accounts
        if (user?.isMaster === 1) {
            baseColumns.push({
                key: 'portalname',
                header: 'Submitted By',
                render: (row) => (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            <UserIcon size={12} />
                        </div>
                        <span className="text-xs font-semibold text-subtitle">{row.payload?.portalname || 'System'}</span>
                    </div>
                )
            });
        }

        baseColumns.push(
            {
                key: 'status',
                header: 'Status',
                render: (row) => (
                    <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        row.processed === 1
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : row.processed === 2
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                        {row.processed === 1 ? 'Processed' : row.processed === 2 ? 'Rejected' : 'Pending Review'}
                    </div>
                )
            },
            {
                key: 'actions',
                header: '',
                render: (row) => (
                    <Button variant="ghost" size="icon" onClick={() => handleView(row)} className="hover:bg-primary/10 text-primary">
                        <EyeIcon size={18} />
                    </Button>
                )
            }
        );

        return baseColumns;
    }, [user?.isMaster, handleView]);



    return (
        <BranchLayout title="My Enrollments">
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
                                    { value: '0', label: 'Pending Review' },
                                    { value: '1', label: 'Processed' },
                                    { value: '2', label: 'Rejected' }
                                ]}
                                value={filters.status}
                                onChange={(val) => handleFilterChange('status', val as string)}
                                className="w-36 sm:w-48 h-9 text-sm border-none bg-transparent shadow-none focus:ring-0"
                            />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-subtitle opacity-50">
                            Total: {meta?.totalRecords || 0}
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={enrollments}
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
                    <span>Showing {enrollments.length} of {meta?.totalRecords || 0} Enrollments</span>
                    <span>System Sync Active</span>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Enrollment Details"
                size="3xl"
            >
                {selectedEnrollment && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header with name + status */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-border/40">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg",
                                    selectedEnrollment.processed === 1 ? "bg-emerald-500 shadow-emerald-500/20" :
                                        selectedEnrollment.processed === 2 ? "bg-rose-500 shadow-rose-500/20" : "bg-amber-500 shadow-amber-500/20"
                                )}>
                                    {selectedEnrollment.payload?.firstname?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-title tracking-tight">{selectedEnrollment.payload?.firstname} {selectedEnrollment.payload?.lastname}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs font-medium text-subtitle flex items-center gap-2">
                                            <ClockIcon size={12} className="opacity-50" />
                                            Submitted {new Date(selectedEnrollment.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        {user?.isMaster === 1 && selectedEnrollment.payload?.portalname && (
                                            <p className="text-xs font-bold text-primary flex items-center gap-2">
                                                <UserIcon size={12} className="opacity-50" />
                                                By {selectedEnrollment.payload?.portalname}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                                selectedEnrollment.processed === 1 ? "bg-emerald-500" :
                                    selectedEnrollment.processed === 2 ? "bg-rose-500" : "bg-amber-500"
                            )}>
                                {selectedEnrollment.processed === 1 ? 'Processed' : selectedEnrollment.processed === 2 ? 'Rejected' : 'Pending Review'}
                            </div>
                        </div>

                        {/* Detail sections in 2-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <UserIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Personal Details</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'Full Name', value: `${selectedEnrollment.payload?.title || ''} ${selectedEnrollment.payload?.firstname || ''} ${selectedEnrollment.payload?.lastname || ''}`.trim() },
                                        { label: 'Email', value: selectedEnrollment.payload?.email },
                                        { label: 'Mobile', value: selectedEnrollment.payload?.number || selectedEnrollment.payload?.phone || selectedEnrollment.payload?.mobile },
                                        { label: 'DOB', value: selectedEnrollment.payload?.dob },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className="text-sm font-bold text-title text-right truncate">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Property */}
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <MapPinIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Service Property</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'Address', value: selectedEnrollment.payload?.address },
                                        { label: 'Customer Type', value: selectedEnrollment.payload?.customerType },
                                        { label: 'Ownership', value: selectedEnrollment.payload?.ownership_status === 0 ? 'Owns' : 'Rents' },
                                        { label: 'VPP Participation', value: selectedEnrollment.payload?.isVpp ? 'Enrolled' : 'Standard' },
                                        ...(selectedEnrollment.payload?.streetSuffix ? [{ label: 'Street Suffix', value: selectedEnrollment.payload.streetSuffix }] : []),
                                        ...(selectedEnrollment.payload?.deliveryPointIdentifier ? [{ label: 'DPID', value: selectedEnrollment.payload.deliveryPointIdentifier }] : []),
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className={cn(
                                                "text-sm font-bold text-right truncate",
                                                item.label === 'VPP Participation' && item.value === 'Enrolled' ? "text-emerald-500" : "text-title"
                                            )}>{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Identity Verification */}
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <IdCardIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Identity Verification</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'ID Type', value: selectedEnrollment.payload?.idType === 0 ? 'Driver License' : selectedEnrollment.payload?.idType === 1 ? 'Medicare' : 'Passport' },
                                        { label: 'ID Number', value: selectedEnrollment.payload?.idnumber },
                                        ...(selectedEnrollment.payload?.licenseCardNumber ? [{ label: 'Card Number', value: selectedEnrollment.payload?.licenseCardNumber }] : []),
                                        ...(selectedEnrollment.payload?.idstate ? [{ label: 'State', value: selectedEnrollment.payload?.idstate }] : []),
                                        ...(selectedEnrollment.payload?.idexpiary ? [{ label: 'Expiry', value: selectedEnrollment.payload?.idexpiary }] : []),
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className="text-sm font-bold text-title text-right truncate">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plan Details */}
                            <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                                <div className="px-5 py-3 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                                    <CheckIcon size={14} className="text-primary" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Plan Details</h3>
                                </div>
                                <div className="p-2 divide-y divide-border/20">
                                    {[
                                        { label: 'NMI', value: selectedEnrollment.payload?.nmi },
                                        { label: 'Tariff Code', value: selectedEnrollment.payload?.tariffcode },
                                        { label: 'Discount Applied', value: `${selectedEnrollment.payload?.discount || 0}%` },
                                        ...(selectedEnrollment.payload?.abn ? [{ label: 'ABN', value: selectedEnrollment.payload.abn }] : []),
                                        ...(selectedEnrollment.payload?.businessName ? [{ label: 'Business', value: selectedEnrollment.payload.businessName }] : []),
                                        ...(selectedEnrollment.payload?.legalEntityName ? [{ label: 'Legal Name', value: selectedEnrollment.payload.legalEntityName }] : []),
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-2.5 gap-4">
                                            <span className="text-[11px] text-subtitle font-bold uppercase tracking-wider opacity-60 shrink-0">{item.label}</span>
                                            <span className="text-sm font-bold text-title text-right truncate">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border/40">
                            <Button
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 h-10 font-bold text-subtitle hover:text-title hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                            >
                                Close Details
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </BranchLayout>
    );
}
