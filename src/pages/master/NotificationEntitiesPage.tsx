
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Tooltip } from '@/components/ui/Tooltip';
import { DataTable, type Column, Modal } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from '@/components/icons';
import { Select } from '@/components/ui/Select';
import {
    GET_NOTIFICATION_ENTITIES,
    CREATE_NOTIFICATION_ENTITY,
    UPDATE_NOTIFICATION_ENTITY,
    DELETE_NOTIFICATION_ENTITY,
    GET_USERS
} from '@/graphql';
import { formatDateTime } from '@/lib/date';
import { useAuthStore } from '@/stores/useAuthStore';

// Types
interface NotificationEntity {
    id: string;
    uid: string;
    tenant: string;
    fromEmail: string;
    bccEmail?: string;
    preference?: number;
    entityType: number;
    isActive: number; // 1 or 0
    userUids?: string[];
    createdAt: string;
    updatedAt: string;
}

const ENTITY_TYPES = [
    { value: "0", label: 'Lead' },
    { value: "1", label: 'Project' },
    { value: "2", label: 'Contact' },
    { value: "3", label: 'Super Sales Rep' },
];

export function NotificationEntitiesPage() {
    // Permissions
    const canCreate = useAuthStore((state) => state.canCreateInMenu('notification_entity')); // Adjust menu code if needed
    const canEdit = useAuthStore((state) => state.canEditInMenu('notification_entity'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('notification_entity'));

    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingEntity, setEditingEntity] = useState<NotificationEntity | null>(null);

    const initialFormState = {
        fromEmail: '',
        password: '',
        bccEmail: '',
        preference: 0,
        entityType: 1,
        userUids: [] as string[]
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<NotificationEntity | null>(null);
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Query
    const { data, loading, error, refetch } = useQuery<{ notificationEntities: NotificationEntity[] }>(GET_NOTIFICATION_ENTITIES, {
        fetchPolicy: 'network-only',
    });

    // Fetch Users
    const { data: usersData } = useQuery(GET_USERS, {
        variables: {
            status: 'ACTIVE', // Active users
            limit: 1000,
            onlyVisibleRoles: true
        },
        fetchPolicy: 'cache-and-network'
    });

    const usersOptions = usersData?.users?.data?.map((user: any) => ({
        value: user.uid,
        label: user.name || user.email
    })) || [];

    // Mutations
    const [createEntity] = useMutation(CREATE_NOTIFICATION_ENTITY);
    const [updateEntity] = useMutation(UPDATE_NOTIFICATION_ENTITY);
    const [deleteEntity] = useMutation(DELETE_NOTIFICATION_ENTITY);

    const allEntities = data?.notificationEntities || [];

    // Filter
    const displayedEntities = allEntities.filter(entity => {
        return !searchQuery || entity.fromEmail.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Form Handling
    const handleAdd = () => {
        setModalMode('create');
        setEditingEntity(null);
        setFormData(initialFormState);
        setErrors({});
        setModalOpen(true);
    };

    const handleEdit = (entity: NotificationEntity) => {
        setModalMode('edit');
        setEditingEntity(entity);
        setFormData({
            fromEmail: entity.fromEmail,
            password: '', // Password is not fetched
            bccEmail: entity.bccEmail || '',
            preference: entity.preference || 0,
            entityType: entity.entityType,
            userUids: entity.userUids || []
        });
        setErrors({});
        setModalOpen(true);
    };

    const validateField = (name: string, value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let error = '';

        if (name === 'fromEmail') {
            if (!value.trim()) error = 'From Email is required';
            else if (!emailRegex.test(value)) error = 'Invalid email format';
        }

        if (name === 'password' && modalMode === 'create') {
            if (!value.trim()) error = 'Password is required for new entities';
        }

        if (name === 'bccEmail') {
            if (value.trim() && !emailRegex.test(value)) error = 'Invalid BCC email format';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.fromEmail.trim()) {
            newErrors.fromEmail = 'From Email is required';
        } else if (!emailRegex.test(formData.fromEmail)) {
            newErrors.fromEmail = 'Invalid email format';
        }

        if (modalMode === 'create' && !formData.password.trim()) {
            newErrors.password = 'Password is required for new entities';
        }

        if (formData.bccEmail && formData.bccEmail.trim()) {
            if (!emailRegex.test(formData.bccEmail)) {
                newErrors.bccEmail = 'Invalid BCC email format';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const input: any = {
                fromEmail: formData.fromEmail,
                bccEmail: formData.bccEmail,
                preference: Number(formData.preference),
                entityType: Number(formData.entityType),
                userUids: formData.userUids.length > 0 ? formData.userUids : null
            };

            if (formData.password) {
                input.password = formData.password;
            }

            // isActive is only for update mutation in schema
            if (modalMode !== 'create') {
                input.isActive = 1; // Default to active
            }

            if (modalMode === 'create') {
                await createEntity({
                    variables: { input }
                });
                toast.success('Notification Entity created successfully');
            } else {
                if (!editingEntity) return;

                await updateEntity({
                    variables: {
                        uid: editingEntity.uid,
                        input
                    }
                });
                toast.success('Notification Entity updated successfully');
            }
            setModalOpen(false);
            await refetch();
        } catch (err: any) {
            console.error('Failed to save entity:', err);
            let errorMessage = err.message || 'Failed to save entity';

            // Handle error wrapped in ApolloError (networkError)
            const networkError = err.networkError as any;
            if (networkError && networkError.response) {
                const responseData = networkError.response.data;
                if (responseData?.errors?.length > 0) {
                    errorMessage = responseData.errors[0].message;
                } else if (networkError.response.status === 409) {
                    errorMessage = 'User is already assigned to another entity.';
                }
            }
            // Handle Axios Error if thrown directly (unlikely with useMutation but safe to check)
            else if (err.response) {
                const responseData = err.response.data;
                if (responseData?.errors?.length > 0) {
                    errorMessage = responseData.errors[0].message;
                } else if (err.response.status === 409) {
                    errorMessage = 'User is already assigned to another entity.';
                }
            }
            // Handle standard Apollo Error structure
            else if (err.graphQLErrors?.length > 0) {
                errorMessage = err.graphQLErrors[0].message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (entity: NotificationEntity) => {
        setEntityToDelete(entity);
        setDeleteConfirmEmail('');
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!entityToDelete || deleteConfirmEmail !== entityToDelete.fromEmail) return;

        setIsDeleting(true);
        try {
            await deleteEntity({ variables: { uid: entityToDelete.uid } });
            toast.success('Notification Entity deleted successfully');
            setDeleteModalOpen(false);
            setEntityToDelete(null);
            await refetch();
        } catch (err: any) {
            console.error('Failed to delete entity:', err);
            toast.error(err.message || 'Failed to delete entity');
        } finally {
            setIsDeleting(false);
        }
    };

    const columns: Column<NotificationEntity>[] = [
        {
            key: 'fromEmail',
            header: 'From Email',
            width: 'w-[250px]',
            render: (t) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{t.fromEmail}</span>
                    {t.bccEmail && <span className="text-xs text-muted-foreground">BCC: {t.bccEmail}</span>}
                </div>
            )
        },
        {
            key: 'entityType',
            header: 'Type',
            width: 'w-[120px]',
            render: (t) => {
                const type = ENTITY_TYPES.find(type => type.value === String(t.entityType));
                return (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm w-fit">
                        <span>{type?.label || t.entityType}</span>
                    </div>
                );
            }
        },
        {
            key: 'preference',
            header: 'Preference',
            width: 'w-[100px]',
            render: (t) => (
                <div className="flex justify-center">
                    {t.preference === 1 ? (
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                            <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'userUids',
            header: 'Users',
            width: 'w-[150px]',
            render: (t) => {
                if (!t.userUids || t.userUids.length === 0) return <span className="text-muted-foreground">-</span>;
                const userNames = t.userUids.map(uid => {
                    const user = usersOptions.find((u: any) => u.value === uid);
                    return user?.label || 'Unknown';
                });
                return (
                    <div className="flex flex-col gap-1 max-h-16 overflow-y-auto">
                        {userNames.map((name, idx) => (
                            <span key={idx} className="text-foreground text-xs bg-gray-100 px-2 py-0.5 rounded-md self-start">{name}</span>
                        ))}
                    </div>
                );
            }
        },

        {
            key: 'createdAt',
            header: 'Created On',
            width: 'w-[150px]',
            render: (t) => (
                <span className="text-muted-foreground">
                    {formatDateTime(t.createdAt)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'w-[100px]',
            render: (t) => (
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Tooltip content="Edit">
                            <button
                                className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => handleEdit(t)}
                            >
                                <PencilIcon size={16} />
                            </button>
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip content="Delete">
                            <button
                                className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                onClick={() => handleDeleteClick(t)}
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Notification Entities</h1>
                    <p className="text-muted-foreground">Manage email accounts for notifications</p>
                </div>
                {canCreate && (
                    <Button leftIcon={<PlusIcon size={16} />} onClick={handleAdd}>
                        Add Entity
                    </Button>
                )}
            </div>

            <div className="p-5 bg-background rounded-lg border border-border shadow-sm">
                <div className="mb-6">
                    <Input
                        type="search"
                        placeholder="Search by email..."
                        containerClassName="w-[30%]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={displayedEntities}
                    rowKey={(t) => t.uid}
                    loading={loading}
                    error={error?.message}
                    emptyMessage="No notification entities found."
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Create Notification Entity' : 'Edit Notification Entity'}
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {modalMode === 'create' ? 'Create' : 'Save Changes'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">From Email <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="email@example.com"
                            value={formData.fromEmail}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, fromEmail: e.target.value }));
                                if (errors.fromEmail) setErrors(prev => ({ ...prev, fromEmail: '' }));
                            }}
                            onBlur={() => validateField('fromEmail', formData.fromEmail)}
                            error={errors.fromEmail}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password {modalMode === 'create' && <span className="text-red-500">*</span>}</label>
                        <Input
                            type="password"
                            placeholder={modalMode === 'create' ? "Password" : "Leave blank to keep unchanged"}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, password: e.target.value }));
                                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                            }}
                            onBlur={() => validateField('password', formData.password)}
                            error={errors.password}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">BCC Email</label>
                        <Input
                            placeholder="bcc@example.com"
                            value={formData.bccEmail}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, bccEmail: e.target.value }));
                                if (errors.bccEmail) setErrors(prev => ({ ...prev, bccEmail: '' }));
                            }}
                            onBlur={() => validateField('bccEmail', formData.bccEmail || '')}
                            error={errors.bccEmail}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col pt-6">
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={Boolean(formData.preference)}
                                    onChange={(checked) => setFormData(prev => ({ ...prev, preference: checked ? 1 : 0 }))}
                                />
                                <label className="text-sm font-medium">Preference</label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Entity Type</label>
                            <Select
                                options={ENTITY_TYPES}
                                value={String(formData.entityType)}
                                onChange={(val) => setFormData(prev => ({ ...prev, entityType: Number(val) }))}
                                placeholder="Select Type"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Users</label>
                            <Select
                                multiple
                                options={usersOptions}
                                value={formData.userUids}
                                onChange={(val) => setFormData(prev => ({ ...prev, userUids: val as string[] }))}
                                placeholder="Select Users"
                            />
                        </div>
                    </div>


                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm deletion"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteConfirmEmail !== entityToDelete?.fromEmail || isDeleting}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Type the email <span className="font-semibold text-foreground">{entityToDelete?.fromEmail}</span> to delete this entity.
                    </p>
                    <Input
                        placeholder="Enter email"
                        value={deleteConfirmEmail}
                        onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                        autoFocus
                    />
                </div>
            </Modal>
        </div>
    );
}
