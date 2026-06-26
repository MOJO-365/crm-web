
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_ALL_APP_VERSIONS,
    CREATE_APP_VERSION,
    UPDATE_APP_VERSION,
    DELETE_APP_VERSION,
    SET_CURRENT_APP_VERSION
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon, SpinnerIcon, StarIcon, CheckCircleIcon, AndroidIcon, AppleIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';

interface AppVersion {
    uid: string;
    platform: string;
    versionNumber: string;
    title: string;
    description: string;
    releaseDate?: string | null;
    isCurrent: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const AppVersionsPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVersion, setEditingVersion] = useState<AppVersion | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [platformFilter, setPlatformFilter] = useState<'ALL' | 'android' | 'ios'>('ALL');
    const [filteredData, setFilteredData] = useState<AppVersion[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [versionToDelete, setVersionToDelete] = useState<AppVersion | null>(null);

    // Set Current Modal State
    const [currentModalOpen, setCurrentModalOpen] = useState(false);
    const [versionToSetCurrent, setVersionToSetCurrent] = useState<AppVersion | null>(null);

    const [formData, setFormData] = useState({
        platform: 'android',
        versionNumber: '',
        title: '',
        description: '',
        releaseDate: '',
        isCurrent: false,
        isActive: true
    });

    const { data, loading, error, refetch } = useQuery(GET_ALL_APP_VERSIONS, {
        fetchPolicy: 'network-only'
    });

    const [createVersionMutation, { loading: creating }] = useMutation(CREATE_APP_VERSION);
    const [updateVersionMutation, { loading: updating }] = useMutation(UPDATE_APP_VERSION);
    const [deleteVersionMutation, { loading: deleting }] = useMutation(DELETE_APP_VERSION);
    const [setCurrentMutation, { loading: settingCurrent }] = useMutation(SET_CURRENT_APP_VERSION);

    const canCreate = useAuthStore((state) => state.canCreateInMenu('app_versions'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('app_versions'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('app_versions'));

    // Filter Logic
    useEffect(() => {
        if (data?.appVersions) {
            let result = [...data.appVersions];

            // Sort: current version first, then by createdAt desc
            result.sort((a: AppVersion, b: AppVersion) => {
                if (a.isCurrent && !b.isCurrent) return -1;
                if (!a.isCurrent && b.isCurrent) return 1;
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            });

            // Filter by Status
            if (statusFilter === 'ACTIVE') {
                result = result.filter(item => item.isActive);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter(item => !item.isActive);
            }

            // Filter by Platform
            if (platformFilter !== 'ALL') {
                result = result.filter(item => item.platform === platformFilter);
            }

            // Filter by Search
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter(item =>
                    item.versionNumber.toLowerCase().includes(lowerQuery) ||
                    item.title.toLowerCase().includes(lowerQuery) ||
                    item.description?.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, platformFilter, searchQuery]);

    const handleEdit = (version: AppVersion) => {
        setEditingVersion(version);
        setFormData({
            platform: version.platform || 'android',
            versionNumber: version.versionNumber,
            title: version.title,
            description: version.description || '',
            releaseDate: version.releaseDate ? new Date(version.releaseDate).toISOString().split('T')[0] : '',
            isCurrent: version.isCurrent,
            isActive: version.isActive
        });
        setIsCreating(false);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingVersion(null);
        setFormData({
            platform: 'android',
            versionNumber: '',
            title: '',
            description: '',
            releaseDate: '',
            isCurrent: false,
            isActive: true
        });
        setIsCreating(true);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (version: AppVersion) => {
        setVersionToDelete(version);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!versionToDelete) return;
        try {
            await deleteVersionMutation({ variables: { uid: versionToDelete.uid } });
            toast.success('Version deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setVersionToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
        }
    };

    const handleSetCurrentClick = (version: AppVersion) => {
        setVersionToSetCurrent(version);
        setCurrentModalOpen(true);
    };

    const handleConfirmSetCurrent = async () => {
        if (!versionToSetCurrent) return;
        try {
            await setCurrentMutation({ variables: { uid: versionToSetCurrent.uid } });
            toast.success(`Version ${versionToSetCurrent.versionNumber} set as current`);
            refetch();
            setCurrentModalOpen(false);
            setVersionToSetCurrent(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to set current version');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.versionNumber.trim()) {
            toast.error("Version Number is required");
            return;
        }
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }

        try {
            const input: any = {
                platform: formData.platform,
                versionNumber: formData.versionNumber,
                title: formData.title,
                description: formData.description || null,
                releaseDate: formData.releaseDate || null,
                isActive: formData.isActive
            };

            if (isCreating) {
                input.isCurrent = formData.isCurrent;
                await createVersionMutation({ variables: { input } });
                toast.success('Version created successfully');
            } else if (editingVersion) {
                await updateVersionMutation({
                    variables: {
                        uid: editingVersion.uid,
                        input
                    }
                });
                toast.success('Version updated successfully');
            }
            setIsEditModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        }
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Find the current versions for the hero card
    const currentVersions = data?.appVersions?.filter((v: AppVersion) => v.isCurrent) || [];

    const columns: Column<AppVersion>[] = [
        {
            header: 'Version',
            key: 'versionNumber',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-foreground text-sm tracking-wide">
                        v{item.versionNumber}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${item.platform === 'android'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}>
                        {item.platform === 'android' ? <AndroidIcon size={12} /> : <AppleIcon size={12} />}
                        {item.platform}
                    </span>
                    {item.isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-sm">
                            <CheckCircleIcon size={12} />
                            Current
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Title',
            key: 'title',
            render: (item) => (
                <span className="font-medium text-foreground">{item.title}</span>
            )
        },
        {
            header: 'Description',
            key: 'description',
            render: (item) => (
                <span className="text-sm text-muted-foreground truncate max-w-[300px] block">
                    {item.description || '-'}
                </span>
            )
        },
        {
            header: 'Release Date',
            key: 'releaseDate',
            render: (item) => (
                <span className="text-sm text-foreground">{formatDate(item.releaseDate)}</span>
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
                            {canEdit && !item.isCurrent && (
                                <Tooltip content="Set as Current Version">
                                    <button
                                        className="p-2 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                        onClick={() => handleSetCurrentClick(item)}
                                    >
                                        <StarIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canEdit && (
                                <Tooltip content="Edit Version">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && !item.isCurrent && (
                                <Tooltip content="Delete Version">
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
            <p className="text-muted-foreground animate-pulse">Loading versions...</p>
        </div>
    );
    if (error) return <div className="p-8 text-red-500">Error loading versions: {error.message}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Application Versions</h1>
                    <p className="text-muted-foreground">Manage and track application version releases</p>
                </div>
                {canCreate && (
                    <Button onClick={handleCreate}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        New Version
                    </Button>
                )}
            </div>

            {/* Current Version Hero Card */}
            {currentVersions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentVersions.map((currentVersion: AppVersion) => {
                        const isAndroid = currentVersion.platform === 'android';
                        const PlatformIcon = isAndroid ? AndroidIcon : AppleIcon;

                        return (
                            <div key={currentVersion.uid} className={`relative overflow-hidden rounded-xl border p-5 ${isAndroid
                                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40'
                                    : 'border-blue-200 dark:border-blue-800/60 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-sky-950/40'
                                }`}>
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-8 translate-x-8 ${isAndroid ? 'bg-emerald-200/20 dark:bg-emerald-700/10' : 'bg-blue-200/20 dark:bg-blue-700/10'
                                    }`} />
                                <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-6 -translate-x-6 ${isAndroid ? 'bg-teal-200/20 dark:bg-teal-700/10' : 'bg-sky-200/20 dark:bg-sky-700/10'
                                    }`} />
                                <div className="relative flex items-center gap-4">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm ${isAndroid
                                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        <PlatformIcon size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${isAndroid ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                                                }`}>
                                                Current {currentVersion.platform} Version
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span className={`text-2xl font-bold font-mono ${isAndroid ? 'text-emerald-800 dark:text-emerald-300' : 'text-blue-800 dark:text-blue-300'
                                                }`}>
                                                v{currentVersion.versionNumber}
                                            </span>
                                            <span className="text-lg font-medium text-foreground truncate max-w-[200px]">
                                                {currentVersion.title}
                                            </span>
                                        </div>
                                        {currentVersion.description && (
                                            <p className="text-sm text-muted-foreground mt-1 max-w-sm truncate">
                                                {currentVersion.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        {currentVersion.releaseDate && (
                                            <div className="text-sm text-muted-foreground">
                                                Released {formatDate(currentVersion.releaseDate)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Data Table */}
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
                        <Select
                            options={[
                                { label: 'All Platforms', value: 'ALL' },
                                { label: 'Android', value: 'android' },
                                { label: 'iOS', value: 'ios' }
                            ]}
                            value={platformFilter}
                            onChange={(val) => setPlatformFilter(val as 'ALL' | 'android' | 'ios')}
                            className="w-[150px]"
                        />
                        <Input
                            type="search"
                            placeholder="Search versions..."
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
                    emptyMessage="No versions found"
                    rowClassName={(row) =>
                        row.isCurrent
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-l-2 border-l-emerald-500'
                            : ''
                    }
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreating ? 'Create Version' : 'Edit Version'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform</label>
                            <Select
                                options={[
                                    { label: 'Android', value: 'android' },
                                    { label: 'iOS', value: 'ios' }
                                ]}
                                value={formData.platform}
                                onChange={(val) => setFormData({ ...formData, platform: val as 'android' | 'ios' })}
                                disabled={!isCreating} // Usually don't change platform after creation
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Version Number</label>
                            <Input
                                value={formData.versionNumber}
                                onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
                                placeholder="e.g. 1.2.0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Release Date</label>
                            <DatePicker
                                value={formData.releaseDate ? new Date(formData.releaseDate) : null}
                                onChange={(date) => setFormData({
                                    ...formData,
                                    releaseDate: date ? date.toISOString().split('T')[0] : ''
                                })}
                                placeholder="Select release date"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Major UI Overhaul"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description / Release Notes</label>
                        <textarea
                            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what's new in this version..."
                        />
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

                    {isCreating && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                            <input
                                type="checkbox"
                                id="isCurrent"
                                checked={formData.isCurrent}
                                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="isCurrent" className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                Set as current active version
                            </label>
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
                <p>Are you sure you want to delete version <span className="font-bold font-mono">v{versionToDelete?.versionNumber}</span> — <span className="font-bold">{versionToDelete?.title}</span>? This action cannot be undone.</p>
            </Modal>

            {/* Set Current Confirmation Modal */}
            <Modal
                isOpen={currentModalOpen}
                onClose={() => setCurrentModalOpen(false)}
                title="Set as Current Version"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setCurrentModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSetCurrent}
                            isLoading={settingCurrent}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <div className="space-y-3">
                    <p>Set <span className="font-bold font-mono">v{versionToSetCurrent?.versionNumber}</span> as the current active version?</p>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            ⚠️ This will un-mark any previously current version.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
