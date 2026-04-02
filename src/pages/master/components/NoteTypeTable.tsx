
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_NOTE_TYPES,
    CREATE_NOTE_TYPE,
    UPDATE_NOTE_TYPE,
    DELETE_NOTE_TYPE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatSydneyTime } from '@/lib/date';

interface NoteType {
    uid: string;
    name: string;
    color?: string;
    isActive?: number;
    createdAt: string;
}

export const NoteTypeTable = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<NoteType | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<NoteType[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<NoteType | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        color: '#3B82F6',
        isActive: 1
    });

    const { data, loading, refetch } = useQuery(GET_NOTE_TYPES, {
        fetchPolicy: 'network-only'
    });

    const [createNoteType, { loading: creating }] = useMutation(CREATE_NOTE_TYPE);
    const [updateNoteType, { loading: updating }] = useMutation(UPDATE_NOTE_TYPE);
    const [deleteNoteType, { loading: deleting }] = useMutation(DELETE_NOTE_TYPE);

    const canCreate = useAuthStore((state) => state.canCreateInMenu('note_types'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('note_types'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('note_types'));

    // Filter Logic
    useEffect(() => {
        if (data?.noteTypes) {
            let result = [...data.noteTypes];

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter(item => (item.isActive ?? 1) === 1);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter(item => (item.isActive ?? 1) === 0);
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

    const handleEdit = (type: NoteType) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            color: type.color || '#3B82F6',
            isActive: type.isActive ?? 1
        });
        setIsCreating(false);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingType(null);
        setFormData({
            name: '',
            color: '#3B82F6',
            isActive: 1
        });
        setIsCreating(true);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (type: NoteType) => {
        setTypeToDelete(type);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!typeToDelete) return;
        try {
            await deleteNoteType({ variables: { uid: typeToDelete.uid } });
            toast.success('Note Type deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setTypeToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await createNoteType({
                    variables: {
                        name: formData.name,
                        color: formData.color
                    }
                });
                toast.success('Note Type created');
            } else if (editingType) {
                await updateNoteType({
                    variables: {
                        uid: editingType.uid,
                        name: formData.name,
                        color: formData.color,
                        isActive: formData.isActive
                    }
                });
                toast.success('Note Type updated');
            }
            setIsEditModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const columns: Column<NoteType>[] = [
        {
            header: 'Type Name',
            key: 'name',
            render: (item) => <span style={{ color: item.color }} className="font-medium">{item.name}</span>
        },
        {
            header: 'Status',
            key: 'status',
            width: '120px',
            render: (item) => <StatusField type="user_status" value={item.isActive ?? 1} />
        },
        {
            header: 'Created',
            key: 'createdAt',
            width: '150px',
            render: (item) => <span className="text-xs text-muted-foreground">{formatSydneyTime(item.createdAt)}</span>
        },
        {
            header: 'Actions',
            key: 'actions',
            width: '100px',
            render: (item) => (
                <div className="flex gap-2">
                    {canEdit && (
                        <Tooltip content="Edit Note Type">
                            <button
                                className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => handleEdit(item)}
                            >
                                <PencilIcon size={16} />
                            </button>
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip content="Delete Note Type">
                            <button
                                className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                onClick={() => handleDeleteClick(item)}
                            >
                                <TrashIcon size={16} />
                            </button>
                        </Tooltip>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                    <h2 className="font-bold text-lg">Note Types</h2>
                    <p className="text-xs text-muted-foreground">Manage categorization of system notes</p>
                </div>
                {canCreate && (
                    <Button size="sm" onClick={handleCreate} className="h-9">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Type
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
                        placeholder="Search types..."
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
                    emptyMessage="No note types found"
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreating ? 'Create Note Type' : 'Edit Note Type'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Call Summary"
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
                    <p>Are you sure you want to delete <span className="font-bold">{typeToDelete?.name}</span>? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} isLoading={deleting}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
