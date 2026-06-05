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
    AlertCircleIcon, ChevronRightIcon, UserIcon, ArrowLeftIcon,
    ZapIcon, ArrowRightIcon
} from '@/components/icons';
import { toast } from 'react-toastify';
import { secondaryApiAxios } from '@/lib/apollo';
import { useAuthStore } from '@/stores/useAuthStore';
import { BATTERY_BRAND_OPTIONS } from '@/lib/constants';

interface Customer {
    uid: string;
    customerId?: string;
    firstName: string;
    lastName: string;
    email: string;
    number?: string;
    status: number | string;
    vppDetails?: {
        vpp?: number;
        vppConnected?: number;
        vppSignupBonus?: number;
    };
    batteryDetails?: {
        batterybrand?: string;
        snnumber?: string;
        batterycapacity?: number;
        exportlimit?: number;
        inverterCapacity?: number;
        checkCode?: string;
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

interface GsyncStatsResponse {
    total: { pageInfo: { totalCount: number } };
    connected: { pageInfo: { totalCount: number } };
    pending: { pageInfo: { totalCount: number } };
}

const GET_GSYNC_STATS = gql`
    query GetGsyncStats($searchSigned: Int) {
        total: customersCursor(first: 1, searchVpp: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        connected: customersCursor(first: 1, searchVpp: 1, searchVppConnected: 1, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
        pending: customersCursor(first: 1, searchVpp: 1, searchVppConnected: 0, searchSigned: $searchSigned) {
            pageInfo {
                totalCount
            }
        }
    }
`;

export const PushToGsyncPage: React.FC = () => {
    const navigate = useNavigate();
    const canEdit = useAuthStore((state) => state.canEditInMenu('push_to_gsync'));

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

    // Modal state for pushing to Gsync
    const [pushModalOpen, setPushModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isPushing, setIsPushing] = useState(false);
    const [isSkippingVpp, setIsSkippingVpp] = useState(false);

    // Form fields for VPP push details
    const [vppForm, setVppForm] = useState({
        vppSignupBonus: '',
        batteryBrand: '',
        snNumber: '',
        batteryCapacity: '',
        exportLimit: '',
        inverterCapacity: '',
        checkCode: ''
    });

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

    // Fetch VPP customers (only customers with vpp: 1 and who are signed)
    const { data, loading, error, refetch } = useQuery<CustomersCursorResponse>(GET_CUSTOMERS_CURSOR, {
        variables: {
            first: limit,
            after: pageCursors[currentPage - 1] || null,
            searchVpp: 1,
            searchVppConnected: statusFilter === 'ALL' ? undefined : parseInt(statusFilter),
            searchName: debouncedName || undefined,
            searchId: debouncedId || undefined,
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    // Fetch static VPP stats counts (unaffected by UI filters)
    const { data: statsData, refetch: refetchStats } = useQuery<GsyncStatsResponse>(GET_GSYNC_STATS, {
        variables: {
            searchSigned: 1,
        },
        fetchPolicy: 'network-only',
    });

    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    // Dynamic stats query to get total counts (we can use a separate fetch or deduce from overall counts)
    // For premium UX, we will fetch overall pending vs connected counts by doing quick parallel queries or local counts if simple.
    // Let's call refetch when appropriate.

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

    const handleOpenPushModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setVppForm({
            vppSignupBonus: customer.vppDetails?.vppSignupBonus?.toString() || '',
            batteryBrand: customer.batteryDetails?.batterybrand || '',
            snNumber: customer.batteryDetails?.snnumber || '',
            batteryCapacity: customer.batteryDetails?.batterycapacity?.toString() || '',
            exportLimit: customer.batteryDetails?.exportlimit?.toString() || '',
            inverterCapacity: customer.batteryDetails?.inverterCapacity?.toString() || '',
            checkCode: customer.batteryDetails?.checkCode || ''
        });
        setPushModalOpen(true);
    };

    const handleSkipAndConnectVpp = async () => {
        if (!selectedCustomer) return;
        setIsSkippingVpp(true);
        try {
            const inputData = {
                vppDetails: {
                    vpp: 1,
                    vppConnected: 1,
                },
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: inputData
                }
            });

            toast.success('VPP Connected (Details Skipped)');
            setPushModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (error: any) {
            console.error('Error connecting VPP (Skip):', error);
            toast.error(error.message || 'Failed to connect VPP');
        } finally {
            setIsSkippingVpp(false);
        }
    };

    const handleConfirmPush = async () => {
        if (!selectedCustomer) return;

        if (!vppForm.batteryBrand || !vppForm.snNumber) {
            toast.error('Battery Brand and Serial Number are required');
            return;
        }

        setIsPushing(true);
        try {
            // 1. Sync with secondary API first (matching logic in CustomerDetailsPage.tsx)
            try {
                await secondaryApiAxios.post('/v1/utilmate/user/add-user-battery', {
                    user_id: selectedCustomer.customerId || selectedCustomer.uid,
                    battery_brand: vppForm.batteryBrand,
                    battery_sn_number: vppForm.snNumber,
                    check_code: vppForm.checkCode,
                    battery_usable_capacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : 0,
                    inverter_capacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : 0
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. VPP not connected.');
            }

            // 2. Update customer details in backend DB
            const inputData = {
                vppDetails: {
                    vpp: 1,
                    vppConnected: 1,
                },
                batteryDetails: {
                    batterybrand: vppForm.batteryBrand,
                    snnumber: vppForm.snNumber,
                    batterycapacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : undefined,
                    inverterCapacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : undefined,
                    checkCode: vppForm.checkCode || undefined,
                },
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomer.uid,
                    input: inputData
                }
            });

            toast.success('VPP Connected and details saved');
            setPushModalOpen(false);
            setSelectedCustomer(null);
            refetch();
            refetchStats();
        } catch (error: any) {
            console.error('Error pushing to Gsync:', error);
            toast.error(error.message || 'Failed to push to Gsync VPP');
        } finally {
            setIsPushing(false);
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
            header: 'Battery Details',
            key: 'battery',
            render: (row) => (
                row.batteryDetails?.batterybrand || row.batteryDetails?.snnumber ? (
                    <div className="flex flex-col text-xs">
                        <span className="font-medium">{row.batteryDetails.batterybrand || 'Unknown brand'}</span>
                        {row.batteryDetails.snnumber && (
                            <span className="text-[10px] text-muted-foreground font-mono">SN: {row.batteryDetails.snnumber}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground italic">—</span>
                )
            )
        },
        {
            header: 'VPP Sync Status',
            key: 'vppConnected',
            render: (row) => (
                row.vppDetails?.vppConnected === 1 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                        <CheckIcon size={12} className="stroke-[3]" />
                        Connected
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
                        <AlertCircleIcon size={12} />
                        Pending Push
                    </span>
                )
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.vppDetails?.vppConnected !== 1 ? (
                        <Button
                            size="sm"
                            disabled={!canEdit}
                            onClick={() => handleOpenPushModal(row)}
                            className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-xs py-1 px-3 h-8 shadow-sm flex items-center gap-1.5"
                        >
                            <RefreshCwIcon size={13} className="animate-spin-slow" />
                            Push to Gsync
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/customers/${row.uid}`)}
                            className="border-border hover:bg-accent text-muted-foreground hover:text-foreground text-xs py-1 px-3 h-8"
                        >
                            Details
                            <ChevronRightIcon size={13} className="ml-1" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-2 border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Push to Gsync Tracker
                        </h1>
                        <p className="text-muted-foreground">
                            Track VPP customers and push their battery systems to the Gsync VPP platform.
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
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Total VPP Customers</span>
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
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Pushed to Gsync</span>
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
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Pending Push</span>
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
                                    { value: '0', label: 'Pending Push' },
                                    { value: '1', label: 'Pushed / Connected' },
                                    { value: 'ALL', label: 'All VPP Customers' }
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
                    {error ? (
                        <div className="p-8 text-center text-red-500 font-semibold border border-red-200 bg-red-50 rounded-lg">
                            Error loading VPP customer data: {error.message}
                        </div>
                    ) : (
                        <DataTable
                            data={customers}
                            columns={columns}
                            rowKey={(row) => row.uid}
                            loading={loading}
                            emptyMessage="No VPP customers found matching the filters"
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

            {/* VPP Connection Modal */}
            <Modal
                isOpen={pushModalOpen}
                onClose={() => setPushModalOpen(false)}
                title="Connect VPP - Battery Details"
                size="lg"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setPushModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            className="mr-2 text-primary border-primary/20 hover:bg-primary/5 shadow-sm hover:shadow transition-all duration-300 group"
                            onClick={handleSkipAndConnectVpp}
                            isLoading={isSkippingVpp}
                            rightIcon={<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        >
                            Skip & Connect
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                            onClick={handleConfirmPush}
                            isLoading={isPushing}
                            disabled={isPushing}
                            leftIcon={<ZapIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                        >
                            Connect & Save
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please provide battery details to connect VPP.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Battery Brand</label>
                            <Select
                                options={BATTERY_BRAND_OPTIONS}
                                value={vppForm.batteryBrand}
                                onChange={(val) => setVppForm({ ...vppForm, batteryBrand: val as string })}
                                placeholder="Select Brand..."
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">SN Number</label>
                            <Input
                                placeholder="e.g. SN12345678"
                                value={vppForm.snNumber}
                                onChange={(e) => setVppForm({ ...vppForm, snNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Battery Capacity</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="13.5"
                                    value={vppForm.batteryCapacity}
                                    onChange={(e) => setVppForm({ ...vppForm, batteryCapacity: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div>
                        {/* <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Export Limit</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="5.0"
                                    value={vppForm.exportLimit}
                                    onChange={(e) => setVppForm({ ...vppForm, exportLimit: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div> */}
                        <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Inverter Capacity</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="6.0"
                                    value={vppForm.inverterCapacity}
                                    onChange={(e) => setVppForm({ ...vppForm, inverterCapacity: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div>
                        {(vppForm.batteryBrand === 'Fox ESS' || vppForm.batteryBrand === 'NeoVolt' || vppForm.batteryBrand === 'AlphaESS' || vppForm.batteryBrand === 'Alpha ESS' || vppForm.batteryBrand === 'Aerl') && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Check Code</label>
                                <Input
                                    placeholder="Verification Code"
                                    value={vppForm.checkCode}
                                    onChange={(e) => setVppForm({ ...vppForm, checkCode: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
