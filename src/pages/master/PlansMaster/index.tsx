import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_PLANS,
    DELETE_PLAN
} from '@/graphql';
import { GET_RATE_PLANS } from '@/graphql/queries/rates';
import { UPDATE_PLAN, CREATE_PLAN } from '@/graphql/mutations/plans';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { ConfirmationPopover } from '@/components/ui';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, TrashIcon, PencilIcon, CopyIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { formatSydneyTime } from '@/lib/date';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { ColumnMetadataModal } from '@/pages/rates/components/ColumnMetadataModal';
interface Plan {
    uid: string;
    title: string;
    state?: string;
    description?: string;
    isActive?: boolean;
    isDnspBased?: boolean;
    propertyType?: number;
    isSolarRequired?: boolean;
    isBatteryRequired?: boolean;
    attachNominationForm?: boolean;
    contractTerm?: string;
    exitFee?: number;
    createdAt: string;
    updatedAt: string;
}

export const PlansMasterPage: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery(GET_PLANS);
    const { data: ratePlansData } = useQuery(GET_RATE_PLANS, { variables: { limit: 1000 } });
    const [deletePlan, { loading: deleting }] = useMutation(DELETE_PLAN);
    const [updatePlan] = useMutation(UPDATE_PLAN);
    const [createPlan, { loading: creating }] = useMutation(CREATE_PLAN);

    const canManage = useAuthStore((state) => state.canEditInMenu('plans_master'));
    const canChangeStatus = useAuthStore((state) => state.hasFeatureAccess('feature_change_plan_status'));

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [filteredData, setFilteredData] = useState<Plan[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
    const [columnModalOpen, setColumnModalOpen] = useState(false);

    const dynamicFieldNames = useMemo(() => {
        const names = new Set<string>();
        if (ratePlansData?.ratePlans?.data) {
            ratePlansData.ratePlans.data.forEach((plan: any) => {
                plan.offers?.forEach((offer: any) => {
                    let parsedDynamic: any[] = [];
                    if (typeof offer.dynamicRates === 'string') {
                        try { parsedDynamic = JSON.parse(offer.dynamicRates); } catch { }
                    } else if (offer.dynamicRates) {
                        parsedDynamic = offer.dynamicRates;
                    }
                    parsedDynamic.forEach((rate: any) => {
                        if (rate.name) names.add(rate.name.toLowerCase());
                    });
                });
            });
        }
        return Array.from(names).sort();
    }, [ratePlansData]);

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
            setDeleteModalOpen(false);
            setPlanToDelete(null);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete plan');
        }
    };

    const handleDuplicateClick = async (item: Plan) => {
        try {
            const { uid, tenant, createdAt, updatedAt, __typename, ...rest } = item as any;
            const input = {
                ...rest,
                title: `${item.title} copy`
            };
            await createPlan({ variables: { input } });
            toast.success('Plan duplicated successfully');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to duplicate plan');
        }
    };

    const handleToggleStatus = async (plan: Plan) => {
        try {
            await updatePlan({
                variables: {
                    uid: plan.uid,
                    input: {
                        isActive: plan.isActive === false ? true : false
                    }
                }
            });
            toast.success(`Plan marked as ${plan.isActive === false ? 'active' : 'inactive'}`);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update plan status');
        }
    };

    const columns: Column<Plan>[] = [
        {
            header: 'Plan Title',
            key: 'title',
            render: (item) => <span className="font-medium">{item.title}</span>
        },
        {
            header: 'State',
            key: 'state' as any,
            render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {item.state ? item.state.split(',').map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full dark:bg-purple-900/30 dark:text-purple-400 font-medium whitespace-nowrap border border-purple-200 dark:border-purple-800">
                            {s.trim()}
                        </span>
                    )) : <span className="text-muted-foreground">-</span>}
                </div>
            )
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
                    {item.propertyType === 1 ? 'Commercial' : item.propertyType === 2 ? 'Large Business' : 'Residential'}
                </span>
            )
        },
        {
            header: 'Requirements',
            key: 'requirements' as any,
            render: (item) => (
                <div className="flex gap-2">
                    {item.isSolarRequired && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400 font-medium whitespace-nowrap border border-yellow-200 dark:border-yellow-800">Solar Req.</span>}
                    {item.isBatteryRequired && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-400 font-medium whitespace-nowrap border border-green-200 dark:border-green-800">Battery Req.</span>}
                    {!item.isSolarRequired && !item.isBatteryRequired && <span className="text-muted-foreground">-</span>}
                </div>
            )
        },
        {
            header: 'Attachments',
            key: 'attachNominationForm' as any,
            render: (item) => (
                <div className="flex gap-2">
                    {item.attachNominationForm ? (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400 font-medium whitespace-nowrap border border-blue-200 dark:border-blue-800">
                            Nom. Form
                        </span>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            )
        },
        {
            header: 'Contract Term',
            key: 'contractTerm' as any,
            render: (item) => <span className="text-sm font-medium">{item.contractTerm || '-'}</span>
        },
        {
            header: 'Exit Fee',
            key: 'exitFee' as any,
            render: (item) => <span className="text-sm font-medium">{item.exitFee !== null && item.exitFee !== undefined ? `$${item.exitFee}` : '-'}</span>
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <ConfirmationPopover
                        title="Confirm Status Change"
                        description={`Are you sure you want to mark this plan as ${item.isActive === false ? 'Active' : 'Inactive'}?`}
                        onConfirm={() => handleToggleStatus(item)}
                        enabled={canChangeStatus}
                        confirmVariant="default"
                        placement="left"
                    >
                        <div className={!canChangeStatus ? 'pointer-events-none opacity-50' : ''}>
                            <Switch
                                checked={item.isActive !== false}
                                onChange={() => { }}
                                disabled={!canChangeStatus}
                            />
                        </div>
                    </ConfirmationPopover>
                    <StatusField type="user_status" value={item.isActive !== false ? 1 : 0} />
                </div>
            )
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
                            <Tooltip content="Duplicate Plan">
                                <ConfirmationPopover
                                    title="Duplicate Plan"
                                    description={`Are you sure you want to duplicate "${item.title}"?`}
                                    onConfirm={() => handleDuplicateClick(item)}
                                    confirmVariant="default"
                                    placement="left"
                                    enabled={canManage}
                                >
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                        disabled={creating}
                                    >
                                        <CopyIcon size={16} />
                                    </button>
                                </ConfirmationPopover>
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


    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-2 border-border pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            Plans Master Catalogue
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-2xl mt-1">
                            Manage plans and their associated details.
                        </p>
                    </div>
                    {canManage && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setColumnModalOpen(true)}>
                                Column Definitions
                            </Button>
                            <Button onClick={() => navigate('/plans-master/new')}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add New Plan
                            </Button>
                        </div>
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
                        loading={loading}
                        error={error?.message}
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

            <ColumnMetadataModal 
                isOpen={columnModalOpen} 
                onClose={() => setColumnModalOpen(false)} 
                availableColumns={[
                    'anytime', 'cl1Supply', 'cl1Usage', 'cl2Supply', 'cl2Usage', 'demand', 'demandOp', 'demandP', 'demandS', 'fit', 'fitPeak', 'fitCritical', 'fitVpp', 'offPeak', 'peak', 'shoulder', 'supplyCharge', 'vppOrcharge',
                    ...dynamicFieldNames
                ]}
            />
        </div>
    );
};
