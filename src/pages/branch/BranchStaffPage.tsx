import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { useUser } from '@/stores/useAuthStore';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal } from '@/components/common';
import {
    PlusIcon, PencilIcon, TrashIcon
} from '@/components/icons';
import { GET_USERS, UPDATE_USER, SOFT_DELETE_USER, GET_ROLES, CREATE_USER } from '@/graphql';
import { BranchLayout } from './BranchLayout';

// Types
interface User {
    uid: string;
    email?: string;
    password?: string;
    name: string;
    number?: string;
    tenant?: string;
    roleUid: string;
    roleName: string;
    status: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
}

interface Role {
    uid: string;
    name: string;
    isDeleted: boolean;
    isIndependentUi?: boolean;
}

interface UsersResponse {
    users: {
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
        data: User[];
    };
}

export function BranchStaffPage() {
    const currentUser = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Create/Edit modal state
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        number: '',
        roleUid: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const limit = 20;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== searchQuery) {
                setAllUsers([]);
                setPage(1);
                setDebouncedSearch(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, debouncedSearch]);

    const { data, loading, error, refetch } = useQuery<UsersResponse>(GET_USERS, {
        variables: {
            page,
            limit,
            status: 'ACTIVE',
            search: debouncedSearch || undefined,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    // Fetch roles for dropdown
    const { data: rolesData } = useQuery(GET_ROLES);
    const roles = rolesData?.roles?.data || [];

    // Branch staff should only be able to assign "Branch Staff" or similar independent roles
    const roleDropdownOptions = roles
        .filter((r: Role) => !r.isDeleted && r.isIndependentUi)
        .map((r: Role) => ({ value: r.uid, label: r.name }));

    const [createUser] = useMutation(CREATE_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    const [softDeleteUser] = useMutation(SOFT_DELETE_USER);

    const meta = data?.users?.meta;
    const hasMore = meta ? page < meta.totalPages : false;

    // Update allUsers when data changes
    useEffect(() => {
        if (data?.users?.data) {
            let fetchedUsers = data.users.data;
            if (page === 1) {
                setAllUsers(fetchedUsers);
            } else {
                setAllUsers(prev => {
                    const existingIds = new Set(prev.map(u => u.uid));
                    const newUsers = fetchedUsers.filter(u => !existingIds.has(u.uid));
                    return [...prev, ...newUsers];
                });
            }
            setIsLoadingMore(false);
        }
    }, [data, page]);

    // Toggle user status (ACTIVE <-> INACTIVE)
    const toggleUserStatus = async (user: User) => {
        const newStatus = user.status === 'ACTIVE' ? 0 : 1;
        const newStatusString = newStatus === 1 ? 'ACTIVE' : 'INACTIVE';

        setAllUsers(prev =>
            prev.map(u => u.uid === user.uid ? { ...u, status: newStatusString } : u)
        );

        try {
            await updateUser({
                variables: {
                    uid: user.uid,
                    input: { status: newStatus }
                }
            });
        } catch (err) {
            setAllUsers(prev =>
                prev.map(u => u.uid === user.uid ? { ...u, status: user.status } : u)
            );
            console.error('Failed to update user status:', err);
        }
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteConfirmName('');
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete || deleteConfirmName !== userToDelete.name) return;
        setIsDeleting(true);
        try {
            await softDeleteUser({ variables: { uid: userToDelete.uid } });
            toast.success('Staff member removed');
            setAllUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddUser = () => {
        setModalMode('create');
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            number: '',
            roleUid: roleDropdownOptions[0]?.value || '',
        });
        setErrors({});
        setUserModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setModalMode('edit');
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            number: user.number || '',
            roleUid: user.roleUid || '',
        });
        setErrors({});
        setUserModalOpen(true);
    };

    const handleUserSubmit = async () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.number) newErrors.number = 'Phone number is required';
        if (!formData.roleUid) newErrors.roleUid = 'Role is required';
        if (modalMode === 'create') {
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.password) newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            if (modalMode === 'create') {
                await createUser({
                    variables: {
                        input: {
                            ...formData,
                            isMaster: 0, // Staff added by branch is always staff
                            isAllowedWithoutIp: 1
                        }
                    }
                });
                toast.success('Staff member added successfully');
            } else {
                if (!editingUser) return;
                const updateInput: any = {
                    name: formData.name,
                    number: formData.number,
                    role_uid: formData.roleUid,
                };
                if (formData.password) updateInput.password = formData.password;

                await updateUser({
                    variables: {
                        uid: editingUser.uid,
                        input: updateInput
                    }
                });
                toast.success('Staff member updated');
            }
            setUserModalOpen(false);
            await refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'Name',
            render: (u) => <span className="font-bold text-title">{u.name}</span>,
        },
        {
            key: 'email',
            header: 'Email',
            render: (u) => <span className="text-subtitle">{u.email}</span>,
        },
        {
            key: 'role',
            header: 'Role',
            render: (u) => (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {u.roleName}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (u) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleUserStatus(u)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${u.status === 'ACTIVE' ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${u.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-xs font-bold text-title">{u.status}</span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: '',
            width: 'w-[100px]',
            render: (u) => (
                <div className="flex items-center justify-end gap-2">
                    {currentUser?.isMaster && (
                        <>
                            <button
                                className="p-2 text-subtitle hover:text-primary transition-colors"
                                onClick={() => handleEditUser(u)}
                            >
                                <PencilIcon size={16} />
                            </button>
                            {currentUser?.uid !== u.uid && (
                                <button
                                    className="p-2 text-subtitle hover:text-rose-500 transition-colors"
                                    onClick={() => handleDeleteClick(u)}
                                >
                                    <TrashIcon size={16} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <BranchLayout>
            <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-title tracking-tight">Staff Management</h1>
                        <p className="text-subtitle mt-1">Manage your branch team members and their portal access.</p>
                    </div>
                    {currentUser?.isMaster && (
                        <Button
                            leftIcon={<PlusIcon size={18} />}
                            onClick={handleAddUser}
                            className="shadow-lg shadow-primary/20"
                        >
                            Add Staff Member
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border/40 bg-gray-50/50 dark:bg-white/[0.02]">
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-md bg-white dark:bg-transparent"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={allUsers}
                        rowKey={(u) => u.uid}
                        loading={loading}
                        error={error?.message}
                        emptyMessage="No staff members found."
                        infiniteScroll
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMore}
                    />
                </div>
            </div>

            {/* User Modal */}
            <Modal
                isOpen={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                title={modalMode === 'create' ? 'Add Staff Member' : 'Edit Staff Member'}
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUserSubmit} isLoading={isSubmitting}>
                            {modalMode === 'create' ? 'Add Member' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-title uppercase tracking-wider opacity-70">Full Name</label>
                        <Input
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-title uppercase tracking-wider opacity-70">Email Address</label>
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={modalMode === 'edit'}
                                error={errors.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-title uppercase tracking-wider opacity-70">Phone Number</label>
                            <Input
                                placeholder="0400 000 000"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                error={errors.number}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-title uppercase tracking-wider opacity-70">Portal Password</label>
                            <Input
                                type="password"
                                placeholder={modalMode === 'edit' ? 'Leave blank to keep same' : 'Enter password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-title uppercase tracking-wider opacity-70">Assigned Role</label>
                            <select
                                className="w-full h-10 px-3 rounded-xl border border-border bg-white dark:bg-white/[0.04] text-title text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.roleUid}
                                onChange={(e) => setFormData({ ...formData, roleUid: e.target.value })}
                            >
                                {roleDropdownOptions.map((opt: { value: string; label: string }) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Remove Staff Member"
                size="sm"
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteConfirmName !== userToDelete?.name}
                            isLoading={isDeleting}
                        >
                            Remove
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-subtitle">
                        Are you sure you want to remove <span className="font-bold text-title">{userToDelete?.name}</span>?
                        They will no longer be able to access the branch portal.
                    </p>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Type name to confirm</p>
                    <Input
                        placeholder="Enter name"
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                    />
                </div>
            </Modal>
        </BranchLayout>
    );
}
