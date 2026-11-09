import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    CheckCircleIcon,
    AlertCircleIcon,
    BuildingIcon,
    ZapIcon,
    RefreshCwIcon,
    PhoneIcon,
    MailIcon
} from '@/components/icons';
import { TITLE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { sanitizePhoneInput, formatAustralianPhone, validatePhoneNumber } from '@/lib/phone';
import { BASE_API_URL } from '@/lib/apollo';
import LocationAutocomplete from '@/pages/LocationAutocomplete';

interface CompanyInfo {
    name: string;
    code: string;
    portalName: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    abn?: string;
    notes?: string;
    linkCode?: string;
}

export const CompanyEnrollmentPage = () => {
    const { code } = useParams<{ code: string }>();

    const [loadingCompany, setLoadingCompany] = useState(true);
    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [companyError, setCompanyError] = useState<string | null>(null);

    // Form fields
    const [formData, setFormData] = useState({
        title: 'Mr',
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        streetAddress: '',
        suburb: '',
        state: 'NSW',
        postcode: '',
        nmi: '',
        propertyType: '0', // 0 = Residential, 1 = Commercial
        agreed: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submittedUid, setSubmittedUid] = useState<string | null>(null);

    // Fetch company info
    useEffect(() => {
        if (!code) {
            setCompanyError('No referral code provided in the URL.');
            setLoadingCompany(false);
            return;
        }

        const fetchCompany = async () => {
            try {
                setLoadingCompany(true);
                const apiBase = (BASE_API_URL || 'http://localhost:4000').replace(/\/graphql\/?$/, '').replace(/\/+$/, '');
                const token = import.meta.env.VITE_WEB_TOKEN || 'GSYNC_WEB_v1_0tuu903stcif2kzsx7t8fyy';
                const res = await axios.get(`${apiBase}/web/company-ref/${encodeURIComponent(code)}`, {
                    headers: {
                        'X-Web-Token': token
                    }
                });
                if (res.data?.success && res.data?.data) {
                    setCompany(res.data.data);
                } else {
                    setCompanyError(res.data?.message || 'Referral link is invalid or inactive.');
                }
            } catch (err: any) {
                // If API endpoint is unreachable or 404, fallback to friendly message
                const msg = err.response?.data?.message || 'Referral link is invalid, expired, or deactivated.';
                setCompanyError(msg);
            } finally {
                setLoadingCompany(false);
            }
        };

        fetchCompany();
    }, [code]);

    const handleMobileChange = (raw: string) => {
        const sanitized = sanitizePhoneInput(raw);
        const formatted = formatAustralianPhone(sanitized);
        setFormData(prev => ({ ...prev, mobile: formatted }));
        if (errors.mobile || sanitized.length >= 8) {
            const err = validatePhoneNumber(formatted, true);
            setErrors(prev => ({ ...prev, mobile: err || '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required *';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required *';

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required *';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        const phoneErr = validatePhoneNumber(formData.mobile, true);
        if (phoneErr) {
            newErrors.mobile = phoneErr;
        }

        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required *';
        if (!formData.suburb.trim()) newErrors.suburb = 'Suburb is required *';
        if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required *';

        const cleanNmi = formData.nmi.replace(/\s+/g, '');
        if (!cleanNmi) {
            newErrors.nmi = 'NMI is required *';
        } else if (cleanNmi.length < 10 || cleanNmi.length > 11) {
            newErrors.nmi = 'NMI must be 10 or 11 digits';
        }

        if (!formData.agreed) {
            newErrors.agreed = 'You must accept the terms to submit your application';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !company) return;

        setSubmitting(true);
        try {
            const fullAddress = `${formData.streetAddress.trim()}, ${formData.suburb.trim()} ${formData.state} ${formData.postcode.trim()}`;
            const cleanPhone = `+61${formData.mobile.replace(/\D/g, '').replace(/^0/, '')}`;

            const payload = {
                title: formData.title,
                firstname: formData.firstname.trim(),
                lastname: formData.lastname.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: cleanPhone,
                mobile: cleanPhone,
                number: cleanPhone,
                nmi: formData.nmi.trim().toUpperCase(),
                address: {
                    street: formData.streetAddress.trim(),
                    suburb: formData.suburb.trim(),
                    state: formData.state,
                    postcode: formData.postcode.trim(),
                    address: fullAddress,
                    fullAddress: fullAddress
                },
                fullAddress: fullAddress,
                property_type: parseInt(formData.propertyType, 10),
                isVpp: 0,
                // Portal Tagging
                portalname: company.portalName || company.name,
                portalName: company.portalName || company.name,
                companyName: company.name,
                company_name: company.name,
                linkCode: code,
                createdBy: {
                    company_name: company.name,
                    company_code: company.code,
                    link_code: code,
                    source: 'referral_portal'
                }
            };

            const apiBase = (BASE_API_URL || 'http://localhost:4000').replace(/\/graphql\/?$/, '').replace(/\/+$/, '');
            const token = import.meta.env.VITE_WEB_TOKEN || 'GSYNC_WEB_v1_0tuu903stcif2kzsx7t8fyy';
            const response = await axios.post(`${apiBase}/web/create-customer`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Web-Token': token
                }
            });

            if (response.data?.success) {
                setSubmittedUid(response.data.uid || 'SUBMITTED');
            } else {
                setErrors({ submit: response.data?.message || 'Submission failed. Please try again.' });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to submit application. Please check your connection and try again.';
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    // Loading State
    if (loadingCompany) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-3 text-muted-foreground bg-card p-6 rounded-xl border border-border shadow-sm">
                    <RefreshCwIcon size={20} className="animate-spin text-primary" />
                    <span className="text-sm font-medium">Loading enrollment portal...</span>
                </div>
            </div>
        );
    }

    // Invalid Link / Error State
    if (companyError || !company) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-4 shadow-md">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <AlertCircleIcon size={30} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Referral Link Unavailable</h2>
                    <p className="text-sm text-muted-foreground">
                        {companyError || 'The referral link you entered is invalid or has expired.'}
                    </p>
                    <div className="pt-2">
                        <Link to="/login" className="inline-block text-xs font-semibold text-primary hover:underline">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success Submission Screen
    if (submittedUid) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-lg w-full bg-card rounded-2xl border border-border p-8 text-center space-y-5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircleIcon size={36} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Enrollment Received!</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Thank you, <span className="font-semibold text-foreground">{formData.firstname}</span>. Your energy customer application has been successfully submitted to <span className="font-semibold text-foreground">{company.name}</span>.
                        </p>
                    </div>

                    <div className="bg-muted/40 p-4 rounded-xl text-left text-xs space-y-2 border border-border">
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Reference UID:</span>
                            <span className="font-mono font-medium text-foreground">{submittedUid}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Service NMI:</span>
                            <span className="font-mono font-medium text-foreground">{formData.nmi}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Company Partner:</span>
                            <span className="font-semibold text-foreground">{company.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">Pending Customer Approval</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Our team will verify your supply details and email your offer contract shortly.
                    </p>

                    <Button
                        onClick={() => {
                            setSubmittedUid(null);
                            setFormData({
                                title: 'Mr',
                                firstname: '',
                                lastname: '',
                                email: '',
                                mobile: '',
                                streetAddress: '',
                                suburb: '',
                                state: 'NSW',
                                postcode: '',
                                nmi: '',
                                propertyType: '0',
                                agreed: false
                            });
                        }}
                        variant="outline"
                        className="w-full"
                    >
                        Submit Another Application
                    </Button>
                </div>
            </div>
        );
    }

    // Main Enrollment Form Screen
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Branding Banner */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                            <BuildingIcon size={24} />
                        </div>
                        <div>
                            <span className="text-xs font-semibold tracking-wider uppercase text-primary">Customer Onboarding Portal</span>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{company.name}</h1>
                        </div>
                    </div>

                    <div className="flex flex-col text-xs text-muted-foreground sm:text-right">
                        {company.contactPerson && <span className="font-medium text-foreground">{company.contactPerson}</span>}
                        {company.email && (
                            <span className="flex items-center sm:justify-end gap-1">
                                <MailIcon size={12} /> {company.email}
                            </span>
                        )}
                        {company.phone && (
                            <span className="flex items-center sm:justify-end gap-1">
                                <PhoneIcon size={12} /> {company.phone}
                            </span>
                        )}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.submit && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircleIcon size={16} className="shrink-0" />
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        {/* Customer Information */}
                        <div className="space-y-4">
                            <div className="border-b border-border pb-2">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                    1. Customer Information
                                </h2>
                                <p className="text-xs text-muted-foreground">Enter primary account holder details.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                <div className="sm:col-span-3 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">Title</label>
                                    <Select
                                        options={TITLE_OPTIONS}
                                        value={formData.title}
                                        onChange={(val) => setFormData({ ...formData, title: val as string })}
                                    />
                                </div>
                                <div className="sm:col-span-4 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="John"
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        className={cn(errors.firstname && "border-red-500 ring-1 ring-red-500")}
                                    />
                                    {errors.firstname && <p className="text-[11px] text-red-500">{errors.firstname}</p>}
                                </div>
                                <div className="sm:col-span-5 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Doe"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        className={cn(errors.lastname && "border-red-500 ring-1 ring-red-500")}
                                    />
                                    {errors.lastname && <p className="text-[11px] text-red-500">{errors.lastname}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={cn(errors.email && "border-red-500 ring-1 ring-red-500")}
                                    />
                                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                        Mobile Number <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <Input
                                        placeholder="0412 345 678"
                                        value={formData.mobile}
                                        onChange={(e) => handleMobileChange(e.target.value)}
                                        onBlur={() => {
                                            const err = validatePhoneNumber(formData.mobile, true);
                                            if (err) setErrors(prev => ({ ...prev, mobile: err }));
                                        }}
                                        className={cn(errors.mobile && "border-red-500 ring-1 ring-red-500")}
                                    />
                                    {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile}</p>}
                                    <p className="text-[10px] text-muted-foreground">Australian mobile (04xx xxx xxx)</p>
                                </div>
                            </div>
                        </div>

                        {/* Electricity & Supply Address */}
                        <div className="space-y-4 pt-4">
                            <div className="border-b border-border pb-2">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                    2. Electricity Supply Details
                                </h2>
                                <p className="text-xs text-muted-foreground">National Meter Identifier (NMI) and service address.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                        <ZapIcon size={14} className="text-amber-500" />
                                        NMI (10 or 11 digits) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. 4102000000"
                                        value={formData.nmi}
                                        onChange={(e) => setFormData({ ...formData, nmi: e.target.value.toUpperCase() })}
                                        className={cn("font-mono", errors.nmi && "border-red-500 ring-1 ring-red-500")}
                                        maxLength={11}
                                    />
                                    {errors.nmi ? (
                                        <p className="text-[11px] text-red-500">{errors.nmi}</p>
                                    ) : (
                                        <p className="text-[10px] text-muted-foreground">Located on the first or second page of your power bill.</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground">Property Type</label>
                                    <Select
                                        options={[
                                            { value: '0', label: 'Residential' },
                                            { value: '1', label: 'Commercial / Business' }
                                        ]}
                                        value={formData.propertyType}
                                        onChange={(val) => setFormData({ ...formData, propertyType: val as string })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <LocationAutocomplete
                                    placeholder="Start typing address (e.g. 123 Example Street)..."
                                    value={formData.streetAddress}
                                    onChange={(val) => {
                                        setFormData(prev => ({ ...prev, streetAddress: val }));
                                        if (errors.streetAddress) {
                                            setErrors(prev => ({ ...prev, streetAddress: '' }));
                                        }
                                    }}
                                    onSelect={(place) => {
                                        const unitNumber = place.unitNumber || '';
                                        let streetNumber = place.streetNumber || place.houseNumber || '';
                                        let houseNumberSuffix = '';

                                        const suffixMatch = streetNumber.match(/^(\d+)\s*([a-zA-Z])$/);
                                        if (suffixMatch) {
                                            streetNumber = suffixMatch[1];
                                            houseNumberSuffix = suffixMatch[2].toUpperCase();
                                        }

                                        const streetCombined = [streetNumber + houseNumberSuffix, place.streetName, place.streetType].filter(Boolean).join(' ');
                                        const fullStreet = unitNumber ? `${unitNumber}/${streetCombined}` : (streetCombined || place.address);

                                        const validStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
                                        const normState = (place.state || '').toUpperCase();
                                        const matchedState = validStates.find(s => s === normState);

                                        setFormData(prev => ({
                                            ...prev,
                                            streetAddress: fullStreet || place.address,
                                            suburb: place.suburb || prev.suburb,
                                            state: matchedState || prev.state,
                                            postcode: place.postcode || prev.postcode
                                        }));

                                        setErrors(prev => {
                                            const updated = { ...prev };
                                            delete updated.streetAddress;
                                            if (place.suburb) delete updated.suburb;
                                            if (place.postcode) delete updated.postcode;
                                            return updated;
                                        });
                                    }}
                                    error={errors.streetAddress}
                                    zIndexClass="z-[9999]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                <div className="sm:col-span-6 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">
                                        Suburb <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Sydney"
                                        value={formData.suburb}
                                        onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                        className={cn(errors.suburb && "border-red-500 ring-1 ring-red-500")}
                                    />
                                    {errors.suburb && <p className="text-[11px] text-red-500">{errors.suburb}</p>}
                                </div>

                                <div className="sm:col-span-3 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">State</label>
                                    <Select
                                        options={STATE_OPTIONS}
                                        value={formData.state}
                                        onChange={(val) => setFormData({ ...formData, state: val as string })}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-1">
                                    <label className="text-xs font-semibold text-foreground">
                                        Postcode <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="2000"
                                        value={formData.postcode}
                                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                        className={cn(errors.postcode && "border-red-500 ring-1 ring-red-500")}
                                        maxLength={4}
                                    />
                                    {errors.postcode && <p className="text-[11px] text-red-500">{errors.postcode}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Consent & Submit */}
                        <div className="pt-4 border-t border-border space-y-4">
                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="agreeConsent"
                                    checked={formData.agreed}
                                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                    className="mt-0.5 rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="agreeConsent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                                    I confirm that I am the account holder or authorized representative for the electricity supply address above. I consent to enrolling into energy services with <strong className="text-foreground">{company.name}</strong> and agree to receive offer notifications.
                                </label>
                            </div>
                            {errors.agreed && <p className="text-[11px] text-red-500">{errors.agreed}</p>}

                            <Button
                                type="submit"
                                className="w-full h-11 text-sm font-semibold shadow-md"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCwIcon size={16} className="animate-spin" />
                                        Submitting Application...
                                    </span>
                                ) : (
                                    'Submit Energy Application'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

