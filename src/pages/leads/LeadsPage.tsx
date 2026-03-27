import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { DataTable, type Column } from '@/components/common';
import {
    PlusIcon, PencilIcon, TrashIcon, XIcon, ArrowRightIcon
} from '@/components/icons';
import { GET_LEADS, DELETE_LEAD } from '@/graphql';
import { Button, Input, Select, Tooltip } from '@/components/ui';
import { LEAD_SOURCE_OPTIONS } from '@/lib/constants';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMutation } from '@apollo/client';
import { Modal } from '@/components/common';
import { cn } from '@/lib/utils';
import LeadFormModal from './LeadFormModal';

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
    referralName?: string;
    createdAt: string;
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

interface LeadsFilters {
    name: string;
    email: string;
    number: string;
    source: string;
    address: string;
}

const INITIAL_FILTERS: LeadsFilters = {
    name: '',
    email: '',
    number: '',
    source: '',
    address: '',
};

export default function LeadsPage() {
    const navigate = useNavigate();
    const canCreate = useAuthStore((state) => state.canCreateInMenu('leads'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('leads'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('leads'));

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchFilters, setSearchFilters] = useState<LeadsFilters>(INITIAL_FILTERS);
    const [debouncedFilters, setDebouncedFilters] = useState<LeadsFilters>(INITIAL_FILTERS);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editLeadUid, setEditLeadUid] = useState<string | null>(null);

    // Debounce search and reset pagination
    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(searchFilters) !== JSON.stringify(debouncedFilters)) {
                setDebouncedFilters(searchFilters);
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchFilters, debouncedFilters]);

    const { data, loading, refetch } = useQuery<LeadsResponse>(GET_LEADS, {
        variables: {
            page,
            limit,
            search: [
                debouncedFilters.name,
                debouncedFilters.email,
                debouncedFilters.number,
                debouncedFilters.address
            ].filter(Boolean).join(' ') || undefined,
            source: debouncedFilters.source || undefined,
            isCustomerNow: false,
        },
        fetchPolicy: 'network-only',
    });

    const [deleteLeadMutation, { loading: deleting }] = useMutation(DELETE_LEAD);

    const handleDeleteClick = (lead: Lead) => {
        setLeadToDelete(lead);
        setDeleteModalOpen(true);
    };

    const handleSearchChange = (key: keyof LeadsFilters, value: string) => {
        setSearchFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setSearchFilters(INITIAL_FILTERS);
    };

    const handleOpenFormModal = (uid?: string) => {
        setEditLeadUid(uid || null);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditLeadUid(null);
        refetch();
    };

    const confirmDelete = async () => {
        if (!leadToDelete) return;
        try {
            const { data: res } = await deleteLeadMutation({
                variables: { uid: leadToDelete.uid }
            });
            if (res?.deleteLead) {
                toast.success('Lead deleted successfully');
                refetch();
                setDeleteModalOpen(false);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete lead');
        }
    };

    const columns: Column<Lead>[] = [
        {
            key: 'name',
            header: (
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.name ? "text-primary" : "text-muted-foreground"
                        )}>
                            Name
                        </span>
                        {searchFilters.name && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.name}
                        onChange={(e) => handleSearchChange('name', e.target.value)}
                        placeholder="Search name..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.name && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.name && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('name', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {row.title ? row.title + ' ' : ''}{row.firstname} {row.lastname}
                    </span>
                    {row.email && <span className="text-xs text-muted-foreground">{row.email}</span>}
                </div>
            ),
        },
        {
            key: 'email',
            header: (
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.email ? "text-primary" : "text-muted-foreground"
                        )}>
                            Email
                        </span>
                        {searchFilters.email && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.email}
                        onChange={(e) => handleSearchChange('email', e.target.value)}
                        placeholder="Search email..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.email && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.email && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('email', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => row.email || '-',
        },
        {
            key: 'number',
            header: (
                <div className="flex flex-col gap-1 max-w-[120px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.number ? "text-primary" : "text-muted-foreground"
                        )}>
                            Phone
                        </span>
                        {searchFilters.number && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.number}
                        onChange={(e) => handleSearchChange('number', e.target.value)}
                        placeholder="Search phone..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.number && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.number && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('number', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => row.number || '-',
        },
        {
            key: 'source',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.source ? "text-primary" : "text-muted-foreground"
                        )}>
                            Source
                        </span>
                        {searchFilters.source && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...LEAD_SOURCE_OPTIONS]}
                        value={searchFilters.source}
                        onChange={(val) => handleSearchChange('source', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[100px] transition-all duration-200",
                            searchFilters.source && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {row.source || 'Unknown'}
                </span>
            ),
        },
        {
            key: 'address',
            header: (
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.address ? "text-primary" : "text-muted-foreground"
                        )}>
                            Address
                        </span>
                        {searchFilters.address && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.address}
                        onChange={(e) => handleSearchChange('address', e.target.value)}
                        placeholder="Search address..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.address && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.address && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('address', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <span className="text-sm truncate max-w-[200px] block" title={row.fullAddress}>
                    {row.fullAddress || '-'}
                </span>
            ),
        },
        {
            key: 'createdAt',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</span>
                    </div>
                </div>
            ),
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: 'referralName',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Referral</span>
                    </div>
                </div>
            ),
            render: (row) => row.referralName || '-',
        },
        // {
        //     key: 'isCustomerNow',
        //     header: (
        //         <div className="flex flex-col gap-1 items-start text-center">
        //             <div className="h-7 flex items-center">
        //                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer?</span>
        //             </div>
        //         </div>
        //     ),
        //     render: (row) => (
        //         <div className="flex justify-center w-full">
        //             {row.isCustomerNow ? (
        //                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Yes</span>
        //             ) : (
        //                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">No</span>
        //             )}
        //         </div>
        //     ),
        // },
        {
            key: 'actions',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</span>
                    </div>
                </div>
            ),
            render: (row) => (
                <div className="flex items-center gap-2">

                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenFormModal(row.uid)}
                            title="Edit Lead"
                        >
                            <PencilIcon size={14} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(row)}
                            title="Delete Lead"
                        >
                            <TrashIcon size={14} />
                        </Button>
                    )}
                    {canEdit && (
                        <Tooltip content="Onboard customer" position='left'>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-amber-600 bg-amber-50 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                                onClick={() => navigate('/customers/new', { state: { prefillData: row } })}
                            >
                                <ArrowRightIcon size={14} />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    const isFiltered = Object.values(searchFilters).some(value => value !== '' && value !== null && value !== undefined);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Manage and track your customer leads.</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenFormModal()} className="gap-2">
                        <PlusIcon size={16} />
                        Add Lead
                    </Button>
                )}
            </div>

            {/* Leads Table */}
            <div className='p-5 bg-background rounded-lg border border-border shadow-sm'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Total Leads: <span className="text-foreground font-bold">{data?.leads?.meta?.totalRecords ?? 0}</span>
                        </p>
                        {isFiltered && (
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<XIcon size={14} />}
                                onClick={handleResetFilters}
                                className="text-xs font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 h-7 px-3 rounded-full transition-all shadow-sm"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={data?.leads?.data || []}
                    loading={loading}
                    rowKey={(row) => row.uid}
                    pagination={{
                        currentPage: page,
                        pageSize: limit,
                        totalCount: data?.leads?.meta?.totalRecords || 0,
                        onPageChange: setPage,
                        onPageSizeChange: setLimit,
                        hasNextPage: page < (data?.leads?.meta?.totalPages || 0),
                        hasPreviousPage: page > 1,
                    }}
                    containerHeightClass="h-[calc(100vh-280px)]"
                />
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Lead"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} isLoading={deleting}>Delete</Button>
                    </div>
                }
            >
                <p>Are you sure you want to delete lead <strong>{leadToDelete?.firstname} {leadToDelete?.lastname}</strong>? This action cannot be undone.</p>
            </Modal>

            <LeadFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                uid={editLeadUid}
            />
        </div>
    );
}
