import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_CUSTOMERS_CURSOR, UPDATE_CUSTOMER } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal } from '@/components/common';
import {
    CheckIcon, SearchIcon,
    AlertCircleIcon, ChevronRightIcon, UserIcon, ArrowLeftIcon,
    ArrowRightIcon
} from '@/components/icons';
import { toast } from 'react-toastify';
import { secondaryApiAxios } from '@/lib/apollo';
import { useAuthStore } from '@/stores/useAuthStore';
import { DNSP_LABELS } from '@/lib/constants';

interface Customer {
    uid: string;
    customerId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    number?: string;
    status: number | string;
    utilmateStatus?: number;
    utilmateUpdatedAt?: string;
    utilmateDetails?: {
        utilmateConnected?: number;
        utilmateConnectedAt?: string;
        utilmateApiPushed?: number | null;
        siteIdentifier?: string;
        accountNumber?: string;
    };
    ratePlan?: {
        dnsp?: number;
    };
    address?: {
        fullAddress?: string;
        nmi?: string;
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

interface UtilmateStatsResponse {
    total: { pageInfo: { totalCount: number } };
    connected: { pageInfo: { totalCount: number } };
    skipConnect: { pageInfo: { totalCount: number } };
    pending: { pageInfo: { totalCount: number } };
}

type UtilmatePushStatus = 'pending' | 'api' | 'manual' | 'connected';

/** Status from customer_utilmate.utilmate_api_pushed (0 = manual, 1 = API, null = pending) */
const getUtilmatePushStatus = (row: Customer): UtilmatePushStatus => {
    if (row.utilmateDetails?.utilmateConnected !== 1 && row.utilmateStatus !== 1) {
        return 'pending';
    }

    const raw = row.utilmateDetails?.utilmateApiPushed;

    if (raw !== null && raw !== undefined) {
        const apiPushed = Number(raw);
        if (!Number.isNaN(apiPushed)) {
            if (apiPushed === 0) return 'manual';
            if (apiPushed === 1) return 'api';
        }
    }

    if (row.utilmateDetails?.utilmateConnected === 1 || row.utilmateStatus === 1) {
        return 'connected';
    }

    return 'pending';
};

const isUtilmatePending = (row: Customer) => getUtilmatePushStatus(row) === 'pending';

const renderUtilmateStatusBadge = (status: UtilmatePushStatus) => {
    switch (status) {
        case 'api':
        case 'connected':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                    <CheckIcon size={12} className="stroke-[3]" />
                    Connected
                </span>
            );
        case 'manual':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                    <CheckIcon size={12} className="stroke-[3]" />
                    Skip & Connect
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
                    <AlertCircleIcon size={12} />
                    Not Connected
                </span>
            );
    }
};

type StatusFilter = 'ALL' | '0' | 'api' | 'manual';

const getUtilmateFilterVariables = (filter: StatusFilter) => {
    switch (filter) {
        case '0':
            return { searchUtilmateStatus: 0, searchUtilmateApiPushed: undefined };
        case 'api':
            return { searchUtilmateStatus: 1, searchUtilmateApiPushed: 1 };
        case 'manual':
            return { searchUtilmateStatus: 1, searchUtilmateApiPushed: 0 };
        case 'ALL':
        default:
            return { searchUtilmateStatus: undefined, searchUtilmateApiPushed: undefined };
    }
};

const GET_UTILMATE_STATS = gql`
    query GetUtilmateStats($searchSigned: Int) {
        total: customersCursor(first: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        connected: customersCursor(first: 1, searchUtilmateStatus: 1, searchUtilmateApiPushed: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        skipConnect: customersCursor(first: 1, searchUtilmateStatus: 1, searchUtilmateApiPushed: 0, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        pending: customersCursor(first: 1, searchUtilmateStatus: 0, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
    }
`;

