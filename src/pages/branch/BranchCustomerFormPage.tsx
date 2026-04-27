
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@apollo/client';
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
    ZapIcon,
    CheckCircleIcon,
    SearchIcon,
    InfoIcon,
    Settings2Icon,
    PlugIcon,
    ActivityIcon,
    SunIcon,
    FileTextIcon,
    CalendarIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon
} from '@/components/icons';
import { useUser } from '@/stores/useAuthStore';
import LocationAutocomplete from '../LocationAutocomplete';
import { TITLE_OPTIONS, ID_TYPE_OPTIONS, STATE_OPTIONS, DISCOUNT_OPTIONS } from '@/lib/constants';
import { normalisePhone } from '@/lib/twilio';
import { GET_ACTIVE_RATES_HISTORY } from '@/graphql';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { Modal } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import { getData } from 'country-list';

const MEDICARE_CARD_TYPE_OPTIONS = [
    { value: '0', label: 'Standard (Green)' },
    { value: '1', label: 'Interim (Blue)' },
    { value: '2', label: 'Reciprocal (Yellow)' },
];


const Field = ({ label, required, children, error }: { label: string, required?: boolean, children: React.ReactNode, error?: string }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
);

const SummaryItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-accent/10 border border-border/50">
        <div className="mt-0.5 p-2 bg-white dark:bg-card border border-border rounded-lg text-primary shrink-0">
            <Icon size={16} />
        </div>
        <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] uppercase font-bold text-subtitle tracking-wider">{label}</p>
            <p className="text-sm font-bold text-title truncate">{value || '—'}</p>
        </div>
    </div>
);

