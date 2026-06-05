import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_PLANS,
    DELETE_PLAN
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, TrashIcon, PencilIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { formatSydneyTime } from '@/lib/date';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';

interface Plan {
    uid: string;
    title: string;
    description?: string;
    isActive?: boolean;
    propertyType?: number;
    createdAt: string;
    updatedAt: string;
}

export const PlansMasterPage: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery(GET_PLANS);
    const [deletePlan, { loading: deleting }] = useMutation(DELETE_PLAN);

    const canManage = useAuthStore((state) => state.canEditInMenu('plans_master'));

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<Plan[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    useEffect(() => {
        if (data?.plans) {
            let result = [...data.plans];

            if (statusFilter === 'ACTIVE') {
                result = result.filter((item: Plan) => item.isActive !== false);
            } else if (statusFilter === 'INACTIVE') {
                result = result.filter((item: Plan) => item.isActive === false);
            }

            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter((item: Plan) =>
                    item.title?.toLowerCase().includes(lowerQuery) ||
                    item.description?.toLowerCase().includes(lowerQuery)
                );
            }

            setFilteredData(result);
        }
    }, [data, statusFilter, searchQuery]);

    const handleOpenModal = (plan: Plan) => {
        navigate(`/plans-master/${plan.uid}/edit`);
    };

    const handleDeleteClick = (plan: Plan) => {
        setPlanToDelete(plan);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!planToDelete) return;
        try {
            await deletePlan({ variables: { uid: planToDelete.uid } });
            toast.success('Plan deleted successfully');
            refetch();
            setDeleteModalOpen(false);
            setPlanToDelete(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete plan');
        }
    };

    const columns: Column<Plan>[] = [
        {
            header: 'Plan Title',
            key: 'title',
            render: (item) => <span className="font-medium">{item.title}</span>
        },
        {
            header: 'Description',
            key: 'description',
            render: (item) => <span className="text-muted-foreground">{item.description || '-'}</span>
        },
        {
            header: 'Property Type',
            key: 'propertyType',
            render: (item) => (
                <span className="capitalize font-medium">
                    {item.propertyType === 1 ? 'Commercial' : 'Residential'}
                </span>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item) => <StatusField type="user_status" value={item.isActive !== false ? 1 : 0} />
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
                    {canManage ? (
                        <>
                            <Tooltip content="Edit Plan">
                                <button
                                    className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => handleOpenModal(item)}
                                >
                                    <PencilIcon size={16} />
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete Plan">
                                <button
                                    className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                    onClick={() => handleDeleteClick(item)}
                                >
                                    <TrashIcon size={16} />
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No permission</span>
                    )}
                </div>
            )
        }
    ];

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading plans</div>;

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col gap-2 border-border pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Plans Master Catalogue
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-2xl mt-1">
                            Manage plans and their associated details.
                        </p>
                    </div>
                    {canManage && (
                        <Button onClick={() => navigate('/plans-master/new')}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add New Plan
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm">
                <div className="p-5 border-b border-border">
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
                            placeholder="Search plans..."
                            containerClassName="w-[30%]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-5">
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        rowKey={(row) => row.uid}
                        emptyMessage="No plans found"
                    />
                </div>
            </div>

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
                <p>Are you sure you want to delete <span className="font-bold">{planToDelete?.title}</span>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};
