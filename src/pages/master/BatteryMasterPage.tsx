import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_BATTERY_MAKES,
    GET_BATTERY_MODELS,
    CREATE_BATTERY_MAKE,
    UPDATE_BATTERY_MAKE,
    DELETE_BATTERY_MAKE,
    CREATE_BATTERY_MODEL,
    UPDATE_BATTERY_MODEL,
    DELETE_BATTERY_MODEL,
    UPLOAD_FILE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal, ConfirmModal } from '@/components/common';
import { Tooltip } from '@/components/ui/Tooltip';
import { Switch } from '@/components/ui/Switch';
import { PlusIcon, TrashIcon, PencilIcon, ZapIcon, ChevronRightIcon, CheckCircleIcon, CloseIcon, AlertCircleIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

interface BatteryMake {
    uid: string;
    make: string;
    isActive: boolean;
    declaredModelCount?: number;
    actualModelRows?: number;
    minCapacity?: number;
    maxCapacity?: number;
    shortName?: string;
    description?: string;
    batteryUsableCapacity?: number;
    maxBackupLoad?: number;
    batteryProdWarranty?: string;
    productStatus?: number;
    cecStatus?: number;
    pdrsStatus?: number;
    cegCapacity?: number;
    batteryCapacityKwh?: number;
    cegExpiryDate?: string;
    datasheetPath?: string;
    datasheetUrl?: string;
    datasheetName?: string;
}

interface BatteryModel {
    uid: string;
    makeUid: string;
    model: string;
    capacity: number;
    vppProgram: string;
    bess2Eligible: number;
    vpp1Eligible: number;
    isActive: boolean;
}

export const BatteryMasterPage: React.FC = () => {
    // Queries
    const { data: makesData, loading: loadingMakes, refetch: refetchMakes } = useQuery(GET_BATTERY_MAKES);
    const [selectedMake, setSelectedMake] = useState<BatteryMake | null>(null);
    const { data: modelsData, loading: loadingModels, refetch: refetchModels } = useQuery(GET_BATTERY_MODELS, {
        variables: { makeUid: selectedMake?.uid || '' },
        skip: !selectedMake?.uid
    });

    // Mutations
    const [createMake] = useMutation(CREATE_BATTERY_MAKE);
    const [updateMake] = useMutation(UPDATE_BATTERY_MAKE);
    const [deleteMake] = useMutation(DELETE_BATTERY_MAKE);
    const [createModel] = useMutation(CREATE_BATTERY_MODEL);
    const [updateModel] = useMutation(UPDATE_BATTERY_MODEL);
    const [deleteModel] = useMutation(DELETE_BATTERY_MODEL);
    const [uploadFile] = useMutation(UPLOAD_FILE);

    // Permissions
    const canManage = useAuthStore((state) => state.canEditInMenu('battery_master'));

    // Search States
    const [makesSearch, setMakesSearch] = useState('');
    const [modelsSearch, setModelsSearch] = useState('');

    // Modal States
    const [makeModalOpen, setMakeModalOpen] = useState(false);
    const [editingMake, setEditingMake] = useState<BatteryMake | null>(null);
    const [makeForm, setMakeForm] = useState({
        make: '',
        declaredModelCount: 0,
        actualModelRows: 0,
        minCapacity: 0,
        maxCapacity: 0,
        shortName: '',
        description: '',
        batteryUsableCapacity: 0,
        maxBackupLoad: 0,
        batteryProdWarranty: '',
        productStatus: 0,
        cecStatus: 0,
        pdrsStatus: 0,
        cegCapacity: 0,
        batteryCapacityKwh: 0,
        cegExpiryDate: '',
        isActive: true,
        datasheetPath: '',
        datasheetUrl: '',
        datasheetName: ''
    });

    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<BatteryModel | null>(null);
    const [modelForm, setModelForm] = useState({
        model: '',
        capacity: 0,
        vppProgram: '',
        bess2Eligible: 0,
        vpp1Eligible: 0,
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
    const [isSavingMake, setIsSavingMake] = useState(false);
    const [isSavingModel, setIsSavingModel] = useState(false);


    // Filtering logic for Makes
    const filteredMakes = makesData?.batteryMakes?.filter((m: BatteryMake) =>
        m.make.toLowerCase().includes(makesSearch.toLowerCase())
    ) || [];

    // Filtering logic for Models
    const filteredModels = modelsData?.batteryModels?.filter((m: BatteryModel) =>
        m.model.toLowerCase().includes(modelsSearch.toLowerCase())
    ) || [];

    // Handle Make selection
    useEffect(() => {
        if (makesData?.batteryMakes?.length > 0 && !selectedMake) {
            setSelectedMake(makesData.batteryMakes[0]);
        }
    }, [makesData, selectedMake]);

    // Make Handlers
    const handleOpenMakeModal = (make?: BatteryMake) => {
        if (make) {
            setEditingMake(make);
            setMakeForm({
                make: make.make,
                declaredModelCount: make.declaredModelCount || 0,
                actualModelRows: make.actualModelRows || 0,
                minCapacity: make.minCapacity || 0,
                maxCapacity: make.maxCapacity || 0,
                shortName: make.shortName || '',
                description: make.description || '',
                batteryUsableCapacity: make.batteryUsableCapacity || 0,
                maxBackupLoad: make.maxBackupLoad || 0,
                batteryProdWarranty: make.batteryProdWarranty || '',
                productStatus: make.productStatus || 0,
                cecStatus: make.cecStatus || 0,
                pdrsStatus: make.pdrsStatus || 0,
                cegCapacity: make.cegCapacity || 0,
                batteryCapacityKwh: make.batteryCapacityKwh || 0,
                cegExpiryDate: make.cegExpiryDate ? new Date(make.cegExpiryDate).toISOString().split('T')[0] : '',
                isActive: make.isActive,
                datasheetPath: make.datasheetPath || '',
                datasheetUrl: make.datasheetUrl || '',
                datasheetName: make.datasheetName || ''
            });
        } else {
            setEditingMake(null);
            setMakeForm({
                make: '',
                declaredModelCount: 0,
                actualModelRows: 0,
                minCapacity: 0,
                maxCapacity: 0,
                shortName: '',
                description: '',
                batteryUsableCapacity: 0,
                maxBackupLoad: 0,
                batteryProdWarranty: '',
                productStatus: 0,
                cecStatus: 0,
                pdrsStatus: 0,
                cegCapacity: 0,
                batteryCapacityKwh: 0,
                cegExpiryDate: '',
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
        setIsSavingMake(true);
        try {
            // Clean up input payload
            const inputPayload = {
                ...makeForm,
                cegExpiryDate: makeForm.cegExpiryDate || null,
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
        } finally {
            setIsSavingMake(false);
        }
    };

    const handleDeleteMake = (make: BatteryMake) => {
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
                if (data?.deleteBatteryMake) {
                    toast.success('Manufacturer deleted');
                    if (selectedMake?.uid === deleteConfig.uid) setSelectedMake(null);
                    refetchMakes();
                } else {
                    toast.error('Failed to delete manufacturer');
                }
            } else {
                const { data } = await deleteModel({ variables: { uid: deleteConfig.uid } });
                if (data?.deleteBatteryModel) {
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
    const handleOpenModelModal = (model?: BatteryModel) => {
        if (model) {
            setEditingModel(model);
            setModelForm({
                model: model.model,
                capacity: model.capacity,
                vppProgram: model.vppProgram || '',
                bess2Eligible: model.bess2Eligible,
                vpp1Eligible: model.vpp1Eligible,
                isActive: model.isActive
            });
        } else {
            setEditingModel(null);
            setModelForm({
                model: '',
                capacity: 0,
                vppProgram: '',
                bess2Eligible: 0,
                vpp1Eligible: 0,
                isActive: true
            });
        }
        setModelModalOpen(true);
    };

    const handleModelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMake) return;
        setIsSavingModel(true);
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
        } finally {
            setIsSavingModel(false);
        }
    };

    const handleDeleteModel = (model: BatteryModel) => {
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
                            folder: 'battery-datasheets'
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

    const modelColumns: Column<BatteryModel>[] = [
        {
            header: 'Model Name',
            key: 'model',
            render: (item: BatteryModel) => <span className="font-medium">{item.model}</span>
        },
        {
            header: 'Capacity (kWh)',
            key: 'capacity',
            render: (item: BatteryModel) => <span>{item.capacity}</span>
        },
        {
            header: 'VPP Program',
            key: 'vppProgram',
            render: (item: BatteryModel) => <span>{item.vppProgram || '-'}</span>
        },
        {
            header: 'Eligibility',
            key: 'eligibility',
            render: (item: BatteryModel) => (
                <div className="flex gap-2">
                    {item.bess2Eligible === 1 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">BESS2</span>}
                    {item.vpp1Eligible === 1 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">VPP1</span>}
                </div>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (item: BatteryModel) => (
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
                        <ZapIcon className="text-primary" /> Battery Master Catalogue
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage the database of battery manufacturers and models</p>
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
                                {filteredMakes.map((m: BatteryMake) => (
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
                                                {m.make}
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
                                                    <button onClick={(e) => { e.stopPropagation(); handleOpenMakeModal(m); }} className="p-1 hover:text-primary"><PencilIcon size={14} /></button>
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
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Declared Models</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.declaredModelCount || 0}</div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Actual Rows</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.actualModelRows || 0}</div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Min Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.minCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kWh</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Max Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.maxCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kWh</span></div>
                                    </div>

                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Usable Capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.batteryUsableCapacity || 0} <span className="text-xs font-normal text-muted-foreground">kWh</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Battery capacity</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.batteryCapacityKwh || 0} <span className="text-xs font-normal text-muted-foreground">kWh</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Max Backup Load</div>
                                        <div className="text-xl font-bold text-foreground">{selectedMake.maxBackupLoad || 0} <span className="text-xs font-normal text-muted-foreground">kW</span></div>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Warranty</div>
                                        <div className="text-lg font-bold text-foreground leading-tight">{selectedMake.batteryProdWarranty || '-'}</div>
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

                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                                            selectedMake.cecStatus === 1
                                                ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 shadow-[0_2px_10px_-4px_rgba(59,130,246,0.3)]"
                                                : "bg-muted/30 border-border/50 text-muted-foreground"
                                        )}>
                                            {selectedMake.cecStatus === 1 ? <CheckCircleIcon size={12} className="text-blue-500" /> : <AlertCircleIcon size={12} />}
                                            <span className="text-[10px] font-bold uppercase tracking-wider">CEC Listed</span>
                                            <div className={cn(
                                                "w-10 py-0.5 rounded text-[8px] font-black leading-none text-center",
                                                selectedMake.cecStatus === 1 ? "bg-blue-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                                            )}>
                                                {selectedMake.cecStatus === 1 ? "ON" : "OFF"}
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                                            selectedMake.pdrsStatus === 1
                                                ? "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400 shadow-[0_2px_10px_-4px_rgba(249,115,22,0.3)]"
                                                : "bg-muted/30 border-border/50 text-muted-foreground"
                                        )}>
                                            {selectedMake.pdrsStatus === 1 ? <CheckCircleIcon size={12} className="text-orange-500" /> : <AlertCircleIcon size={12} />}
                                            <span className="text-[10px] font-bold uppercase tracking-wider">PDRS</span>
                                            <div className={cn(
                                                "w-10 py-0.5 rounded text-[8px] font-black leading-none text-center",
                                                selectedMake.pdrsStatus === 1 ? "bg-orange-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                                            )}>
                                                {selectedMake.pdrsStatus === 1 ? "ON" : "OFF"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        {selectedMake.cegExpiryDate && (
                                            <div className="text-[10px] text-muted-foreground">
                                                <span className="font-bold">CEG EXPIRY:</span> {new Date(selectedMake.cegExpiryDate).toLocaleDateString()}
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
                                rowKey={(row: BatteryModel) => row.uid}
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
                                placeholder="e.g. Tesla"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Name</label>
                            <Input
                                value={makeForm.shortName}
                                onChange={(e) => setMakeForm({ ...makeForm, shortName: e.target.value })}
                                placeholder="e.g. TSLA"
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

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Declared Models</label>
                            <Input
                                type="number"
                                value={makeForm.declaredModelCount}
                                onChange={(e) => setMakeForm({ ...makeForm, declaredModelCount: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.minCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, minCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.maxCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, maxCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Usable Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.batteryUsableCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, batteryUsableCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Backup Load (kW)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.maxBackupLoad}
                                onChange={(e) => setMakeForm({ ...makeForm, maxBackupLoad: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Warranty Details</label>
                            <Input
                                value={makeForm.batteryProdWarranty}
                                onChange={(e) => setMakeForm({ ...makeForm, batteryProdWarranty: e.target.value })}
                                placeholder="e.g. 10 Years"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CEG Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.cegCapacity}
                                onChange={(e) => setMakeForm({ ...makeForm, cegCapacity: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Battery Total Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={makeForm.batteryCapacityKwh}
                                onChange={(e) => setMakeForm({ ...makeForm, batteryCapacityKwh: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CEG Expiry Date</label>
                            <Input
                                type="date"
                                value={makeForm.cegExpiryDate}
                                onChange={(e) => setMakeForm({ ...makeForm, cegExpiryDate: e.target.value })}
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
                                checked={makeForm.cecStatus === 1}
                                onChange={(checked) => setMakeForm({ ...makeForm, cecStatus: checked ? 1 : 0 })}
                            />
                            <span className="text-sm">CEC Listed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                                checked={makeForm.pdrsStatus === 1}
                                onChange={(checked) => setMakeForm({ ...makeForm, pdrsStatus: checked ? 1 : 0 })}
                            />
                            <span className="text-sm">PDRS Active</span>
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
                        <Button type="button" variant="outline" onClick={() => setMakeModalOpen(false)} disabled={isSavingMake}>Cancel</Button>
                        <Button type="submit" isLoading={isSavingMake}>{editingMake ? 'Update Manufacturer' : 'Create Manufacturer'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Model Modal */}
            <Modal
                isOpen={modelModalOpen}
                onClose={() => setModelModalOpen(false)}
                title={editingModel ? 'Edit Battery Model' : 'Add New Battery Model'}
                size="md"
            >
                <form onSubmit={handleModelSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Model Name</label>
                        <Input
                            value={modelForm.model}
                            onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })}
                            placeholder="e.g. Powerwall 2"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity (kWh)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={modelForm.capacity}
                                onChange={(e) => setModelForm({ ...modelForm, capacity: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">VPP Program</label>
                            <Input
                                value={modelForm.vppProgram}
                                onChange={(e) => setModelForm({ ...modelForm, vppProgram: e.target.value })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={modelForm.bess2Eligible === 1}
                                onChange={(e) => setModelForm({ ...modelForm, bess2Eligible: e.target.checked ? 1 : 0 })}
                            />
                            <span className="text-sm">BESS2 Eligible</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={modelForm.vpp1Eligible === 1}
                                onChange={(e) => setModelForm({ ...modelForm, vpp1Eligible: e.target.checked ? 1 : 0 })}
                            />
                            <span className="text-sm">VPP1 Eligible</span>
                        </label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setModelModalOpen(false)} disabled={isSavingModel}>Cancel</Button>
                        <Button type="submit" isLoading={isSavingModel}>{editingModel ? 'Update' : 'Create'}</Button>
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

