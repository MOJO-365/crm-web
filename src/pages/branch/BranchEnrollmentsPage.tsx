import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import { GET_WEB_ENROLLMENTS } from '@/graphql/queries/customers';
import { Input } from '@/components/ui/Input';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EyeIcon, CheckIcon, ChevronLeftIcon, MapPinIcon, UserIcon, IdCardIcon, ZapIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUser } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
}

const INITIAL_FILTERS: SearchFilters = {
    name: '',
    status: ''
};

export function BranchEnrollmentsPage() {
    const user = useUser();
    const navigate = useNavigate();
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

    const { data, loading, error } = useQuery<WebEnrollmentsResponse>(GET_WEB_ENROLLMENTS, {
        variables: {
            page,
            limit,
            searchName: debouncedFilters.name || undefined,
            processed: debouncedFilters.status !== '' ? parseInt(debouncedFilters.status) : undefined,
            searchPortal: user?.name || 'Branch Portal'
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

    const columns: Column<WebEnrollment>[] = [
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
            render: (row) => <span className="text-xs font-mono font-semibold bg-primary/5 text-primary px-2 py-1 rounded-md">{row.payload?.nmi || '-'}</span>
        },
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
    ];

    if (error) {
        return (
            <div className="p-8 text-center text-rose-500 bg-rose-50 rounded-2xl border border-rose-100 mx-auto max-w-lg mt-20">
                <p className="font-bold">Failed to load enrollments</p>
                <p className="text-sm opacity-80">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-[#0a0a0a] dark:via-[#0d0d0d] dark:to-[#0a0a0a] overflow-hidden relative">
            {/* decorative background orbs */}
            <div className="absolute w-[400px] h-[400px] bg-blue-400/15 rounded-full blur-3xl -top-48 -right-48 pointer-events-none" />
            <div className="absolute w-[300px] h-[300px] bg-primary/15 rounded-full blur-3xl -bottom-32 -left-32 pointer-events-none" />

            {/* ── top bar ── */}
            <header className="relative z-10 shrink-0">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/branch-portal')}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                            <ChevronLeftIcon size={16} />
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-md shadow-primary/20">
                                <ZapIcon size={14} className="text-white" />
                            </div>
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-title tracking-tight leading-none">
                                My Enrollments
                            </h1>
                            <p className="text-xs text-subtitle mt-0.5">
                                View and track the status of your customer submissions
                            </p>
                        </div>
                        <h1 className="text-base font-bold text-title tracking-tight sm:hidden">
                            Enrollments
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name..."
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="w-40 sm:w-56 h-9 text-sm shadow-sm rounded-xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-md border-border/50"
                        />
                        <Select
                            options={[
                                { value: '', label: 'All Status' },
                                { value: '0', label: 'Pending' },
                                { value: '1', label: 'Processed' },
                                { value: '2', label: 'Rejected' }
                            ]}
                            value={filters.status}
                            onChange={(val) => handleFilterChange('status', val as string)}
                            className="w-32 sm:w-40 h-9 text-sm shadow-sm rounded-xl"
                        />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* ── table fills remaining height ── */}
            <div className="relative z-10 flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4 pt-1">
                <div className="h-full bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-border/60 overflow-hidden shadow-lg shadow-gray-200/30 dark:shadow-none flex flex-col">
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
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Enrollment Details"
                size="3xl"
            >
                {selectedEnrollment && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header with name + status */}
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-11 h-11 rounded-full flex items-center justify-center font-bold text-base",
                                    selectedEnrollment.processed === 1 ? "bg-emerald-100 text-emerald-600" :
                                        selectedEnrollment.processed === 2 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    {selectedEnrollment.payload?.firstname?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-title">{selectedEnrollment.payload?.firstname} {selectedEnrollment.payload?.lastname}</h2>
                                    <p className="text-[11px] font-medium text-subtitle">
                                        Submitted on {new Date(selectedEnrollment.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                selectedEnrollment.processed === 1 ? "bg-emerald-600 text-white" :
                                    selectedEnrollment.processed === 2 ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                            )}>
                                {selectedEnrollment.processed === 1 ? 'Processed' : selectedEnrollment.processed === 2 ? 'Rejected' : 'Pending Review'}
                            </div>
                        </div>

                        {/* Detail sections in 2-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Personal Information */}
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                    <UserIcon size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Personal Information</h3>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {[
                                        { label: 'Full Name', value: `${selectedEnrollment.payload?.title || ''} ${selectedEnrollment.payload?.firstname || ''} ${selectedEnrollment.payload?.lastname || ''}`.trim() },
                                        { label: 'Email', value: selectedEnrollment.payload?.email },
                                        { label: 'Mobile', value: selectedEnrollment.payload?.number || selectedEnrollment.payload?.phone || selectedEnrollment.payload?.mobile },
                                        { label: 'Date of Birth', value: selectedEnrollment.payload?.dob },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                            <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                            <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Property */}
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                    <MapPinIcon size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Service Property</h3>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {[
                                        { label: 'Address', value: selectedEnrollment.payload?.address },
                                        { label: 'Type', value: selectedEnrollment.payload?.customerType },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                            <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                            <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Identity Verification */}
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                    <IdCardIcon size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Identity Verification</h3>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {[
                                        { label: 'ID Type', value: selectedEnrollment.payload?.idType === 0 ? 'Driver License' : selectedEnrollment.payload?.idType === 1 ? 'Medicare' : 'Passport' },
                                        { label: 'ID Number', value: selectedEnrollment.payload?.idnumber },
                                        ...(selectedEnrollment.payload?.licenseCardNumber ? [{ label: 'Card Number', value: selectedEnrollment.payload?.licenseCardNumber }] : []),
                                        ...(selectedEnrollment.payload?.idstate ? [{ label: 'State', value: selectedEnrollment.payload?.idstate }] : []),
                                        ...(selectedEnrollment.payload?.idexpiary ? [{ label: 'Expiry', value: selectedEnrollment.payload?.idexpiary }] : []),
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                            <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                            <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plan Details */}
                            <div className="rounded-xl border border-border overflow-hidden">
                                <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                    <CheckIcon size={14} className="text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Plan Details</h3>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {[
                                        { label: 'NMI', value: selectedEnrollment.payload?.nmi },
                                        { label: 'Tariff Code', value: selectedEnrollment.payload?.tariffcode },
                                        { label: 'Discount', value: `${selectedEnrollment.payload?.discount || 0}%` },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                            <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                            <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setIsModalOpen(false)} className="px-10 rounded-xl shadow-lg shadow-primary/20">Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