export function BranchCustomerFormPage() {
    const navigate = useNavigate();
    const user = useUser();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isNmiLookupLoading, setIsNmiLookupLoading] = useState(false);
    const [nmiOptions, setNmiOptions] = useState<any[]>([]);
    const [isNmiModalOpen, setIsNmiModalOpen] = useState(false);
    const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
    const [selectedNmiResult, setSelectedNmiResult] = useState<any>(null);
    const [availableTariffs, setAvailableTariffs] = useState<string[]>([]);

    const STEPS = [
        { id: 1, title: 'Customer', icon: <UserIcon size={18} /> },
        { id: 2, title: 'Service', icon: <HomeIcon size={18} /> },
        { id: 3, title: 'Identity', icon: <IdCardIcon size={18} /> },
        { id: 4, title: 'Plan', icon: <ZapIcon size={18} /> },
        { id: 5, title: 'Confirm', icon: <CheckCircleIcon size={18} /> }
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
        tariffcode: '',
        nmi: '',
        address: '',
        unitNumber: '',
        houseNumber: '',
        streetNumber: '',
        streetName: '',
        streetType: '',
        suburb: '',
        state: '',
        postcode: '',
        discount: 0,
        isVpp: 0
    });

    const eighteenYearsAgo = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    }, []);

    const { data: activeRatesData } = useQuery(GET_ACTIVE_RATES_HISTORY);
    // const { data: unitsData } = useQuery(GET_MEASUREMENT_UNITS);

    // const unitsMap = useMemo(() => {
    //     const map: Record<string, string> = {};
    //     unitsData?.measurementUnits?.forEach((u: any) => { map[u.uid] = u.name; });
    //     return map;
    // }, [unitsData]);

    const ratePlans = useMemo(() => {
        const record = activeRatesData?.globalActiveRatesHistory;
        if (!record?.newRecord) return [];
        try {
            return typeof record.newRecord === 'string' ? JSON.parse(record.newRecord) : record.newRecord;
        } catch (e) {
            return [];
        }
    }, [activeRatesData]);

    const tariffOptions = useMemo(() => {
        if (!formData.state) return [];
        return ratePlans
            .filter((rp: any) => {
                const stateMatch = rp.state?.toLowerCase() === formData.state?.toLowerCase();
                const activeMatch = !rp.isActive === false;
                const vppMatch = formData.isVpp ? rp.vpp === 1 : rp.vpp !== 1;
                return stateMatch && activeMatch && vppMatch;
            })
            .map((rp: any) => ({
                value: rp.codes,
                label: `${rp.codes} - ${rp.tariff} (${rp.state})`,
            }));
    }, [ratePlans, formData.state, formData.isVpp]);

    const countryOptions = useMemo(() => {
        return getData().map((country) => ({
            value: country.name,
            label: country.name,
        }));
    }, []);


    const updateField = (field: string, value: any) => {
        let finalValue = value;

        if (field === 'isVpp' && value !== formData.isVpp) {
            setFormData(prev => ({
                ...prev,
                isVpp: value,
                nmi: '',
                tariffcode: '',
                discount: 0
            }));
            return;
        }

        if (field === 'number' || field === 'nmi') {
            if (typeof value === 'string') {
                finalValue = value.replace(/\D/g, '');
                if (field === 'number' && finalValue.startsWith('0')) {
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

    const autoSelectTariff = (selectedTariff: string) => {
        if (!selectedTariff || !tariffOptions?.length) return;
        const s = selectedTariff.toLowerCase().trim();
        const sNoPrefix = s.startsWith('vpp ') ? s.substring(4) : s;

        let matchedTariff = tariffOptions.find((opt: any) => {
            const v = opt.value.toLowerCase().trim();
            const vNoPrefix = v.startsWith('vpp ') ? v.substring(4) : v;
            return v === s || vNoPrefix === sNoPrefix;
        });

        if (!matchedTariff) {
            matchedTariff = tariffOptions.find((opt: any) => {
                const l = opt.label.toLowerCase().trim();
                const firstPart = l.split(' - ')[0]?.trim();
                return l === s || firstPart === s || firstPart === `vpp ${s}`;
            });
        }

        if (matchedTariff) {
            updateField('tariffcode', matchedTariff.value);
            const rp = ratePlans.find((r: any) => r.codes === matchedTariff.value);
            if (rp) updateField('discount', rp.discountPercentage || 0);
        } else {
            updateField('tariffcode', '');
            updateField('discount', 0);
        }
    };

    const handleNmiLookup = async () => {
        if (!formData.address) {
            toast.error('Please select an address first');
            return;
        }
        try {
            setIsNmiLookupLoading(true);
            const body = {
                jurisdictionCode: formData.state || 'NSW',
                stateOrTerritory: formData.state || 'NSW',
                postcode: formData.postcode || '',
                houseNumber: formData.houseNumber || '',
                streetName: formData.streetName || '',
                StreetType: formData.streetType || '',
                SuburbOrPlaceOrLocality: formData.suburb || ''
            };

            const response = await fetch(`${import.meta.env.VITE_MSAT_API_URL}/api/nmi-lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (Array.isArray(data?.results) && data.results.length > 1) {
                setNmiOptions(data.results);
                setIsNmiModalOpen(true);
                return;
            }

            const item = data?.results?.[0] || data?.data?.[0] || data;
            const nmi = item?.nmi || data?.nmi;

            if (nmi) {
                updateField('nmi', nmi);
                const tariff = item?.network?.tariff || (item?.registers?.[0]?.tariffCode);
                if (tariff) autoSelectTariff(tariff);
                toast.success('NMI and Tariff successfully matched');
            } else {
                toast.error('NMI not found for this address');
            }
        } catch (error) {
            toast.error('Failed to lookup NMI');
        } finally {
            setIsNmiLookupLoading(false);
        }
    };

    const handleSelectNmi = (option: any) => {
        // Find all unique valid tariffs for this NMI
        const registers = option?.registers || [];
        const tariffsFromRegisters = registers.map((r: any) => r.tariffCode).filter(Boolean);
        const networkTariff = option?.network?.tariff;
        const allUniqueTariffs = Array.from(new Set([...tariffsFromRegisters, networkTariff].filter(Boolean)));

        // Filter against our current valid tariffOptions (which handle state/vpp/isDeleted checks)
        const validTariffs = allUniqueTariffs.filter((t: any) => tariffOptions.some((to: any) => to.value === t));

        if (validTariffs.length > 1) {
            // Multiple valid tariffs found, show selection modal
            setSelectedNmiResult(option);
            setAvailableTariffs(validTariffs);
            setIsNmiModalOpen(false);
            setIsTariffModalOpen(true);
        } else {
            // Only one or zero valid tariffs, proceed as usual
            updateField('nmi', option.nmi);
            if (option.customerType) {
                updateField('customerType', option.customerType);
            }
            const tariff = validTariffs[0] || networkTariff || (option?.registers?.[0]?.tariffCode);
            if (tariff) autoSelectTariff(tariff);
            setIsNmiModalOpen(false);
            if (tariff) toast.success(`NMI ${option.nmi} and Tariff matched successfully`);
            else toast.success(`NMI ${option.nmi} selected`);
        }
    };

    const handleSelectTariff = (tariffCode: string) => {
        if (selectedNmiResult) {
            updateField('nmi', selectedNmiResult.nmi);
            if (selectedNmiResult.customerType) {
                updateField('customerType', selectedNmiResult.customerType);
            }
            autoSelectTariff(tariffCode);
            setIsTariffModalOpen(false);
            toast.success(`NMI and Tariff ${tariffCode} matched successfully`);
        }
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.firstname) newErrors.firstname = 'Required';
            if (!formData.lastname) newErrors.lastname = 'Required';
            if (!formData.number || formData.number.length < 9) newErrors.number = 'Valid AU mobile required';
            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
            if (!formData.dob) newErrors.dob = 'Required';
        } else if (step === 2) {
            if (!formData.address) newErrors.address = 'Required';
        } else if (step === 4) {
            if (!formData.nmi) newErrors.nmi = 'Required';
            if (!formData.tariffcode) newErrors.tariffcode = 'Required';
        }
        setErrors(newErrors);
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
        if (!validateStep(4)) return;
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                number: normalisePhone(formData.number),
                phone: normalisePhone(formData.number),
                portalname: user?.name || 'Branch Portal',
                isVpp: Number(formData.isVpp),
                discount: Number(formData.discount),
                ownership_status: Number(formData.ownership_status)
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/web/create-customer`, payload, {
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

    const selectedRatePlan = useMemo(() => {
        return ratePlans.find((rp: any) => rp.codes === formData.tariffcode);
    }, [ratePlans, formData.tariffcode]);

    const activeOffer = useMemo(() => {
        return selectedRatePlan?.offers?.[0] || {};
    }, [selectedRatePlan]);

    const parsedDynamicRates = useMemo(() => {
        if (!activeOffer.dynamicRates) return [];
        try {
            return typeof activeOffer.dynamicRates === 'string' ? JSON.parse(activeOffer.dynamicRates) : activeOffer.dynamicRates;
        } catch (e) { return []; }
    }, [activeOffer.dynamicRates]);

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-card border-b border-border sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/branch-portal')} className="p-2 hover:bg-gray-100 dark:hover:bg-accent rounded-full transition-colors">
                            <ChevronLeftIcon size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-title">Enrollment Wizard</h1>
                            <p className="text-xs text-subtitle">{user?.name} Branch</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => navigate('/branch-portal')}>Cancel</Button>
                        {currentStep === STEPS.length ? (
                            <Button onClick={handleSubmit} isLoading={isSubmitting} leftIcon={<CheckCircleIcon size={18} />}>Finish & Submit</Button>
                        ) : (
                            <Button onClick={handleNext}>Next Step</Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8">
                {/* Stepper */}
                <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-accent -translate-y-1/2 z-0" />
                        <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
                        {STEPS.map((step) => {
                            const isCompleted = currentStep > step.id;
                            const isActive = currentStep === step.id;
                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <button onClick={() => step.id < currentStep && setCurrentStep(step.id)} disabled={step.id >= currentStep} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isCompleted ? 'bg-primary border-primary text-white' : isActive ? 'bg-white dark:bg-card border-primary text-primary shadow-lg scale-110' : 'bg-white dark:bg-card border-gray-200 dark:border-accent text-subtitle'}`}>
                                        {isCompleted ? <CheckCircleIcon size={20} /> : step.icon}
                                    </button>
                                    <span className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${isActive ? 'text-primary' : 'text-subtitle'}`}>{step.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-xl overflow-hidden min-h-[450px] flex flex-col">
                    <div className="flex-1 p-8 md:p-10">
                        {/* Step 1: Customer Details */}
                        {currentStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Personal Details</h2><p className="text-subtitle text-sm">Customer contact information</p></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <Field label="Title" required error={errors.title}><Select options={TITLE_OPTIONS} value={formData.title} onChange={(val) => updateField('title', val as string)} placeholder="Select title" /></Field>
                                    <div className="hidden md:block" />
                                    <Field label="First Name" required error={errors.firstname}><Input value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} placeholder="e.g. John" /></Field>
                                    <Field label="Last Name" required error={errors.lastname}><Input value={formData.lastname} onChange={(e) => updateField('lastname', e.target.value)} placeholder="e.g. Doe" /></Field>
                                    <Field label="Email Address" required error={errors.email}><Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="e.g. john.doe@example.com" /></Field>
                                    <Field label="Mobile Number" required error={errors.number}>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 font-bold text-primary z-10">+61</span>
                                            <Input value={formData.number} onChange={(e) => updateField('number', e.target.value)} placeholder="400 000 000" className="pl-12" />
                                        </div>
                                    </Field>
                                    <Field label="Date of Birth" required error={errors.dob}><DatePicker value={formData.dob} onChange={(date) => updateField('dob', date?.toISOString().split('T')[0])} placeholder="Select DOB" maxDate={eighteenYearsAgo} /></Field>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Service Address */}
                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Service Address</h2><p className="text-subtitle text-sm">Connection location and property type</p></div>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4"><div className="p-3 rounded-full bg-primary/10 text-primary"><ZapIcon size={24} /></div><div><h3 className="font-bold text-title">VPP Participation</h3><p className="text-xs text-subtitle">Enable Virtual Power Plant</p></div></div>
                                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={!!formData.isVpp} onChange={(e) => updateField('isVpp', e.target.checked ? 1 : 0)} /><div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div></label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <Field label="Customer Type"><Select options={[{ value: 'RESIDENTIAL', label: 'Residential' }, { value: 'BUSINESS', label: 'Business' }]} value={formData.customerType} onChange={(val) => updateField('customerType', val as string)} /></Field>
                                    <Field label="Ownership Status"><Select options={[{ value: '0', label: 'Owns' }, { value: '1', label: 'Rents' }]} value={formData.ownership_status.toString()} onChange={(val) => updateField('ownership_status', parseInt(val as string))} /></Field>
                                </div>
                                <Field label="Search Address" required error={errors.address}><LocationAutocomplete onSelect={handleAddressSelect} value={formData.address} onChange={(val) => updateField('address', val)} /></Field>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
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
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Identity Verification</h2><p className="text-subtitle text-sm">Security and identification</p></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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

                        {/* Step 4: Energy Plan */}
                        {currentStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                                <div className="space-y-1"><h2 className="text-2xl font-bold text-title">Energy Plan</h2><p className="text-subtitle text-sm">Final details and rates</p></div>
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-end gap-3"><div className="flex-1"><Field label="NMI" required error={errors.nmi}><Input value={formData.nmi} onChange={(e) => updateField('nmi', e.target.value)} placeholder="10 or 11 digit NMI" /></Field></div><Button variant="outline" onClick={handleNmiLookup} isLoading={isNmiLookupLoading} className="h-10" leftIcon={!isNmiLookupLoading && <SearchIcon size={16} />}>Lookup NMI</Button></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label="Tariff Code" required error={errors.tariffcode}>
                                            <Select options={tariffOptions} value={formData.tariffcode} onChange={(val) => updateField('tariffcode', val as string)} placeholder="Lookup NMI to select tariff" disabled={true} />
                                        </Field>
                                        <Field label="Discount (%)">
                                            <Select options={DISCOUNT_OPTIONS} value={formData.discount.toString()} onChange={(val) => updateField('discount', parseFloat(val as string) || 0)} />
                                        </Field>
                                    </div>

                                    {formData.tariffcode && selectedRatePlan && (
                                        <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                                            <div className="flex items-center justify-between border-b border-border pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><Settings2Icon size={24} /></div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Selected Tariff</p>
                                                        <h3 className="font-bold text-lg text-title">{selectedRatePlan.codes} - {selectedRatePlan.tariff}</h3>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><InfoIcon size={12} />GST Inclusive</div>
                                            </div>
                                            <div className="flex flex-wrap gap-6">
                                                <div className="flex-1 min-w-[280px] space-y-4">
                                                    <div className="flex items-center gap-2 text-blue-500 font-bold uppercase text-[10px] tracking-widest px-1"><Settings2Icon size={14} />Energy Rates</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {[
                                                            { label: 'Anytime', value: activeOffer.anytime, type: 'anytime' },
                                                            { label: 'Peak', value: activeOffer.peak, type: 'peak' },
                                                            { label: 'Shoulder', value: activeOffer.shoulder, type: 'shoulder' },
                                                            { label: 'Off-Peak', value: activeOffer.offPeak, type: 'offPeak' },
                                                            ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount }))
                                                        ].filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0).map((rate, idx) => {
                                                            const isAnytime = rate.type === 'anytime';
                                                            const numericValue = parseFloat(String(rate.value || 0));
                                                            const shouldApplyDiscount = rate.type === 'dynamic' ? !!(rate as any).applyDiscount : true;
                                                            const discountedPrice = shouldApplyDiscount ? calculateDiscountedRate(numericValue, formData.discount) : numericValue;
                                                            // const unit = rate.type === 'dynamic' ? (rate.unitId ? unitsMap[rate.unitId] : 'kWh') : formatUnit(rate.type, 'kWh');
                                                            return (
                                                                <div key={idx} className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all group", isAnytime ? "bg-orange-50/50 border-orange-100 hover:border-orange-300" : "bg-blue-50/50 border-blue-100 hover:border-blue-300")}>
                                                                    <div className={cn("text-xl font-black", isAnytime ? "text-orange-600" : "text-blue-600")}>${discountedPrice.toFixed(4)}</div>
                                                                    <div className={cn("text-[9px] font-black uppercase tracking-widest opacity-70 mb-1", isAnytime ? "text-orange-700" : "text-blue-700")}>{isAnytime ? 'Discounted Usage Rate' : `${rate.label} Rate`}</div>
                                                                    {shouldApplyDiscount && <div className="text-[10px] font-medium text-subtitle line-through opacity-50">${numericValue.toFixed(4)} Standard</div>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-[280px] space-y-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-purple-500 font-bold uppercase text-[10px] tracking-widest px-1"><PlugIcon size={14} />Supply Charges</div>
                                                        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex items-center justify-between group hover:border-purple-300 transition-all">
                                                            <div className="space-y-0.5"><p className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Daily Supply</p><p className="text-xs text-subtitle font-medium">Standard Connection Charge</p></div>
                                                            <div className="text-right"><p className="text-lg font-black text-purple-600">${parseFloat(String(activeOffer.supplyCharge || '0')).toFixed(4)}</p><p className="text-[9px] font-bold text-subtitle uppercase tracking-tighter">Per Day</p></div>
                                                        </div>
                                                    </div>
                                                    {((activeOffer.demand ?? 0) > 0 || (activeOffer.demandOp ?? 0) > 0 || (activeOffer.demandP ?? 0) > 0) && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-[10px] tracking-widest px-1"><ActivityIcon size={14} />Demand Charges</div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {[{ label: 'Demand (OP)', value: activeOffer.demandOp }, { label: 'Demand (P)', value: activeOffer.demandP }, { label: 'Demand (S)', value: activeOffer.demandS }].filter(d => (d.value || 0) > 0).map((d, id) => (
                                                                    <div key={id} className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-center">
                                                                        <p className="text-lg font-black text-rose-600">${parseFloat(String(d.value)).toFixed(4)}</p><p className="text-[9px] font-bold text-rose-700 uppercase tracking-widest">{d.label}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {((activeOffer.fit ?? 0) > 0 || (activeOffer.fitPeak ?? 0) > 0 || (activeOffer.fitCritical ?? 0) > 0) && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest px-1"><SunIcon size={14} />Solar FIT</div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {[{ label: 'Base FIT', value: activeOffer.fit }, { label: 'Premium FIT', value: activeOffer.fitPeak }, { label: 'Critical Event FIT', value: activeOffer.fitCritical }].filter(f => (f.value || 0) > 0).map((f, id) => (
                                                                    <div key={id} className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex flex-col items-center justify-center">
                                                                        <p className="text-lg font-black text-green-600">${parseFloat(String(f.value)).toFixed(4)}</p><p className="text-[9px] font-bold text-green-700 uppercase tracking-widest">{f.label}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(activeOffer.vppOrcharge || 0) > 0 && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-amber-500 font-bold uppercase text-[10px] tracking-widest px-1"><ActivityIcon size={14} />VPP Orchestration Charges</div>
                                                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
                                                                <div className="space-y-0.5"><p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Orchestration</p><p className="text-xs text-subtitle font-medium">Virtual Power Plant Maintenance</p></div>
                                                                <p className="text-lg font-black text-amber-600">${parseFloat(String(activeOffer.vppOrcharge)).toFixed(4)}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Confirmation */}
                        {currentStep === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-title">Review & Confirm</h2>
                                    <p className="text-subtitle text-sm">Please verify all information before submitting the enrollment</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    {/* Personal Info Summary */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <UserIcon size={14} />
                                            Customer Details
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <SummaryItem icon={UserIcon} label="Full Name" value={`${formData.title} ${formData.firstname} ${formData.lastname}`} />
                                            <SummaryItem icon={MailIcon} label="Email Address" value={formData.email} />
                                            <SummaryItem icon={PhoneIcon} label="Mobile Number" value={`+61 ${formData.number}`} />
                                            <SummaryItem icon={CalendarIcon} label="Date of Birth" value={formData.dob} />
                                        </div>
                                    </div>

                                    {/* Service Address Summary */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <HomeIcon size={14} />
                                            Service Property
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <SummaryItem icon={MapPinIcon} label="Connection Address" value={formData.address} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <SummaryItem icon={InfoIcon} label="Ownership" value={formData.ownership_status === 0 ? 'Owns' : 'Rents'} />
                                                <SummaryItem icon={ZapIcon} label="VPP Status" value={formData.isVpp ? 'Enrolled' : 'Not Enrolled'} />
                                            </div>
                                            <SummaryItem icon={FileTextIcon} label="Property Type" value={formData.customerType} />
                                        </div>
                                    </div>

                                    {/* Identity Summary */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <IdCardIcon size={14} />
                                            Identity Verification
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <SummaryItem icon={IdCardIcon} label="ID Type" value={ID_TYPE_OPTIONS.find(o => o.value === formData.idType.toString())?.label || 'Driver License'} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <SummaryItem icon={InfoIcon} label="ID Number" value={formData.idnumber} />
                                                {formData.idType === 0 && <SummaryItem icon={IdCardIcon} label="Card No" value={formData.licenseCardNumber} />}
                                                {formData.idType === 1 && <SummaryItem icon={IdCardIcon} label="Card Type" value={MEDICARE_CARD_TYPE_OPTIONS.find(o => o.value === formData.medicareCardType.toString())?.label} />}
                                                <SummaryItem icon={MapPinIcon} label="Location" value={formData.idType === 2 ? formData.idcountry : formData.idstate} />
                                                <SummaryItem icon={CalendarIcon} label="Expiry" value={formData.idexpiary} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plan Summary */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            <ZapIcon size={14} />
                                            Energy Plan
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            <SummaryItem icon={FileTextIcon} label="NMI" value={formData.nmi} />
                                            <SummaryItem icon={Settings2Icon} label="Selected Tariff" value={selectedRatePlan?.tariff} />
                                            <SummaryItem icon={InfoIcon} label="Branch Discount" value={`${formData.discount}%`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-primary/5 border border-dashed border-primary/20 rounded-2xl flex items-start gap-4">
                                    <div className="mt-1 text-primary"><InfoIcon size={20} /></div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-title">Almost Done!</p>
                                        <p className="text-sm text-subtitle">By clicking "Finish & Submit", you confirm that the information above is correct and the customer has consented to this enrollment.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-accent/5 border-t border-border flex items-center justify-between"><Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} leftIcon={<ChevronLeftIcon size={18} />}>Back</Button><div className="text-xs font-bold text-subtitle uppercase tracking-widest">Step {currentStep} of {STEPS.length}</div>{currentStep === STEPS.length ? (<Button onClick={handleSubmit} isLoading={isSubmitting} className="px-8 shadow-lg shadow-primary/20" leftIcon={<CheckCircleIcon size={18} />}>Finish & Submit</Button>) : (<Button onClick={handleNext} className="px-10">Continue</Button>)}</div>
                </div>
            </div>

            <Modal isOpen={isNmiModalOpen} onClose={() => setIsNmiModalOpen(false)} title="Select NMI / Service Address" size="lg">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <p className="text-sm text-subtitle">Multiple NMIs found for this address. Please select the correct one:</p>
                    <div className="grid grid-cols-1 gap-3">
                        {nmiOptions.map((opt: any, idx: number) => (
                            <button key={idx} onClick={() => handleSelectNmi(opt)} className="flex items-start justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{(idx + 1).toString().padStart(2, '0')}</div>
                                        <span className="font-bold text-title group-hover:text-primary transition-colors">NMI: {opt.nmi}</span>
                                    </div>
                                    <p className="text-xs text-subtitle font-medium pl-10">
                                        {typeof opt.address === 'string' ? opt.address :
                                            (opt.fullAddress || `${(opt.flatOrUnitNumber || opt.address?.flatOrUnitNumber) ? `Unit ${opt.flatOrUnitNumber || opt.address?.flatOrUnitNumber}, ` : ''}${opt.houseNumber || opt.address?.houseNumber || ''} ${opt.streetName || opt.address?.streetName || ''} ${opt.suburb || opt.address?.suburb || ''} ${opt.state || opt.address?.state || ''} ${opt.postcode || opt.address?.postcode || ''}`.trim())}
                                    </p>
                                </div>
                                <div className="px-3 py-1 bg-gray-100 dark:bg-accent rounded-full text-[10px] font-bold uppercase tracking-wider text-subtitle group-hover:bg-primary group-hover:text-white transition-all">Select</div>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isTariffModalOpen} onClose={() => setIsTariffModalOpen(false)} title="Select Energy Plan" size="md">
                <div className="space-y-4">
                    <p className="text-sm text-subtitle">Multiple valid tariffs found for NMI <span className="font-bold text-title">{selectedNmiResult?.nmi}</span>. Please select the correct one:</p>
                    <div className="grid grid-cols-1 gap-3">
                        {availableTariffs.map((tCode, idx) => {
                            const rp = ratePlans.find((r: any) => r.codes === tCode);
                            return (
                                <button key={idx} onClick={() => handleSelectTariff(tCode)} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-title group-hover:text-primary transition-colors">{tCode}</span>
                                        </div>
                                        <p className="text-xs text-subtitle font-medium">
                                            {rp?.tariff || 'Standard Tariff'}
                                        </p>
                                    </div>
                                    <div className="px-3 py-1 bg-gray-100 dark:bg-accent rounded-full text-[10px] font-bold uppercase tracking-wider text-subtitle group-hover:bg-primary group-hover:text-white transition-all">Select</div>
                                </button>
                            );
                        })}
                    </div>
                    <Button variant="ghost" fullWidth onClick={() => { setIsTariffModalOpen(false); setIsNmiModalOpen(true); }} className="mt-4">Back to NMI Selection</Button>
                </div>
            </Modal>
        </div>
    );
}
