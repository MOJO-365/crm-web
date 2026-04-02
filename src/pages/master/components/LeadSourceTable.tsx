
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_LEAD_SOURCES,
    CREATE_LEAD_SOURCE,
    UPDATE_LEAD_SOURCE,
    DELETE_LEAD_SOURCE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';

interface LeadSource {
    uid: string;
    name: string;
    isActive: number;
}

export const LeadSourceTable = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<LeadSource[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<LeadSource | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        isActive: 1
    });

    const { data, loading, refetch } = useQuery(GET_LEAD_SOURCES, {
        fetchPolicy: 'network-only'
    });

    const [createLeadSource, { loading: creating }] = useMutation(CREATE_LEAD_SOURCE);
    const [updateLeadSource, { loading: updating }] = useMutation(UPDATE_LEAD_SOURCE);
    const [deleteLeadSource, { loading: deleting }] = useMutation(DELETE_LEAD_SOURCE);

    // Using the feature flag mentioned in LeadFormModal
    const canManage = useAuthStore((state) => state.hasFeatureAccess('feature_manage_lead_sources'));

    // Filter Logic
    useEffect(() => {
        if (data?.leadSources) {
            let result = [...data.leadSources];

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter(item => item.isActive === 1);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter(item => item.isActive === 0);
            }

            // Filter by Search
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter(item =>
                    item.name.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, searchQuery]);

    const handleEdit = (source: LeadSource) => {
        setEditingSource(source);
        setFormData({
            name: source.name,
            isActive: source.isActive
        });
        setIsCreating(false);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingSource(null);
        setFormData({
            name: '',
            isActive: 1
        });
        setIsCreating(true);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (source: LeadSource) => {
        setSourceToDelete(source);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!sourceToDelete) return;
        try {
            await deleteLeadSource({ variables: { uid: sourceToDelete.uid } });
            toast.success('Lead Source deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setSourceToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await createLeadSource({
                    variables: {
                        name: formData.name
                    }
                });
                toast.success('Lead Source created');
            } else if (editingSource) {
                await updateLeadSource({
                    variables: {
                        uid: editingSource.uid,
                        name: formData.name,
                        isActive: formData.isActive
                    }
                });
                toast.success('Lead Source updated');
            }
            setIsEditModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns: Column<LeadSource>[] = [
        {
            header: 'Source Name',
            key: 'name',
            render: (item) => <span className="font-medium text-foreground">{item.name}</span>
        },
        {
            header: 'Status',
            key: 'status',
            width: '120px',
            render: (item) => <StatusField type="user_status" value={item.isActive} />
        },
        {
            header: 'Actions',
            key: 'actions',
            width: '100px',
            render: (item) => (
                <div className="flex gap-2">
                    {canManage && (
                        <>
                            <Tooltip content="Edit Source">
                                <button
                                    className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => handleEdit(item)}
                                >
                                    <PencilIcon size={16} />
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete Source">
                                <button
                                    className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                    onClick={() => handleDeleteClick(item)}
                                >
                                    <TrashIcon size={16} />
                                </button>
                            </Tooltip>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                    <h2 className="font-bold text-lg">Lead Sources</h2>
                    <p className="text-xs text-muted-foreground">Manage channels where leads originate from</p>
                </div>
                {canManage && (
                    <Button size="sm" onClick={handleCreate} className="h-9">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Source
                    </Button>
                )}
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <StatusField
                        type="user_status"
                        mode="select"
                        showAllOption
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                        placeholder="All Status"
                        className="w-[130px]"
                    />
                    <Input
                        type="search"
                        placeholder="Search sources..."
                        className="flex-1 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    rowKey={(row) => row.uid}
                    loading={loading}
                    emptyMessage="No lead sources found"
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreating ? 'Create Lead Source' : 'Edit Lead Source'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Source Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Website, Referral, Facebook"
                            required
                        />
                    </div>

                    {!isCreating && (
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

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="sm"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete <span className="font-bold">{sourceToDelete?.name}</span>? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} isLoading={deleting}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
