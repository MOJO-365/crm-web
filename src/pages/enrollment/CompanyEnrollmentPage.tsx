import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    ArrowLeftIcon,
    CheckIcon
} from '@/components/icons';
import { TITLE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
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

    // Multi-stage flow: 'overview' (landing) -> 'step1' (Customer Details) -> 'step2' (Supply & Address)
    const [currentView, setCurrentView] = useState<'overview' | 'step1' | 'step2'>('overview');

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

    const validateMobileInput = (val: string): string | null => {
        const digits = (val || '').replace(/\D/g, '').replace(/^0/, '');
        if (!digits) {
            return 'Mobile number is required *';
        }
        if (!digits.startsWith('4')) {
            return 'Australian mobile must start with 4 (e.g. 412 345 678)';
        }
        if (digits.length < 9) {
            return `Mobile number must be 9 digits (${digits.length}/9 entered)`;
        }
        if (digits.length > 9) {
            return 'Mobile number cannot exceed 9 digits';
        }
        if (/^(\d)\1+$/.test(digits)) {
            return 'Please enter a valid active mobile number';
        }
        return null;
    };

    const handleMobileChange = (raw: string) => {
        // Strip everything except digits
        let digits = raw.replace(/\D/g, '');

        // If starts with 61 and length > 9, strip 61
        if (digits.startsWith('61') && digits.length > 9) {
            digits = digits.slice(2);
        }

        // "No need to take 0" -> If user types leading 0, strip it automatically
        if (digits.startsWith('0')) {
            digits = digits.slice(1);
        }

        // Australian mobile without leading 0 is 9 digits (starts with 4)
        digits = digits.slice(0, 9);

        // Format as 4XX XXX XXX
        let formatted = digits;
        if (digits.length > 6) {
            formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
        } else if (digits.length > 3) {
            formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
        }

        setFormData(prev => ({ ...prev, mobile: formatted }));

        if (errors.mobile || digits.length >= 9) {
            const err = validateMobileInput(formatted);
            setErrors(prev => ({ ...prev, mobile: err || '' }));
        }
    };

    // Step 1 Validation
    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required *';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required *';

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required *';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        const phoneErr = validateMobileInput(formData.mobile);
        if (phoneErr) {
            newErrors.mobile = phoneErr;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 2 Validation
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

    const handleStartApplication = () => {
        setCurrentView('step1');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStep1Next = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep1()) {
            setCurrentView('step2');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) {
            setCurrentView('step1');
            return;
        }
        if (!validateStep2() || !company) return;

        setSubmitting(true);
        try {
            const fullAddress = `${formData.streetAddress.trim()}, ${formData.suburb.trim()} ${formData.state} ${formData.postcode.trim()}`;
            const rawDigits = formData.mobile.replace(/\D/g, '').replace(/^0/, '');
            // User requirement: "No need to take 0 add by default add while saving in db"
            const dbMobile = `0${rawDigits}`; // e.g. "0451254154"

            const payload = {
                title: formData.title || 'Mr',
                firstname: formData.firstname.trim(),
                lastname: formData.lastname.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: dbMobile,
                mobile: dbMobile,
                number: dbMobile,
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
                    <RefreshCwIcon size={20} className="animate-spin text-primary" />
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
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-all shadow-xs cursor-pointer"
                        >
                            <RefreshCwIcon size={14} />
                            Retry Link
                        </button>
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
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 text-primary flex items-center justify-center">
                        <CheckCircleIcon size={36} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Solar Soak Plan Application</span>
                        <h2 className="text-2xl font-bold text-foreground mt-1">Application Received!</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Thank you, <span className="font-semibold text-foreground">{formData.firstname}</span>. Your electricity application via <span className="font-semibold text-foreground">{company.name}</span> has been successfully submitted.
                        </p>
                    </div>

                    <div className="bg-muted/40 p-5 rounded-2xl text-left text-xs space-y-2.5 border border-border">
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Reference UID:</span>
                            <span className="font-mono font-medium text-foreground">{submittedUid}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Selected Plan:</span>
                            <span className="font-semibold text-primary">GEE Energy Solar Soak Plan</span>
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
                        Our onboarding team will verify your supply meter details and send your Solar Soak welcome contract to <span className="font-medium text-foreground">{formData.email}</span>.
                    </p>

                    <Button
                        onClick={() => {
                            setSubmittedUid(null);
                            setCurrentView('overview');
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

    // Shared Header Component for all stages
    const renderTopHeader = () => (
        <div className="flex items-center justify-between gap-3">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                    GEE Energy
                </h2>
                <p className="text-xs text-muted-foreground">
                    Smart electricity solutions
                </p>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                Partner referral
            </div>
        </div>
    );

    // Shared Referral Partner Card
    const renderPartnerCard = (compact = false) => (
        <div className={cn(
            "border border-border/80 rounded-2xl bg-muted/20 flex items-center justify-between gap-3.5 shadow-2xs",
            compact ? "p-3 sm:p-3.5" : "p-4"
        )}>
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <HandshakeIcon size={22} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                        YOU HAVE BEEN REFERRED BY
                    </span>
                    <span className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
                        {company.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                        Official GEE Energy referral partner
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {(company.email || company.phone) && !compact && (
                    <div className="hidden sm:flex flex-col text-right text-[11px] text-muted-foreground">
                        {company.email && (
                            <span className="flex items-center justify-end gap-1 truncate">
                                <MailIcon size={11} /> {company.email}
                            </span>
                        )}
                        {company.phone && (
                            <span className="flex items-center justify-end gap-1">
                                <PhoneIcon size={11} /> {company.phone}
                            </span>
                        )}
                    </div>
                )}
                <div className="text-primary shrink-0">
                    <VerifiedCheckIcon size={22} />
                </div>
            </div>
        </div>
    );

    // Step Progress Indicator for Step 1 and Step 2
    const renderStepProgress = () => (
        <div className="py-1">
            <div className="flex items-center justify-between gap-3 relative">
                {/* Step 1 Indicator */}
                <div
                    onClick={() => currentView === 'step2' && setCurrentView('step1')}
                    className={cn(
                        "flex items-center gap-2.5 min-w-0 transition-all",
                        currentView === 'step2' ? "cursor-pointer group" : ""
                    )}
                >
                    <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all shadow-2xs",
                        currentView === 'step2'
                            ? "bg-primary text-primary-foreground group-hover:scale-105"
                            : currentView === 'step1'
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                            : "bg-muted text-muted-foreground"
                    )}>
                        {currentView === 'step2' ? <CheckIcon size={13} strokeWidth={3} /> : '1'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Step 1</span>
                        <span className={cn(
                            "text-xs truncate leading-tight transition-colors",
                            currentView === 'step1' ? "text-primary font-bold" : currentView === 'step2' ? "text-foreground group-hover:text-primary font-medium" : "text-muted-foreground font-medium"
                        )}>
                            Customer Info
                        </span>
                    </div>
                </div>

                {/* Connecting Progress Track */}
                <div className="flex-1 mx-2 sm:mx-4 h-1 bg-muted/80 rounded-full overflow-hidden">
                    <div className={cn(
                        "h-full bg-primary transition-all duration-300 ease-out",
                        currentView === 'step2' ? "w-full" : "w-0"
                    )} />
                </div>

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all shadow-2xs",
                        currentView === 'step2'
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                            : "bg-muted/70 text-muted-foreground border border-border/80"
                    )}>
                        2
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">Step 2</span>
                        <span className={cn(
                            "text-xs leading-tight truncate transition-colors",
                            currentView === 'step2' ? "text-primary font-bold" : "text-muted-foreground font-medium"
                        )}>
                            Supply Details
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 py-8 px-4 sm:px-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-card border border-border/80 rounded-[24px] p-5 sm:p-7 shadow-sm space-y-5">

                {/* Shared Top Header */}
                {renderTopHeader()}

                {/* ========================================================== */}
                {/* VIEW 0: FIRST SCREEN (As shown in user's reference image)   */}
                {/* ========================================================== */}
                {currentView === 'overview' && (
                    <div className="space-y-5 animate-in fade-in duration-150">
                        {/* Referral Partner Card */}
                        {renderPartnerCard()}

                        {/* Move to Solar Soak Plan Heading */}
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground leading-tight">
                                Move to Solar Soak Plan
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Discover the GEE Energy Solar Soak Plan and complete your electricity application online. Designed to maximise your solar & battery savings.
                            </p>
                        </div>

                        {/* 4 Highlight Stat Cards (2x2 Grid) */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                                <span className="text-2xl font-bold text-foreground tracking-tight">$300</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">Welcome credit</span>
                            </div>

                            <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                                <span className="text-2xl font-bold text-foreground tracking-tight">$0</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">Exit fees</span>
                            </div>

                            <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                                <span className="text-2xl font-bold text-foreground tracking-tight">30¢</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">Import rate / kWh</span>
                            </div>

                            <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-center">
                                <span className="text-2xl font-bold text-foreground tracking-tight">Up to 30¢</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">Battery export FiT / kWh</span>
                            </div>
                        </div>

                        {/* 3 Value Proposition Bullets */}
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                                <VerifiedCheckIcon size={17} className="text-primary shrink-0" />
                                <span>Flexible electricity plan with daytime solar soak hours</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                                <VerifiedCheckIcon size={17} className="text-primary shrink-0" />
                                <span>Battery-friendly feed-in tariffs to boost solar export returns</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground font-medium">
                                <VerifiedCheckIcon size={17} className="text-primary shrink-0" />
                                <span>Simple online application with seamless switch & zero power interruption</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border/70 pt-1" />

                        {/* Next Button - Themed */}
                        <div className="space-y-2">
                            <Button
                                type="button"
                                onClick={handleStartApplication}
                                className="w-full h-12 text-sm font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Next</span>
                                <ArrowRightIcon size={18} />
                            </Button>
                            <p className="text-[11px] text-center text-muted-foreground">
                                Fast 2-step application · Takes less than 2 minutes
                            </p>
                        </div>
                    </div>
                )}

                {/* ========================================================== */}
                {/* VIEW 1: STEP 1 (Customer Information)                      */}
                {/* ========================================================== */}
                {currentView === 'step1' && (
                    <form onSubmit={handleStep1Next} className="space-y-5 animate-in fade-in duration-150">
                        {/* Compact Partner Banner */}
                        {renderPartnerCard(true)}

                        {/* Step Progress Tracker */}
                        {renderStepProgress()}

                        {/* Section Title */}
                        <div className="border-b border-border/70 pb-2">
                            <h3 className="text-base font-bold text-foreground">
                                Step 1: Customer Information
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Please enter your personal and contact details.
                            </p>
                        </div>

                        {/* Title, First Name, Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-semibold text-foreground">Title</label>
                                <Select
                                    options={TITLE_OPTIONS}
                                    value={formData.title}
                                    onChange={(val) => setFormData({ ...formData, title: val as string })}
                                    className="h-11 rounded-xl bg-background border-border/90 text-sm"
                                />
                            </div>

                            <div className="sm:col-span-4 space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    First Name <span className="text-red-500">*</span>
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

                            <div className="sm:col-span-5 space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Last Name <span className="text-red-500">*</span>
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

                        {/* Email and Mobile Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
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

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Mobile Number <span className="text-red-500 font-bold">*</span>
                                </label>
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-11 px-3.5 bg-muted/60 border border-r-0 border-border/90 rounded-l-xl text-sm font-semibold text-muted-foreground whitespace-nowrap select-none">
                                        +61
                                    </div>
                                    <Input
                                        placeholder="412 345 678"
                                        value={formData.mobile}
                                        onChange={(e) => handleMobileChange(e.target.value)}
                                        onBlur={() => {
                                            const err = validateMobileInput(formData.mobile);
                                            if (err) setErrors(prev => ({ ...prev, mobile: err }));
                                        }}
                                        className={cn(
                                            "h-11 rounded-r-xl rounded-l-none bg-background border-border/90 text-sm",
                                            errors.mobile && "border-red-500 ring-1 ring-red-500"
                                        )}
                                        maxLength={12}
                                    />
                                </div>
                                {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile}</p>}
                                <p className="text-[10px] text-muted-foreground">Australian mobile (4xx xxx xxx)</p>
                            </div>
                        </div>

                        {/* Step 1 Actions */}
                        <div className="flex items-center gap-3 pt-3 border-t border-border/70">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentView('overview')}
                                className="h-11 rounded-xl px-4 text-xs font-semibold"
                            >
                                <ArrowLeftIcon size={14} className="mr-1" />
                                Back to Plan
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-md flex items-center justify-center gap-1.5"
                            >
                                <span>Next: Supply Details</span>
                                <ArrowRightIcon size={16} />
                            </Button>
                        </div>
                    </form>
                )}

                {/* ========================================================== */}
                {/* VIEW 2: STEP 2 (Electricity Supply Details & Consent)      */}
                {/* ========================================================== */}
                {currentView === 'step2' && (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-150">
                        {/* Compact Partner Banner */}
                        {renderPartnerCard(true)}

                        {/* Step Progress Tracker */}
                        {renderStepProgress()}

                        {/* Customer Summary Chip */}
                        <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{formData.firstname} {formData.lastname}</span>
                                <span className="text-muted-foreground font-mono">(0{formData.mobile.replace(/\D/g, '').replace(/^0/, '')})</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCurrentView('step1')}
                                className="text-primary hover:underline text-xs font-semibold"
                            >
                                Edit Details
                            </button>
                        </div>

                        {/* Section Title */}
                        <div className="border-b border-border/70 pb-2">
                            <h3 className="text-base font-bold text-foreground">
                                Step 2: Electricity Supply Details
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                National Meter Identifier (NMI) and service supply address.
                            </p>
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertCircleIcon size={16} className="shrink-0" />
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        {/* NMI and Property Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                    <ZapIcon size={14} className="text-amber-500" />
                                    <span>NMI (10 or 11 digits) <span className="text-red-500">*</span></span>
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
                                <label className="text-xs font-semibold text-foreground">Property Type</label>
                                <Select
                                    options={[
                                        { value: '0', label: 'Residential' },
                                        { value: '1', label: 'Commercial / Business' }
                                    ]}
                                    value={formData.propertyType}
                                    onChange={(val) => setFormData({ ...formData, propertyType: val as string })}
                                    className="h-11 rounded-xl bg-background border-border/90 text-sm"
                                />
                            </div>
                        </div>

                        {/* Street Address with Google Places Autocomplete */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                                Supply Address <span className="text-red-500">*</span>
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

                        {/* Suburb, State, Postcode */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                            <div className="sm:col-span-6 space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Suburb <span className="text-red-500">*</span>
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

                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-semibold text-foreground">State</label>
                                <Select
                                    options={STATE_OPTIONS}
                                    value={formData.state}
                                    onChange={(val) => setFormData({ ...formData, state: val as string })}
                                    className="h-11 rounded-xl bg-background border-border/90 text-sm"
                                />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-semibold text-foreground">
                                    Postcode <span className="text-red-500">*</span>
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

                        {/* Consent & Confirmation */}
                        <div className="pt-2 border-t border-border/70 space-y-2">
                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="agreeConsent"
                                    checked={formData.agreed}
                                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                    className="mt-1 rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="agreeConsent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
                                    I confirm that I am the account holder or authorized representative for the electricity supply address above. I consent to enrolling into the GEE Energy Solar Soak Plan through referral partner <strong className="text-foreground">{company.name}</strong> and agree to receive electricity supply communications.
                                </label>
                            </div>
                            {errors.agreed && <p className="text-[11px] text-red-500">{errors.agreed}</p>}
                        </div>

                        {/* Step 2 Actions */}
                        <div className="flex items-center gap-3 pt-3 border-t border-border/70">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentView('step1')}
                                className="h-11 rounded-xl px-4 text-xs font-semibold"
                                disabled={submitting}
                            >
                                <ArrowLeftIcon size={14} className="mr-1" />
                                Back to Step 1
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-11 text-sm font-semibold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-md flex items-center justify-center gap-2"
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
        </div>
    );
};