export const PushToUtilmatePage: React.FC = () => {
    const navigate = useNavigate();
    const canEdit = useAuthStore((state) => state.canEditInMenu('utilmate_tracker'));

    const [searchName, setSearchName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('0');

    const [debouncedName, setDebouncedName] = useState('');
    const [debouncedId, setDebouncedId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]);

    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isPushing, setIsPushing] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const [utilmateForm, setUtilmateForm] = useState({
        siteIdentifier: '',
        accountNumber: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(searchName);
            setDebouncedId(searchId);
            setCurrentPage(1);
            setPageCursors([null]);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchName, searchId]);

    useEffect(() => {
        setCurrentPage(1);
        setPageCursors([null]);
    }, [statusFilter]);

    const filterVariables = getUtilmateFilterVariables(statusFilter);

    const { data, loading, error, refetch } = useQuery<CustomersCursorResponse>(GET_CUSTOMERS_CURSOR, {
        variables: {
            first: limit,
            after: pageCursors[currentPage - 1] || null,
            ...filterVariables,
            searchName: debouncedName || undefined,
            searchId: debouncedId || undefined,
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    const { data: statsData, refetch: refetchStats } = useQuery<UtilmateStatsResponse>(GET_UTILMATE_STATS, {
        variables: {
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
    });

    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    const customers = data?.customersCursor?.data || [];
    const pageInfo = data?.customersCursor?.pageInfo;

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

    const handleOpenConnectModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setUtilmateForm({
            siteIdentifier: customer.utilmateDetails?.siteIdentifier || '',
            accountNumber: customer.utilmateDetails?.accountNumber || '',
        });
        setConnectModalOpen(true);
    };

    const handleSkipAndConnect = async () => {
        if (!selectedCustomer) return;
        setIsSkipping(true);
        try {
            const now = new Date().toISOString();
            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: {
                        status: 9,
                        utilmateStatus: 1,
                        utilmateUpdatedAt: now,
                        utilmateDetails: {
                            siteIdentifier: utilmateForm.siteIdentifier || undefined,
                            accountNumber: utilmateForm.accountNumber || undefined,
                            utilmateConnected: 1,
                            utilmateConnectedAt: now,
                            utilmateApiPushed: 0,
                        },
                        skipStatusUpdate: true,
                    },
                },
            });

            toast.success('Utilmate connected (Skip & Connect)');
            setConnectModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (err: any) {
            console.error('Error connecting Utilmate (Skip):', err);
            toast.error(err.message || 'Failed to connect Utilmate');
        } finally {
            setIsSkipping(false);
        }
    };

    const handleConfirmConnect = async () => {
        if (!selectedCustomer) return;

        if (!utilmateForm.siteIdentifier || !utilmateForm.accountNumber) {
            toast.error('Site Identifier and Account Number are required');
            return;
        }

        setIsPushing(true);
        try {
            try {
                await secondaryApiAxios.post('/v1/utilmate/user/add-user', {
                    account_number: utilmateForm.accountNumber,
                    site_identifier: utilmateForm.siteIdentifier,
                    gee_id: selectedCustomer.customerId || selectedCustomer.uid,
                    dnsp: (selectedCustomer.ratePlan?.dnsp !== undefined && selectedCustomer.ratePlan?.dnsp !== null)
                        ? (DNSP_LABELS[selectedCustomer.ratePlan.dnsp as keyof typeof DNSP_LABELS] || '')
                        : '',
                    nmi_number: selectedCustomer.address?.nmi || '',
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. Utilmate not connected.');
            }

            const now = new Date().toISOString();
            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: {
                        status: 9,
                        utilmateStatus: 1,
                        utilmateUpdatedAt: now,
                        utilmateDetails: {
                            siteIdentifier: utilmateForm.siteIdentifier || undefined,
                            accountNumber: utilmateForm.accountNumber || undefined,
                            utilmateConnected: 1,
                            utilmateConnectedAt: now,
                            utilmateApiPushed: 1,
                        },
                        skipStatusUpdate: true,
                    },
                },
            });

            toast.success('Utilmate connected successfully');
            setConnectModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (err: any) {
            console.error('Error connecting Utilmate:', err);
            toast.error(err.message || 'Failed to connect Utilmate');
        } finally {
            setIsPushing(false);
        }
    };

    const handleDisconnect = async () => {
        if (!selectedCustomer) return;
        setIsDisconnecting(true);

        try {
            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: {
                        utilmateStatus: 0,
                        utilmateDetails: {
                            utilmateConnected: 0,
                            utilmateApiPushed: null,
                        },
                        skipStatusUpdate: true,
                    },
                },
            });

            toast.success('Utilmate disconnected successfully');
            setDisconnectModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (err: any) {
            console.error('Error disconnecting Utilmate:', err);
            toast.error(err.message || 'Failed to disconnect Utilmate');
        } finally {
            setIsDisconnecting(false);
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
            ),
        },
        {
            header: 'Name',
            key: 'name',
            render: (row) => <span className="font-medium text-foreground">{row.firstName} {row.lastName}</span>,
        },
        {
            header: 'Contact Info',
            key: 'contact',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    {row.email && <span className="text-muted-foreground">{row.email}</span>}
                    {row.number && <span className="text-muted-foreground/80">{row.number}</span>}
                </div>
            ),
        },
        {
            header: 'Utilmate Details',
            key: 'utilmate',
            render: (row) => (
                row.utilmateDetails?.siteIdentifier || row.utilmateDetails?.accountNumber ? (
                    <div className="flex flex-col text-xs">
                        {row.utilmateDetails.siteIdentifier && (
                            <span className="font-medium">Site: {row.utilmateDetails.siteIdentifier}</span>
                        )}
                        {row.utilmateDetails.accountNumber && (
                            <span className="text-[10px] text-muted-foreground font-mono">Acct: {row.utilmateDetails.accountNumber}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground italic">—</span>
                )
            ),
        },
        {
            header: 'Utilmate Status',
            key: 'utilmateStatus',
            render: (row) => renderUtilmateStatusBadge(getUtilmatePushStatus(row)),
        },
        {
            header: 'Updated At',
            key: 'updatedAt',
            render: (row) => row.utilmateUpdatedAt ? (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(row.utilmateUpdatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ) : <span className="text-xs text-muted-foreground italic">—</span>,
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {isUtilmatePending(row) ? (
                        <Button
                            size="sm"
                            disabled={!canEdit}
                            onClick={() => handleOpenConnectModal(row)}
                            className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-xs py-1 px-3 h-8 shadow-sm flex items-center gap-1.5"
                            leftIcon={<ArrowRightIcon size={12} />}
                        >
                            Push to Utilmate
                        </Button>
                    ) : (
                        <>
                            {canEdit && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs py-1 px-3 h-8"
                                    onClick={() => {
                                        setSelectedCustomer(row);
                                        setDisconnectModalOpen(true);
                                    }}
                                >
                                    Disconnect
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/customers/${row.uid}`)}
                                className="border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs py-1 px-3 h-8"
                            >
                                Details
                                <ChevronRightIcon size={13} className="ml-1" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Push to Utilmate Tracker
                        </h1>
                        <p className="text-muted-foreground">
                            Track signed customers and push their accounts to the Utilmate platform.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(-1)} className="h-9 px-3 text-sm">
                        <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                        Back
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Total Signed Customers</span>
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
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Connected</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.connected?.pageInfo?.totalCount !== undefined ? statsData.connected.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                        <ArrowRightIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Skip & Connect</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.skipConnect?.pageInfo?.totalCount !== undefined ? statsData.skipConnect.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
                        <AlertCircleIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Not Connected</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.pending?.pageInfo?.totalCount !== undefined ? statsData.pending.pageInfo.totalCount : '—'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border bg-muted/20">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                        <div className="w-full sm:w-[200px]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Connection Status</label>
                            <Select
                                options={[
                                    { value: '0', label: 'Not Connected' },
                                    { value: 'api', label: 'Connected' },
                                    { value: 'manual', label: 'Skip & Connect' },
                                    { value: 'ALL', label: 'All' },
                                ]}
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val as StatusFilter)}
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
                    {error ? (
                        <div className="p-8 text-center text-red-500 font-semibold border border-red-200 bg-red-50 rounded-lg">
                            Error loading customer data: {error.message}
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

            <Modal
                isOpen={connectModalOpen}
                onClose={() => !isPushing && !isSkipping && setConnectModalOpen(false)}
                title="Connect Utilmate"
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setConnectModalOpen(false)}
                            disabled={isPushing || isSkipping}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            className="mr-2 text-primary border-primary/20 hover:bg-primary/5 shadow-sm hover:shadow transition-all duration-300 group"
                            onClick={handleSkipAndConnect}
                            isLoading={isSkipping}
                            disabled={isPushing}
                            rightIcon={<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        >
                            Skip & Connect
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                            onClick={handleConfirmConnect}
                            isLoading={isPushing}
                            disabled={isPushing || isSkipping}
                        >
                            Connect & Save
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please provide Utilmate details to connect.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Site Identifier</label>
                            <Input
                                placeholder="Site ID..."
                                value={utilmateForm.siteIdentifier}
                                onChange={(e) => setUtilmateForm({ ...utilmateForm, siteIdentifier: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Account Number</label>
                            <Input
                                placeholder="Account #..."
                                value={utilmateForm.accountNumber}
                                onChange={(e) => setUtilmateForm({ ...utilmateForm, accountNumber: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={disconnectModalOpen}
                onClose={() => !isDisconnecting && setDisconnectModalOpen(false)}
                title="Disconnect from Utilmate"
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setDisconnectModalOpen(false)}
                            disabled={isDisconnecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
                            onClick={handleDisconnect}
                            isLoading={isDisconnecting}
                            disabled={isDisconnecting}
                        >
                            Disconnect Utilmate
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to disconnect customer {selectedCustomer?.firstName} {selectedCustomer?.lastName} from Utilmate?
                    </p>
                </div>
            </Modal>
        </div>
    );
};
