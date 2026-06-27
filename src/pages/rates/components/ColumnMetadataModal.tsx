import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { GET_COLUMN_METADATA } from '@/graphql/queries/rates';
import { SAVE_COLUMN_METADATA } from '@/graphql/mutations/rates';
import { PencilIcon, SaveIcon } from '@/components/icons';

interface ColumnMetadata {
    id: string;
    columnName: string;
    description: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    availableColumns: string[];
}

export function ColumnMetadataModal({ isOpen, onClose, availableColumns }: Props) {
    const [editingColumn, setEditingColumn] = useState<string | null>(null);
    const [editDescription, setEditDescription] = useState('');
    const [newColumnName, setNewColumnName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const { data, loading, refetch } = useQuery(GET_COLUMN_METADATA, {
        fetchPolicy: 'network-only',
        skip: !isOpen
    });

    const [saveMetadata, { loading: isSaving }] = useMutation(SAVE_COLUMN_METADATA, {
        onCompleted: () => {
            toast.success('Column description saved');
            setEditingColumn(null);
            setNewColumnName('');
            setNewDescription('');
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to save description');
        }
    });

    const metadataList: ColumnMetadata[] = data?.getColumnMetadata || [];
    
    const unaddedColumns = availableColumns.filter(
        col => !metadataList.some(meta => meta.columnName === col)
    );

    const handleSave = (columnName: string, description: string) => {
        if (!columnName.trim()) {
            toast.error('Column name is required');
            return;
        }
        saveMetadata({ variables: { columnName: columnName.trim(), description: description.trim() } });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Column Descriptions"
            size="4xl"
        >
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium mb-3">Add or Edit Description</h3>
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Column Name</label>
                            <Select 
                                value={newColumnName} 
                                onChange={(val) => setNewColumnName(val as string)} 
                                placeholder="e.g. anytime"
                                options={unaddedColumns.map(col => ({ label: col, value: col }))}
                                creatable={true}
                            />
                        </div>
                        <div className="flex-[2]">
                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <Input 
                                value={newDescription} 
                                onChange={e => setNewDescription(e.target.value)} 
                                placeholder="Enter description..."
                            />
                        </div>
                        <Button 
                            onClick={() => handleSave(newColumnName, newDescription)}
                            disabled={isSaving || !newColumnName.trim()}
                        >
                            Save
                        </Button>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px] max-h-[65vh] overflow-y-auto flex flex-col">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                            ) : metadataList.length === 0 ? (
                                <tr><td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">No descriptions added yet.</td></tr>
                            ) : metadataList.map(meta => (
                                <tr key={meta.id}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                                        {meta.columnName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {editingColumn === meta.columnName ? (
                                            <Input 
                                                value={editDescription} 
                                                onChange={e => setEditDescription(e.target.value)} 
                                                autoFocus
                                            />
                                        ) : (
                                            meta.description || <span className="italic text-gray-400">No description</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {editingColumn === meta.columnName ? (
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleSave(meta.columnName, editDescription)}
                                                disabled={isSaving}
                                            >
                                                <SaveIcon className="w-4 h-4 mr-1" /> Save
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => {
                                                    setEditingColumn(meta.columnName);
                                                    setEditDescription(meta.description || '');
                                                }}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
}
