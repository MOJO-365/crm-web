import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    CheckCircleIcon,
    AlertCircleIcon,
    ZapIcon,
    RefreshCwIcon,
    PhoneIcon,
    MailIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@/components/icons';
import { STATE_OPTIONS } from '@/lib/constants';
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

// Custom Handshake / Referral Partner Icon
const HandshakeIcon = ({ size = 22, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L13 12" />
        <path d="m14 14 1.5 1.5a1 1 0 0 0 1.4 0l2.8-2.8a1 1 0 0 0 0-1.4L18 9.6a1 1 0 0 0-1.4 0L15 11" />
        <path d="M7 15l-3-3a1 1 0 0 1 0-1.4l5.3-5.3a1 1 0 0 1 1.4 0L13 7.6a1 1 0 0 1 0 1.4L10 12" />
        <path d="m2 14 6 6" />
        <path d="m22 10-6-6" />
    </svg>
);

// Green circle with checkmark
const VerifiedCheckIcon = ({ size = 22, className }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export const CompanyEnrollmentPage = () => {
    const { code } = useParams<{ code: string }>();

    const [loadingCompany, setLoadingCompany] = useState(true);
    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [companyError, setCompanyError] = useState<string | null>(null);

    // Multi-step form state (1 = Personal Info, 2 = Supply & Address)
    const [step, setStep] = useState<1 | 2>(1);

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

    // Step 1 Validation (Personal details)
    const validateStep1 = () => {
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 2 Validation (Supply & Address details)
    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        const cleanNmi = formData.nmi.replace(/\s+/g, '');
        if (!cleanNmi) {
            newErrors.nmi = 'NMI is required *';
        } else if (cleanNmi.length < 10 || cleanNmi.length > 11) {
            newErrors.nmi = 'NMI must be 10 or 11 digits';
        }

        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required *';
        if (!formData.suburb.trim()) newErrors.suburb = 'Suburb is required *';
        if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required *';

        if (!formData.agreed) {
            newErrors.agreed = 'You must accept the terms to submit your application';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
            // Smoothly scroll down to the step 2 form section
            const el = document.getElementById('application-form-section');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) {
            setStep(1);
            return;
        }
        if (!validateStep2() || !company) return;

        setSubmitting(true);
        try {
            const fullAddress = `${formData.streetAddress.trim()}, ${formData.suburb.trim()} ${formData.state} ${formData.postcode.trim()}`;
            const cleanPhone = `+61${formData.mobile.replace(/\D/g, '').replace(/^0/, '')}`;

            const payload = {
                title: formData.title || 'Mr',
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
            <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-3 text-muted-foreground bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <RefreshCwIcon size={20} className="animate-spin text-emerald-600" />
                    <span className="text-sm font-medium">Loading Solar Soak enrollment portal...</span>
                </div>
            </div>
        );
    }

    // Invalid Link / Error State
    if (companyError || !company) {
        return (
            <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-card rounded-3xl border border-border p-8 text-center space-y-4 shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <AlertCircleIcon size={30} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Referral Link Unavailable</h2>
                    <p className="text-sm text-muted-foreground">
                        {companyError || 'The referral link you entered is invalid or has expired.'}
                    </p>
                    <div className="pt-2">
                        <Link to="/login" className="inline-block text-xs font-semibold text-emerald-600 hover:underline">
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
            <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-lg w-full bg-card rounded-3xl border border-border p-8 text-center space-y-5 shadow-md animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircleIcon size={36} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Solar Soak Plan Application</span>
                        <h2 className="text-2xl font-bold text-foreground mt-1">Application Received!</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Thank you, <span className="font-semibold text-foreground">{formData.firstname}</span>. Your electricity switch request via <span className="font-semibold text-foreground">{company.name}</span> has been successfully received.
                        </p>
                    </div>

                    <div className="bg-muted/40 p-5 rounded-2xl text-left text-xs space-y-2.5 border border-border">
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Reference UID:</span>
                            <span className="font-mono font-medium text-foreground">{submittedUid}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Selected Plan:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">GEE Energy Solar Soak Plan</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Service NMI:</span>
                            <span className="font-mono font-medium text-foreground">{formData.nmi}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Referral Partner:</span>
                            <span className="font-semibold text-foreground">{company.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Application Status:</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">Pending Customer Approval</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Our energy onboarding team will confirm your supply meter details and send your Solar Soak welcome pack to <span className="font-medium text-foreground">{formData.email}</span>.
                    </p>

                    <Button
                        onClick={() => {
                            setSubmittedUid(null);
                            setStep(1);
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
                        className="w-full rounded-xl"
                    >
                        Submit Another Application
                    </Button>
                </div>
            </div>
        );
    }

    // Main Partner Referral Enrollment Screen
    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 py-8 px-4 sm:px-6 flex justify-center">
            <div className="w-full max-w-[620px] bg-card border border-border/80 rounded-[28px] p-6 sm:p-9 shadow-sm space-y-6">

                {/* 1. Header: Brand + Partner Referral Pill */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                            GEE Energy
                        </h2>
                        <p className="text-xs text-muted-foreground font-normal">
                            Smart electricity solutions
                        </p>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                        Partner referral
                    </div>
                </div>

                {/* 2. Referral Partner Verified Card */}
                <div className="border border-border/80 rounded-2xl p-4 bg-card/60 flex items-center justify-between gap-3.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center shrink-0">
                            <HandshakeIcon size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                                YOU HAVE BEEN REFERRED BY
                            </span>
                            <span className="text-base sm:text-lg font-bold text-foreground leading-tight">
                                {company.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground mt-0.5">
                                Official GEE Energy referral partner
                            </span>
                        </div>
                    </div>

                    <div className="text-emerald-600 dark:text-emerald-400 shrink-0">
                        <VerifiedCheckIcon size={22} />
                    </div>
                </div>

                {/* 3. Hero Headline: Move to Solar Soak Plan */}
                <div className="space-y-2 pt-1">
                    <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground leading-tight">
                        Move to Solar Soak Plan
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Discover the GEE Energy Solar Soak Plan and complete your electricity application online.
                    </p>
                </div>

                {/* 4. Highlight Stats Cards (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Card 1: $300 Welcome credit */}
                    <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                        <span className="text-2xl font-bold text-foreground tracking-tight">$300</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Welcome credit*</span>
                    </div>

                    {/* Card 2: $0 Exit fees */}
                    <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                        <span className="text-2xl font-bold text-foreground tracking-tight">$0</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Exit fees</span>
                    </div>

                    {/* Card 3: 30¢ Import rate */}
                    <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                        <span className="text-2xl font-bold text-foreground tracking-tight">30¢</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Import rate / kWh*</span>
                    </div>

                    {/* Card 4: Up to 30¢ Battery export FiT */}
                    <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                        <span className="text-2xl font-bold text-foreground tracking-tight">Up to 30¢</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Battery export FiT / kWh*</span>
                    </div>
                </div>

                {/* 5. Value Proposition Bullets */}
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                        <VerifiedCheckIcon size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Flexible electricity plan</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                        <VerifiedCheckIcon size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Battery-friendly feed-in tariffs</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                        <VerifiedCheckIcon size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Simple online application</span>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-border/70 my-2" />

                {/* 6. Form Section */}
                <div id="application-form-section" className="space-y-4 pt-1">
                    {/* Form Section Header with Step Indicator */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                            Your electricity application
                        </h3>
                        <span className="text-xs font-semibold text-muted-foreground font-mono">
                            Step {step} of 2
                        </span>
                    </div>

                    {errors.submit && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertCircleIcon size={16} className="shrink-0" />
                            <span>{errors.submit}</span>
                        </div>
                    )}

                    {/* Step 1: Personal Contact Information */}
                    {step === 1 && (
                        <form onSubmit={handleContinue} className="space-y-4 animate-in fade-in duration-150">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-foreground">
                                        First name *
                                    </label>
                                    <Input
                                        placeholder="John"
                                        value={formData.firstname}
                                        onChange={(e) => {
                                            setFormData({ ...formData, firstname: e.target.value });
                                            if (errors.firstname) setErrors(prev => ({ ...prev, firstname: '' }));
                                        }}
                                        className={cn(
                                            "h-11 rounded-xl bg-background border-border/90 text-sm",
                                            errors.firstname && "border-red-500 ring-1 ring-red-500"
                                        )}
                                    />
                                    {errors.firstname && <p className="text-[11px] text-red-500">{errors.firstname}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-foreground">
                                        Last name *
                                    </label>
                                    <Input
                                        placeholder="Doe"
                                        value={formData.lastname}
                                        onChange={(e) => {
                                            setFormData({ ...formData, lastname: e.target.value });
                                            if (errors.lastname) setErrors(prev => ({ ...prev, lastname: '' }));
                                        }}
                                        className={cn(
                                            "h-11 rounded-xl bg-background border-border/90 text-sm",
                                            errors.lastname && "border-red-500 ring-1 ring-red-500"
                                        )}
                                    />
                                    {errors.lastname && <p className="text-[11px] text-red-500">{errors.lastname}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground">
                                    Mobile number *
                                </label>
                                <Input
                                    placeholder="0412 345 678"
                                    value={formData.mobile}
                                    onChange={(e) => handleMobileChange(e.target.value)}
                                    onBlur={() => {
                                        const err = validatePhoneNumber(formData.mobile, true);
                                        if (err) setErrors(prev => ({ ...prev, mobile: err }));
                                    }}
                                    className={cn(
                                        "h-11 rounded-xl bg-background border-border/90 text-sm",
                                        errors.mobile && "border-red-500 ring-1 ring-red-500"
                                    )}
                                />
                                {errors.mobile && <p className="text-[11px] text-red-500">{errors.mobile}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground">
                                    Email address *
                                </label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    className={cn(
                                        "h-11 rounded-xl bg-background border-border/90 text-sm",
                                        errors.email && "border-red-500 ring-1 ring-red-500"
                                    )}
                                />
                                {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-sm font-semibold rounded-xl mt-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
                            >
                                <span>Continue</span>
                                <ArrowRightIcon size={16} />
                            </Button>
                        </form>
                    )}

                    {/* Step 2: Supply Details, Address & Consent */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between pb-1">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    <ArrowLeftIcon size={14} />
                                    <span>Back to personal details</span>
                                </button>
                                <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                                    {formData.firstname} {formData.lastname} ({formData.mobile})
                                </span>
                            </div>

                            {/* NMI and Property Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                                        <ZapIcon size={13} className="text-amber-500" />
                                        <span>NMI (10 or 11 digits) *</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. 4102000000"
                                        value={formData.nmi}
                                        onChange={(e) => {
                                            setFormData({ ...formData, nmi: e.target.value.toUpperCase() });
                                            if (errors.nmi) setErrors(prev => ({ ...prev, nmi: '' }));
                                        }}
                                        className={cn(
                                            "h-11 font-mono rounded-xl bg-background border-border/90 text-sm",
                                            errors.nmi && "border-red-500 ring-1 ring-red-500"
                                        )}
                                        maxLength={11}
                                    />
                                    {errors.nmi ? (
                                        <p className="text-[11px] text-red-500">{errors.nmi}</p>
                                    ) : (
                                        <p className="text-[10px] text-muted-foreground">Found on your current electricity bill</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-foreground">Property type</label>
                                    <Select
                                        options={[
                                            { value: '0', label: 'Residential' },
                                            { value: '1', label: 'Commercial' }
                                        ]}
                                        value={formData.propertyType}
                                        onChange={(val) => setFormData({ ...formData, propertyType: val as string })}
                                        className="h-11 rounded-xl bg-background border-border/90 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Street Address with Google Autocomplete */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-foreground">
                                    Supply address *
                                </label>
                                <LocationAutocomplete
                                    placeholder="Start typing your street address..."
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

                            {/* Suburb, State, Postcode */}
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-6 space-y-1">
                                    <label className="text-xs font-medium text-foreground">
                                        Suburb *
                                    </label>
                                    <Input
                                        placeholder="Sydney"
                                        value={formData.suburb}
                                        onChange={(e) => {
                                            setFormData({ ...formData, suburb: e.target.value });
                                            if (errors.suburb) setErrors(prev => ({ ...prev, suburb: '' }));
                                        }}
                                        className={cn(
                                            "h-11 rounded-xl bg-background border-border/90 text-sm",
                                            errors.suburb && "border-red-500 ring-1 ring-red-500"
                                        )}
                                    />
                                    {errors.suburb && <p className="text-[11px] text-red-500">{errors.suburb}</p>}
                                </div>

                                <div className="col-span-3 space-y-1">
                                    <label className="text-xs font-medium text-foreground">State</label>
                                    <Select
                                        options={STATE_OPTIONS}
                                        value={formData.state}
                                        onChange={(val) => setFormData({ ...formData, state: val as string })}
                                        className="h-11 rounded-xl bg-background border-border/90 text-sm"
                                    />
                                </div>

                                <div className="col-span-3 space-y-1">
                                    <label className="text-xs font-medium text-foreground">
                                        Postcode *
                                    </label>
                                    <Input
                                        placeholder="2000"
                                        value={formData.postcode}
                                        onChange={(e) => {
                                            setFormData({ ...formData, postcode: e.target.value });
                                            if (errors.postcode) setErrors(prev => ({ ...prev, postcode: '' }));
                                        }}
                                        className={cn(
                                            "h-11 rounded-xl bg-background border-border/90 text-sm",
                                            errors.postcode && "border-red-500 ring-1 ring-red-500"
                                        )}
                                        maxLength={4}
                                    />
                                    {errors.postcode && <p className="text-[11px] text-red-500">{errors.postcode}</p>}
                                </div>
                            </div>

                            {/* Terms & Consent */}
                            <div className="pt-2 space-y-2 border-t border-border/60">
                                <div className="flex items-start gap-2.5">
                                    <input
                                        type="checkbox"
                                        id="agreeConsent"
                                        checked={formData.agreed}
                                        onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                        className="mt-1 rounded border-input text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="agreeConsent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                                        I confirm that I am the account holder or authorized representative for the electricity supply address above. I consent to enrolling into the GEE Energy Solar Soak Plan through referral partner <strong className="text-foreground">{company.name}</strong> and agree to receive electricity supply communications.
                                    </label>
                                </div>
                                {errors.agreed && <p className="text-[11px] text-red-500">{errors.agreed}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="h-11 rounded-xl px-4 text-xs font-semibold"
                                    disabled={submitting}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-11 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white transition-all shadow-xs"
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
                    )}
                </div>

                {/* 7. Bottom Footnote Disclaimer */}
                <div className="pt-4 border-t border-border/60 text-center space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                        Illustrative design only
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-lg mx-auto">
                        *Illustrative plan information. Rates, credits, export conditions and eligibility must be confirmed against the current applicable GEE Energy offer.
                    </p>
                </div>

            </div>
        </div>
    );
};
