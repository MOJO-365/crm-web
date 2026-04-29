import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import {
    ChevronLeftIcon,
    UserIcon,
    HomeIcon,
    IdCardIcon,
    AlertCircleIcon,
    ZapIcon,
    CheckCircleIcon,
    InfoIcon,
} from '@/components/icons';
import { useUser } from '@/stores/useAuthStore';
import LocationAutocomplete from '../LocationAutocomplete';
import { TITLE_OPTIONS, ID_TYPE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getData } from 'country-list';
import { BranchLayout } from './BranchLayout';

const MEDICARE_CARD_TYPE_OPTIONS = [
    { value: '0', label: 'Standard (Green)' },
    { value: '1', label: 'Interim (Blue)' },
    { value: '2', label: 'Reciprocal (Yellow)' },
];

const capitalize = (str: string) => {
    if (!str) return '';
    return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};

const Field = ({ label, required, children, error }: { label: string, required?: boolean, children: React.ReactNode, error?: string }) => {
    const fieldId = label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="space-y-1.5" id={`field-${fieldId}`}>
            <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                {label}
                {required && <span className="text-red-500 font-bold">*</span>}
            </label>
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

export function BranchCustomerFormPage() {
    const navigate = useNavigate();
    const user = useUser();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const STEPS = [
        { id: 1, title: 'Customer', icon: <UserIcon size={18} /> },
        { id: 2, title: 'Service', icon: <HomeIcon size={18} /> },
        { id: 3, title: 'Identity', icon: <IdCardIcon size={18} /> },
        { id: 4, title: 'Confirm', icon: <CheckCircleIcon size={18} /> }
    ];

    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        number: '',
        email: '',
        dob: '',
        ownership_status: 0,
        customerType: 'RESIDENTIAL',
        idType: 0,
        idnumber: '',
        idstate: '',
        idcountry: 'Australia',
        idexpiary: '',
        licenseCardNumber: '',
        medicareCardType: 0,
        address: '',
        unitNumber: '',
        houseNumber: '',
        streetNumber: '',
        streetName: '',
        streetType: '',
        suburb: '',
        state: '',
        postcode: '',
        isVpp: 0
    });

    const eighteenYearsAgo = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    }, []);

    const countryOptions = useMemo(() => {
        return getData().map((country) => ({
            value: country.name,
            label: country.name,
        }));
    }, []);


    const updateField = (field: string, value: any) => {
        let finalValue = value;

        if (field === 'number') {
            if (typeof value === 'string') {
                finalValue = value.replace(/\D/g, '');
                if (finalValue.startsWith('0')) {
                    finalValue = finalValue.substring(1);
                }
            }
        }
        setFormData(prev => ({ ...prev, [field]: finalValue }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAddressSelect = (addressData: any) => {
        setFormData(prev => ({
            ...prev,
            address: addressData.fullAddress || addressData.address,
            unitNumber: addressData.unitNumber || '',
            houseNumber: addressData.houseNumber || addressData.streetNumber || '',
            streetNumber: addressData.streetNumber || addressData.houseNumber || '',
            streetName: addressData.streetName || '',
            streetType: addressData.streetType || '',
            suburb: addressData.suburb || '',
            state: addressData.state || '',
            postcode: addressData.postcode || '',
        }));
    };


    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.title) newErrors.title = 'Please select a title';
            if (!formData.firstname?.trim()) newErrors.firstname = 'First name is required';
            if (!formData.lastname?.trim()) newErrors.lastname = 'Last name is required';

            if (!formData.number) {
                newErrors.number = 'Mobile number is required';
            } else if (formData.number.length !== 9) {
                newErrors.number = 'Mobile number must be 9 digits';
            }

            if (!formData.email) {
                newErrors.email = 'Email address is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }

            if (!formData.dob) newErrors.dob = 'Date of birth is required';
        }
        else if (step === 2) {
            if (!formData.address) newErrors.address = 'Please search and select a service address';
        }
        else if (step === 3) {
            // No required fields for Identity step
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const errorKeys = Object.keys(newErrors);
            const firstErrorField = errorKeys[0];
            const fieldMap: Record<string, string> = {
                title: 'title',
                firstname: 'first-name',
                lastname: 'last-name',
                email: 'email-address',
                number: 'mobile-number',
                dob: 'date-of-birth',
                address: 'search-address',
                idnumber: 'id-number',
                idstate: 'id-state',
                idcountry: 'id-country',
                idexpiary: 'id-expiry',
                licenseCardNumber: 'license-card-number'
            };
            const fieldId = fieldMap[firstErrorField] || firstErrorField.toLowerCase();
            const element = document.getElementById(`field-${fieldId}`);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        } else {
            toast.error('Please correct the errors before proceeding');
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                firstname: capitalize(formData.firstname),
                lastname: capitalize(formData.lastname),
                number: `+61${formData.number.replace(/\D/g, '')}`,
                phone: `+61${formData.number.replace(/\D/g, '')}`,
                portalname: user?.name || 'Branch Portal',
                branchTenant: user?.branchTenant,
                isVpp: Number(formData.isVpp),
                ownership_status: Number(formData.ownership_status)
            };
            await axios.post(`/api/web/create-customer`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Web-Token': import.meta.env.VITE_WEB_TOKEN
                }
            });
            toast.success('Enrollment submitted successfully!');
            navigate('/branch-portal');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit enrollment');
        } finally {
            setIsSubmitting(false);
        }
    };


    // const parsedPriceUnits = useMemo(() => {
    //     if (!activeOffer.priceUnits) return {};
    //     try {
    //         return typeof activeOffer.priceUnits === 'string' ? JSON.parse(activeOffer.priceUnits) : activeOffer.priceUnits;
    //     } catch (e) { return {}; }
    // }, [activeOffer.priceUnits]);

    // const formatUnit = (key: string, fallback: string) => {
    //     const unitUid = parsedPriceUnits[key];
    //     const unit = unitUid ? (unitsMap[unitUid] || fallback) : fallback;
    //     return unit ? `/${unit}` : '';
    // };

    const actions = null;

    return (
        <BranchLayout title="New Enrollment" actions={actions}>
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">


                    <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-border/50 shadow-sm flex flex-col min-h-[500px] relative">
                        <div className="flex-1 p-6 sm:p-8 lg:p-10">
                            {/* Step 1: Customer Details */}
                            {currentStep === 1 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold text-title tracking-tight">Personal Details</h2>
                                        <p className="text-subtitle text-sm opacity-70">Enter the customer's contact information</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                        <Field label="Title" required error={errors.title}><Select options={TITLE_OPTIONS} value={formData.title} onChange={(val) => updateField('title', val as string)} placeholder="Select title" /></Field>
                                        <Field label="First Name" required error={errors.firstname}><Input value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} placeholder="e.g. John" /></Field>
                                        <Field label="Last Name" required error={errors.lastname}><Input value={formData.lastname} onChange={(e) => updateField('lastname', e.target.value)} placeholder="e.g. Doe" /></Field>
                                        <Field label="Email Address" required error={errors.email}><Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="e.g. john.doe@example.com" /></Field>
                                        <Field label="Mobile Number" required error={errors.number}>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-4 font-bold text-primary z-10 text-xs">+61</span>
                                                <Input value={formData.number} onChange={(e) => updateField('number', e.target.value)} placeholder="400 000 000" className="pl-12 h-11" />
                                            </div>
                                        </Field>
                                        <Field label="Date of Birth" required error={errors.dob}><DatePicker value={formData.dob} onChange={(date) => updateField('dob', date?.toISOString().split('T')[0])} placeholder="Select DOB" maxDate={eighteenYearsAgo} /></Field>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Service Address */}
                            {currentStep === 2 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                                    <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Service Address</h2><p className="text-subtitle text-sm">Connection location and property type</p></div>
                                    <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3"><div className="p-2.5 rounded-full bg-primary/10 text-primary"><ZapIcon size={20} /></div><div><h3 className="font-semibold text-title text-sm">VPP Participation</h3><p className="text-[11px] text-subtitle">Enable Virtual Power Plant</p></div></div>
                                        <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={!!formData.isVpp} onChange={(e) => updateField('isVpp', e.target.checked ? 1 : 0)} /><div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div></label>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                                        <Field label="Customer Type"><Select options={[{ value: 'RESIDENTIAL', label: 'Residential' }, { value: 'BUSINESS', label: 'Business' }]} value={formData.customerType} onChange={(val) => updateField('customerType', val as string)} /></Field>
                                        <Field label="Ownership Status"><Select options={[{ value: '0', label: 'Own' }, { value: '1', label: 'Rent' }]} value={formData.ownership_status.toString()} onChange={(val) => updateField('ownership_status', parseInt(val as string))} /></Field>
                                    </div>
                                    <Field label="Search Address" required error={errors.address}><LocationAutocomplete onSelect={handleAddressSelect} value={formData.address} onChange={(val) => updateField('address', val)} /></Field>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                                        <Field label="Unit/Flat"><Input value={formData.unitNumber} onChange={(e) => updateField('unitNumber', e.target.value)} placeholder="Unit" disabled={true} /></Field>
                                        <Field label="House/Street No."><Input value={formData.streetNumber} onChange={(e) => updateField('streetNumber', e.target.value)} placeholder="No." disabled={true} /></Field>
                                        <Field label="Street Name"><Input value={formData.streetName} onChange={(e) => updateField('streetName', e.target.value)} placeholder="Street Name" disabled={true} /></Field>
                                        <Field label="Street Type"><Input value={formData.streetType} onChange={(e) => updateField('streetType', e.target.value)} placeholder="St, Rd, etc." disabled={true} /></Field>
                                        <Field label="Suburb"><Input value={formData.suburb} onChange={(e) => updateField('suburb', e.target.value)} placeholder="Suburb" disabled={true} /></Field>
                                        <Field label="State"><Input value={formData.state} onChange={(e) => updateField('state', e.target.value)} placeholder="State" disabled={true} /></Field>
                                        <Field label="Postcode"><Input value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} placeholder="Postcode" disabled={true} /></Field>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Identity Verification */}
                            {currentStep === 3 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                                    <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Identity Verification</h2><p className="text-subtitle text-sm">Security and identification</p></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                                        <Field label="ID Type"><Select options={ID_TYPE_OPTIONS} value={formData.idType.toString()} onChange={(val) => updateField('idType', parseInt(val as string))} /></Field>
                                        <Field label="ID Number"><Input value={formData.idnumber} onChange={(e) => updateField('idnumber', e.target.value)} placeholder="Enter ID number" /></Field>

                                        {formData.idType === 0 && (
                                            <Field label="License Card Number">
                                                <Input value={formData.licenseCardNumber} onChange={(e) => updateField('licenseCardNumber', e.target.value)} placeholder="Enter Card Number" />
                                            </Field>
                                        )}

                                        {formData.idType === 1 && (
                                            <Field label="Medicare Card Type">
                                                <Select options={MEDICARE_CARD_TYPE_OPTIONS} value={formData.medicareCardType.toString()} onChange={(val) => updateField('medicareCardType', parseInt(val as string))} placeholder="Select Medicare Type" />
                                            </Field>
                                        )}

                                        {formData.idType === 2 ? (
                                            <Field label="ID Country">
                                                <Select options={countryOptions} value={formData.idcountry} onChange={(val) => updateField('idcountry', val as string)} placeholder="Select Country" />
                                            </Field>
                                        ) : (
                                            <Field label="ID State"><Select options={STATE_OPTIONS} value={formData.idstate} onChange={(val) => updateField('idstate', val as string)} placeholder="Select State" /></Field>
                                        )}

                                        <Field label="ID Expiry"><DatePicker value={formData.idexpiary} onChange={(date) => updateField('idexpiary', date?.toISOString().split('T')[0])} placeholder="Select Expiry" /></Field>
                                    </div>

                                </div>
                            )}

                            {/* Step 4: Confirmation */}
                            {currentStep === 4 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-title">Review & Confirm</h2>
                                        <p className="text-subtitle text-sm">Please verify all information before submitting the enrollment</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 items-stretch">
                                        {/* Customer Details */}
                                        <div className="rounded-xl border border-border overflow-hidden flex flex-col h-full bg-white/50 dark:bg-white/[0.02]">
                                            <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                                <UserIcon size={14} className="text-primary" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Customer Details</h3>
                                            </div>
                                            <div className="divide-y divide-border/50 flex-1">
                                                {[
                                                    { label: 'Full Name', value: `${formData.title} ${formData.firstname} ${formData.lastname}` },
                                                    { label: 'Email', value: formData.email },
                                                    { label: 'Mobile', value: `+61 ${formData.number}` },
                                                    { label: 'Date of Birth', value: formData.dob },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                                        <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                                        <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Service Property */}
                                        <div className="rounded-xl border border-border overflow-hidden flex flex-col h-full bg-white/50 dark:bg-white/[0.02]">
                                            <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                                <HomeIcon size={14} className="text-primary" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Service Property</h3>
                                            </div>
                                            <div className="divide-y divide-border/50 flex-1">
                                                {[
                                                    { label: 'Address', value: formData.address },
                                                    { label: 'Ownership', value: formData.ownership_status === 0 ? 'Owns' : 'Rents' },
                                                    { label: 'VPP Status', value: formData.isVpp ? 'Enrolled' : 'Not Enrolled' },
                                                    { label: 'Type', value: formData.customerType },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                                        <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                                        <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Identity Verification */}
                                        <div className="rounded-xl border border-border overflow-hidden flex flex-col h-full bg-white/50 dark:bg-white/[0.02]">
                                            <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                                                <IdCardIcon size={14} className="text-primary" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Identity Verification</h3>
                                            </div>
                                            <div className="divide-y divide-border/50 flex-1">
                                                {[
                                                    { label: 'ID Type', value: ID_TYPE_OPTIONS.find(o => o.value === formData.idType.toString())?.label || 'Driver License' },
                                                    { label: 'ID Number', value: formData.idnumber },
                                                    ...(formData.idType === 0 ? [{ label: 'Card Number', value: formData.licenseCardNumber }] : []),
                                                    ...(formData.idType === 1 ? [{ label: 'Card Type', value: MEDICARE_CARD_TYPE_OPTIONS.find(o => o.value === formData.medicareCardType.toString())?.label }] : []),
                                                    { label: formData.idType === 2 ? 'Country' : 'State', value: formData.idType === 2 ? formData.idcountry : formData.idstate },
                                                    { label: 'Expiry', value: formData.idexpiary },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-4">
                                                        <span className="text-xs text-subtitle font-medium shrink-0">{item.label}</span>
                                                        <span className="text-sm font-semibold text-title text-right">{item.value || '—'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 bg-primary/5 border border-dashed border-primary/20 rounded-xl flex items-start gap-3">
                                        <div className="mt-1 text-primary"><InfoIcon size={20} /></div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-title text-sm">Almost Done!</p>
                                            <p className="text-xs sm:text-sm text-subtitle">By clicking "Finish & Submit", you confirm that the information above is correct and the customer has consented to this enrollment.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 sm:px-8 py-6 bg-white/80 dark:bg-white/[0.02] border-t border-border/40 flex items-center justify-between sticky bottom-0 z-20 backdrop-blur-md rounded-b-[2rem]">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="text-xs font-bold uppercase tracking-widest text-subtitle hover:text-title"
                                leftIcon={<ChevronLeftIcon size={14} />}
                            >
                                Back
                            </Button>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-subtitle opacity-40">
                                Step {currentStep} of {STEPS.length}
                            </div>
                            {currentStep === STEPS.length ? (
                                <Button
                                    onClick={handleSubmit}
                                    isLoading={isSubmitting}
                                    className="px-10 rounded-xl shadow-lg shadow-primary/20"
                                    leftIcon={<CheckCircleIcon size={18} />}
                                >
                                    Finish & Submit
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="px-12 rounded-xl shadow-md shadow-primary/10"
                                >
                                    Continue
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BranchLayout>
    );
}
