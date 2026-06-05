import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_CUSTOMERS_CURSOR, UPDATE_CUSTOMER } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal } from '@/components/common';
import {
    RefreshCwIcon, CheckIcon, SearchIcon,
    AlertCircleIcon, UserIcon, ArrowLeftIcon,
    ArrowRightIcon
} from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';

interface Customer {
    uid: string;
    customerId?: string;
    firstName: string;
    lastName: string;
    email: string;
    number?: string;
    status: number | string;
    msatDetails?: {
        msatConnected?: number;
        msatConnectedAt?: string;
        msatUpdatedAt?: string;
    };
    address?: {
        fullAddress?: string;
    };
}

interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
    totalCount?: number;
}

interface CustomersCursorResponse {
    customersCursor: {
        data: Customer[];
        pageInfo: PageInfo;
    };
}

interface MsatStatsResponse {
    total: { pageInfo: { totalCount: number } };
    connected: { pageInfo: { totalCount: number } };
    pending: { pageInfo: { totalCount: number } };
}

const GET_MSAT_STATS = gql`
    query GetMsatStats($searchSigned: Int) {
        total: customersCursor(first: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        connected: customersCursor(first: 1, searchMsatConnected: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        pending: customersCursor(first: 1, searchMsatConnected: 0, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
    }
`;

