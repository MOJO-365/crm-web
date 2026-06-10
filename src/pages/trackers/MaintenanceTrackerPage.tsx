import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_MAINTENANCES,
    GET_MAINTENANCE_STATS,
    GET_ITEM_CATEGORIES,
    GET_USERS,
    UPDATE_CUSTOMER_MAINTENANCE,
    DELETE_CUSTOMER_MAINTENANCE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal } from '@/components/common';
import {
    CheckIcon, SearchIcon,
    AlertCircleIcon, UserIcon, ArrowLeftIcon,
    PencilIcon, TrashIcon, ListIcon, EyeIcon
} from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

interface Customer {
    uid: string;
    customerId?: string;
    firstName: string;
    lastName: string;
    email: string;
    number?: string;
}

interface MaintenanceRecord {
    id: string;
    uid: string;
    customerUid: string;
    customer?: Customer;
    callDate: string;
    category?: string;
    takenCareByUid?: string;
    takenCareByUser?: {
        uid: string;
        name: string;
    };
    method?: number;
    status: number;
    priority: number;
    notes?: string;
    createdAt: string;
    createdByName?: string;
}

interface PageInfo {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
}

interface MaintenancesResponse {
    maintenances: {
        data: MaintenanceRecord[];
        meta: PageInfo;
    };
}

interface StatsResponse {
    maintenanceStats: {
        total: number;
        inProgress: number;
        resolved: number;
        cancelled: number;
    };
}

const MAINTENANCE_METHOD_LABELS: Record<number, string> = {
    1: 'Call',
    2: 'Email'
};

