import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    ChevronLeftIcon,
    UserIcon,
    HomeIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    TagIcon,
    FileTextIcon
} from '@/components/icons';
import { useUser } from '@/stores/useAuthStore';
import {
    CREATE_LEAD,
    GET_LEAD_SOURCES,
    GET_LEADS,
    CHECK_NMI_EXISTS
} from '@/graphql';
import { TITLE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import LocationAutocomplete from '../LocationAutocomplete';
import { BranchLayout } from './BranchLayout';

const Field = ({ label, required, children, error, action }: { label: string, required?: boolean, children: React.ReactNode, error?: string, action?: React.ReactNode }) => {
    const fieldId = label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="space-y-1.5" id={`field-${fieldId}`}>
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </label>
                {action}
            </div>
            <div className={cn("transition-all duration-200", error && "ring-1 ring-red-500 rounded-lg")}>
                {children}
            </div>
            {error && (
                <div className="flex items-center gap-1.5 text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircleIcon size={12} className="shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, icon, isMono }: { label: string, value: string, icon?: React.ReactNode, isMono?: boolean }) => (
    <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-3 text-subtitle">
            <div className="opacity-50">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={cn(
            "text-sm font-bold text-title text-right",
            isMono && "font-mono"
        )}>
            {value}
        </span>
    </div>
);

export function BranchLeadFormPage() {
    const navigate = useNavigate();
    const user = useUser();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [duplicateErrors, setDuplicateErrors] = useState<{ address?: string; nmi?: string }>({});

    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        number: '',
        source: '',
        notes: '',
        unitnumber: '',
        housenumber: '',
        buildingname: '',
        floorlevelnumber: '',
        streetnumber: '',
        streetname: '',
        streettype: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
        nmi: '',
        assignedToUid: user?.uid || '',
        referralName: '',
    });

    const [addressSearch, setAddressSearch] = useState('');

    const { data: sourcesData, loading: sourcesLoading } = useQuery(GET_LEAD_SOURCES);

    const [createLead] = useMutation(CREATE_LEAD, {
        refetchQueries: [{ query: GET_LEADS }]
    });

    const [checkNmiExists] = useLazyQuery(CHECK_NMI_EXISTS);


    const sourceOptions = sourcesData?.leadSources?.map((s: any) => ({
        label: s.name,
        value: s.name
    })) || [];

    const updateField = (field: string, value: any) => {
        let finalValue = value;
        if (field === 'number') {
            finalValue = value.replace(/\D/g, '');
            if (finalValue.startsWith('0')) finalValue = finalValue.substring(1);
            if (finalValue.length > 9) finalValue = finalValue.substring(0, 9);
        }
        setFormData(prev => ({ ...prev, [field]: finalValue }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
        if (field === 'nmi' && duplicateErrors.nmi) setDuplicateErrors(prev => ({ ...prev, nmi: undefined }));
    };

    const checkNmiDuplicate = async (nmi: string) => {
        if (!nmi || nmi.length < 10) {
            setDuplicateErrors(prev => ({ ...prev, nmi: undefined }));
            return;
        }
        try {
            const { data } = await checkNmiExists({ variables: { nmi } });
            if (data?.checkNmiExists) {
                const existing = data.checkNmiExists;
                setDuplicateErrors(prev => ({
                    ...prev,
                    nmi: `NMI already exists: ${existing.firstName} ${existing.lastName} (${existing.customerId})`
                }));
            } else {
                setDuplicateErrors(prev => ({ ...prev, nmi: undefined }));
            }
        } catch (err) {
            console.error('NMI check failed:', err);
        }
    };

    const handleAddressSelect = (place: any) => {
        setAddressSearch(place.fullAddress || place.address);
        const unitnumber = place.unitNumber || '';
        const streetnumber = place.streetNumber || '';
        const housenumber = place.houseNumber || '';

        setFormData(prev => ({
            ...prev,
            unitnumber,
            housenumber: (housenumber === streetnumber || housenumber === unitnumber) ? '' : housenumber,
            buildingname: place.buildingName || '',
            floorlevelnumber: place.floorLevelNumber || '',
            streetnumber,
            streetname: place.streetName || '',
            streettype: place.streetType || '',
            suburb: place.suburb || '',
            state: place.state || '',
            postcode: place.postcode || '',
            country: place.country || 'Australia',
        }));
    };

    const validateStep = (s: number) => {
        const newErrors: Record<string, string> = {};
        if (s === 1) {
            if (!formData.firstname?.trim()) newErrors.firstname = 'First name is required';
            if (!formData.lastname?.trim()) newErrors.lastname = 'Last name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
            if (!formData.number) newErrors.number = 'Phone number is required';
            else if (formData.number.length !== 9) newErrors.number = 'Must be 9 digits';
            if (!formData.source) newErrors.source = 'Lead source is required';
            if (formData.source === 'Referral' && !formData.referralName?.trim()) newErrors.referralName = 'Referral name is required';
        }
        if (s === 2) {
            if (!formData.suburb) newErrors.address = 'Address selection is required';
            if (duplicateErrors.nmi) newErrors.nmi = duplicateErrors.nmi;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            toast.error('Please complete all required fields');
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setIsSubmitting(true);
        try {
            await createLead({
                variables: {
                    input: {
                        ...formData,
                        number: `+61${formData.number}`,
                        branchTenant: user?.branchTenant,
                        assignedToUid: null
                    }
                }
            });
            toast.success('Lead created successfully!');
            navigate('/branch-portal');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create lead');
        } finally {
            setIsSubmitting(false);
        }
    };


    const steps = [
        { id: 1, name: 'Personal', icon: <UserIcon size={16} /> },
        { id: 2, name: 'Property', icon: <HomeIcon size={16} /> },
        { id: 3, name: 'Review', icon: <CheckCircleIcon size={16} /> },
    ];

    return (
        <BranchLayout title="Create New Lead">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        step === s.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" :
                                            step > s.id ? "bg-emerald-500 text-white" : "bg-white dark:bg-white/5 text-subtitle border border-border/50"
                                    )}>
                                        {step > s.id ? <CheckCircleIcon size={20} /> : s.icon}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        step === s.id ? "text-primary" : "text-subtitle opacity-50"
                                    )}>
                                        {s.name}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-12 h-[2px] bg-border/40 -mt-6">
                                        <div className={cn(
                                            "h-full bg-primary transition-all duration-500",
                                            step > s.id ? "w-full" : "w-0"
                                        )} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-border/50 shadow-sm overflow-hidden flex flex-col relative transition-all duration-500">
                        <div className="p-6 sm:p-8 lg:p-10 space-y-8 min-h-[400px]">
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-title tracking-tight">Personal Details</h2>
                                        <p className="text-subtitle text-sm opacity-70">Tell us about the customer</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-2">
                                            <Field label="Title">
                                                <Select options={TITLE_OPTIONS} value={formData.title} onChange={(val) => updateField('title', val as string)} placeholder="Select" />
                                            </Field>
                                        </div>
                                        <div className="md:col-span-5">
                                            <Field label="First Name" required error={errors.firstname}>
                                                <Input value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} placeholder="First name" />
                                            </Field>
                                        </div>
                                        <div className="md:col-span-5">
                                            <Field label="Last Name" required error={errors.lastname}>
                                                <Input value={formData.lastname} onChange={(e) => updateField('lastname', e.target.value)} placeholder="Last name" />
                                            </Field>
                                        </div>

                                        <div className="md:col-span-6">
                                            <Field label="Email" required error={errors.email}>
                                                <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@example.com" />
                                            </Field>
                                        </div>
                                        <div className="md:col-span-6">
                                            <Field label="Phone Number" required error={errors.number}>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-4 font-bold text-primary z-10 text-xs">+61</span>
                                                    <Input value={formData.number} onChange={(e) => updateField('number', e.target.value)} placeholder="400 000 000" className="pl-12" />
                                                </div>
                                            </Field>
                                        </div>

                                        <div className="md:col-span-12">
                                            <Field label="Lead Source" required error={errors.source}>
                                                <Select options={sourceOptions} value={formData.source} onChange={(val) => updateField('source', val as string)} placeholder={sourcesLoading ? "Loading..." : "Select source"} disabled={sourcesLoading} />
                                            </Field>
                                        </div>

                                        {formData.source === 'Referral' && (
                                            <div className="md:col-span-12 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Field label="Referral Name" required={true} error={errors.referralName}>
                                                    <Input value={formData.referralName} onChange={(e) => updateField('referralName', e.target.value)} placeholder="Who referred this lead?" />
                                                </Field>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-title tracking-tight">Property Information</h2>
                                        <p className="text-subtitle text-sm opacity-70">Service address and meter details</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-8">
                                            <Field label="Search Address" error={errors.address}>
                                                <LocationAutocomplete
                                                    value={addressSearch}
                                                    onChange={(val) => setAddressSearch(val)}
                                                    onSelect={handleAddressSelect}
                                                    placeholder="Start typing address..."
                                                />
                                            </Field>
                                        </div>
                                        <div className="md:col-span-4">
                                            <Field label="NMI" error={errors.nmi || duplicateErrors.nmi}>
                                                <Input
                                                    value={formData.nmi}
                                                    onChange={(e) => updateField('nmi', e.target.value)}
                                                    onBlur={() => checkNmiDuplicate(formData.nmi)}
                                                    placeholder="NMI number"
                                                    maxLength={11}
                                                />
                                            </Field>
                                        </div>

                                        <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-border/40">
                                            <Field label="Unit No."><Input disabled value={formData.unitnumber || '-'} /></Field>
                                            <Field label="House No."><Input disabled value={formData.housenumber || '-'} /></Field>
                                            <Field label="Building"><Input disabled value={formData.buildingname || '-'} /></Field>
                                            <Field label="Floor/Level"><Input disabled value={formData.floorlevelnumber || '-'} /></Field>
                                            <Field label="St. No."><Input disabled value={formData.streetnumber || '-'} /></Field>
                                            <Field label="St. Name"><Input disabled value={formData.streetname || '-'} /></Field>
                                            <Field label="St. Type"><Input disabled value={formData.streettype || '-'} /></Field>
                                            <Field label="Suburb"><Input disabled value={formData.suburb || '-'} /></Field>
                                            <Field label="State"><Input disabled value={formData.state || '-'} /></Field>
                                            <Field label="Postcode"><Input disabled value={formData.postcode || '-'} /></Field>
                                            <Field label="Country"><Input disabled value={formData.country || '-'} /></Field>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                                    {/* Header Section - Clean & Borderless */}
                                    <div className="flex items-center gap-5 px-2">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <CheckCircleIcon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-title tracking-tight">Review & Summary</h3>
                                            <p className="text-sm text-subtitle opacity-70">Please verify details and add any final notes below</p>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Data Sections Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-2">
                                            {/* Customer Column */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                                                    <UserIcon size={18} className="text-primary" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-title opacity-60">Customer Details</h4>
                                                </div>
                                                
                                                <div className="space-y-5">
                                                    <DetailRow label="Full Name" value={`${formData.title} ${formData.firstname} ${formData.lastname}`} icon={<UserIcon size={14} />} />
                                                    <DetailRow label="Email Address" value={formData.email} icon={<MailIcon size={14} />} />
                                                    <DetailRow label="Phone Number" value={`+61 ${formData.number}`} icon={<PhoneIcon size={14} />} />
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex items-center gap-3 text-subtitle">
                                                            <TagIcon size={14} className="opacity-50" />
                                                            <span className="text-xs font-medium">Lead Source</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight">{formData.source}</span>
                                                            {formData.referralName && (
                                                                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-tight">Ref: {formData.referralName}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Column */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                                                    <MapPinIcon size={18} className="text-primary" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-title opacity-60">Property & Meter</h4>
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center gap-3 text-subtitle">
                                                            <MapPinIcon size={14} className="opacity-50" />
                                                            <span className="text-xs font-medium">Service Address</span>
                                                        </div>
                                                        <p className="pl-6.5 text-[15px] font-bold text-title leading-relaxed">
                                                            {addressSearch || <span className="text-red-500 italic">No address selected</span>}
                                                        </p>
                                                    </div>
                                                    
                                                    <DetailRow label="NMI Number" value={formData.nmi || 'Not provided'} icon={<FileTextIcon size={14} />} isMono />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes Section */}
                                        <div className="pt-4 px-2">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2.5">
                                                    <FileTextIcon size={18} className="text-primary" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-title opacity-60">Internal Notes</h4>
                                                </div>
                                                <textarea
                                                    value={formData.notes}
                                                    onChange={(e) => updateField('notes', e.target.value)}
                                                    className="w-full min-h-[160px] rounded-2xl border border-border bg-gray-50/30 dark:bg-white/[0.01] px-6 py-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground transition-all resize-none placeholder:text-subtitle/40 shadow-inner"
                                                    placeholder="Add any special requirements or notes about this lead here..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 sm:px-8 py-6 bg-white/80 dark:bg-white/[0.02] border-t border-border/40 flex items-center justify-between sticky bottom-0 z-20 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                {step > 1 ? (
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={prevStep}
                                        className="text-xs font-bold uppercase tracking-widest text-subtitle hover:text-title"
                                        leftIcon={<ChevronLeftIcon size={14} />}
                                    >
                                        Back
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={() => navigate('/branch-portal')}
                                        className="text-xs font-bold uppercase tracking-widest text-subtitle hover:text-title"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-10 rounded-xl shadow-lg shadow-primary/20 bg-primary"
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    isLoading={isSubmitting}
                                    className="px-10 rounded-xl shadow-lg shadow-primary/20 bg-primary"
                                    leftIcon={<CheckCircleIcon size={18} />}
                                >
                                    Submit Lead
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BranchLayout>
    );
}