export const PushToMsatPage: React.FC = () => {
    const navigate = useNavigate();
    const canEdit = useAuthStore((state) => state.canEditInMenu('msat_tracker'));

    // Search and filter states
    const [searchName, setSearchName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | '0' | '1'>('0'); // Default to Pending (0)

    // Debounced search filters
    const [debouncedName, setDebouncedName] = useState('');
    const [debouncedId, setDebouncedId] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]);

    // Modal state for confirmation
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [actionType, setActionType] = useState<'CONNECT' | 'DISCONNECT'>('CONNECT');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debounce search changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(searchName);
            setDebouncedId(searchId);
            // Reset pagination when search changes
            setCurrentPage(1);
            setPageCursors([null]);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchName, searchId]);

    // Reset pagination when status filter changes
    useEffect(() => {
        setCurrentPage(1);
        setPageCursors([null]);
    }, [statusFilter]);

    // Fetch customers (filtered by searchMsatConnected and searchSigned: 1)
    const { data, loading, error, refetch } = useQuery<CustomersCursorResponse>(GET_CUSTOMERS_CURSOR, {
        variables: {
            first: limit,
            after: pageCursors[currentPage - 1] || null,
            searchMsatConnected: statusFilter === 'ALL' ? undefined : parseInt(statusFilter),
            searchName: debouncedName || undefined,
            searchId: debouncedId || undefined,
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    // Fetch static MSAT stats counts (unaffected by UI filters)
    const { data: statsData, refetch: refetchStats } = useQuery<MsatStatsResponse>(GET_MSAT_STATS, {
        variables: {
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
    });

    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    const customers = data?.customersCursor?.data || [];
    const pageInfo = data?.customersCursor?.pageInfo;

    // Track page end cursor for next navigation
    useEffect(() => {
        if (pageInfo?.endCursor) {
            setPageCursors(prev => {
                const newCursors = [...prev];
                newCursors[currentPage] = pageInfo.endCursor;
                return newCursors;
            });
        }
    }, [pageInfo, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        if (newPage > currentPage && !pageInfo?.hasNextPage) return;
        setCurrentPage(newPage);
    };

    const handleToggleMsat = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        const newValue = actionType === 'CONNECT';
        const now = new Date().toISOString();

        try {
            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: {
                        msatDetails: {
                            msatConnected: newValue ? 1 : 0,
                            msatConnectedAt: newValue ? now : undefined,
                            msatUpdatedAt: now
                        },
                        skipStatusUpdate: true
                    }
                }
            });

            toast.success(`MSAT ${newValue ? 'connected' : 'disconnected'} successfully`);
            setConfirmModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (error: any) {
            console.error('Error updating MSAT status:', error);
            toast.error(error.message || 'Failed to update MSAT status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Customer>[] = [
        {
            header: 'Customer ID',
            key: 'customerId',
            render: (row) => (
                <button
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    onClick={() => navigate(`/customers/${row.uid}`)}
                >
                    {row.customerId || row.uid.slice(0, 8)}
                </button>
            )
        },
        {
            header: 'Name',
            key: 'name',
            render: (row) => <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>
        },
        {
            header: 'Contact Info',
            key: 'contact',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="text-muted-foreground">{row.email}</span>
                    {row.number && <span className="text-muted-foreground/80">{row.number}</span>}
                </div>
            )
        },
        {
            header: 'Address',
            key: 'address',
            render: (row) => <span className="text-muted-foreground text-xs line-clamp-1">{row.address?.fullAddress || '—'}</span>,
        },
        {
            header: 'MSAT Status',
            key: 'msatConnected',
            render: (row) => (
                row.msatDetails?.msatConnected === 1 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                        <CheckIcon size={12} className="stroke-[3]" />
                        Connected
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
                        <AlertCircleIcon size={12} />
                        Pending
                    </span>
                )
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (row) => {
                if (!canEdit) return null;
                const isConnected = row.msatDetails?.msatConnected === 1;
                return (
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs py-1 px-3 h-8"
                                onClick={() => {
                                    setSelectedCustomer(row);
                                    setActionType('DISCONNECT');
                                    setConfirmModalOpen(true);
                                }}
                            >
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-xs py-1 px-3 h-8 shadow-sm flex items-center gap-1.5"
                                onClick={() => {
                                    setSelectedCustomer(row);
                                    setActionType('CONNECT');
                                    setConfirmModalOpen(true);
                                }}
                                leftIcon={<CheckIcon size={12} />}
                            >
                                Connect MSAT
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-2 border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            MSAT Connection Tracker
                        </h1>
                        <p className="text-muted-foreground">
                            Track customers and manage their Market Settlement and Transfer (MSAT) connection status.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(-1)} className="h-9 px-3 text-sm">
                        <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Total Customers</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.total?.pageInfo?.totalCount !== undefined ? statsData.total.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-900/30">
                        <CheckIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Connected to MSAT</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.connected?.pageInfo?.totalCount !== undefined ? statsData.connected.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
                        <AlertCircleIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Pending Connection</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.pending?.pageInfo?.totalCount !== undefined ? statsData.pending.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter and Table Container */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border bg-muted/20">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                        <div className="w-full sm:w-[150px]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Connection Status</label>
                            <Select
                                options={[
                                    { value: '0', label: 'Pending Connection' },
                                    { value: '1', label: 'Connected' },
                                    { value: 'ALL', label: 'All Customers' }
                                ]}
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val as 'ALL' | '0' | '1')}
                                className="h-9 text-xs transition-all duration-200"
                            />
                        </div>

                        <div className="w-full sm:w-[250px]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Search Name</label>
                            <Input
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Search by name..."
                                className="h-9 text-xs"
                                leftIcon={<SearchIcon size={14} className="text-muted-foreground" />}
                            />
                        </div>

                        <div className="w-full sm:w-[200px]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Search Customer ID</label>
                            <Input
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Search ID..."
                                className="h-9 text-xs"
                                leftIcon={<SearchIcon size={14} className="text-muted-foreground" />}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    {loading ? (
                        <div className="p-12 flex justify-center items-center">
                            <RefreshCwIcon className="animate-spin w-8 h-8 text-primary" />
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-destructive flex flex-col items-center gap-2">
                            <AlertCircleIcon size={32} />
                            <span>Error loading customer data: {error.message}</span>
                        </div>
                    ) : (
                        <DataTable
                            data={customers}
                            columns={columns}
                            rowKey={(row) => row.uid}
                            loading={loading}
                            emptyMessage="No customers found matching the filters"
                            containerHeightClass="h-[300px] sm:h-[calc(100vh-486px)]"
                            pagination={pageInfo ? {
                                currentPage,
                                pageSize: limit,
                                totalCount: pageInfo?.totalCount ?? 0,
                                onPageChange: handlePageChange,
                                onPageSizeChange: (newSize) => {
                                    setLimit(newSize);
                                    setCurrentPage(1);
                                    setPageCursors([null]);
                                },
                                hasNextPage: !!pageInfo?.hasNextPage,
                                hasPreviousPage: currentPage > 1,
                            } : undefined}
                        />
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={confirmModalOpen}
                onClose={() => !isSubmitting && setConfirmModalOpen(false)}
                title={actionType === 'CONNECT' ? 'Connect to MSAT' : 'Disconnect from MSAT'}
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setConfirmModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={actionType === 'CONNECT' ? 'bg-primary text-white hover:bg-primary/90 shadow-md' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md'}
                            onClick={handleToggleMsat}
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            leftIcon={actionType === 'CONNECT' ? <CheckIcon className="w-4 h-4 text-white" /> : undefined}
                        >
                            {actionType === 'CONNECT' ? 'Connect MSAT' : 'Disconnect MSAT'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {actionType === 'CONNECT' 
                            ? `Are you sure you want to mark customer ${selectedCustomer?.firstName} ${selectedCustomer?.lastName} as Connected to MSAT?`
                            : `Are you sure you want to disconnect customer ${selectedCustomer?.firstName} ${selectedCustomer?.lastName} from MSAT?`
                        }
                    </p>
                </div>
            </Modal>
        </div>
    );
};
