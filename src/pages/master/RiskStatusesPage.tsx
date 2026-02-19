
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_RISK_STATUSES,
    CREATE_RISK_STATUS,
    UPDATE_RISK_STATUS,
    DELETE_RISK_STATUS
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, TrashIcon, PencilIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';


interface RiskStatusType {
    id: string;
    uid: string;
    name: string;
    code: string;
    description?: string;
    color?: string;
    scoreMin?: number | null;
    scoreMax?: number | null;
    manualOffer?: number;
    sortOrder?: number;
    isActive: boolean;
}

export const RiskStatusesPage = () => {
    const { data, loading, error, refetch } = useQuery(GET_RISK_STATUSES);
    const riskStatuses = data?.riskStatuses || [];
    const [createRiskStatus, { loading: creating }] = useMutation(CREATE_RISK_STATUS);
    const [deleteRiskStatus, { loading: deleting }] = useMutation(DELETE_RISK_STATUS);
    const [updateRiskStatus, { loading: updating }] = useMutation(UPDATE_RISK_STATUS);

    const canCreate = useAuthStore((state) => state.canCreateInMenu('risk_statuses'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('risk_statuses'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('risk_statuses'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<RiskStatusType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        color: '#3B82F6',
        scoreMin: '' as string | number,
        scoreMax: '' as string | number,
        manualOffer: 1,
        sortOrder: 0,
        isActive: 1
    });

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<RiskStatusType[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<RiskStatusType | null>(null);

    // Filter Logic
    useEffect(() => {
        if (data?.riskStatuses) {
            let result = [...data.riskStatuses];

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter((item: RiskStatusType) => item.isActive === true);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter((item: RiskStatusType) => item.isActive === false);
            }

            // Filter by Search
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter((item: RiskStatusType) =>
                    item.name.toLowerCase().includes(lowerQuery) ||
                    item.code.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, searchQuery]);

    const handleOpenModal = (status?: RiskStatusType) => {
        if (status) {
            setEditingStatus(status);
            setFormData({
                name: status.name,
                code: status.code,
                description: status.description || '',
                color: status.color || '#3B82F6',
                scoreMin: status.scoreMin ?? '',
                scoreMax: status.scoreMax ?? '',
                manualOffer: status.manualOffer ?? 1,
                sortOrder: status.sortOrder ?? 0,
                isActive: status.isActive ? 1 : 0
            });
        } else {
            setEditingStatus(null);
            setFormData({
                name: '',
                code: '',
                description: '',
                color: '#3B82F6',
                scoreMin: '',
                scoreMax: '',
                manualOffer: 1,
                sortOrder: 0,
                isActive: 1
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStatus) {
                await updateRiskStatus({
                    variables: {
                        uid: editingStatus.uid,
                        name: formData.name,
                        code: formData.code,
                        description: formData.description || null,
                        color: formData.color,
                        scoreMin: formData.scoreMin === '' ? null : Number(formData.scoreMin),
                        scoreMax: formData.scoreMax === '' ? null : Number(formData.scoreMax),
                        manualOffer: formData.manualOffer,
                        sortOrder: formData.sortOrder,
                        isActive: formData.isActive
                    }
                });
                toast.success('Risk Status updated successfully');
            } else {
                await createRiskStatus({
                    variables: {
                        name: formData.name,
                        code: formData.code,
                        description: formData.description || null,
                        color: formData.color,
                        scoreMin: formData.scoreMin === '' ? null : Number(formData.scoreMin),
                        scoreMax: formData.scoreMax === '' ? null : Number(formData.scoreMax),
                        manualOffer: formData.manualOffer,
                        sortOrder: formData.sortOrder
                    }
                });
                toast.success('Risk Status created successfully');
            }
            setIsModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${editingStatus ? 'update' : 'create'} risk status`);
        }
    };

    const handleDeleteClick = (status: RiskStatusType) => {
        setStatusToDelete(status);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!statusToDelete) return;
        try {
            await deleteRiskStatus({ variables: { uid: statusToDelete.uid } });
            toast.success('Risk Status deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setStatusToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const columns: Column<RiskStatusType>[] = [
        {
            header: 'Name',
            key: 'name',
            render: (item) => (
                <StatusField
                    type="risk_status"
                    value={item.uid}
                    mode="badge"
                    riskStatuses={riskStatuses}
                />
            )
        },
        {
            header: 'Code',
            key: 'code',
            render: (item) => (
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{item.code}</span>
            )
        },
        {
            header: 'Score Range',
            key: 'scoreMin',
            render: (item) => (
                <span className="text-sm">
                    {item.scoreMin != null && item.scoreMax != null
                        ? `${item.scoreMin} – ${item.scoreMax}`
                        : '—'}
                </span>
            )
        },
        {
            header: 'Manual Offer',
            key: 'manualOffer',
            render: (item) => (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.manualOffer === 1
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {item.manualOffer === 1 ? 'Manual' : 'Auto'}
                </span>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item) => <StatusField type="user_status" value={item.isActive ? 1 : 0} />
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (item) => (
                <div className="flex gap-2">
                    {canEdit || canDelete ? (
                        <>
                            {canEdit && (
                                <Tooltip content="Edit Risk Status">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && (
                                <Tooltip content="Delete Risk Status">
                                    <button
                                        className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        onClick={() => handleDeleteClick(item)}
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                        </>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No permission</span>
                    )}
                </div>
            )
        }
    ];

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading risk statuses</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Risk Statuses</h1>
                    <p className="text-muted-foreground">Manage risk status levels and credit score ranges</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Risk Status
                    </Button>
                )}
            </div>

            <div className="p-5 bg-background dark:bg-card rounded-lg border border-border dark:border-border shadow-sm">
                {/* Filters and Search */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <StatusField
                            type="user_status"
                            mode="select"
                            showAllOption
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                            placeholder="All"
                            className="w-[150px]"
                        />
                        <Input
                            type="search"
                            placeholder="Search risk statuses..."
                            containerClassName="w-[30%]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    rowKey={(row) => row.uid}
                    emptyMessage="No risk statuses found"
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStatus ? "Edit Risk Status" : "Create Risk Status"}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Low Risk"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code</label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="e.g. low_risk"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-10 h-10 rounded border border-border cursor-pointer"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="#3B82F6"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Score Min</label>
                            <Input
                                type="number"
                                value={formData.scoreMin}
                                onChange={(e) => setFormData({ ...formData, scoreMin: e.target.value === '' ? '' : Number(e.target.value) })}
                                placeholder="e.g. 0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Score Max</label>
                            <Input
                                type="number"
                                value={formData.scoreMax}
                                onChange={(e) => setFormData({ ...formData, scoreMax: e.target.value === '' ? '' : Number(e.target.value) })}
                                placeholder="e.g. 500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Manual Offer</label>
                            <Select
                                options={[
                                    { label: 'Manual (requires approval)', value: '1' },
                                    { label: 'Auto (send automatically)', value: '0' }
                                ]}
                                value={String(formData.manualOffer)}
                                onChange={(val) => setFormData({ ...formData, manualOffer: Number(val) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sort Order</label>
                            <Input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                        {/* {editingStatus && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    options={[
                                        { label: 'Active', value: '1' },
                                        { label: 'Inactive', value: '0' }
                                    ]}
                                    value={String(formData.isActive)}
                                    onChange={(val) => setFormData({ ...formData, isActive: Number(val) })}
                                />
                            </div>
                        )} */}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={creating || updating}>
                            {editingStatus ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            isLoading={deleting}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <span className="font-bold">{statusToDelete?.name}</span>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};
