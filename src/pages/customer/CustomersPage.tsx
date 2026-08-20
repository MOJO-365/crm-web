import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import {
    PlusIcon, PencilIcon,
    CheckIcon, XIcon, MailIcon, RefreshCwIcon, CreditCardIcon
} from '@/components/icons';
import { GET_CUSTOMERS_CURSOR, RESTORE_CUSTOMER, GET_ALL_FILTERED_CUSTOMER_IDS, GET_RISK_STATUSES, GET_USERS, GET_LEAD_SOURCES, GET_WEB_API_CREDENTIALS } from '@/graphql';
import { Tooltip } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
// import { Switch } from '@/components/ui/Switch';
import { StatusField } from '@/components/common';
import BulkEmailModal from './BulkEmailModal';

import { DNSP_OPTIONS, DISCOUNT_OPTIONS, CUSTOMER_STATUS_OPTIONS, VPP_OPTIONS, VPP_CONNECTED_OPTIONS, ULTIMATE_STATUS_OPTIONS, MSAT_CONNECTED_OPTIONS } from '@/lib/constants';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';

interface CustomerAddress {
    id: string;
    unitNumber?: string;
    streetNumber?: string;
    streetName?: string;
    streetType?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    country?: string;
    fullAddress?: string;
}

interface Customer {
    uid: string;
    customerId?: string;
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    number?: string;
    status: number | string;
    tariffCode?: string;
    discount?: string;
    previousBill?: { path: string; filename?: string };
    identityProof?: { path: string; filename?: string };
    createdAt: string;
    rateVersion?: number;
    address?: CustomerAddress;
    ratePlan?: {
        dnsp?: number;
        tariff?: string;
    };
    vppDetails?: {
        vpp?: number;
        vppConnected?: number;
        vppSignupBonus?: number;
    };
    batteryDetails?: {
        isbattery?: boolean | number;
        batterybrand?: string;
        snnumber?: string;
        batterycapacity?: number;
        exportlimit?: number;
        batterymodel?: string;
        inverterCapacity?: number;
    };
    utilmateStatus?: number;
    msatDetails?: {
        msatConnected?: number;
    };
    utilmateDetails?: {
        utilmateConnected?: number;
    };
    riskStatus?: string;
    assignedToUser?: { uid: string; name: string; email: string };
    createdByUser?: { uid: string; name: string };
    referenceId?: string;
    leadUid?: string;
    isDeleted?: boolean;
    pdrsEmailSent?: number;
    pdrsEmailSentAt?: string;
    portalName?: string;
    hasAcpDetails?: boolean;
    isPartner?: number;
    source?: string;
    referralName?: string;
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

interface SearchFilters {
    id: string;
    name: string;
    mobile: string;
    address: string;
    tariff: string;
    dnsp: string;
    discount: string;
    status: string;
    vpp: string;
    vppConnected: string;
    utilmateStatus: string;
    msatConnected: string;
    riskStatus: string;
    assignedTo: string;
    createdBy: string;
    portal: string;
}
const CUSTOMERS_FILTER_KEY = 'customers_search_filters';

const INITIAL_FILTERS: SearchFilters = {
    id: '',
    name: '',
    mobile: '',
    address: '',
    tariff: '',
    dnsp: '',
    discount: '',
    status: '',
    vpp: '',
    vppConnected: '',
    utilmateStatus: '',
    msatConnected: '',
    riskStatus: '',
    assignedTo: '',
    createdBy: '',
    portal: '',
};

export function CustomersPage() {
    const { data: webApiCredsData } = useQuery(GET_WEB_API_CREDENTIALS);
    const navigate = useNavigate();
    const location = useLocation();
    const canView = useAuthStore((state) => state.canViewMenu('customers'));
    const canCreate = useAuthStore((state) => state.canCreateInMenu('customers'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('customers'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('customers'));
    const canViewAllCustomers = useAuthStore((state) => state.hasFeatureAccess('feature_view_all_customers'));
    const [searchFilters, setSearchFilters] = useState<SearchFilters>(() => {
        const saved = sessionStorage.getItem(CUSTOMERS_FILTER_KEY);
        try {
            return saved ? { ...INITIAL_FILTERS, ...JSON.parse(saved) } : INITIAL_FILTERS;
        } catch (e) {
            console.error('Failed to parse saved filters', e);
            return INITIAL_FILTERS;
        }
    });

    // Handle reset filters from sidebar navigation
    useEffect(() => {
        if (location.state?.resetFilters) {
            handleResetFilters();
            // Clear the state to prevent resetting on every re-render/refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    // Save filters to sessionStorage when they change
    useEffect(() => {
        sessionStorage.setItem(CUSTOMERS_FILTER_KEY, JSON.stringify(searchFilters));
    }, [searchFilters]);

    const [debouncedFilters, setDebouncedFilters] = useState(searchFilters);
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]); // Index 0 corresponds to page 1's start cursor (which is null)

    // Restore modal state
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [customerToRestore, setCustomerToRestore] = useState<Customer | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    // Lazy query for fetching all filtered customer IDs (for Select All)
    const [fetchAllFilteredIds] = useLazyQuery(GET_ALL_FILTERED_CUSTOMER_IDS, {
        fetchPolicy: 'network-only',
    });

    // State for selection
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
    const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
    const [isSelectingAll, setIsSelectingAll] = useState(false);
    const [totalFilteredCount, setTotalFilteredCount] = useState<number | undefined>(undefined);

    const [limit, setLimit] = useState(20);

    const { data: rsData } = useQuery(GET_RISK_STATUSES);
    const riskStatuses = rsData?.riskStatuses || [];

    const { data: sourcesData } = useQuery(GET_LEAD_SOURCES);
    const { data: credentialsData } = useQuery(GET_WEB_API_CREDENTIALS);

    const { data: userData } = useQuery(GET_USERS, {
        variables: { limit: 1000, status: 'ACTIVE', onlyVisibleRoles: true },
    });
    const userOptions = useMemo(() => {
        return (userData?.users?.data || []).map((u: any) => ({
            value: u.uid,
            label: u.name || u.email,
        }));
    }, [userData]);

    const sourceFilterOptions = useMemo(() => {
        const baseOptions = [
            { value: '', label: 'All' },
            { value: 'Gee Energy', label: 'Gee Energy' },
            { value: 'PEERLESSGROUP', label: 'Peer Less Group' },
            { value: 'BESS2', label: 'BESS2' }
        ];

        const credentialOptions = (credentialsData?.webApiCredentials || [])
            .filter((c: any) => c.isPDRS && c.portalName && c.portalName.trim() !== '')
            .map((c: any) => ({
                value: c.portalName,
                label: c.name
            }));

        const leadOptions = (sourcesData?.leadSources || []).map((s: any) => ({
            value: s.name,
            label: s.name
        }));

        // Combine and filter out duplicates based on value
        const allOptions = [...baseOptions, ...credentialOptions, ...leadOptions];
        const uniqueOptions = allOptions.filter((option, index, self) =>
            index === self.findIndex((t) => t.value === option.value)
        );

        return uniqueOptions;
    }, [sourcesData, credentialsData]);

    // Debounce search and reset pagination
    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(searchFilters) !== JSON.stringify(debouncedFilters)) {
                setAllCustomers([]);
                setDebouncedFilters(searchFilters);
                // Reset pagination and selection
                setCurrentPage(1);
                setPageCursors([null]);
                setSelectedCustomerIds([]);
                setTotalFilteredCount(undefined);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchFilters, debouncedFilters]);

    const { data, loading, error } = useQuery<CustomersCursorResponse>(GET_CUSTOMERS_CURSOR, {
        variables: {
            first: limit,
            after: pageCursors[currentPage - 1] || null,
            searchId: debouncedFilters.id || undefined,
            searchName: debouncedFilters.name || undefined,
            searchMobile: debouncedFilters.mobile || undefined,
            searchAddress: debouncedFilters.address || undefined,
            searchTariff: debouncedFilters.tariff || undefined,
            searchDnsp: debouncedFilters.dnsp || undefined,
            searchDiscount: debouncedFilters.discount !== '' ? parseInt(debouncedFilters.discount) : undefined,
            searchStatus: (debouncedFilters.status !== '' && debouncedFilters.status !== 'deleted') ? parseInt(debouncedFilters.status) : undefined,
            searchVpp: debouncedFilters.vpp !== '' ? parseInt(debouncedFilters.vpp) : undefined,
            searchVppConnected: debouncedFilters.vppConnected !== '' ? parseInt(debouncedFilters.vppConnected) : undefined,
            searchUtilmateStatus: debouncedFilters.utilmateStatus !== '' ? parseInt(debouncedFilters.utilmateStatus) : undefined,
            searchMsatConnected: debouncedFilters.msatConnected !== '' ? parseInt(debouncedFilters.msatConnected) : undefined,
            searchRiskStatus: debouncedFilters.riskStatus || undefined,
            searchAssignedTo: debouncedFilters.assignedTo || undefined,
            searchCreatedBy: debouncedFilters.createdBy || undefined,
            searchPortal: debouncedFilters.portal || undefined,
            includeDeleted: debouncedFilters.status === 'deleted' ? 'only' : 'false',
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    const pageInfo = data?.customersCursor?.pageInfo;

    // Update customers when data changes
    useEffect(() => {
        if (data?.customersCursor?.data) {
            setAllCustomers(data.customersCursor.data);

            // If we have an endCursor and we are moving forward to a page we haven't visited yet (conceptually),
            // though with this array approach we usually just push the next one if it doesn't exist.
            if (data.customersCursor.pageInfo.endCursor) {
                setPageCursors(prev => {
                    const newCursors = [...prev];
                    // Ensure the cursor for the NEXT page (index = currentPage) is set
                    if (newCursors.length <= currentPage) {
                        newCursors[currentPage] = data.customersCursor.pageInfo.endCursor;
                    } else {
                        newCursors[currentPage] = data.customersCursor.pageInfo.endCursor;
                    }
                    return newCursors;
                });
            }
        }
    }, [data, currentPage]);



    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        // Prevent going to next page if we don't have a cursor for it, unless it's page 1
        if (newPage > currentPage && !pageInfo?.hasNextPage) return;

        setCurrentPage(newPage);
        // Deselect when changing pages (optional, but typical for non-persisted selection across pages)
        // Keeping selection across pages might be desired, current logic allows it if IDs are kept.
        // Existing logic `setSelectedCustomerIds` persists IDs, so we can keep them.
    };

    const handleResetFilters = () => {
        setSearchFilters(INITIAL_FILTERS);
        sessionStorage.removeItem(CUSTOMERS_FILTER_KEY);
    };

    const handleSearchChange = (key: keyof SearchFilters, value: string | boolean) => {
        setSearchFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageSizeChange = (newSize: number) => {
        setLimit(newSize);
        setCurrentPage(1);
        setPageCursors([null]);
    };

    const [restoreCustomer] = useMutation(RESTORE_CUSTOMER);

    const handleRestoreCustomerClick = (customer: Customer) => {
        setCustomerToRestore(customer);
        setRestoreModalOpen(true);
    };

    const handleConfirmRestore = async () => {
        if (!customerToRestore) return;

        setIsRestoring(true);
        try {
            const { data: result } = await restoreCustomer({
                variables: { uid: customerToRestore.uid }
            });

            if (result?.restoreCustomer) {
                toast.success('Customer restored successfully');
                setAllCustomers(prev => prev.map(c => c.uid === customerToRestore.uid ? { ...c, isDeleted: false } : c));
                setRestoreModalOpen(false);
                setCustomerToRestore(null);
            }
        } catch (err: any) {
            console.error('Failed to restore customer:', err);
            toast.error(err.message || 'Failed to restore customer');
        } finally {
            setIsRestoring(false);
        }
    };

    const handleEdit = (customer: Customer) => {
        navigate(`/customers/${customer.uid}/edit`);
    };

    // Handler to view customer details in modal
    // Handler to view customer details in modal
    const handleViewDetails = (customer: Customer) => {
        navigate(`/customers/${customer.uid}`);
    };

    // allCustomers now contains API-filtered results (search is done server-side)
    const filteredCustomers = allCustomers;

    const showActionsColumn = canView || canEdit || canDelete;

    const isFiltered = Object.values(searchFilters).some(value => value !== '' && value !== null && value !== undefined);

    // Selection Logic handled by DataTable
    const hasSelection = selectedCustomerIds.length > 0;

    // Handle Select All - fetches all customer IDs matching current filters from backend
    const handleSelectAll = async (selectAll: boolean) => {
        if (!selectAll) {
            // Deselect all
            setSelectedCustomerIds([]);
            return;
        }

        // Fetch all customer IDs matching the current filters
        setIsSelectingAll(true);
        try {
            const { data } = await fetchAllFilteredIds({
                variables: {
                    searchId: debouncedFilters.id || undefined,
                    searchName: debouncedFilters.name || undefined,
                    searchMobile: debouncedFilters.mobile || undefined,
                    searchAddress: debouncedFilters.address || undefined,
                    searchTariff: debouncedFilters.tariff || undefined,
                    searchDnsp: debouncedFilters.dnsp || undefined,
                    searchDiscount: debouncedFilters.discount ? parseInt(debouncedFilters.discount) : undefined,
                    searchStatus: (debouncedFilters.status !== '' && debouncedFilters.status !== 'deleted') ? parseInt(debouncedFilters.status) : undefined,
                    searchVpp: debouncedFilters.vpp !== '' ? parseInt(debouncedFilters.vpp) : undefined,
                    searchVppConnected: debouncedFilters.vppConnected !== '' ? parseInt(debouncedFilters.vppConnected) : undefined,
                    searchUtilmateStatus: debouncedFilters.utilmateStatus !== '' ? parseInt(debouncedFilters.utilmateStatus) : undefined,
                    searchMsatConnected: debouncedFilters.msatConnected !== '' ? parseInt(debouncedFilters.msatConnected) : undefined,
                    searchRiskStatus: debouncedFilters.riskStatus || undefined,
                    searchAssignedTo: debouncedFilters.assignedTo || undefined,
                    searchPortal: debouncedFilters.portal || undefined,
                    includeDeleted: debouncedFilters.status === 'deleted' ? 'only' : 'false',
                },
            });

            if (data?.customersCursor?.data) {
                const allIds = data.customersCursor.data.map((c: { uid: string }) => c.uid);
                setSelectedCustomerIds(allIds);
                setTotalFilteredCount(allIds.length);
                // toast.success(`Selected all ${allIds.length} customers matching your filters`);
            }
        } catch (error: any) {
            console.error('Error fetching all customer IDs:', error);
            toast.error('Failed to select all customers');
            setSelectedCustomerIds([]);
        } finally {
            setIsSelectingAll(false);
        }
    };

    const columns: Column<Customer>[] = [
        // Only show actions column if user has at least one action permission or we need selection

        {
            key: 'id',
            header: (
                <div className="flex flex-col gap-1 max-w-[100px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.id ? "text-primary" : "text-muted-foreground"
                        )}>
                            Customer ID
                        </span>
                        {searchFilters.id && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.id}
                        onChange={(e) => handleSearchChange('id', e.target.value)}
                        placeholder="Search ID..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.id && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.id && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('id', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => (
                row.status === 4 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 cursor-not-allowed">
                        {row.customerId || row.uid.slice(0, 8)}
                    </span>
                ) : (
                    <button
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        onClick={() => handleViewDetails(row)}
                    >
                        {row.customerId || row.uid.slice(0, 8)}
                    </button>
                )
            ),
        },
        {
            key: 'name',
            header: (
                <div className="flex flex-col gap-1 min-w-[100px]">
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
            width: 'w-[200px]',
            render: (row) => {
                const fullName = `${row.title ? row.title + ' ' : ''}${row.firstName} ${row.lastName}`;
                return (
                    <div className="flex flex-col items-start gap-1">
                        <Tooltip content={fullName} fullWidth>
                            <span className="font-medium text-foreground truncate block max-w-[180px]">
                                {fullName}
                            </span>
                        </Tooltip>
                        {/* {row.isDeleted && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                Archived
                            </span>
                        )} */}
                    </div>
                );
            },
        },
        {
            key: 'discount',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.discount ? "text-primary" : "text-muted-foreground"
                        )}>
                            Discount
                        </span>
                        {searchFilters.discount && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...DISCOUNT_OPTIONS]}
                        value={searchFilters.discount}
                        onChange={(val) => handleSearchChange('discount', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[65px] transition-all duration-200",
                            searchFilters.discount && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => <span className="text-foreground">{row.discount ? `${row.discount} %` : '0 %'}</span>,
        },
        {
            key: 'status',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.status ? "text-primary" : "text-muted-foreground"
                        )}>
                            Status
                        </span>
                        {searchFilters.status && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[
                            { value: '', label: 'All' },
                            ...CUSTOMER_STATUS_OPTIONS,
                            { value: 'deleted', label: 'Archive' }
                        ]}
                        value={searchFilters.status}
                        onChange={(val) => handleSearchChange('status', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[85px] transition-all duration-200",
                            searchFilters.status && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            width: 'w-[110px]',
            render: (row: Customer) => (
                <div className="whitespace-nowrap">
                    {row.isDeleted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Archive
                        </span>
                    ) : (
                        <StatusField
                            type="customer_status"
                            value={row.status}
                            mode="badge"
                        />
                    )}
                </div>
            ),
        },
        {
            key: 'riskStatus',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.riskStatus ? "text-primary" : "text-muted-foreground"
                        )}>
                            Risk Status
                        </span>
                        {searchFilters.riskStatus && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...riskStatuses.map((rs: any) => ({ value: rs.uid, label: rs.name }))]}
                        value={searchFilters.riskStatus}
                        onChange={(val) => handleSearchChange('riskStatus', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            searchFilters.riskStatus && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            width: 'w-[150px]',
            render: (row: Customer) => (
                <div className="whitespace-nowrap">
                    <StatusField
                        type="risk_status"
                        value={row.riskStatus}
                        mode="badge"
                        riskStatuses={riskStatuses}
                    />
                </div>
            ),
        },
        ...(canViewAllCustomers ? [{
            key: 'assignedTo',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.assignedTo ? "text-primary" : "text-muted-foreground"
                        )}>
                            Assigned To
                        </span>
                        {searchFilters.assignedTo && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...userOptions]}
                        value={searchFilters.assignedTo}
                        onChange={(val) => handleSearchChange('assignedTo', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            searchFilters.assignedTo && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            width: 'w-[150px]',
            render: (row: Customer) => (
                <div className="whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground">
                        {row.assignedToUser?.name || '-'}
                    </span>
                </div>
            ),
        }] : []),
        {
            key: 'vppConnected',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                            searchFilters.vpp ? "text-primary" : "text-muted-foreground"
                        )}>
                            VPP
                        </span>
                        {searchFilters.vpp && <div className="w-1 h-1 rounded-full bg-primary" />}
                        <Select
                            options={[{ value: '', label: 'All' }, ...VPP_OPTIONS]}
                            value={searchFilters.vpp}
                            onChange={(val) => handleSearchChange('vpp', val as string)}
                            placeholder="All"
                            className={cn(
                                "h-7 text-xs w-[70px] transition-all duration-200 ml-1",
                                searchFilters.vpp && "border-primary ring-1 ring-primary/30 bg-primary/5"
                            )}
                        />
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...VPP_CONNECTED_OPTIONS]}
                        value={searchFilters.vppConnected}
                        onChange={(val) => handleSearchChange('vppConnected', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[98px] transition-all duration-200",
                            searchFilters.vppConnected && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <div className="flex justify-center">
                    {row.vppDetails?.vppConnected === 1 ? (
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                            <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'isBattery',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors whitespace-nowrap">
                            Is Battery
                        </span>
                    </div>
                </div>
            ),
            render: (row) => {
                const hasBattery = !!(row.batteryDetails?.isbattery || row.batteryDetails?.batterybrand || row.batteryDetails?.batterymodel || row.batteryDetails?.snnumber);
                return (
                    <div className="flex justify-center">
                        {hasBattery ? (
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        ) : (
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                                <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'portalName',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                            searchFilters.portal ? "text-primary" : "text-muted-foreground"
                        )}>
                            Source
                        </span>
                        {searchFilters.portal && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={sourceFilterOptions}
                        value={searchFilters.portal}
                        onChange={(val) => handleSearchChange('portal', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            searchFilters.portal && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            width: 'w-[200px] min-w-[150px]',
            render: (row) => {
                let displayPortal = '';
                
                if (row.portalName) {
                    displayPortal = String(row.portalName);
                    
                    if (webApiCredsData?.webApiCredentials) {
                        const matchedCred = webApiCredsData.webApiCredentials.find((c: any) => c.portalName === displayPortal && c.isPDRS);
                        if (matchedCred) {
                            displayPortal = matchedCred.name;
                        }
                    }
                }

                if (row.isPartner) {
                    // Keep the matched client name or raw portalName
                } else if (row.hasAcpDetails) {
                    displayPortal = 'BESS2';
                } else if (displayPortal) {
                    if (displayPortal.toUpperCase() === 'PEERLESSGROUP') {
                        displayPortal = 'PeerLessGroup';
                    } else if (displayPortal.toUpperCase().includes('GEE')) {
                        displayPortal = 'Gee Energy';
                    }
                }

                if (displayPortal) {
                    if (row.referenceId) {
                        return (
                            <Tooltip content={`Ref ID: ${row.referenceId}`} position="top">
                                <span className="text-foreground text-xs font-medium cursor-help border-b border-dashed border-muted-foreground hover:text-primary transition-colors">
                                    {displayPortal}
                                </span>
                            </Tooltip>
                        );
                    }
                    return (
                        <span className="text-foreground text-xs font-medium">
                            {displayPortal}
                        </span>
                    );
                }

                if (row.source) {
                    if (row.source === 'Referral' && row.referralName) {
                        return (
                            <Tooltip content={`Referred by: ${row.referralName}`} position="top">
                                <span className="text-foreground text-xs font-medium cursor-help border-b border-dashed border-muted-foreground hover:text-primary transition-colors">
                                    Referral
                                </span>
                            </Tooltip>
                        );
                    }
                    return (
                        <span className="text-foreground text-xs font-medium">
                            {row.source}
                        </span>
                    );
                }

                return (
                    <span className="text-foreground text-xs font-medium">
                        -
                    </span>
                );
            },
        },
        ...(searchFilters.status === '3' ? [
            {
                key: 'utilmateStatus',
                header: (
                    <div className="flex flex-col gap-1 items-start">
                        <div className="h-7 flex items-center gap-1.5">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                searchFilters.utilmateStatus ? "text-primary" : "text-muted-foreground"
                            )}>
                                Ultimate
                            </span>
                            {searchFilters.utilmateStatus && <div className="w-1 h-1 rounded-full bg-primary" />}
                        </div>
                        <Select
                            options={[{ value: '', label: 'All' }, ...ULTIMATE_STATUS_OPTIONS]}
                            value={searchFilters.utilmateStatus}
                            onChange={(val) => handleSearchChange('utilmateStatus', val as string)}
                            placeholder="All"
                            className={cn(
                                "h-7 text-xs w-[70px] transition-all duration-200",
                                searchFilters.utilmateStatus && "border-primary ring-1 ring-primary/30 bg-primary/5"
                            )}
                        />
                    </div>
                ),
                render: (row: Customer) => (
                    <div className="flex justify-center">
                        {row.utilmateDetails?.utilmateConnected === 1 ? (
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        ) : (
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                                <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'msatConnected',
                header: (
                    <div className="flex flex-col gap-1 items-start">
                        <div className="h-7 flex items-center gap-1.5">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                searchFilters.msatConnected ? "text-primary" : "text-muted-foreground"
                            )}>
                                MSAT
                            </span>
                            {searchFilters.msatConnected && <div className="w-1 h-1 rounded-full bg-primary" />}
                        </div>
                        <Select
                            options={[{ value: '', label: 'All' }, ...MSAT_CONNECTED_OPTIONS]}
                            value={searchFilters.msatConnected}
                            onChange={(val) => handleSearchChange('msatConnected', val as string)}
                            placeholder="All"
                            className={cn(
                                "h-7 text-xs w-[70px] transition-all duration-200",
                                searchFilters.msatConnected && "border-primary ring-1 ring-primary/30 bg-primary/5"
                            )}
                        />
                    </div>
                ),
                render: (row: Customer) => (
                    <div className="flex justify-center">
                        {row.msatDetails?.msatConnected === 1 ? (
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        ) : (
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                                <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                    </div>
                ),
            }
        ] : []),
        {
            key: 'mobile',
            header: (
                <div className="flex flex-col gap-1 max-w-[110px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.mobile ? "text-primary" : "text-muted-foreground"
                        )}>
                            Mobile
                        </span>
                        {searchFilters.mobile && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.mobile}
                        onChange={(e) => handleSearchChange('mobile', e.target.value)}
                        placeholder="Search mobile..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.mobile && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.mobile && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('mobile', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            width: 'w-[120px]',
            render: (row) => <span className="text-foreground">{row.number || '-'}</span>,
        },
        {
            key: 'address',
            header: (
                <div className="flex flex-col gap-1 min-w-[120px]">
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
            width: 'w-[220px]',
            render: (row) => {
                const fullAddr = row.address?.fullAddress;
                if (!fullAddr) return <span className="text-muted-foreground">-</span>;
                return (
                    <Tooltip content={fullAddr}>
                        <span className="text-foreground text-sm truncate max-w-[220px] block">
                            {fullAddr}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            key: 'tariff',
            header: (
                <div className="flex flex-col gap-1 min-w-[100px]">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.tariff ? "text-primary" : "text-muted-foreground"
                        )}>
                            Tariff
                        </span>
                        {searchFilters.tariff && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={searchFilters.tariff}
                        onChange={(e) => handleSearchChange('tariff', e.target.value)}
                        placeholder="Search tariff..."
                        className={cn(
                            "h-7 text-xs transition-all duration-200",
                            searchFilters.tariff && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={searchFilters.tariff && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleSearchChange('tariff', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            width: 'w-[130px]',
            render: (row) => <span className="text-foreground">{row.tariffCode || row.ratePlan?.tariff || '-'}</span>,
        },
        {
            key: 'dnsp',
            header: (
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            searchFilters.dnsp ? "text-primary" : "text-muted-foreground"
                        )}>
                            DNSP
                        </span>
                        {searchFilters.dnsp && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[{ value: '', label: 'All' }, ...DNSP_OPTIONS]}
                        value={searchFilters.dnsp}
                        onChange={(val) => handleSearchChange('dnsp', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[85px] transition-all duration-200",
                            searchFilters.dnsp && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => <StatusField type="dnsp" value={row.ratePlan?.dnsp} mode="badge" />,
        },
        // {
        //     key: 'pdrsEmailSent',
        //     header: (
        //         <div className="flex flex-col gap-1 items-start">
        //             <div className="h-7 flex items-center gap-1.5">
        //                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        //                     PDRS Email
        //                 </span>
        //             </div>
        //         </div>
        //     ),
        //     width: 'w-[100px]',
        //     render: (row: Customer) => (
        //         <div className="flex justify-center">
        //             {row.pdrsEmailSent === 1 ? (
        //                 <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
        //                     <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
        //                 </div>
        //             ) : (
        //                 <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
        //                     <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
        //                 </div>
        //             )}
        //         </div>
        //     ),
        // },
        // {
        //     key: 'pdrsEmailSentAt',
        //     header: (
        //         <div className="flex flex-col gap-1 items-start">
        //             <div className="h-7 flex items-center gap-1.5">
        //                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        //                     PDRS Sent At
        //                 </span>
        //             </div>
        //         </div>
        //     ),
        //     width: 'w-[150px]',
        //     render: (row: Customer) => (
        //         <span className="text-xs text-foreground">
        //             {row.pdrsEmailSentAt ? new Date(row.pdrsEmailSentAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
        //         </span>
        //     ),
        // },
        ...(showActionsColumn ? [{
            key: 'actions' as const,
            header: (
                <div className="flex flex-col gap-1 min-w-[100px]">
                    <div className="h-7 flex items-center">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Actions</span>
                    </div>
                    {/* <div className="h-7 flex items-center">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            ref={input => {
                                if (input) input.indeterminate = someSelected;
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        />
                    </div> */}
                </div>
            ),
            width: 'w-[100px]',
            sticky: 'right' as const,
            render: (row: Customer) => (
                <div className="flex items-center gap-3">
                    {/* <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedCustomerIds.includes(row.uid)}
                            onChange={(e) => handleSelectRow(row.uid, e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        />
                    </div> */}
                    <div className="flex items-center gap-2">
                        {canView && (
                            <Tooltip content={row.status === 4 ? "Cannot view frozen customer" : "View Details"}>
                                <button
                                    className={`p-2 border rounded-lg transition-colors ${row.status === 4
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                                        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40'
                                        }`}
                                    onClick={() => row.status !== 4 && handleViewDetails(row)}
                                    disabled={row.status === 4}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                </button>
                            </Tooltip>
                        )}
                        {canEdit &&
                            // row.status !== 3 && 
                            !row.isDeleted && (
                                <Tooltip content="Edit Customer">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleEdit(row)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                        {canView && !row.isDeleted && row.status !== 4 && (
                            <Tooltip content="Billing Cycle">
                                <button
                                    className="p-2 border border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 transition-colors dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/40"
                                    onClick={() => navigate(`/customer-billing?customer=${row.uid}`)}
                                >
                                    <CreditCardIcon size={16} />
                                </button>
                            </Tooltip>
                        )}
                        {row.isDeleted && (
                            <Tooltip content="Restore Customer">
                                <button
                                    className="p-2 border border-green-400 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors shadow-sm"
                                    onClick={() => handleRestoreCustomerClick(row)}
                                >
                                    <RefreshCwIcon size={16} />
                                </button>
                            </Tooltip>
                        )}

                    </div>
                </div>
            ),
        }] : [])
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer accounts</p>
                </div>
                <div className="flex items-center gap-2">
                    {hasSelection && (
                        <div className="flex items-center gap-2 mr-2">
                            <span className="text-sm text-muted-foreground">{selectedCustomerIds.length} selected</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBulkEmailModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <MailIcon size={16} />
                                Send Email
                            </Button>
                        </div>
                    )}
                    {canCreate && (
                        <Button
                            leftIcon={<PlusIcon size={16} />}
                            onClick={() => navigate('/customers/new')}
                        >
                            Add Customer
                        </Button>
                    )}
                </div>
            </div>

            {/* Customers Table */}
            <div className='p-5 bg-background rounded-lg border border-border shadow-sm'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Total Customers: <span className="text-foreground font-bold">{pageInfo?.totalCount ?? 0}</span>
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
                    data={filteredCustomers}
                    loading={loading}
                    error={error?.message}
                    rowKey={(row) => row.uid}
                    emptyMessage='No customers found. Click "Add Customer" to create one.'
                    loadingMessage="Loading customers..."
                    rowClassName={(row) => row.isDeleted ? 'bg-red-50 dark:bg-red-900/20' : ''}
                    /* Fixed height for pagination - adjusted to ensure footer is visible */
                    containerHeightClass="h-[calc(100vh-280px)]"
                    enableSelection={true}
                    selectedRowKeys={selectedCustomerIds}
                    onSelectionChange={setSelectedCustomerIds}
                    onSelectAll={handleSelectAll}
                    isSelectingAll={isSelectingAll}
                    totalFilteredCount={totalFilteredCount}
                    pagination={{
                        currentPage,
                        pageSize: limit,
                        totalCount: pageInfo?.totalCount ?? 0,
                        onPageChange: handlePageChange,
                        onPageSizeChange: handlePageSizeChange,
                        hasNextPage: !!pageInfo?.hasNextPage,
                        hasPreviousPage: currentPage > 1,
                    }}
                />
            </div>

            <BulkEmailModal
                isOpen={bulkEmailModalOpen}
                onClose={() => setBulkEmailModalOpen(false)}
                selectedCustomerIds={selectedCustomerIds}
                onSuccess={() => {
                    setSelectedCustomerIds([]);
                    // Optional: refresh list if needed, but not strictly required for email sending
                    toast.success("Bulk email process completed");
                }}
            />

            <Modal
                isOpen={restoreModalOpen}
                onClose={() => setRestoreModalOpen(false)}
                title="Confirm Restoration"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setRestoreModalOpen(false)}
                            disabled={isRestoring}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default" // Using default primary style for restore
                            onClick={handleConfirmRestore}
                            disabled={!customerToRestore || isRestoring}
                            isLoading={isRestoring}
                            loadingText="Restoring..."
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Restore
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to restore customer <span className="font-semibold text-foreground">{customerToRestore?.firstName} {customerToRestore?.lastName}</span>?
                        They will be visible in the active customer lists again.
                    </p>
                </div>
            </Modal>

        </div>
    );
}