const MAINTENANCE_STATUS_MAP: Record<number, { label: string, color: string }> = {
    1: { label: 'Resolved', color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800' },
    2: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800' },
    3: { label: 'In-Progress', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' }
};

const MAINTENANCE_PRIORITY_MAP: Record<number, { label: string, color: string }> = {
    1: { label: 'Low', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800' },
    2: { label: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
    3: { label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800' },
    4: { label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 animate-pulse' }
};

const STATUS_FILTER_OPTIONS = [
    { value: 'ALL', label: 'All Statuses' },
    { value: '3', label: 'In-Progress' },
    { value: '1', label: 'Resolved' },
    { value: '2', label: 'Cancelled' },
];

const PRIORITY_FILTER_OPTIONS = [
    { value: 'ALL', label: 'All Priorities' },
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Urgent' },
];

const METHOD_FORM_OPTIONS = [
    { value: '1', label: 'Call' },
    { value: '2', label: 'Email' },
];

const STATUS_FORM_OPTIONS = [
    { value: '3', label: 'In-Progress' },
    { value: '1', label: 'Resolved' },
    { value: '2', label: 'Cancelled' },
];

const PRIORITY_FORM_OPTIONS = [
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
    { value: '4', label: 'Urgent' },
];

export const MaintenanceTrackerPage: React.FC = () => {
    const navigate = useNavigate();
    const canEdit = useAuthStore((state) => state.canEditInMenu('maintenance_tracker'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('maintenance_tracker'));

    // Search and filter states
    const [searchName, setSearchName] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('3'); // Default to In-Progress (3)
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

    // Debounced search filters
    const [debouncedName, setDebouncedName] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // Edit/Delete Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit Form State
    const [formState, setFormState] = useState({
        category: '',
        takenCareByUid: '',
        method: 1,
        status: 3,
        priority: 2,
        notes: ''
    });

    // Debounce search changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(searchName);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchName]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, priorityFilter, categoryFilter]);

    // Queries
    const { data, loading, error, refetch } = useQuery<MaintenancesResponse>(GET_MAINTENANCES, {
        variables: {
            page: currentPage,
            limit: limit,
            status: statusFilter === 'ALL' ? undefined : parseInt(statusFilter, 10),
            priority: priorityFilter === 'ALL' ? undefined : parseInt(priorityFilter, 10),
            category: categoryFilter === 'ALL' ? undefined : categoryFilter,
            search: debouncedName || undefined,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    const { data: statsData, refetch: refetchStats } = useQuery<StatsResponse>(GET_MAINTENANCE_STATS, {
        fetchPolicy: 'network-only',
    });

    const { data: categoriesData } = useQuery(GET_ITEM_CATEGORIES, {
        fetchPolicy: 'cache-first'
    });

    const { data: userData } = useQuery(GET_USERS, {
        variables: { limit: 1000, status: 'ACTIVE', onlyVisibleRoles: true },
        fetchPolicy: 'cache-first'
    });

    // Mutations
    const [updateMaintenance] = useMutation(UPDATE_CUSTOMER_MAINTENANCE);
    const [deleteMaintenance] = useMutation(DELETE_CUSTOMER_MAINTENANCE);

    const records = data?.maintenances?.data || [];
    const meta = data?.maintenances?.meta;

    const userOptions = useMemo(() => {
        return userData?.users?.data?.map((u: any) => ({
            label: u.name || 'Unknown User',
            value: u.uid
        })) || [];
    }, [userData]);

    const categoryFilterOptions = useMemo(() => {
        const opts = [{ value: 'ALL', label: 'All Categories' }];
        categoriesData?.itemCategories?.forEach((c: any) => {
            opts.push({ value: c.name, label: c.name });
        });
        return opts;
    }, [categoriesData]);

    const categoryFormOptions = useMemo(() => {
        return categoriesData?.itemCategories?.map((c: any) => ({
            label: c.name,
            value: c.name
        })) || [];
    }, [categoriesData]);

    const handleEditClick = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setFormState({
            category: record.category || '',
            takenCareByUid: record.takenCareByUid || '',
            method: record.method || 1,
            status: record.status,
            priority: record.priority,
            notes: record.notes || ''
        });
        setEditModalOpen(true);
    };

    const handleDeleteClick = (record: MaintenanceRecord) => {
        setSelectedRecord(record);
        setDeleteModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedRecord) return;
        setIsSaving(true);
        try {
            await updateMaintenance({
                variables: {
                    uid: selectedRecord.uid,
                    category: formState.category || undefined,
                    takenCareByUid: formState.takenCareByUid || undefined,
                    method: formState.method,
                    status: formState.status,
                    priority: formState.priority,
                    notes: formState.notes || undefined
                }
            });
            toast.success('Maintenance record updated successfully');
            setEditModalOpen(false);
            refetch();
            refetchStats();
        } catch (err: any) {
            console.error('Error updating maintenance:', err);
            toast.error(err.message || 'Failed to update maintenance record');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;
        setIsDeleting(true);
        try {
            await deleteMaintenance({
                variables: {
                    uid: selectedRecord.uid
                }
            });
            toast.success('Maintenance record deleted successfully');
            setDeleteModalOpen(false);
            refetch();
            refetchStats();
        } catch (err: any) {
            console.error('Error deleting maintenance:', err);
            toast.error(err.message || 'Failed to delete maintenance record');
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: Column<MaintenanceRecord>[] = [
        {
            header: 'Customer ID',
            key: 'customerUid',
            render: (row) => (
                <button
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    onClick={() => navigate(`/customers/${row.customerUid}?section=maintenance`)}
                >
                    {row.customer?.customerId || row.customerUid.slice(0, 8)}
                </button>
            )
        },
        {
            header: 'Customer Name',
            key: 'customerName',
            render: (row) => row.customer ? (
                <button
                    className="font-medium text-foreground hover:text-primary hover:underline text-left"
                    onClick={() => navigate(`/customers/${row.customerUid}?section=maintenance`)}
                >
                    {row.customer.firstName} {row.customer.lastName}
                </button>
            ) : <span className="text-muted-foreground italic">N/A</span>
        },
        {
            header: 'Call Date',
            key: 'callDate',
            render: (row) => (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(row.callDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'Category',
            key: 'category',
            render: (row) => row.category ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    {row.category}
                </span>
            ) : <span className="text-xs text-muted-foreground italic">—</span>
        },
        {
            header: 'Priority',
            key: 'priority',
            render: (row) => {
                const info = MAINTENANCE_PRIORITY_MAP[row.priority] || { label: 'Unknown', color: '' };
                return (
                    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', info.color)}>
                        {info.label}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            key: 'status',
            render: (row) => {
                const info = MAINTENANCE_STATUS_MAP[row.status] || { label: 'Unknown', color: '' };
                return (
                    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', info.color)}>
                        {info.label}
                    </span>
                );
            }
        },
        {
            header: 'Method',
            key: 'method',
            render: (row) => MAINTENANCE_METHOD_LABELS[row.method || 0] || 'N/A'
        },
        {
            header: 'Handled By',
            key: 'takenCareByUser',
            render: (row) => row.takenCareByUser?.name || <span className="text-muted-foreground italic">—</span>
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/customers/${row.customerUid}?section=maintenance`)}
                        className="p-1.5 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 rounded-md transition-colors h-8 w-8"
                        title="View Customer Details"
                    >
                        <EyeIcon size={14} />
                    </Button>
                    {canEdit && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(row)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors h-8 w-8"
                        >
                            <PencilIcon size={14} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(row)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors h-8 w-8"
                        >
                            <TrashIcon size={14} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col gap-2 border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <ListIcon className="text-primary w-6 h-6" />
                            Maintenance Tracker
                        </h1>
                        <p className="text-muted-foreground">
                            Track and manage system updates, customer calls, and ticket logs.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(-1)} className="h-9 px-3 text-sm">
                        <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Total Records</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.maintenanceStats?.total !== undefined ? statsData.maintenanceStats.total : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/30">
                        <AlertCircleIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">In-Progress</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.maintenanceStats?.inProgress !== undefined ? statsData.maintenanceStats.inProgress : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-900/30">
                        <CheckIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Resolved</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.maintenanceStats?.resolved !== undefined ? statsData.maintenanceStats.resolved : '—'}
                        </span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
                        <TrashIcon size={24} />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Cancelled</span>
                        <span className="text-2xl font-bold text-foreground">
                            {statsData?.maintenanceStats?.cancelled !== undefined ? statsData.maintenanceStats.cancelled : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter and Table Container */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border bg-muted/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Status</label>
                            <Select
                                options={STATUS_FILTER_OPTIONS}
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val as string)}
                                className="h-9 text-xs transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Priority</label>
                            <Select
                                options={PRIORITY_FILTER_OPTIONS}
                                value={priorityFilter}
                                onChange={(val) => setPriorityFilter(val as string)}
                                className="h-9 text-xs transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Category</label>
                            <Select
                                options={categoryFilterOptions}
                                value={categoryFilter}
                                onChange={(val) => setCategoryFilter(val as string)}
                                className="h-9 text-xs transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Search Customer</label>
                            <Input
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Search Name, Email, or ID..."
                                className="h-9 text-xs"
                                leftIcon={<SearchIcon size={14} className="text-muted-foreground" />}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    {error ? (
                        <div className="p-8 text-center text-red-500 font-semibold border border-red-200 bg-red-50 rounded-lg">
                            Error loading maintenance records: {error.message}
                        </div>
                    ) : (
                        <DataTable
                            data={records}
                            columns={columns}
                            rowKey={(row) => row.uid}
                            loading={loading}
                            emptyMessage="No maintenance tickets found matching the filters"
                            containerHeightClass="h-[300px] sm:h-[calc(100vh-486px)]"
                            pagination={meta ? {
                                currentPage,
                                pageSize: limit,
                                totalCount: meta.totalRecords,
                                onPageChange: (newPage) => setCurrentPage(newPage),
                                onPageSizeChange: (newSize) => {
                                    setLimit(newSize);
                                    setCurrentPage(1);
                                },
                                hasNextPage: meta.currentPage < meta.totalPages,
                                hasPreviousPage: meta.currentPage > 1,
                            } : undefined}
                        />
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => !isSaving && setEditModalOpen(false)}
                title="Update Maintenance Ticket"
                size="lg"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setEditModalOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-md"
                            onClick={handleSave}
                            isLoading={isSaving}
                            disabled={isSaving}
                            leftIcon={<CheckIcon className="w-4 h-4 text-white" />}
                        >
                            Save Changes
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Update details for customer {selectedRecord?.customer?.firstName} {selectedRecord?.customer?.lastName}'s maintenance ticket.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <Select
                                options={categoryFormOptions}
                                value={formState.category}
                                onChange={(val) => setFormState({ ...formState, category: val as string })}
                                placeholder="Select Category..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Handled By</label>
                            <Select
                                options={userOptions}
                                value={formState.takenCareByUid}
                                onChange={(val) => setFormState({ ...formState, takenCareByUid: val as string })}
                                placeholder="Select System User..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Method</label>
                            <Select
                                options={METHOD_FORM_OPTIONS}
                                value={formState.method.toString()}
                                onChange={(val) => setFormState({ ...formState, method: parseInt(val as string, 10) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Status</label>
                            <Select
                                options={STATUS_FORM_OPTIONS}
                                value={formState.status.toString()}
                                onChange={(val) => setFormState({ ...formState, status: parseInt(val as string, 10) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Priority</label>
                            <Select
                                options={PRIORITY_FORM_OPTIONS}
                                value={formState.priority?.toString()}
                                onChange={(val) => setFormState({ ...formState, priority: parseInt(val as string, 10) })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Notes</label>
                        <textarea
                            value={formState.notes}
                            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                            placeholder="Add maintenance notes or ticket details here..."
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all resize-y"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => !isDeleting && setDeleteModalOpen(false)}
                title="Delete Maintenance Ticket"
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            disabled={isDeleting}
                        >
                            Delete Ticket
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete this maintenance record for {selectedRecord?.customer?.firstName} {selectedRecord?.customer?.lastName}?
                    </p>
                    <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-2.5 rounded border border-red-200/50 dark:border-red-900/50">
                        Warning: This action will permanently archive the record and cannot be easily undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};
