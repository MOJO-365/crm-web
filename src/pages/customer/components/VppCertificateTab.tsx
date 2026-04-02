import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/common';
import { apiAxios } from '@/lib/apollo';
import { GET_CUSTOMER_VPP_CERTIFICATE_DETAILS, GENERATE_VPP_CERTIFICATE, GET_BATTERY_MAKES, GET_BATTERY_MODELS } from '@/graphql';
import { useLazyQuery } from '@apollo/client';
import { FileTextIcon, ZapIcon, PlugIcon, ShieldCheckIcon, CheckIcon, EyeIcon, Settings2Icon, SunIcon } from '@/components/icons';

interface VppCertificateTabProps {
    customerUid: string;
    onUpdate?: () => void;
    vppDetails?: any;
    solarDetails?: any;
    ratePlan?: any;
    isDeleted?: boolean;
    vppForm?: any;
    setVppForm?: (val: any) => void;
    isEditingVpp?: boolean;
    setIsEditingVpp?: (val: boolean) => void;
    handleVppToggle?: (uid: string, checked: boolean) => void;
    handleSaveVppDetails?: () => void;
}

export function VppCertificateTab({
    customerUid,
    onUpdate,
    vppDetails,
    solarDetails
}: VppCertificateTabProps) {
    const { data, loading, refetch } = useQuery(GET_CUSTOMER_VPP_CERTIFICATE_DETAILS, {
        variables: { uid: customerUid },
        fetchPolicy: 'network-only'
    });

    const [formState, setFormState] = useState({
        batteryManufacturer: '',
        batteryModel: '',
        batterySerialNumber: '',
        batteryInstalledDate: '',
        batteryUsableCapacity: '',
        batteryPortConnected: 0,
        inverterManufacturer: '',
        inverterModel: '',
        inverterSnNumbers: '',
        inverterCapacity: '',
        isLifeSupportEquipment: 0,
        ifYesDetails: '',
        internetConnectionType: 0,
        internetOtherText: '',
        modemRouterLocation: '',
        apiIntegration: 0,
        remoteChargesCommandTest: 0,
        remoteChargesCommandTestAt: '',
        remoteDischargesCommandTest: 0,
        remoteDischargesCommandTestAt: '',
        stateOfChangeMonitoring: 0,
        stateOfChangeMonitoringAt: '',
        gridExportVerification: 0,
        gridExportVerificationAt: '',
        gridImportVerification: 0,
        gridImportVerificationAt: '',
        communicationFailSafeTest: 0,
        communicationFailSafeTestAt: '',
        testResult: '',
        additionalNotes: ''
    });

    const { data: makesData } = useQuery(GET_BATTERY_MAKES);

    const [getBatteryModels, { data: batteryModelsData, loading: loadingBatteryModels }] = useLazyQuery(GET_BATTERY_MODELS);
    const [getInverterModels, { data: inverterModelsData, loading: loadingInverterModels }] = useLazyQuery(GET_BATTERY_MODELS);

    const handleManufacturerChange = (field: 'batteryManufacturer' | 'inverterManufacturer', value: string) => {
        const make = makesData?.batteryMakes?.find((m: any) => m.make === value);

        setFormState(prev => ({
            ...prev,
            [field]: value,
            [field === 'batteryManufacturer' ? 'batteryModel' : 'inverterModel']: ''
        }));

        if (make) {
            if (field === 'batteryManufacturer') {
                getBatteryModels({ variables: { makeUid: make.uid } });
            } else {
                getInverterModels({ variables: { makeUid: make.uid } });
            }
        }
    };

    const batteryMakeOptions = makesData?.batteryMakes?.map((m: any) => ({
        value: m.make,
        label: m.make
    })) || [];

    const batteryModelOptions = batteryModelsData?.batteryModels?.map((m: any) => ({
        value: m.model,
        label: m.model
    })) || [];

    const inverterModelOptions = inverterModelsData?.batteryModels?.map((m: any) => ({
        value: m.model,
        label: m.model
    })) || [];

    const STEPS = [
        ...(solarDetails?.hassolar === 1 ? [{ id: 0, label: 'Solar Details', icon: SunIcon }] : []),
        { id: 1, label: 'Inverter Details', icon: PlugIcon },
        { id: 2, label: 'Battery Details', icon: ZapIcon },
        { id: 3, label: 'Network & API', icon: FileTextIcon },
        { id: 4, label: 'Testing & Verification', icon: ShieldCheckIcon },
    ];

    const [generateVppCertificate] = useMutation(GENERATE_VPP_CERTIFICATE);
    const [isSaving, setIsSaving] = useState(false); // This 'isSaving' is for the final certificate generation
    const [isSavingDraft, setIsSavingDraft] = useState(false); // This 'isSavingDraft' is for saving as draft
    const [currentStep, setCurrentStep] = useState(0);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    useEffect(() => {
        if (data?.customer?.vppCertificateDetails) {
            const v = data.customer.vppCertificateDetails;
            setTimeout(() => {
                setFormState({
                    batteryManufacturer: v.batteryManufacturer || '',
                    batteryModel: v.batteryModel || '',
                    batterySerialNumber: v.batterySerialNumber || '',
                    batteryInstalledDate: v.batteryInstalledDate ? new Date(v.batteryInstalledDate).toISOString().split('T')[0] : '',
                    batteryUsableCapacity: v.batteryUsableCapacity?.toString() || '',
                    batteryPortConnected: v.batteryPortConnected ?? 0,
                    inverterManufacturer: v.inverterManufacturer || '',
                    inverterModel: v.inverterModel || '',
                    inverterSnNumbers: v.inverterSnNumbers || '',
                    inverterCapacity: v.inverterCapacity?.toString() || '',
                    isLifeSupportEquipment: v.isLifeSupportEquipment ?? 0,
                    ifYesDetails: v.ifYesDetails || '',
                    internetConnectionType: v.internetConnectionType ?? 0,
                    internetOtherText: v.internetOtherText || '',
                    modemRouterLocation: v.modemRouterLocation || '',
                    apiIntegration: v.apiIntegration ?? 0,
                    remoteChargesCommandTest: v.remoteChargesCommandTest ?? 0,
                    remoteChargesCommandTestAt: v.remoteChargesCommandTestAt ? new Date(v.remoteChargesCommandTestAt).toISOString().slice(0, 16) : '',
                    remoteDischargesCommandTest: v.remoteDischargesCommandTest ?? 0,
                    remoteDischargesCommandTestAt: v.remoteDischargesCommandTestAt ? new Date(v.remoteDischargesCommandTestAt).toISOString().slice(0, 16) : '',
                    stateOfChangeMonitoring: v.stateOfChangeMonitoring ?? 0,
                    stateOfChangeMonitoringAt: v.stateOfChangeMonitoringAt ? new Date(v.stateOfChangeMonitoringAt).toISOString().slice(0, 16) : '',
                    gridExportVerification: v.gridExportVerification ?? 0,
                    gridExportVerificationAt: v.gridExportVerificationAt ? new Date(v.gridExportVerificationAt).toISOString().slice(0, 16) : '',
                    gridImportVerification: v.gridImportVerification ?? 0,
                    gridImportVerificationAt: v.gridImportVerificationAt ? new Date(v.gridImportVerificationAt).toISOString().slice(0, 16) : '',
                    communicationFailSafeTest: v.communicationFailSafeTest ?? 0,
                    communicationFailSafeTestAt: v.communicationFailSafeTestAt ? new Date(v.communicationFailSafeTestAt).toISOString().slice(0, 16) : '',
                    testResult: v.testResult || '',
                    additionalNotes: v.additionalNotes || ''
                });
            }, 0);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleToggleTest = (testField: string, timestampField: string) => {
        setFormState(prev => {
            const currentVal = (prev as Record<string, unknown>)[testField] as number;
            const newVal = currentVal === 1 ? 0 : 1;
            return {
                ...prev,
                [testField]: newVal,
                [timestampField]: newVal === 1 ? new Date().toISOString().slice(0, 16) : ''
            };
        });
    };

    const handlePreview = () => {
        setIsLoadingPreview(true);
        const baseUrl = apiAxios.defaults.baseURL || '';
        setPreviewUrl(`${baseUrl}/vpp-certificate/preview/${customerUid}`);
        setPreviewModalOpen(true);
    };


    // Required fields for full certificate generation (excludes if_yes_details, internet_other_text, all test fields + timestamps)
    const REQUIRED_FIELDS: { key: string; label: string }[] = [
        { key: 'batteryManufacturer', label: 'Battery Manufacturer' },
        { key: 'batteryModel', label: 'Battery Model' },
        { key: 'batterySerialNumber', label: 'Battery Serial Number' },
        { key: 'batteryInstalledDate', label: 'Battery Installed Date' },
        { key: 'batteryUsableCapacity', label: 'Battery Usable Capacity' },
        { key: 'inverterManufacturer', label: 'Inverter Manufacturer' },
        { key: 'inverterModel', label: 'Inverter Model' },
        { key: 'inverterSnNumbers', label: 'Inverter Serial Number' },
        { key: 'inverterCapacity', label: 'Inverter Capacity' },
        { key: 'modemRouterLocation', label: 'Modem Router Location' },
    ];

    const validateRequiredFields = (): string[] => {
        const missing: string[] = [];
        for (const f of REQUIRED_FIELDS) {
            const val = (formState as Record<string, unknown>)[f.key];
            if (val === '' || val === null || val === undefined) {
                missing.push(f.label);
            }
        }
        return missing;
    };

    const buildInputFormat = () => ({
        ...formState,
        batteryUsableCapacity: formState.batteryUsableCapacity ? parseFloat(formState.batteryUsableCapacity) : null,
        inverterCapacity: formState.inverterCapacity ? parseFloat(formState.inverterCapacity) : null,
        batteryInstalledDate: formState.batteryInstalledDate ? new Date(formState.batteryInstalledDate).toISOString() : null,
        remoteChargesCommandTestAt: formState.remoteChargesCommandTestAt ? new Date(formState.remoteChargesCommandTestAt).toISOString() : null,
        remoteDischargesCommandTestAt: formState.remoteDischargesCommandTestAt ? new Date(formState.remoteDischargesCommandTestAt).toISOString() : null,
        stateOfChangeMonitoringAt: formState.stateOfChangeMonitoringAt ? new Date(formState.stateOfChangeMonitoringAt).toISOString() : null,
        gridExportVerificationAt: formState.gridExportVerificationAt ? new Date(formState.gridExportVerificationAt).toISOString() : null,
        gridImportVerificationAt: formState.gridImportVerificationAt ? new Date(formState.gridImportVerificationAt).toISOString() : null,
        communicationFailSafeTestAt: formState.communicationFailSafeTestAt ? new Date(formState.communicationFailSafeTestAt).toISOString() : null,
        isAllRequiredFilled: validateRequiredFields().length === 0 ? 1 : 0,
    });


    const handleSaveDraft = async () => {
        try {
            setIsSavingDraft(true);
            await generateVppCertificate({
                variables: { customerUid, input: buildInputFormat() }
            });
            toast.success('Draft saved successfully!');
            refetch();
            onUpdate?.();
        } catch (error) {
            console.error('Error saving draft:', error);
            const msg = error instanceof Error ? error.message : 'Failed to save draft.';
            toast.error(msg);
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleGenerateCertificate = async () => {
        const missing = validateRequiredFields();
        if (missing.length > 0) {
            toast.error(`Please fill all required fields: ${missing.join(', ')}`);
            return;
        }

        try {
            setIsSaving(true);
            await generateVppCertificate({
                variables: { customerUid, input: buildInputFormat() }
            });
            toast.success('VPP Certificate generated successfully!');
            refetch();
            onUpdate?.();
        } catch (error) {
            console.error('Error generating VPP Certificate:', error);
            const msg = error instanceof Error ? error.message : 'Failed to generate VPP Certificate.';
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="w-8 h-8 rounded-full border-4 border-muted/30 border-t-muted-foreground animate-spin" />
            </div>
        );
    }

    const { vppCertificateDetails } = data?.customer || {};

    const isLastStep = currentStep === STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const isFormComplete = validateRequiredFields().length === 0;

    return (
        <div className="flex flex-col h-[500px] animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileTextIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-foreground tracking-tight">VPP Certificate</h3>
                        <p className="text-xs text-muted-foreground">Manage details and generate VPP certificates</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {Number(vppCertificateDetails?.id) > 0 && (
                        <Button type="button" variant="outline" size="sm" onClick={handlePreview} className="bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                            <EyeIcon size={14} className="mr-1.5" /> Preview
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => refetch()}
                        className="text-muted-foreground hover:text-foreground h-9 w-9 p-0"
                        title="Refresh Data"
                    >
                        <Settings2Icon size={16} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    {vppCertificateDetails?.certificateNo && (
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certificate No</p>
                            <p className="text-md font-bold text-primary">{vppCertificateDetails.certificateNo}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="relative mt-6 mb-6">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        return (
                            <React.Fragment key={step.id}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(index)}
                                    className="flex flex-col items-center gap-1.5 group relative z-10 cursor-pointer"
                                >
                                    <div
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                            ${isCompleted
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                                : isActive
                                                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                                                    : 'bg-muted/50 border-border text-muted-foreground group-hover:border-muted-foreground/50'
                                            }
                                        `}
                                    >
                                        {isCompleted ? <CheckIcon size={16} /> : <StepIcon size={16} />}
                                    </div>
                                    <span
                                        className={`
                                            text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] leading-tight transition-colors
                                            ${isActive ? 'text-primary' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}
                                        `}
                                    >
                                        {step.label}
                                    </span>
                                </button>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 mt-[-20px] relative">
                                        <div className="absolute inset-0 bg-border rounded-full" />
                                        <div
                                            className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: index < currentStep ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-right-2 duration-300" key={currentStep}>
                    {/* Step 0 — System Settings */}
                    {STEPS[currentStep].id === 0 && (
                        <div className="space-y-8">
                            {/* Solar Section */}
                            {solarDetails?.hassolar === 1 && (
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Solar Configuration</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Solar Capacity</label>
                                            <p className="font-medium">{solarDetails.solarcapacity} kW</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Inverter Capacity</label>
                                            <p className="font-medium">{solarDetails.invertercapacity} kW</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VPP Section
                            {(vppDetails?.vpp === 1 || ratePlan?.vpp === 1) && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-lg font-semibold">VPP Configuration</h3>
                                        <div className="flex items-center gap-2">
                                            {!isDeleted && handleVppToggle && (
                                                <>
                                                    <span className="text-sm font-medium text-muted-foreground">VPP Connected</span>
                                                    <ToggleSwitch
                                                        checked={vppDetails?.vppConnected === 1}
                                                        onChange={(checked: boolean) => handleVppToggle(customerUid, checked)}
                                                        disabled={false}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {vppDetails?.vppConnected === 1 && vppForm && setVppForm && setIsEditingVpp && handleSaveVppDetails && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Signup Bonus ($)</label>
                                                    <Input
                                                        type="number"
                                                        value={vppForm.vppSignupBonus}
                                                        onChange={(e) => setVppForm({ ...vppForm, vppSignupBonus: e.target.value })}
                                                        disabled={!isEditingVpp}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Battery Brand</label>
                                                    <Select
                                                        value={vppForm.batteryBrand}
                                                        onChange={(val: any) => setVppForm({ ...vppForm, batteryBrand: val })}
                                                        disabled={!isEditingVpp}
                                                        options={BATTERY_BRAND_OPTIONS}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Serial Number</label>
                                                    <Input
                                                        value={vppForm.snNumber}
                                                        onChange={(e) => setVppForm({ ...vppForm, snNumber: e.target.value })}
                                                        disabled={!isEditingVpp}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Battery Capacity (kWh)</label>
                                                    <Input
                                                        type="number"
                                                        value={vppForm.batteryCapacity}
                                                        onChange={(e) => setVppForm({ ...vppForm, batteryCapacity: e.target.value })}
                                                        disabled={!isEditingVpp}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Export Limit (kW)</label>
                                                    <Input
                                                        type="number"
                                                        value={vppForm.exportLimit}
                                                        onChange={(e) => setVppForm({ ...vppForm, exportLimit: e.target.value })}
                                                        disabled={!isEditingVpp}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-foreground">Inverter Capacity (kW)</label>
                                                    <Input
                                                        type="number"
                                                        value={vppForm.inverterCapacity}
                                                        onChange={(e) => setVppForm({ ...vppForm, inverterCapacity: e.target.value })}
                                                        disabled={!isEditingVpp}
                                                    />
                                                </div>
                                                {(vppForm.batteryBrand === 'Fox ESS' || vppForm.batteryBrand === 'NeoVolt' || vppForm.batteryBrand === 'AlphaESS' || vppForm.batteryBrand === 'Alpha ESS' || vppForm.batteryBrand === 'Aerl') && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-foreground">Check Code</label>
                                                        <Input
                                                            value={vppForm.checkCode}
                                                            onChange={(e) => setVppForm({ ...vppForm, checkCode: e.target.value })}
                                                            disabled={!isEditingVpp}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4 border-t border-border/40 mt-6">
                                                {isEditingVpp ? (
                                                    <>
                                                        <Button variant="outline" onClick={() => setIsEditingVpp(false)}>Cancel</Button>
                                                        <Button onClick={handleSaveVppDetails}>Save VPP Details</Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline" onClick={() => setIsEditingVpp(true)}>
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Edit Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )} */}

                            {solarDetails?.hassolar !== 1 && (
                                <div className="text-center py-12 text-muted-foreground bg-white dark:bg-neutral-950 rounded-lg border border-dashed border-border">
                                    <Settings2Icon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No Solar or VPP configuration found for this customer.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2 — Battery Details */}
                    {STEPS[currentStep].id === 2 && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Battery Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Manufacturer</label>
                                    <Select
                                        value={formState.batteryManufacturer}
                                        onChange={(v: any) => handleManufacturerChange('batteryManufacturer', v as string)}
                                        options={batteryMakeOptions}
                                        placeholder="Select brand"
                                        disabled={vppDetails?.vppConnected === 1}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Model</label>
                                    <Select
                                        value={formState.batteryModel}
                                        onChange={(v: any) => setFormState(prev => ({ ...prev, batteryModel: v as string }))}
                                        options={batteryModelOptions}
                                        placeholder={loadingBatteryModels ? "Loading models..." : "Select model"}
                                        disabled={!formState.batteryManufacturer || loadingBatteryModels}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Serial Number(SN numbers)</label>
                                    <Input name="batterySerialNumber" value={formState.batterySerialNumber} onChange={handleChange} placeholder="Comma separated" disabled={vppDetails?.vppConnected === 1} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Installed Date</label>
                                    <DatePicker
                                        value={formState.batteryInstalledDate || null}
                                        onChange={(date) => setFormState(prev => ({ ...prev, batteryInstalledDate: date ? date.toISOString().split('T')[0] : '' }))}
                                        placeholder="Select date"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Usable Capacity (kWh)</label>
                                    <Input type="number" step="0.1" name="batteryUsableCapacity" value={formState.batteryUsableCapacity} onChange={handleChange} disabled={vppDetails?.vppConnected === 1} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Backup Port Connected</label>
                                    <Select
                                        value={formState.batteryPortConnected.toString()}
                                        onChange={(v) => handleSelectChange('batteryPortConnected', v as string)}
                                        options={[
                                            { value: '0', label: 'No' },
                                            { value: '1', label: 'Yes' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Inverter Details */}
                    {STEPS[currentStep].id === 1 && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Inverter Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Manufacturer</label>
                                    <Select
                                        value={formState.inverterManufacturer}
                                        onChange={(v: any) => handleManufacturerChange('inverterManufacturer', v as string)}
                                        options={batteryMakeOptions}
                                        placeholder="Select brand"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Model</label>
                                    <Select
                                        value={formState.inverterModel}
                                        onChange={(v: any) => setFormState(prev => ({ ...prev, inverterModel: v as string }))}
                                        options={inverterModelOptions}
                                        placeholder={loadingInverterModels ? "Loading models..." : "Select model"}
                                        disabled={!formState.inverterManufacturer || loadingInverterModels}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Serial Number(SN numbers)</label>
                                    <Input name="inverterSnNumbers" value={formState.inverterSnNumbers} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Capacity (kW)</label>
                                    <Input type="number" step="0.1" name="inverterCapacity" value={formState.inverterCapacity} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Life Support Equipment</label>
                                    <Select
                                        value={formState.isLifeSupportEquipment.toString()}
                                        onChange={(v) => handleSelectChange('isLifeSupportEquipment', v as string)}
                                        options={[
                                            { value: '0', label: 'No' },
                                            { value: '1', label: 'Yes' }
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">If Yes, Details</label>
                                    <Input name="ifYesDetails" value={formState.ifYesDetails} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Network & API Integrations */}
                    {STEPS[currentStep].id === 3 && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Network & API Integrations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Internet Connection Type</label>
                                    <Select
                                        value={formState.internetConnectionType.toString()}
                                        onChange={(v) => handleSelectChange('internetConnectionType', v as string)}
                                        options={[
                                            { value: '0', label: 'NBN' },
                                            { value: '1', label: '4G' },
                                            { value: '2', label: '5G' },
                                            { value: '3', label: 'Fibre' },
                                            { value: '4', label: 'Other' }
                                        ]}
                                    />
                                </div>
                                {formState.internetConnectionType === 4 && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Other Internet Type</label>
                                        <Input name="internetOtherText" value={formState.internetOtherText} onChange={handleChange} placeholder="Specify internet type..." />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Modem Router Location</label>
                                    <Input name="modemRouterLocation" value={formState.modemRouterLocation} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">API Integration Completed</label>
                                    <Select
                                        value={formState.apiIntegration.toString()}
                                        onChange={(v) => handleSelectChange('apiIntegration', v as string)}
                                        options={[
                                            { value: '0', label: 'No' },
                                            { value: '1', label: 'Yes' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Testing & Verification */}
                    {STEPS[currentStep].id === 4 && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Testing & Verification</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Remote Charges Command Test', field: 'remoteChargesCommandTest', tsField: 'remoteChargesCommandTestAt' },
                                    { label: 'Remote Discharges Command Test', field: 'remoteDischargesCommandTest', tsField: 'remoteDischargesCommandTestAt' },
                                    { label: 'State of Charge Monitoring', field: 'stateOfChangeMonitoring', tsField: 'stateOfChangeMonitoringAt' },
                                    { label: 'Grid Export Verification', field: 'gridExportVerification', tsField: 'gridExportVerificationAt' },
                                    { label: 'Grid Import Verification', field: 'gridImportVerification', tsField: 'gridImportVerificationAt' },
                                    { label: 'Communication Fail Safe Test', field: 'communicationFailSafeTest', tsField: 'communicationFailSafeTestAt' },
                                ].map((test) => {
                                    const isPassed = (formState as Record<string, unknown>)[test.field] === 1;
                                    return (
                                        <div
                                            key={test.field}
                                            className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card"
                                        >
                                            <p className="text-sm font-medium text-foreground">{test.label}</p>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleTest(test.field, test.tsField)}
                                                className={`
                                                    px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200
                                                    ${isPassed
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20'
                                                    }
                                                `}
                                            >
                                                {isPassed ? '✓ Passed' : '✗ Failed'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Dynamic summary message */}
                            {(() => {
                                const allPassed = formState.remoteChargesCommandTest === 1
                                    && formState.remoteDischargesCommandTest === 1
                                    && formState.stateOfChangeMonitoring === 1
                                    && formState.gridExportVerification === 1
                                    && formState.gridImportVerification === 1
                                    && formState.communicationFailSafeTest === 1;
                                return (
                                    <>
                                        <div className={`p-3 rounded-lg border text-sm font-medium ${allPassed
                                            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                            : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                                            }`}>
                                            {allPassed
                                                ? '✓ All tests passed — the battery system responded correctly to all dispatch commands.'
                                                : '✗ Not all tests passed — the battery system has not met the operational requirements yet.'}
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <label className="text-sm font-medium text-foreground">Test Result / Notes</label>
                                            <Input
                                                name="testResult"
                                                value={formState.testResult || (allPassed ? 'All Test passed successfully' : 'Failed')}
                                                onChange={handleChange}
                                                placeholder="Any specific notes or observations..."
                                            />
                                        </div>
                                    </>
                                );
                            })()}

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-foreground">Additional Notes</label>
                                <textarea
                                    name="additionalNotes"
                                    value={formState.additionalNotes}
                                    onChange={handleChange}
                                    placeholder="Any additional notes..."
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex-none pt-4 mt-auto border-t border-border bg-background z-10 flex items-center justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={isFirstStep}
                    className={isFirstStep ? 'opacity-0 pointer-events-none' : ''}
                >
                    ← Previous
                </Button>

                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} isLoading={isSavingDraft} disabled={isSavingDraft || isSaving}>
                        Save Draft
                    </Button>

                    {isLastStep ? (
                        <Button
                            type="button"
                            onClick={handleGenerateCertificate}
                            isLoading={isSaving}
                            disabled={isSaving || isSavingDraft || !isFormComplete}
                            title={!isFormComplete ? "Please fill all required fields to generate certificate" : ""}
                        >
                            {vppCertificateDetails?.id ? 'Update' : 'Generate'}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                        >
                            Next →
                        </Button>
                    )}
                </div>
            </div>
            {/* Preview Modal */}
            <Modal
                isOpen={previewModalOpen}
                onClose={() => { setPreviewModalOpen(false); setIsLoadingPreview(false); }}
                title="VPP Certificate Preview"
                size="full"
            >
                <div className="flex-1 h-[70vh] w-full bg-muted/20 rounded-md border overflow-hidden mb-4 relative">
                    {previewUrl ? (
                        <>
                            {isLoadingPreview && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-10">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                                    <p className="mt-3 text-sm font-medium text-muted-foreground">Loading preview...</p>
                                </div>
                            )}
                            <iframe
                                src={previewUrl}
                                className="w-full h-full"
                                title="VPP Certificate Preview"
                                onLoad={() => setIsLoadingPreview(false)}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3" />
                                <p className="text-sm font-medium">Preparing preview...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setPreviewModalOpen(false); setIsLoadingPreview(false); }}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div >
    );
}