import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_INVERTER_MAKES,
    GET_INVERTER_MODELS,
    CREATE_INVERTER_MAKE,
    UPDATE_INVERTER_MAKE,
    DELETE_INVERTER_MAKE,
    CREATE_INVERTER_MODEL,
    UPDATE_INVERTER_MODEL,
    DELETE_INVERTER_MODEL,
    UPLOAD_FILE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal, ConfirmModal } from '@/components/common';
import { Tooltip } from '@/components/ui/Tooltip';
import { Switch } from '@/components/ui/Switch';
import { PlusIcon, TrashIcon, PencilIcon, ZapIcon, ChevronRightIcon, CheckCircleIcon, CloseIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

interface InverterMake {
    uid: string;
    make: string;
    isActive: boolean;
    shortName?: string;
    description?: string;
    minCapacity?: number;
    maxCapacity?: number;
    totalCapacity?: number;
    usableCapacity?: number;
    warrantyDetails?: string;
    productStatus?: number;
    cecCapacity?: number;
    cecExpiryDate?: string;
    datasheetPath?: string;
    datasheetUrl?: string;
    datasheetName?: string;
}

interface InverterModel {
    uid: string;
    makeUid: string;
    model: string;
    capacity: number;
    warranty?: string;
    isActive: boolean;
}

export const InverterMasterPage: React.FC = () => {
    // Queries
    const { data: makesData, loading: loadingMakes, refetch: refetchMakes } = useQuery(GET_INVERTER_MAKES);
    const [selectedMake, setSelectedMake] = useState<InverterMake | null>(null);
    const { data: modelsData, loading: loadingModels, refetch: refetchModels } = useQuery(GET_INVERTER_MODELS, {
        variables: { makeUid: selectedMake?.uid || '' },
        skip: !selectedMake?.uid
    });

    // Mutations
    const [createMake] = useMutation(CREATE_INVERTER_MAKE);
    const [updateMake] = useMutation(UPDATE_INVERTER_MAKE);
    const [deleteMake] = useMutation(DELETE_INVERTER_MAKE);
    const [createModel] = useMutation(CREATE_INVERTER_MODEL);
    const [updateModel] = useMutation(UPDATE_INVERTER_MODEL);
    const [deleteModel] = useMutation(DELETE_INVERTER_MODEL);
    const [uploadFile] = useMutation(UPLOAD_FILE);

    // Permissions
    const canManage = useAuthStore((state) => state.canEditInMenu('inverter_master'));

    // Search States
    const [makesSearch, setMakesSearch] = useState('');
    const [modelsSearch, setModelsSearch] = useState('');

    // Modal States
    const [makeModalOpen, setMakeModalOpen] = useState(false);
    const [editingMake, setEditingMake] = useState<InverterMake | null>(null);
    const [makeForm, setMakeForm] = useState({
        make: '',
        shortName: '',
        description: '',
        minCapacity: 0,
        maxCapacity: 0,
        totalCapacity: 0,
        usableCapacity: 0,
        warrantyDetails: '',
        productStatus: 0,
        cecCapacity: 0,
        cecExpiryDate: '',
        isActive: true,
        datasheetPath: '',
        datasheetUrl: '',
        datasheetName: ''
    });

    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<InverterModel | null>(null);
    const [modelForm, setModelForm] = useState({
        model: '',
        capacity: 0,
        warranty: '',
        isActive: true
    });

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<{
        uid: string;
        type: 'make' | 'model';
        title: string;
        message: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    // Filtering logic for Makes
    const filteredMakes = makesData?.inverterMakes?.filter((m: InverterMake) =>
        m.make.toLowerCase().includes(makesSearch.toLowerCase())
    ) || [];

    // Filtering logic for Models
    const filteredModels = modelsData?.inverterModels?.filter((m: InverterModel) =>
        m.model.toLowerCase().includes(modelsSearch.toLowerCase())
    ) || [];

    // Handle Make selection
    useEffect(() => {
        if (makesData?.inverterMakes?.length > 0 && !selectedMake) {
            setSelectedMake(makesData.inverterMakes[0]);
        }
    }, [makesData, selectedMake]);

    // Make Handlers
    const handleOpenMakeModal = (make?: InverterMake) => {
        if (make) {
            setEditingMake(make);
            setMakeForm({
                make: make.make,
                shortName: make.shortName || '',
                description: make.description || '',
                minCapacity: make.minCapacity || 0,
                maxCapacity: make.maxCapacity || 0,
                totalCapacity: make.totalCapacity || 0,
                usableCapacity: make.usableCapacity || 0,
                warrantyDetails: make.warrantyDetails || '',
                productStatus: make.productStatus || 0,
                cecCapacity: make.cecCapacity || 0,
                cecExpiryDate: make.cecExpiryDate ? new Date(make.cecExpiryDate).toISOString().split('T')[0] : '',
                isActive: make.isActive,
                datasheetPath: make.datasheetPath || '',
                datasheetUrl: make.datasheetUrl || '',
                datasheetName: make.datasheetName || ''
            });
        } else {
            setEditingMake(null);
            setMakeForm({
                make: '',
                shortName: '',
                description: '',
                minCapacity: 0,
                maxCapacity: 0,
                totalCapacity: 0,
                usableCapacity: 0,
                warrantyDetails: '',
                productStatus: 0,
                cecCapacity: 0,
                cecExpiryDate: '',
                isActive: true,
                datasheetPath: '',
                datasheetUrl: '',
                datasheetName: ''
            });
        }
        setMakeModalOpen(true);
    };

    const handleMakeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const inputPayload = {
                ...makeForm,
                cecExpiryDate: makeForm.cecExpiryDate || null,
            };
            // @ts-ignore
            delete inputPayload.datasheetUrl;

            if (editingMake) {
                const res = await updateMake({ variables: { uid: editingMake.uid, input: inputPayload } });
                if (res.errors) throw new Error(res.errors[0].message);
                toast.success('Manufacturer updated');
            } else {
                const res = await createMake({ variables: { input: inputPayload } });
                if (res.errors) throw new Error(res.errors[0].message);
                toast.success('Manufacturer added');
            }
            setMakeModalOpen(false);
            refetchMakes();
        } catch (error: any) {
            console.error('Submit error:', error);
            const message = error.graphQLErrors?.[0]?.message || error.message || 'Action failed';
            toast.error(message);
        }
    };

    const handleDeleteMake = (make: InverterMake) => {
        setDeleteConfig({
            uid: make.uid,
            type: 'make',
            title: `Delete ${make.make}?`,
            message: 'Are you sure you want to delete this manufacturer and all its associated models? This action cannot be undone.'
        });
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfig) return;
        setIsDeleting(true);
        try {
            if (deleteConfig.type === 'make') {
                const { data } = await deleteMake({ variables: { uid: deleteConfig.uid } });
                if (data?.deleteInverterMake) {
                    toast.success('Manufacturer deleted');
                    if (selectedMake?.uid === deleteConfig.uid) setSelectedMake(null);
                    refetchMakes();
                } else {
                    toast.error('Failed to delete manufacturer');
                }
            } else {
                const { data } = await deleteModel({ variables: { uid: deleteConfig.uid } });
                if (data?.deleteInverterModel) {
                    toast.success('Model deleted');
                    refetchModels();
                } else {
                    toast.error('Failed to delete model');
                }
            }
            setDeleteConfirmOpen(false);
        } catch (error: any) {
            console.error('Delete error:', error);
            const message = error.graphQLErrors?.[0]?.message || error.message || 'Delete failed';
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };



    // Model Handlers
    const handleOpenModelModal = (model?: InverterModel) => {
        if (model) {
            setEditingModel(model);
            setModelForm({
                model: model.model,
                capacity: model.capacity,
                warranty: model.warranty || '',
                isActive: model.isActive
            });
        } else {
            setEditingModel(null);
            setModelForm({
                model: '',
                capacity: 0,
                warranty: '',
                isActive: true
            });
        }
        setModelModalOpen(true);
    };

    const handleModelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMake) return;
        try {
            if (editingModel) {
                const res = await updateModel({ variables: { uid: editingModel.uid, input: modelForm } });
                if (res.errors) throw new Error(res.errors[0].message);
                toast.success('Model updated');
            } else {
                const res = await createModel({ variables: { input: { ...modelForm, makeUid: selectedMake.uid } } });
                if (res.errors) throw new Error(res.errors[0].message);
                toast.success('Model added');
            }
            setModelModalOpen(false);
            refetchModels();
        } catch (error: any) {
            console.error('Submit error:', error);
            const message = error.graphQLErrors?.[0]?.message || error.message || 'Action failed';
            toast.error(message);
        }
    };

    const handleDeleteModel = (model: InverterModel) => {
        setDeleteConfig({
            uid: model.uid,
            type: 'model',
            title: `Delete ${model.model}?`,
            message: 'Are you sure you want to delete this model? This action cannot be undone.'
        });
        setDeleteConfirmOpen(true);
    };



    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'make' | 'model') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            try {
                const { data } = await uploadFile({
                    variables: {
                        input: {
                            fileContent: base64,
                            filename: file.name,
                            folder: 'inverter-datasheets'
                        }
                    }
                });
                if (data?.uploadFile) {
                    if (type === 'make') {
                        setMakeForm({ 
                            ...makeForm, 
                            datasheetPath: data.uploadFile.path, 
                            datasheetUrl: data.uploadFile.url, 
                            datasheetName: data.uploadFile.filename 
                        });
                    }
                    toast.success('Datasheet uploaded');
                }
            } catch (error: any) {
                toast.error(error.message || 'Upload failed');
            }
        };
        reader.readAsDataURL(file);
    };

    const modelColumns: Column<InverterModel>[] = [
        {
            header: 'Model Name',
            key: 'model',
            render: (item: InverterModel) => <span className="font-medium">{item.model}</span>
        },
        {
            header: 'Capacity (kW)',
            key: 'capacity',
            render: (item: InverterModel) => <span>{item.capacity}</span>
        },
        {
            header: 'Warranty',
            key: 'warranty',
            render: (item: InverterModel) => <span>{item.warranty || '-'}</span>
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (item: InverterModel) => (
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold",
                    item.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (item: InverterModel) => (
                <div className="flex gap-2">
                    {canManage && (
                        <>
                            <Tooltip content="Edit">
                                <button onClick={() => handleOpenModelModal(item)} className="p-2 border border-border rounded-lg hover:bg-accent"><PencilIcon size={14} /></button>
                            </Tooltip>
                             <Tooltip content="Delete">
                                <button onClick={() => handleDeleteModel(item)} className="p-2 border border-border rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50 transition-colors">
                                    <TrashIcon size={14} />
                                </button>
                            </Tooltip>


                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6 p-1">
            <div className="flex justify-between items-center px-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ZapIcon className="text-primary" /> Inverter Master Catalogue
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage the database of inverter manufacturers and models</p>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left side: Makes */}
                <div className="w-[350px] bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Manufacturers</h3>
                            {canManage && (
                                <Button size="sm" onClick={() => handleOpenMakeModal()} variant="outline" className="h-8 px-2">
                                    <PlusIcon size={14} className="mr-1" /> Add
                                </Button>
                            )}
                        </div>
                        <Input
                            type="search"
                            inputSize="sm"
                            placeholder="Search manufacturer..."
                            value={makesSearch}
                            onChange={(e) => setMakesSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingMakes ? (
                            <div className="p-8 text-center text-muted-foreground italic">Loading manufacturers...</div>
                        ) : filteredMakes.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground italic">No manufacturers found</div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredMakes.map((m: InverterMake) => (
                                    <div
                                        key={m.uid}
                                        onClick={() => setSelectedMake(m)}
                                        className={cn(
                                            "group p-4 flex justify-between items-center cursor-pointer transition-all hover:bg-accent",
                                            selectedMake?.uid === m.uid ? "bg-accent/50 border-r-4 border-primary" : ""
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className={cn("font-medium", selectedMake?.uid === m.uid ? "text-primary" : "text-foreground")}>
                                                {m.make || 'Unnamed Manufacturer'}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!m.isActive && <span className="text-[10px] text-muted-foreground italic">(Inactive)</span>}
                                                {m.datasheetUrl && (
                                                    <a
                                                        href={m.datasheetUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-[10px] text-primary hover:underline"
                                                    >
                                                        Datasheet
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <div className="hidden group-hover:flex gap-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleOpenMakeModal(m); }} 
                                                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        <PencilIcon size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteMake(m); }} 
                                                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        <TrashIcon size={14} />
                                                    </button>

                                                </div>
                                            )}

                                            <ChevronRightIcon size={16} className={cn("text-muted-foreground transition-transform", selectedMake?.uid === m.uid ? "rotate-90 text-primary" : "")} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Right side: Models */}
                <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border space-y-4">
                        {selectedMake && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Min Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.minCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Max Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.maxCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.totalCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Usable Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.usableCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Warranty</div>
                                        <div className="text-lg font-bold text-foreground leading-tight">{selectedMake.warrantyDetails || '-'}</div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">CEC Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.cecCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center px-4 py-3 bg-accent/5 rounded-xl border border-border/40 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mr-2">
                                        <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Status</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                                            selectedMake.productStatus === 1
                                                ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 shadow-[0_2px_10px_-4px_rgba(34,197,94,0.3)]"
                                                : "bg-muted/30 border-border/50 text-muted-foreground"
                                        )}>
                                            {selectedMake.productStatus === 1 ? <CheckCircleIcon size={12} className="text-green-500" /> : <CloseIcon size={12} />}
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Product</span>
                                            <div className={cn(
                                                "w-10 py-0.5 rounded text-[8px] font-black leading-none text-center",
                                                selectedMake.productStatus === 1 ? "bg-green-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                                            )}>
                                                {selectedMake.productStatus === 1 ? "ACTIVE" : "OFF"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        {selectedMake.cecExpiryDate && (
                                            <div className="text-[10px] text-muted-foreground">
                                                <span className="font-bold">CEC EXPIRY:</span> {(() => {
                                                    const d = new Date(selectedMake.cecExpiryDate);
                                                    return isNaN(d.getTime()) ? selectedMake.cecExpiryDate : d.toLocaleDateString();
                                                })()}
                                            </div>
                                        )}
                                        {selectedMake.datasheetUrl && (
                                            <a
                                                href={selectedMake.datasheetUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-[10px] font-bold uppercase transition-colors hover:bg-primary/90"
                                            >
                                                View Datasheet
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Models {selectedMake && `for ${selectedMake.make}`}
                                </h3>
                            </div>
                            {selectedMake && canManage && (
                                <Button size="sm" onClick={() => handleOpenModelModal()}>
                                    <PlusIcon size={14} className="mr-2" /> Add New Model
                                </Button>
                            )}
                        </div>

                        {selectedMake && (
                            <div className="w-[30%]">
                                <Input
                                    type="search"
                                    inputSize="sm"
                                    placeholder="Search models..."
                                    value={modelsSearch}
                                    onChange={(e) => setModelsSearch(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {!selectedMake ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <ZapIcon size={48} className="mb-4 opacity-10" />
                                <p>Select a manufacturer to view and manage models</p>
                            </div>
                        ) : loadingModels ? (
                            <div className="p-8 text-center">Loading models...</div>
                        ) : (
                            <DataTable
                                data={filteredModels}
                                columns={modelColumns}
                                rowKey={(row: InverterModel) => row.uid}
                                emptyMessage="No models found for this manufacturer"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Manufacturer Modal */}
            <Modal
                isOpen={makeModalOpen}
                onClose={() => setMakeModalOpen(false)}
                title={editingMake ? 'Edit Manufacturer' : 'Add New Manufacturer'}
                size="lg"
            >
                <form onSubmit={handleMakeSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Manufacturer Name</label>
                            <Input
                                value={makeForm.make}
                                onChange={(e) => setMakeForm({ ...makeForm, make: e.target.value })}
                                placeholder="e.g. Sungrow"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Name</label>
                            <Input
                                value={makeForm.shortName}
                                onChange={(e) => setMakeForm({ ...makeForm, shortName: e.target.value })}
                                placeholder="e.g. SUN"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={makeForm.description}
                            onChange={(e) => setMakeForm({ ...makeForm, description: e.target.value })}
                            placeholder="Optional technical description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Capacity (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.minCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, minCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Capacity (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.maxCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, maxCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Capacity (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.totalCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, totalCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Usable Capacity (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.usableCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, usableCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CEC Capacity (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.cecCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, cecCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Warranty Details</label>
                            <Input
                                value={makeForm.warrantyDetails}
                                onChange={(e) => setMakeForm({ ...makeForm, warrantyDetails: e.target.value })}
                                placeholder="e.g. 10 Years"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CEC Expiry Date</label>
                            <Input
                                type="date"
                                value={makeForm.cecExpiryDate}
                                onChange={(e) => setMakeForm({ ...makeForm, cecExpiryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                                checked={makeForm.productStatus === 1}
                                onChange={(checked) => setMakeForm({ ...makeForm, productStatus: checked ? 1 : 0 })}
                            />
                            <span className="text-sm">Product Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                                checked={makeForm.isActive}
                                onChange={(checked) => setMakeForm({ ...makeForm, isActive: checked })}
                            />
                            <span className="text-sm">Manufacturer Active</span>
                        </label>
                    </div>

                    <div className="space-y-4 pt-2">
                        <label className="text-sm font-medium">Datasheet (Upload PDF)</label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={(e) => handleFileUpload(e, 'make')}
                                className="flex-1"
                            />
                            {makeForm.datasheetUrl && (
                                <a href={makeForm.datasheetUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline">
                                    Current: {makeForm.datasheetName || 'View'}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={() => setMakeModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingMake ? 'Update Manufacturer' : 'Create Manufacturer'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Model Modal */}
            <Modal
                isOpen={modelModalOpen}
                onClose={() => setModelModalOpen(false)}
                title={editingModel ? 'Edit Inverter Model' : 'Add New Inverter Model'}
                size="md"
            >
                <form onSubmit={handleModelSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Model Name</label>
                        <Input
                            value={modelForm.model}
                            onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })}
                            placeholder="e.g. SG5.0RS-ADA"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Capacity (kW)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={modelForm.capacity}
                            onChange={(e) => setModelForm({ ...modelForm, capacity: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Warranty</label>
                        <Input
                            value={modelForm.warranty}
                            onChange={(e) => setModelForm({ ...modelForm, warranty: e.target.value })}
                            placeholder="e.g. 5 Years"
                        />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        <Switch
                            checked={modelForm.isActive}
                            onChange={(checked) => setModelForm({ ...modelForm, isActive: checked })}
                        />
                        <span className="text-sm">Model Active</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={() => setModelModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingModel ? 'Update Model' : 'Create Model'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title={deleteConfig?.title || 'Confirm Deletion'}
                message={deleteConfig?.message || 'Are you sure you want to delete this item?'}
                isLoading={isDeleting}
                confirmText={isDeleting ? 'Deleting...' : 'Delete'}
            />
        </div>
    );
};

