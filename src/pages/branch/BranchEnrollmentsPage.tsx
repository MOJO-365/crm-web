import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import { GET_WEB_ENROLLMENTS } from '@/graphql/queries/customers';
import { Input } from '@/components/ui/Input';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EyeIcon, CheckIcon, ChevronLeftIcon, MapPinIcon, CalendarIcon, PhoneIcon, UserIcon, MailIcon, IdCardIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
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

const SummaryItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-border/50">
        <div className="mt-1 p-1.5 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Icon size={14} />
        </div>
        <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
            <p className="text-sm font-bold text-title truncate max-w-[200px]" title={value}>{value || '-'}</p>
        </div>
    </div>
);

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
                return <span className="font-bold text-title">{fullName || '-'}</span>;
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
            render: (row) => <span className="text-xs font-mono font-bold bg-primary/5 text-primary px-2 py-1 rounded-md">{row.payload?.nmi || '-'}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
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
        <div className="min-h-screen bg-gray-50 dark:bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer mb-2" onClick={() => navigate('/branch-portal')}>
                            <ChevronLeftIcon size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-black text-title tracking-tight">My Enrollments</h1>
                        <p className="text-subtitle text-sm">View and track the status of your customer submissions</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Input
                            placeholder="Search by name..."
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)}
                            className="w-full md:w-64 h-10 shadow-sm"
                        />
                        <Select
                            options={[
                                { value: '', label: 'All Status' },
                                { value: '0', label: 'Pending Review' },
                                { value: '1', label: 'Processed' },
                                { value: '2', label: 'Rejected' }
                            ]}
                            value={filters.status}
                            onChange={(val) => handleFilterChange('status', val as string)}
                            className="w-full md:w-48 h-10 shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-card shadow-xl shadow-gray-200/50 dark:shadow-none rounded-3xl border border-border overflow-hidden">
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
                        containerHeightClass="min-h-[400px]"
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                    selectedEnrollment.processed === 1 ? "bg-emerald-100 text-emerald-600" :
                                    selectedEnrollment.processed === 2 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    {selectedEnrollment.payload?.firstname?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-title">{selectedEnrollment.payload?.firstname} {selectedEnrollment.payload?.lastname}</h2>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                        Submitted on {new Date(selectedEnrollment.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                                selectedEnrollment.processed === 1 ? "bg-emerald-600 text-white" :
                                selectedEnrollment.processed === 2 ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                            )}>
                                {selectedEnrollment.processed === 1 ? 'Processed' : selectedEnrollment.processed === 2 ? 'Rejected' : 'Pending Review'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <section className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <UserIcon size={14} /> Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SummaryItem icon={UserIcon} label="Full Name" value={`${selectedEnrollment.payload?.title || ''} ${selectedEnrollment.payload?.firstname || ''} ${selectedEnrollment.payload?.lastname || ''}`} />
                                        <SummaryItem icon={MailIcon} label="Email Address" value={selectedEnrollment.payload?.email} />
                                        <SummaryItem icon={PhoneIcon} label="Mobile Number" value={selectedEnrollment.payload?.number || selectedEnrollment.payload?.phone || selectedEnrollment.payload?.mobile} />
                                        <SummaryItem icon={CalendarIcon} label="Date of Birth" value={selectedEnrollment.payload?.dob} />
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <IdCardIcon size={14} /> Identity Verification
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SummaryItem icon={IdCardIcon} label="ID Type" value={selectedEnrollment.payload?.idType === 0 ? 'Driver License' : selectedEnrollment.payload?.idType === 1 ? 'Medicare' : 'Passport'} />
                                        <SummaryItem icon={IdCardIcon} label="ID Number" value={selectedEnrollment.payload?.idnumber} />
                                        {selectedEnrollment.payload?.licenseCardNumber && <SummaryItem icon={IdCardIcon} label="Card Number" value={selectedEnrollment.payload?.licenseCardNumber} />}
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <section className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <MapPinIcon size={14} /> Service Property
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SummaryItem icon={MapPinIcon} label="Connection Address" value={selectedEnrollment.payload?.address} />
                                        <SummaryItem icon={IdCardIcon} label="Property Type" value={selectedEnrollment.payload?.customerType} />
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <CheckIcon size={14} /> Plan Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <SummaryItem icon={IdCardIcon} label="NMI" value={selectedEnrollment.payload?.nmi} />
                                        <SummaryItem icon={IdCardIcon} label="Tariff Code" value={selectedEnrollment.payload?.tariffcode} />
                                        <SummaryItem icon={CheckIcon} label="Discount" value={`${selectedEnrollment.payload?.discount}%`} />
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setIsModalOpen(false)} className="px-12 rounded-2xl shadow-lg shadow-primary/20">Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
