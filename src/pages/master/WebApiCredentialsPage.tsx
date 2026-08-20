import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_WEB_API_CREDENTIALS,
    CREATE_WEB_API_CREDENTIAL,
    UPDATE_WEB_API_CREDENTIAL,
    DELETE_WEB_API_CREDENTIAL
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, TrashIcon, PencilIcon, CopyIcon, RefreshCwIcon, EyeIcon, EyeOffIcon, XIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { formatSydneyTime } from '@/lib/date';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { v4 as uuidv4 } from 'uuid';

interface WebApiCredential {
    id: string;
    name: string;
    token: string;
    allowedOrigins: string[];
    isActive: boolean;
    isPDRS: boolean;
    portalName: string | null;
    createdAt: string;
    updatedAt: string;
}

const MaskedToken = ({ token }: { token: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        toast.success('Token copied to clipboard');
    };

    return (
        <div className="flex items-center gap-2">
            <span className="font-mono bg-muted px-2 py-1 rounded text-sm w-48 truncate">
                {isVisible ? token : '•'.repeat(token.length > 20 ? 20 : token.length)}
            </span>
            <button
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Hide token" : "Show token"}
            >
                {isVisible ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
            </button>
            <button
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={handleCopy}
                title="Copy token"
            >
                <CopyIcon size={14} />
            </button>
        </div>
    );
};

export const WebApiCredentialsPage = () => {
    const { data, loading, error, refetch } = useQuery(GET_WEB_API_CREDENTIALS);
    const [createCredential, { loading: creating }] = useMutation(CREATE_WEB_API_CREDENTIAL);
    const [deleteCredential, { loading: deleting }] = useMutation(DELETE_WEB_API_CREDENTIAL);
    const [updateCredential, { loading: updating }] = useMutation(UPDATE_WEB_API_CREDENTIAL);

    const canCreate = useAuthStore((state) => state.canCreateInMenu('api_credentials'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('api_credentials'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('api_credentials'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCred, setEditingCred] = useState<WebApiCredential | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        token: string;
        allowedOrigins: string[];
        isActive: boolean;
        isPDRS: boolean;
        portalName: string | null;
    }>({
        name: '',
        token: '',
        allowedOrigins: [],
        isActive: true,
        isPDRS: false,
        portalName: null
    });
    const [originInput, setOriginInput] = useState('');

    const generateToken = (clientName: string) => {
        const shortName = clientName
            ? clientName.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 12)
            : 'CLIENT';
        const randomPart = uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
        return `GSYNC_${shortName}_${randomPart}`;
    };

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [filteredData, setFilteredData] = useState<WebApiCredential[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [credToDelete, setCredToDelete] = useState<WebApiCredential | null>(null);

    // Filter Logic
    useEffect(() => {
        if (data?.webApiCredentials) {
            let result = [...data.webApiCredentials];

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter((item: WebApiCredential) => item.isActive);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter((item: WebApiCredential) => !item.isActive);
            }

            // Filter by Search
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter((item: WebApiCredential) =>
                    item.name.toLowerCase().includes(lowerQuery) ||
                    item.token.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, searchQuery]);

    const handleOpenModal = (cred?: WebApiCredential) => {
        setOriginInput('');
        if (cred) {
            setEditingCred(cred);
            setFormData({
                name: cred.name,
                token: cred.token,
                allowedOrigins: [...cred.allowedOrigins],
                isActive: cred.isActive,
                isPDRS: cred.isPDRS,
                portalName: cred.portalName || null
            });
        } else {
            setEditingCred(null);
            setFormData({
                name: '',
                token: generateToken(''), // Generate token automatically for new ones
                allowedOrigins: [],
                isActive: true,
                isPDRS: false,
                portalName: null
            });
        }
        setIsModalOpen(true);
    };

    const handleGenerateToken = () => {
        setFormData({ ...formData, token: generateToken(formData.name) });
    };

    const handleAddOrigin = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = originInput.trim();
            if (value && !formData.allowedOrigins.includes(value)) {
                setFormData({ ...formData, allowedOrigins: [...formData.allowedOrigins, value] });
            }
            setOriginInput('');
        }
    };

    const handleRemoveOrigin = (originToRemove: string) => {
        setFormData({
            ...formData,
            allowedOrigins: formData.allowedOrigins.filter(o => o !== originToRemove)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCred) {
                await updateCredential({
                    variables: {
                        id: editingCred.id,
                        name: formData.name,
                        token: formData.token,
                        allowedOrigins: formData.allowedOrigins,
                        isActive: formData.isActive,
                        isPDRS: formData.isPDRS,
                        portalName: formData.portalName
                    }
                });
                toast.success('API Credential updated successfully');
            } else {
                await createCredential({
                    variables: {
                        name: formData.name,
                        token: formData.token,
                        allowedOrigins: formData.allowedOrigins,
                        isPDRS: formData.isPDRS,
                        portalName: formData.portalName
                    }
                });
                toast.success('API Credential created successfully');
            }
            setIsModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${editingCred ? 'update' : 'create'} API credential`);
        }
    };

    const handleDeleteClick = (cred: WebApiCredential) => {
        setCredToDelete(cred);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!credToDelete) return;
        try {
            await deleteCredential({ variables: { id: credToDelete.id } });
            toast.success('API Credential deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setCredToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const columns: Column<WebApiCredential>[] = [
        {
            header: 'Client Name',
            key: 'name',
            render: (item) => <span className="font-medium">{item.name}</span>
        },
        {
            header: 'Token',
            key: 'token',
            render: (item) => <MaskedToken token={item.token} />
        },
        {
            header: 'Allowed Origins',
            key: 'allowedOrigins',
            render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {item.allowedOrigins.length > 0 ? (
                        item.allowedOrigins.map((origin, idx) => (
                            <span key={idx} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                                {origin}
                            </span>
                        ))
                    ) : (
                        <span className="text-muted-foreground text-xs italic">Any (Not recommended)</span>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item) => <StatusField type="user_status" value={item.isActive ? 1 : 0} />
        },
        {
            header: 'Is PDRS',
            key: 'isPDRS',
            render: (item) => (
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.isPDRS ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {item.isPDRS ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            header: 'Portal Name',
            key: 'portalName',
            render: (item) => item.portalName ? <span className="font-medium text-sm">{item.portalName}</span> : <span className="text-muted-foreground italic text-xs">N/A</span>
        },
        {
            header: 'Created At',
            key: 'createdAt',
            render: (item) => formatSydneyTime(item.createdAt)
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (item) => (
                <div className="flex gap-2">
                    {canEdit || canDelete ? (
                        <>
                            {canEdit && (
                                <Tooltip content="Edit Credential">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && (
                                <Tooltip content="Delete Credential">
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
    if (error) return <div className="p-8 text-red-500">Error loading API credentials</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">API Credentials</h1>
                    <p className="text-muted-foreground">Manage authentication tokens and allowed origins for web REST APIs</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New Credential
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
                            placeholder="Search by name or token..."
                            containerClassName="w-[30%]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    rowKey={(row) => row.id}
                    emptyMessage="No API credentials found"
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCred ? "Edit API Credential" : "Create API Credential"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Client Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Frontend App, External CRM"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between items-center">
                            Token
                            <button 
                                type="button" 
                                onClick={handleGenerateToken}
                                className="text-xs flex items-center text-primary hover:underline"
                            >
                                <RefreshCwIcon size={12} className="mr-1" /> Generate New
                            </button>
                        </label>
                        <Input
                            value={formData.token}
                            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                            placeholder="Authentication token"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Allowed Origins</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.allowedOrigins.map(origin => (
                                <div key={origin} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded-md border border-border">
                                    <span>{origin}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveOrigin(origin)} 
                                        className="hover:text-destructive text-muted-foreground transition-colors p-0.5 ml-1"
                                    >
                                        <XIcon size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Input
                            value={originInput}
                            onChange={(e) => setOriginInput(e.target.value)}
                            onKeyDown={handleAddOrigin}
                            placeholder="Type origin and press Enter (e.g. https://crm.example.com)"
                        />
                        <p className="text-xs text-muted-foreground">Press Enter or comma to add an origin. Use * for any origin (not recommended).</p>
                    </div>

                    {editingCred && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                options={[
                                    { label: 'Active', value: '1' },
                                    { label: 'Inactive', value: '0' }
                                ]}
                                value={formData.isActive ? '1' : '0'}
                                onChange={(val) => setFormData({ ...formData, isActive: val === '1' })}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Is PDRS</label>
                        <Select
                            options={[
                                { label: 'Yes', value: '1' },
                                { label: 'No', value: '0' }
                            ]}
                            value={formData.isPDRS ? '1' : '0'}
                            onChange={(val) => setFormData({ ...formData, isPDRS: val === '1' })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Portal Name (Optional)</label>
                        <Input
                            value={formData.portalName || ''}
                            onChange={(e) => setFormData({ ...formData, portalName: e.target.value || null })}
                            placeholder="e.g. MyPortal"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={creating || updating}>
                            {editingCred ? 'Update' : 'Create'}
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
                <p>Are you sure you want to delete <span className="font-bold">{credToDelete?.name}</span>? API integrations using this token will immediately stop working. This action cannot be undone.</p>
            </Modal>
        </div>
    );
};
