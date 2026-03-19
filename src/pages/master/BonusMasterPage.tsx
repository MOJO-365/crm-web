
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_ALL_BONUSES,
    CREATE_BONUS,
    UPDATE_BONUS,
    DELETE_BONUS
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon, SpinnerIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';

interface Bonus {
    uid: string;
    name: string;
    description: string;
    amount: number;
    isActive: boolean;
    contractTerm?: string | null;
    exitFee?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export const BonusMasterPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<Bonus[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bonusToDelete, setBonusToDelete] = useState<Bonus | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        amount: 0,
        isActive: true,
        contractTerm: '',
        exitFee: ''
    });

    const { data, loading, error, refetch } = useQuery(GET_ALL_BONUSES, {
        fetchPolicy: 'network-only'
    });

    const [createBonusMutation, { loading: creating }] = useMutation(CREATE_BONUS);
    const [updateBonusMutation, { loading: updating }] = useMutation(UPDATE_BONUS);
    const [deleteBonusMutation, { loading: deleting }] = useMutation(DELETE_BONUS);

    const canCreate = useAuthStore((state) => state.canCreateInMenu('bonus_master'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('bonus_master'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('bonus_master'));

    // Filter Logic
    useEffect(() => {
        if (data?.bonuses) {
            let result = [...data.bonuses];

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter(item => item.isActive);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter(item => !item.isActive);
            }

            // Filter by Search
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter(item =>
                    item.name.toLowerCase().includes(lowerQuery) ||
                    item.description?.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, searchQuery]);

    const handleEdit = (bonus: Bonus) => {
        setEditingBonus(bonus);
        setFormData({
            name: bonus.name,
            description: bonus.description || '',
            amount: bonus.amount || 0,
            isActive: bonus.isActive,
            contractTerm: bonus.contractTerm || '',
            exitFee: bonus.exitFee !== null && bonus.exitFee !== undefined ? String(bonus.exitFee) : ''
        });
        setIsCreating(false);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingBonus(null);
        setFormData({
            name: '',
            description: '',
            amount: 0,
            isActive: true,
            contractTerm: '',
            exitFee: ''
        });
        setIsCreating(true);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (bonus: Bonus) => {
        setBonusToDelete(bonus);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!bonusToDelete) return;
        try {
            await deleteBonusMutation({ variables: { uid: bonusToDelete.uid } });
            toast.success('Bonus deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setBonusToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const input = {
                name: formData.name,
                description: formData.description,
                amount: Number(formData.amount),
                isActive: formData.isActive,
                contractTerm: formData.contractTerm || null,
                exitFee: formData.exitFee ? Number(formData.exitFee) : null
            };

            if (isCreating) {
                await createBonusMutation({
                    variables: { input }
                });
                toast.success('Bonus created successfully');
            } else if (editingBonus) {
                await updateBonusMutation({
                    variables: {
                        uid: editingBonus.uid,
                        input
                    }
                });
                toast.success('Bonus updated successfully');
            }
            setIsEditModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns: Column<Bonus>[] = [
        {
            header: 'Name',
            key: 'name',
            render: (item) => <span className="font-medium text-foreground">{item.name}</span>
        },
        {
            header: 'Amount',
            key: 'amount',
            render: (item) => <span className="font-semibold text-primary">${item.amount.toFixed(2)}</span>
        },
        {
            header: 'Description',
            key: 'description',
            render: (item) => <span className="text-sm text-muted-foreground truncate max-w-[300px] block">{item.description}</span>
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item) => <StatusField type="user_status" value={item.isActive ? 1 : 0} />
        },
        {
            header: 'Contract Term',
            key: 'contractTerm',
            render: (item) => <span className="text-sm text-foreground">{item.contractTerm || '-'}</span>
        },
        {
            header: 'Exit Fee',
            key: 'exitFee',
            render: (item) => <span className="text-sm text-foreground">{item.exitFee !== null && item.exitFee !== undefined ? `$${item.exitFee}` : '-'}</span>
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (item) => (
                <div className="flex gap-2">
                    {canEdit || canDelete ? (
                        <>
                            {canEdit && (
                                <Tooltip content="Edit Bonus">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && (
                                <Tooltip content="Delete Bonus">
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

    if (loading && !data) return (
        <div className="flex flex-col items-center justify-center p-12">
            <SpinnerIcon size={32} className="text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading bonuses...</p>
        </div>
    );
    if (error) return <div className="p-8 text-red-500">Error loading bonuses: {error.message}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Bonus Master</h1>
                    <p className="text-muted-foreground">Manage dynamic bonuses available for customers</p>
                </div>
                {canCreate && (
                    <Button onClick={handleCreate}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New Bonus
                    </Button>
                )}
            </div>

            <div className="p-5 bg-background dark:bg-card rounded-lg border border-border dark:border-border shadow-sm">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <StatusField
                            type="user_status"
                            mode="select"
                            showAllOption
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                            placeholder="All Status"
                            className="w-[150px]"
                        />
                        <Input
                            type="search"
                            placeholder="Search bonuses..."
                            containerClassName="w-full sm:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    rowKey={(row) => row.uid}
                    emptyMessage="No bonuses found"
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreating ? 'Create Bonus' : 'Edit Bonus'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Early Bird Discount"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief details about the bonus"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount ($)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contract Term</label>
                            <Input
                                value={formData.contractTerm}
                                onChange={(e) => setFormData({ ...formData, contractTerm: e.target.value })}
                                placeholder="e.g. 12 months"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Exit Fee ($)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.exitFee}
                                onChange={(e) => setFormData({ ...formData, exitFee: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {!isCreating && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                options={[
                                    { label: 'Active', value: 'true' },
                                    { label: 'Inactive', value: 'false' }
                                ]}
                                value={String(formData.isActive)}
                                onChange={(val) => setFormData({ ...formData, isActive: val === 'true' })}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={creating || updating}>
                            {isCreating ? 'Create' : 'Update'}
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
                <p>Are you sure you want to delete <span className="font-bold">{bonusToDelete?.name}</span>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};
