import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/common';
import { apiAxios } from '@/lib/apollo';
import { GET_CUSTOMER_VPP_CERTIFICATE_DETAILS, GENERATE_VPP_CERTIFICATE, GET_BATTERY_MAKES, GET_INVERTER_MAKES, GET_BATTERY_MODELS, GET_INVERTER_MODELS } from '@/graphql';
import { FileTextIcon, ZapIcon, ShieldCheckIcon, CheckIcon, EyeIcon, Settings2Icon, SunIcon, DownloadIcon, AlertCircleIcon } from '@/components/icons';

interface VppCertificateTabProps {
    customerUid: string;
    onUpdate?: () => Promise<void> | void;
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

const formatIssueDateStr = (val?: any): string => {
    if (!val) return '';
    if (typeof val === 'string') {
        const match = val.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) return match[1];
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export function VppCertificateTab({
    customerUid,
    onUpdate,

    solarDetails
}: VppCertificateTabProps) {
    const { data, loading, refetch } = useQuery(GET_CUSTOMER_VPP_CERTIFICATE_DETAILS, {
        variables: { uid: customerUid },
        fetchPolicy: 'network-only'
    });

    const [formState, setFormState] = useState({
        issueDate: '',
        solarCapacity: '',
        batteryManufacturer: '',
        batteryModel: '-',
        batterySerialNumber: '',
        batteryInstalledDate: '',
        batteryUsableCapacity: '',
        batteryPortConnected: 0,
        inverterManufacturer: '',
        inverterModel: '-',
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

    const { data: makesData, loading: loadingBatteryMakes } = useQuery(GET_BATTERY_MAKES);
    const { data: inverterMakesData, loading: loadingInverterMakes } = useQuery(GET_INVERTER_MAKES);

    const handleManufacturerChange = (field: 'batteryManufacturer' | 'inverterManufacturer', value: string) => {
        let capacityUpdate = {};

        if (field === 'batteryManufacturer') {
            const makeObj = makesData?.batteryMakes?.find((m: any) => m.make === value || m.uid === value);
            if (makeObj?.batteryUsableCapacity) {
                capacityUpdate = { batteryUsableCapacity: makeObj.batteryUsableCapacity.toString() };
            }
        }

        setFormState(prev => ({
            ...prev,
            [field]: value,
            [field === 'batteryManufacturer' ? 'batteryModel' : 'inverterModel']: '-',
            ...capacityUpdate
        }));
    };

    const batteryMakeOptions = makesData?.batteryMakes?.filter((m: any) => m.productStatus === 1).map((m: any) => ({
        value: m.make,
        label: m.make
    })) || [];

    const inverterMakeOptions = inverterMakesData?.inverterMakes?.filter((m: any) => m.productStatus === 1).map((m: any) => ({
        value: m.make,
        label: m.make
    })) || [];

    const selectedBatteryMake = makesData?.batteryMakes?.find((m: any) =>
        m.uid === formState.batteryManufacturer || m.make?.toLowerCase() === formState.batteryManufacturer?.toLowerCase()
    );
    const selectedInverterMake = inverterMakesData?.inverterMakes?.find((m: any) =>
        m.uid === formState.inverterManufacturer || m.make?.toLowerCase() === formState.inverterManufacturer?.toLowerCase()
    );

    const { data: batteryModelsData, loading: loadingBatteryModels } = useQuery(GET_BATTERY_MODELS, {
        variables: { makeUid: selectedBatteryMake?.uid },
        skip: !selectedBatteryMake?.uid,
        fetchPolicy: 'cache-first'
    });

    const { data: inverterModelsData, loading: loadingInverterModels } = useQuery(GET_INVERTER_MODELS, {
        variables: { makeUid: selectedInverterMake?.uid },
        skip: !selectedInverterMake?.uid,
        fetchPolicy: 'cache-first'
    });

    const batteryModelOptions = [
        { value: '-', label: '-' },
        ...(batteryModelsData?.batteryModels?.filter((m: any) => m.isActive && m.model !== '-').map((m: any) => ({
            value: m.model,
            label: m.model
        })) || [])
    ];

    const inverterModelOptions = [
        { value: '-', label: '-' },
        ...(inverterModelsData?.inverterModels?.filter((m: any) => m.isActive && m.model !== '-').map((m: any) => ({
            value: m.model,
            label: m.model
        })) || [])
    ];

    const handleBatteryModelChange = (value: string) => {
        if (!value || value === '-') {
            setFormState(prev => ({ ...prev, batteryModel: '-' }));
            return;
        }
        const modelObj = batteryModelsData?.batteryModels?.find((m: any) => m.model === value || m.uid === value);
        setFormState(prev => ({
            ...prev,
            batteryModel: modelObj ? modelObj.model : value,
            ...(modelObj?.capacity ? { batteryUsableCapacity: modelObj.capacity.toString() } : {})
        }));
    };

    const handleInverterModelChange = (value: string) => {
        if (!value || value === '-') {
            setFormState(prev => ({ ...prev, inverterModel: '-' }));
            return;
        }
        const modelObj = inverterModelsData?.inverterModels?.find((m: any) => m.model === value);
        setFormState(prev => ({
            ...prev,
            inverterModel: value,
            ...(modelObj?.capacity ? { inverterCapacity: modelObj.capacity.toString() } : {})
        }));
    };

    const STEPS = [
        { id: 1, label: 'Solar and Inverter Details', icon: SunIcon },
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
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const errorBoxRef = useRef<HTMLDivElement>(null);

    const resolveBatteryMakeName = (val?: string) => {
        if (!val) return '';
        const match = makesData?.batteryMakes?.find((m: any) => m.uid === val || m.make?.toLowerCase() === val.toLowerCase());
        return match ? match.make : val;
    };

    const resolveInverterMakeName = (val?: string) => {
        if (!val) return '';
        const match = inverterMakesData?.inverterMakes?.find((m: any) => m.uid === val || m.make?.toLowerCase() === val.toLowerCase());
        return match ? match.make : val;
    };

    useEffect(() => {
        if (data?.customer) {
            const v = data.customer.vppCertificateDetails;
            const b = data.customer.batteryDetails;
            const s = data.customer.solarDetails;

            const batteryMake = resolveBatteryMakeName(v?.batteryManufacturer || b?.batterybrand || '');
            const inverterMake = resolveInverterMakeName(v?.inverterManufacturer || '');

            setTimeout(() => {
                setFormState(prev => ({
                    ...prev,
                    issueDate: v?.issueDate ? formatIssueDateStr(v.issueDate) : (prev.issueDate || new Date().toISOString().split('T')[0]),
                    solarCapacity: v?.solarCapacity?.toString() || s?.solarcapacity?.toString() || solarDetails?.solarcapacity?.toString() || prev.solarCapacity || '',
                    batteryManufacturer: batteryMake || prev.batteryManufacturer,
                    batteryModel: (v?.batteryModel && v.batteryModel.trim() !== '') ? v.batteryModel : (b?.batterymodel && b.batterymodel.trim() !== '' ? b.batterymodel : (prev.batteryModel || '-')),
                    batterySerialNumber: v?.batterySerialNumber || b?.snnumber || prev.batterySerialNumber || '',
                    batteryInstalledDate: v?.batteryInstalledDate ? new Date(v.batteryInstalledDate).toISOString().split('T')[0] : (prev.batteryInstalledDate || ''),
                    batteryUsableCapacity: v?.batteryUsableCapacity?.toString() || b?.batterycapacity?.toString() || prev.batteryUsableCapacity || '',
                    batteryPortConnected: v?.batteryPortConnected ?? prev.batteryPortConnected ?? 0,
                    inverterManufacturer: inverterMake || prev.inverterManufacturer,
                    inverterModel: (v?.inverterModel && v.inverterModel.trim() !== '') ? v.inverterModel : (prev.inverterModel || '-'),
                    inverterSnNumbers: v?.inverterSnNumbers || prev.inverterSnNumbers || '',
                    inverterCapacity: v?.inverterCapacity?.toString() || b?.inverterCapacity?.toString() || s?.invertercapacity?.toString() || solarDetails?.invertercapacity?.toString() || prev.inverterCapacity || '',
                    isLifeSupportEquipment: v?.isLifeSupportEquipment ?? prev.isLifeSupportEquipment ?? 0,
                    ifYesDetails: v?.ifYesDetails || prev.ifYesDetails || '',
                    internetConnectionType: v?.internetConnectionType ?? prev.internetConnectionType ?? 0,
                    internetOtherText: v?.internetOtherText || prev.internetOtherText || '',
                    modemRouterLocation: v?.modemRouterLocation || prev.modemRouterLocation || '',
                    apiIntegration: v?.apiIntegration ?? prev.apiIntegration ?? 0,
                    remoteChargesCommandTest: v?.remoteChargesCommandTest ?? prev.remoteChargesCommandTest ?? 0,
                    remoteChargesCommandTestAt: v?.remoteChargesCommandTestAt ? new Date(v.remoteChargesCommandTestAt).toISOString().slice(0, 16) : (prev.remoteChargesCommandTestAt || ''),
                    remoteDischargesCommandTest: v?.remoteDischargesCommandTest ?? prev.remoteDischargesCommandTest ?? 0,
                    remoteDischargesCommandTestAt: v?.remoteDischargesCommandTestAt ? new Date(v.remoteDischargesCommandTestAt).toISOString().slice(0, 16) : (prev.remoteDischargesCommandTestAt || ''),
                    stateOfChangeMonitoring: v?.stateOfChangeMonitoring ?? prev.stateOfChangeMonitoring ?? 0,
                    stateOfChangeMonitoringAt: v?.stateOfChangeMonitoringAt ? new Date(v.stateOfChangeMonitoringAt).toISOString().slice(0, 16) : (prev.stateOfChangeMonitoringAt || ''),
                    gridExportVerification: v?.gridExportVerification ?? prev.gridExportVerification ?? 0,
                    gridExportVerificationAt: v?.gridExportVerificationAt ? new Date(v.gridExportVerificationAt).toISOString().slice(0, 16) : (prev.gridExportVerificationAt || ''),
                    gridImportVerification: v?.gridImportVerification ?? prev.gridImportVerification ?? 0,
                    gridImportVerificationAt: v?.gridImportVerificationAt ? new Date(v.gridImportVerificationAt).toISOString().slice(0, 16) : (prev.gridImportVerificationAt || ''),
                    communicationFailSafeTest: v?.communicationFailSafeTest ?? prev.communicationFailSafeTest ?? 0,
                    communicationFailSafeTestAt: v?.communicationFailSafeTestAt ? new Date(v.communicationFailSafeTestAt).toISOString().slice(0, 16) : (prev.communicationFailSafeTestAt || ''),
                    testResult: v?.testResult || prev.testResult || (
                        ((v?.remoteChargesCommandTest ?? prev.remoteChargesCommandTest) === 1
                            && (v?.remoteDischargesCommandTest ?? prev.remoteDischargesCommandTest) === 1
                            && (v?.stateOfChangeMonitoring ?? prev.stateOfChangeMonitoring) === 1
                            && (v?.gridExportVerification ?? prev.gridExportVerification) === 1
                            && (v?.gridImportVerification ?? prev.gridImportVerification) === 1
                            && (v?.communicationFailSafeTest ?? prev.communicationFailSafeTest) === 1)
                            ? 'All Test passed successfully' : ''
                    ),
                    additionalNotes: v?.additionalNotes || prev.additionalNotes || ''
                }));
            }, 0);
        }
    }, [data, makesData, inverterMakesData]);

    // Re-resolve battery manufacturer name if makesData finishes loading afterwards
    useEffect(() => {
        if (formState.batteryManufacturer && makesData?.batteryMakes?.length) {
            const match = makesData.batteryMakes.find((m: any) => m.uid === formState.batteryManufacturer);
            if (match) {
                setFormState(prev => ({ ...prev, batteryManufacturer: match.make }));
            }
        }
    }, [makesData, formState.batteryManufacturer]);

    // Re-resolve inverter manufacturer name if inverterMakesData finishes loading afterwards
    useEffect(() => {
        if (formState.inverterManufacturer && inverterMakesData?.inverterMakes?.length) {
            const match = inverterMakesData.inverterMakes.find((m: any) => m.uid === formState.inverterManufacturer);
            if (match) {
                setFormState(prev => ({ ...prev, inverterManufacturer: match.make }));
            }
        }
    }, [inverterMakesData, formState.inverterManufacturer]);

    // Re-resolve battery model name if batteryModelsData finishes loading
    useEffect(() => {
        if (formState.batteryModel && formState.batteryModel !== '-' && batteryModelsData?.batteryModels?.length) {
            const match = batteryModelsData.batteryModels.find((m: any) => m.uid === formState.batteryModel);
            if (match) {
                setFormState(prev => ({ ...prev, batteryModel: match.model }));
            }
        }
    }, [batteryModelsData, formState.batteryModel]);

    // Re-resolve inverter model name if inverterModelsData finishes loading
    useEffect(() => {
        if (formState.inverterModel && formState.inverterModel !== '-' && inverterModelsData?.inverterModels?.length) {
            const match = inverterModelsData.inverterModels.find((m: any) => m.uid === formState.inverterModel);
            if (match) {
                setFormState(prev => ({ ...prev, inverterModel: match.model }));
            }
        }
    }, [inverterModelsData, formState.inverterModel]);

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
            const updated = {
                ...prev,
                [testField]: newVal,
                [timestampField]: newVal === 1 ? new Date().toISOString().slice(0, 16) : ''
            };
            const allPassed = updated.remoteChargesCommandTest === 1
                && updated.remoteDischargesCommandTest === 1
                && updated.stateOfChangeMonitoring === 1
                && updated.gridExportVerification === 1
                && updated.gridImportVerification === 1
                && updated.communicationFailSafeTest === 1;

            if (!prev.testResult || prev.testResult === 'All Test passed successfully' || prev.testResult === 'Failed') {
                updated.testResult = allPassed ? 'All Test passed successfully' : 'Failed';
            }
            return updated;
        });
    };

    const handlePreview = async () => {
        setPreviewUrl(null);
        setIsLoadingPreview(true);
        setPreviewModalOpen(true);
        const baseUrl = apiAxios.defaults.baseURL || '';

        // Auto-save latest form state so the preview API reads the up-to-date test results
        try {
            await generateVppCertificate({
                variables: { customerUid, input: buildInputFormat() }
            });
            refetch();
        } catch (e) {
            console.error('Error syncing before preview:', e);
        }

        setPreviewUrl(`${baseUrl}/vpp-certificate/preview/${customerUid}?t=${Date.now()}`);
    };

    const handleDownload = () => {
        const baseUrl = apiAxios.defaults.baseURL || '';
        const downloadUrl = `${baseUrl}/vpp-certificate/preview/${customerUid}?format=pdf&t=${Date.now()}`;
        window.open(downloadUrl, '_blank');
    };


    const isFieldEmpty = (val: any): boolean => {
        if (val === '' || val === null || val === undefined) return true;
        if (typeof val === 'string' && val.trim() === '') return true;
        if (typeof val === 'number' && isNaN(val)) return true;
        return false;
    };

    // Required fields for full certificate generation (excludes if_yes_details, internet_other_text, all test fields + timestamps)
    const REQUIRED_FIELDS = [
        { key: 'inverterManufacturer', label: 'Inverter Manufacturer', stepIndex: 0, stepName: 'Solar and Inverter Details' },
        { key: 'inverterSnNumbers', label: 'Inverter Serial Number', stepIndex: 0, stepName: 'Solar and Inverter Details' },
        { key: 'inverterCapacity', label: 'Inverter Capacity', stepIndex: 0, stepName: 'Solar and Inverter Details' },
        { key: 'batteryManufacturer', label: 'Battery Manufacturer', stepIndex: 1, stepName: 'Battery Details' },
        { key: 'batterySerialNumber', label: 'Battery Serial Number', stepIndex: 1, stepName: 'Battery Details' },
        { key: 'batteryInstalledDate', label: 'Battery Installed Date', stepIndex: 1, stepName: 'Battery Details' },
        { key: 'batteryUsableCapacity', label: 'Battery Usable Capacity', stepIndex: 1, stepName: 'Battery Details' },
        { key: 'modemRouterLocation', label: 'Modem Router Location', stepIndex: 2, stepName: 'Network & API' },
    ];

    const getMissingFields = () => {
        return REQUIRED_FIELDS.filter(f => isFieldEmpty((formState as Record<string, unknown>)[f.key]));
    };

    const validateRequiredFields = (): string[] => {
        return getMissingFields().map(f => f.label);
    };

    const buildInputFormat = () => {
        const allPassed = formState.remoteChargesCommandTest === 1
            && formState.remoteDischargesCommandTest === 1
            && formState.stateOfChangeMonitoring === 1
            && formState.gridExportVerification === 1
            && formState.gridImportVerification === 1
            && formState.communicationFailSafeTest === 1;

        const effectiveTestResult = formState.testResult || (allPassed ? 'All Test passed successfully' : 'Failed');

        return {
            ...formState,
            issueDate: formState.issueDate ? formState.issueDate : new Date().toISOString().split('T')[0],
            batteryModel: (formState.batteryModel && formState.batteryModel.trim() !== '') ? formState.batteryModel : '-',
            inverterModel: (formState.inverterModel && formState.inverterModel.trim() !== '') ? formState.inverterModel : '-',
            testResult: effectiveTestResult,
            solarCapacity: formState.solarCapacity ? parseFloat(formState.solarCapacity) : null,
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
        };
    };


    const handleSaveDraft = async () => {
        try {
            setIsSavingDraft(true);
            await generateVppCertificate({
                variables: { customerUid, input: buildInputFormat() }
            });
            toast.success('Draft saved successfully!');
            refetch();
            await onUpdate?.();
        } catch (error) {
            console.error('Error saving draft:', error);
            const msg = error instanceof Error ? error.message : 'Failed to save draft.';
            toast.error(msg);
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleGenerateCertificate = async () => {
        setHasAttemptedSubmit(true);
        setSubmitError(null);

        const missing = getMissingFields();
        if (missing.length > 0) {
            const count = missing.length;
            toast.error(
                `Cannot ${vppCertificateDetails?.id ? 'update' : 'generate'} certificate: ${count} required ${count === 1 ? 'field is' : 'fields are'} missing. Please review the details below.`,
                { autoClose: 6000 }
            );
            setTimeout(() => {
                errorBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return;
        }

        try {
            setIsSaving(true);
            await generateVppCertificate({
                variables: { customerUid, input: buildInputFormat() }
            });
            toast.success(`VPP Certificate ${vppCertificateDetails?.id ? 'updated' : 'generated'} successfully!`);
            setHasAttemptedSubmit(false);
            refetch();
            await onUpdate?.();
        } catch (error) {
            console.error('Error generating VPP Certificate:', error);
            const msg = error instanceof Error ? error.message : 'Failed to generate VPP Certificate.';
            setSubmitError(msg);
            toast.error(msg);
            setTimeout(() => {
                errorBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
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

    const missingFieldItems = getMissingFields();
    const missingFields = missingFieldItems.map(f => f.label);
    const isFormComplete = missingFieldItems.length === 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

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
                    {formState.issueDate && (
                        <div className="text-right border-r border-border pr-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Issue Date</p>
                            <p className="text-sm font-bold text-foreground">
                                {(() => {
                                    const parts = formState.issueDate.split('-');
                                    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : formState.issueDate;
                                })()}
                            </p>
                        </div>
                    )}
                    {vppCertificateDetails?.certificateNo && (
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certificate No</p>
                            <p className="text-md font-bold text-primary">{vppCertificateDetails.certificateNo}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="relative py-2">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const stepMissing = missingFieldItems.filter(f => f.stepIndex === index);
                        const hasStepErrors = hasAttemptedSubmit && stepMissing.length > 0;
                        const isCompleted = index < currentStep && stepMissing.length === 0;
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
                                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 relative
                                            ${hasStepErrors
                                                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-400/30'
                                                : isCompleted
                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                                    : isActive
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                                                        : 'bg-muted/50 border-border text-muted-foreground group-hover:border-muted-foreground/50'
                                            }
                                        `}
                                    >
                                        {hasStepErrors ? (
                                            <AlertCircleIcon size={18} />
                                        ) : isCompleted ? (
                                            <CheckIcon size={16} />
                                        ) : (
                                            <StepIcon size={16} />
                                        )}
                                        {hasStepErrors && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center border border-white dark:border-neutral-900">
                                                {stepMissing.length}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`
                                            text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] leading-tight transition-colors
                                            ${hasStepErrors ? 'text-red-600 dark:text-red-400 font-bold' : isActive ? 'text-primary' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}
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

            {/* Navigation & Action Controls Above Form Layout */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={isFirstStep}
                    className={isFirstStep ? 'invisible pointer-events-none' : ''}
                >
                    ← Previous
                </Button>

                <div className="flex flex-wrap items-center gap-3">
                    {isLastStep && !isFormComplete && (
                        <div
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${
                                hasAttemptedSubmit
                                    ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800/60 font-semibold'
                                    : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                            }`}
                            title={`Missing required fields: ${missingFields.join(', ')}`}
                        >
                            <span className="font-semibold shrink-0">⚠️ {hasAttemptedSubmit ? 'Incomplete:' : 'Missing:'}</span>
                            <span className="font-medium">{missingFieldItems.length} required {missingFieldItems.length === 1 ? 'field' : 'fields'} missing</span>
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        isLoading={isSavingDraft}
                        disabled={isSavingDraft || isSaving}
                    >
                        Save Draft
                    </Button>

                    {isLastStep ? (
                        <Button
                            type="button"
                            onClick={handleGenerateCertificate}
                            isLoading={isSaving}
                            disabled={isSaving || isSavingDraft}
                            className={!isFormComplete ? "opacity-90 ring-1 ring-amber-400/50" : ""}
                            title={!isFormComplete ? `Click to see missing fields: ${missingFields.join(', ')}` : ""}
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

            {/* Step Content */}
            <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-right-2 duration-300" key={currentStep}>
                    {/* Step 1 — Solar and Inverter Details */}
                    {STEPS[currentStep].id === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Solar Configuration</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Solar Capacity (kW)</label>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="e.g. 6.6"
                                            name="solarCapacity"
                                            value={formState.solarCapacity}
                                            onChange={handleChange}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Inverter Capacity (kW)</label>
                                        <Input
                                            type="number"
                                            step="any"
                                            placeholder="e.g. 5.0"
                                            name="inverterCapacity"
                                            value={formState.inverterCapacity}
                                            onChange={handleChange}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Issue Date</label>
                                        <DatePicker
                                            value={formState.issueDate || null}
                                            onChange={(date) => {
                                                if (!date) {
                                                    setFormState(prev => ({ ...prev, issueDate: '' }));
                                                    return;
                                                }
                                                const y = date.getFullYear();
                                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                                const d = String(date.getDate()).padStart(2, '0');
                                                setFormState(prev => ({ ...prev, issueDate: `${y}-${m}-${d}` }));
                                            }}
                                            placeholder="Select issue date"
                                        />
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Inverter Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Manufacturer <span className="text-red-500">*</span></label>
                                    <Select
                                        value={formState.inverterManufacturer}
                                        onChange={(v: any) => handleManufacturerChange('inverterManufacturer', v as string)}
                                        options={inverterMakeOptions}
                                        placeholder="Select brand"
                                        creatable
                                        isLoading={loadingInverterMakes}
                                        error={hasAttemptedSubmit && isFieldEmpty(formState.inverterManufacturer) ? 'Inverter Manufacturer is required' : undefined}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Model</label>
                                    <Select
                                        value={formState.inverterModel || '-'}
                                        onChange={(v) => handleInverterModelChange(v as string)}
                                        options={inverterModelOptions}
                                        placeholder="-"
                                        creatable={true}
                                        isLoading={loadingInverterModels}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Serial Number(SN numbers) <span className="text-red-500">*</span></label>
                                    <Input name="inverterSnNumbers" value={formState.inverterSnNumbers} onChange={handleChange} error={hasAttemptedSubmit && isFieldEmpty(formState.inverterSnNumbers) ? 'Inverter Serial Number is required' : undefined} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Capacity (kW) <span className="text-red-500">*</span></label>
                                    <Input type="number" step="0.1" name="inverterCapacity" value={formState.inverterCapacity} onChange={handleChange} error={hasAttemptedSubmit && isFieldEmpty(formState.inverterCapacity) ? 'Inverter Capacity is required' : undefined} />
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

                    {/* Step 2 — Battery Details */}
                    {STEPS[currentStep].id === 2 && (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">Battery Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Manufacturer <span className="text-red-500">*</span></label>
                                    <Select
                                        value={formState.batteryManufacturer}
                                        onChange={(v: any) => handleManufacturerChange('batteryManufacturer', v as string)}
                                        options={batteryMakeOptions}
                                        placeholder="Select brand"
                                        creatable
                                        isLoading={loadingBatteryMakes}
                                        error={hasAttemptedSubmit && isFieldEmpty(formState.batteryManufacturer) ? 'Battery Manufacturer is required' : undefined}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Model</label>
                                    <Select
                                        value={formState.batteryModel || '-'}
                                        onChange={(v) => handleBatteryModelChange(v as string)}
                                        options={batteryModelOptions}
                                        placeholder="-"

                                        creatable={true}
                                        isLoading={loadingBatteryModels}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Serial Number(SN numbers) <span className="text-red-500">*</span></label>
                                    <Input name="batterySerialNumber" value={formState.batterySerialNumber} onChange={handleChange} placeholder="Comma separated" error={hasAttemptedSubmit && isFieldEmpty(formState.batterySerialNumber) ? 'Battery Serial Number is required' : undefined} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Installed Date <span className="text-red-500">*</span></label>
                                    <DatePicker
                                        value={formState.batteryInstalledDate || null}
                                        onChange={(date) => setFormState(prev => ({ ...prev, batteryInstalledDate: date ? date.toISOString().split('T')[0] : '' }))}
                                        placeholder="Select date"
                                        error={hasAttemptedSubmit && isFieldEmpty(formState.batteryInstalledDate) ? 'Battery Installed Date is required' : undefined}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Usable Capacity (kWh) <span className="text-red-500">*</span></label>
                                    <Input type="number" step="0.1" name="batteryUsableCapacity" value={formState.batteryUsableCapacity} onChange={handleChange} error={hasAttemptedSubmit && isFieldEmpty(formState.batteryUsableCapacity) ? 'Battery Usable Capacity is required' : undefined} />
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
                                    <label className="text-sm font-medium text-foreground">Modem Router Location <span className="text-red-500">*</span></label>
                                    <Input name="modemRouterLocation" value={formState.modemRouterLocation} onChange={handleChange} error={hasAttemptedSubmit && isFieldEmpty(formState.modemRouterLocation) ? 'Modem Router Location is required' : undefined} />
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
                            {/* Submission Error Banner */}
                            {submitError && (
                                <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 flex items-start justify-between gap-3 animate-in fade-in">
                                    <div className="flex items-center gap-2">
                                        <AlertCircleIcon size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                                        <span className="text-sm font-semibold">{submitError}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSubmitError(null)}
                                        className="text-xs text-red-700 dark:text-red-400 hover:underline font-bold"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}

                            {/* Missing Required Fields Alert Box */}
                            {missingFieldItems.length > 0 && (
                                <div
                                    ref={errorBoxRef}
                                    className={`rounded-xl border p-5 transition-all duration-300 animate-in fade-in ${
                                        hasAttemptedSubmit
                                            ? 'border-red-300 dark:border-red-900/70 bg-red-50/90 dark:bg-red-950/40 ring-2 ring-red-400/30 shadow-md'
                                            : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            hasAttemptedSubmit
                                                ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                                                : 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                                        }`}>
                                            <AlertCircleIcon size={20} />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`text-sm font-bold ${hasAttemptedSubmit ? 'text-red-900 dark:text-red-200' : 'text-amber-900 dark:text-amber-200'}`}>
                                                        {hasAttemptedSubmit
                                                            ? `Cannot ${vppCertificateDetails?.id ? 'Update' : 'Generate'} Certificate — ${missingFieldItems.length} Required ${missingFieldItems.length === 1 ? 'Field' : 'Fields'} Missing`
                                                            : `Incomplete Form — ${missingFieldItems.length} Required ${missingFieldItems.length === 1 ? 'Field' : 'Fields'} Remaining`
                                                        }
                                                    </h4>
                                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                                        hasAttemptedSubmit
                                                            ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                                    }`}>
                                                        Action Required
                                                    </span>
                                                </div>
                                                <p className={`text-xs mt-1 ${hasAttemptedSubmit ? 'text-red-700 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                                                    Please complete all required fields across the steps below before clicking <span className="font-semibold">{vppCertificateDetails?.id ? 'Update' : 'Generate'}</span>. Click any step to jump directly to it:
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                                                {Object.entries(
                                                    missingFieldItems.reduce<Record<number, typeof missingFieldItems>>((acc, item) => {
                                                        (acc[item.stepIndex] = acc[item.stepIndex] || []).push(item);
                                                        return acc;
                                                    }, {})
                                                ).map(([stepIdxStr, items]) => {
                                                    const stepIdx = Number(stepIdxStr);
                                                    const stepInfo = STEPS[stepIdx];
                                                    return (
                                                        <div
                                                            key={stepIdx}
                                                            className="bg-background dark:bg-neutral-900 rounded-lg p-3.5 border border-border shadow-xs flex flex-col justify-between gap-3 hover:border-primary/50 transition-colors"
                                                        >
                                                            <div>
                                                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                                                                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                                        <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 text-[10px] flex items-center justify-center font-bold">
                                                                            {stepIdx + 1}
                                                                        </span>
                                                                        {stepInfo.label}
                                                                    </span>
                                                                    <span className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded">
                                                                        {items.length} missing
                                                                    </span>
                                                                </div>
                                                                <ul className="space-y-1.5 pl-4 list-disc text-xs text-muted-foreground">
                                                                    {items.map(field => (
                                                                        <li key={field.key} className="text-red-600 dark:text-red-400 font-medium">
                                                                            {field.label}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setCurrentStep(stepIdx)}
                                                                className="w-full text-xs font-semibold h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                                                            >
                                                                Go to Step {stepIdx + 1} →
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            onClick={() => handleToggleTest(test.field, test.tsField)}
                                            className={`
                                                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                                                ${isPassed
                                                    ? 'border-green-500/50 bg-green-50/20 dark:bg-green-950/20 hover:border-green-500 shadow-xs'
                                                    : 'border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/20'
                                                }
                                            `}
                                        >
                                            <p className="text-sm font-medium text-foreground">{test.label}</p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleTest(test.field, test.tsField);
                                                }}
                                                className={`
                                                    px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer
                                                    ${isPassed
                                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
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
                                                value={formState.testResult}
                                                onChange={handleChange}
                                                placeholder={allPassed ? 'All Test passed successfully' : 'Failed'}
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

            {/* Preview Modal */}
            <Modal
                isOpen={previewModalOpen}
                onClose={() => { setPreviewModalOpen(false); setPreviewUrl(null); setIsLoadingPreview(false); }}
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
                    <Button variant="outline" onClick={handleDownload} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <DownloadIcon size={16} className="mr-2" /> Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => { setPreviewModalOpen(false); setPreviewUrl(null); setIsLoadingPreview(false); }}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div >
    );
}