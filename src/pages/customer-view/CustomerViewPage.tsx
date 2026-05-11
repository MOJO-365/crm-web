import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WEB_ENROLLMENT_BY_UID, GET_CUSTOMER_BY_ID } from '@/graphql/queries/customers';
import { GET_RATE_PLAN_BY_CODE } from '@/graphql/queries/rates';
import { UPDATE_WEB_ENROLLMENT_CONSENT, UPDATE_CUSTOMER } from '@/graphql/mutations/customers';
import { MailIcon, PhoneIcon, ActivityIcon, CheckIcon, ZapIcon, InfoIcon, ChevronLeftIcon, UserIcon, MapPinIcon } from '@/components/icons';
import { ID_TYPE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { getData as getCountries } from 'country-list';
import MainLogo from '@/assets/main-logo-dark-1.png';
import { Button, Input, Select, DatePicker } from '@/components/ui';

const COUNTRY_OPTIONS = getCountries().map(c => ({ value: c.name, label: c.name }));

export const CustomerViewPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [step, setStep] = useState<'consent' | 'rates' | 'review' | 'idcheck'>('consent');
    const [idConfirmed, setIdConfirmed] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isNominationConfirmed, setIsNominationConfirmed] = useState(false);
    const [idForm, setIdForm] = useState({
        idType: '',
        idnumber: '',
        licenseCardNumber: '',
        idexpiary: '',
        idstate: '',
        idcountry: '',
        medicareCardType: '0',
        medicareIrn: '',
        // Property details (editable in review step)
        address: '',
        nmi: '',
        state: '',
        postcode: '',
        // Personal info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        title: '',
        dob: '',
        connectionDate: '',
    });
    const [idFormInit, setIdFormInit] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const { data: enrollmentData, loading: enrollmentLoading, error: enrollmentError } = useQuery(GET_WEB_ENROLLMENT_BY_UID, {
        variables: { uid },
        skip: !uid,
    });

    const { data: customerData } = useQuery(GET_CUSTOMER_BY_ID, {
        variables: { uid },
        skip: !uid,
    });

    useEffect(() => {
        if (customerData?.customer?.isConsentRead !== undefined) {
            setIsChecked(!!customerData.customer.isConsentRead);
        }
    }, [customerData]);

    const enrollment = enrollmentData?.webEnrollmentByUid;
    const payload = enrollment?.payload || {};
    const tariffCode = payload.tariffCode || payload.tariffcode || "EA025";
    const customerIdDisplay = customerData?.customer?.customerId || customerData?.customer?.id || payload?.customerId || payload?.customer_id || 'Pending';

    const { data: ratesData, loading: ratesLoading } = useQuery(GET_RATE_PLAN_BY_CODE, {
        variables: { code: tariffCode },
        skip: !tariffCode || step !== 'rates',
    });

    const [updateConsent] = useMutation(UPDATE_WEB_ENROLLMENT_CONSENT);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    const handleToggleConsent = async (checked: boolean) => {
        setIsChecked(checked);
        if (uid) {
            try {
                await updateConsent({
                    variables: { uid, isRead: checked }
                });
            } catch (err) {
                console.error('Failed to update consent state', err);
            }
        }
    };

    const handleNext = () => {
        if (isChecked) {
            setStep('rates');
        }
    };

    const handleFinishEnrollment = async () => {
        if (!uid || !idConfirmed) return;

        try {
            await updateCustomer({
                variables: {
                    uid,
                    input: {
                        enrollmentDetails: {
                            idtype: idForm.idType !== '' ? parseInt(idForm.idType) : null,
                            idnumber: idForm.idnumber,
                            idstate: idForm.idstate,
                            idcountry: idForm.idcountry,
                            idexpiry: idForm.idexpiary,
                            licenseCardNumber: idForm.licenseCardNumber,
                            medicareCardType: idForm.medicareCardType,
                            medicareIrn: idForm.medicareIrn,
                            connectiondate: idForm.connectionDate,
                        },
                        // Also update top-level customer fields if they were edited in review (optional)
                        dob: idForm.dob,
                        medicareIrn: idForm.medicareIrn,
                        medicareCardType: idForm.medicareCardType,
                        status: 8, // Mark as Consent Signed (per constants.ts)
                        isEnrollmentFinished: 1,
                        triggerWelcomeEmail: false,
                        triggerUpdateEmail: false,
                    }
                }
            });
            setIsFinished(true);
            toast.success('Application submitted successfully!');
        } catch (err) {
            console.error('Failed to finish enrollment', err);
            toast.error('Failed to submit application. Please try again.');
        }
    };

    if (enrollmentLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (enrollmentError || !enrollment) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ActivityIcon className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Not Found</h2>
                    <p className="text-slate-600 mb-6">We couldn't find the application details you're looking for. Please check the link or contact our support team.</p>
                    <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                        Support: <a href="tel:1300707042" className="text-primary font-semibold">1300 707 042</a>
                    </div>
                </div>
            </div>
        );
    }

    if (isFinished || enrollment.isEnrollmentFinished === 1 || customerData?.customer?.status === 8) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] p-6 font-sans">
                {/* Elegant subtle background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />
                
                <div className="max-w-md w-full relative">
                    {/* Decorative Ring */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

                    <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            {/* Icon Wrapper */}
                            <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100/50">
                                <CheckIcon className="w-12 h-12 text-emerald-500" />
                            </div>

                            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">All set!</h2>
                            <p className="text-slate-500 mb-12 text-lg leading-relaxed">
                                Your application has been received and is currently being processed.
                            </p>

                            {/* Status Card */}
                            <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Application Reference</p>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{customerIdDisplay}</p>
                                    </div>
                                    
                                    <div className="h-px bg-slate-200/60 w-12 mx-auto" />

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Current Status</p>
                                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                            <span className="text-sm font-bold text-slate-700">Connection In Progress</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => window.close()}
                                    className="w-full py-5 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                                >
                                    Done
                                </button>
                                <p className="text-xs text-slate-400 font-medium">
                                    You can safely close this window now.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const ratePlan = ratesData?.ratePlanByCode;
    const mainOffer = ratePlan?.offers?.[0];

    if (step === 'consent') {
        return (
            <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
                {/* Header Section - Fixed */}
                <header className="flex-none bg-white border-b border-slate-100 py-6 px-4 flex justify-center items-center z-10 shadow-sm relative">
                    <img src={MainLogo} alt="GEE Energy" className="h-10 md:h-12" />
                </header>

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <div className="max-w-3xl mx-auto py-10 px-6 md:px-10">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                            <div className="space-y-8">
                                <div className="border-b border-slate-100 pb-6 text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Consent & Terms</h1>
                                    <p className="text-slate-500">Please review the following information carefully.</p>
                                </div>

                                <div className="prose prose-slate max-w-none space-y-6">
                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800 mb-3">1. Explicit Informed Consent</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            I/We provide my/our explicit informed consent for GEE Power and Gas Pty Ltd (GEE Energy) to:
                                        </p>
                                        <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
                                            <li>Request my/our historical energy consumption data from the relevant distributor or metering coordinator.</li>
                                            <li>Use the information provided in this application to perform a credit check if necessary.</li>
                                            <li>Act as my/our energy retailer for the premises listed in this application.</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800 mb-3">2. Marketing and Privacy</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            GEE Energy respects your privacy. We will only use your personal information in accordance with our Privacy Policy.
                                            We may contact you about energy-related products, services, and special offers that may be of interest to you.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800 mb-3">3. Standard Retail Contract</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            By proceeding, you agree to enter into a Standard Retail Contract with GEE Energy.
                                            The terms and conditions of this contract are available on our website or can be provided upon request.
                                        </p>
                                    </section>

                                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                                        <p className="text-emerald-800 text-sm italic">
                                            Note: Your consent is required to process this application. You can withdraw your consent at any time by contacting our customer service team.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Section - Fixed */}
                <footer className="flex-none bg-white border-t border-slate-100 p-6 md:p-8 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <div className="max-w-3xl mx-auto w-full space-y-6">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 hover:border-primary/50"
                                    checked={isChecked}
                                    onChange={(e) => handleToggleConsent(e.target.checked)}
                                />
                                <CheckIcon className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block text-white left-1" />
                            </div>
                            <div className="flex-1">
                                <span className="text-sm md:text-base text-slate-600 group-hover:text-slate-900 transition-colors select-none font-medium">
                                    I confirm that I have read and understood the terms above and provide my explicit informed consent to proceed.
                                </span>
                            </div>
                        </label>

                        <Button
                            fullWidth
                            size="lg"
                            className={`h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${isChecked ? 'shadow-lg shadow-primary/20' : ''}`}
                            disabled={!isChecked}
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    </div>
                </footer>
            </div>
        );
    }

    if (step === 'rates') {
        return (
            <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
                {/* Same Header as Consent */}
                <header className="flex-none bg-white border-b border-slate-100 py-6 px-4 flex justify-center items-center z-10 shadow-sm relative">
                    <img src={MainLogo} alt="GEE Energy" className="h-10 md:h-12" />

                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                        {/* Back + Title */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep('consent')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Back
                            </button>
                            <h1 className="text-lg font-bold text-foreground">Your Energy Rates</h1>
                            <div className="w-12"></div>
                        </div>

                        {ratesLoading ? (
                            <div className="bg-card rounded-xl shadow-sm border border-border p-12 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                                <p className="text-sm text-muted-foreground font-medium">Loading your plan details...</p>
                            </div>
                        ) : mainOffer ? (
                            <>
                                {/* Tariff Info */}
                                <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-5">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Tariff Code</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{tariffCode}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Plan</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{ratePlan?.tariff || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">State</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{ratePlan?.state || 'NSW'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Type</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{ratePlan?.type === 1 ? 'Business' : 'Residential'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rates Card */}
                                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-5 py-4 border-b border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                                                <ZapIcon size={18} className="text-white" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-foreground">Usage & Supply Charges</h3>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex flex-wrap gap-x-10 gap-y-8">
                                            {/* Energy Rates */}
                                            {(() => {
                                                const rates = [
                                                    mainOffer.anytime > 0 && { label: 'Anytime', value: mainOffer.anytime, color: 'orange' },
                                                    mainOffer.peak > 0 && { label: 'Peak', value: mainOffer.peak, color: 'blue' },
                                                    mainOffer.shoulder > 0 && { label: 'Shoulder', value: mainOffer.shoulder, color: 'blue' },
                                                    mainOffer.offPeak > 0 && { label: 'Off-Peak', value: mainOffer.offPeak, color: 'blue' },
                                                ].filter(Boolean) as { label: string; value: number; color: string }[];
                                                if (!rates.length) return null;
                                                const cls: Record<string, string> = {
                                                    blue: "bg-blue-50 border-blue-200 text-blue-600",
                                                    orange: "bg-orange-50 border-orange-200 text-orange-600",
                                                };
                                                return (
                                                    <div className="space-y-3 min-w-[180px] flex-1">
                                                        <div className="flex items-center gap-2 text-blue-500">
                                                            <ActivityIcon size={15} />
                                                            <h4 className="text-xs font-bold uppercase tracking-wide">Energy Rates</h4>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {rates.map((r, i) => (
                                                                <div key={i} className={`${cls[r.color]} border rounded-lg p-2.5 text-center transition-all hover:shadow-sm`}>
                                                                    <div className="font-bold text-sm">${r.value.toFixed(4)}/kWh</div>
                                                                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{r.label}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Supply */}
                                            <div className="space-y-3 min-w-[180px] flex-1">
                                                <div className="flex items-center gap-2 text-purple-500">
                                                    <ActivityIcon size={15} />
                                                    <h4 className="text-xs font-bold uppercase tracking-wide">Supply Charges</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="bg-purple-50 border-purple-200 text-purple-600 border rounded-lg p-2.5 text-center transition-all hover:shadow-sm">
                                                        <div className="font-bold text-sm">${mainOffer.supplyCharge.toFixed(4)}/day</div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">Supply</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Controlled Load */}
                                            {(mainOffer.cl1Usage > 0 || mainOffer.cl2Usage > 0) && (
                                                <div className="space-y-3 min-w-[180px] flex-1">
                                                    <div className="flex items-center gap-2 text-green-500">
                                                        <ActivityIcon size={15} />
                                                        <h4 className="text-xs font-bold uppercase tracking-wide">Controlled Load</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {mainOffer.cl1Usage > 0 && (
                                                            <div className="bg-green-50 border-green-200 text-green-600 border rounded-lg p-2.5 text-center transition-all hover:shadow-sm">
                                                                <div className="font-bold text-sm">${mainOffer.cl1Usage.toFixed(4)}/kWh</div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">CL1 Usage</div>
                                                            </div>
                                                        )}
                                                        {mainOffer.cl2Usage > 0 && (
                                                            <div className="bg-green-50 border-green-200 text-green-600 border rounded-lg p-2.5 text-center transition-all hover:shadow-sm">
                                                                <div className="font-bold text-sm">${mainOffer.cl2Usage.toFixed(4)}/kWh</div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">CL2 Usage</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Solar FiT */}
                                            {mainOffer.fit > 0 && (
                                                <div className="space-y-3 min-w-[180px] flex-1">
                                                    <div className="flex items-center gap-2 text-teal-500">
                                                        <ZapIcon size={15} />
                                                        <h4 className="text-xs font-bold uppercase tracking-wide">Solar FiT</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="bg-teal-50 border-teal-200 text-teal-600 border rounded-lg p-2.5 text-center transition-all hover:shadow-sm">
                                                            <div className="font-bold text-sm">${mainOffer.fit.toFixed(4)}/kWh</div>
                                                            <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">Feed-in</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-5 py-3 bg-muted/50 border-t border-border">
                                        <p className="text-xs text-muted-foreground">
                                            All rates are inclusive of GST. Controlled load rates apply to separately metered appliances.
                                        </p>
                                    </div>
                                </div>

                                {/* VPP Terms Link */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                                    <InfoIcon className="w-5 h-5 text-blue-500 flex-none" />
                                    <p className="text-sm font-medium text-blue-800 leading-relaxed">
                                        Please review the <a href="https://gee.com.au/virtual-power-plant-customer-charter-terms-and-conditions-v1.2" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 transition-colors">Virtual Power Plant Customer Charter Terms and Conditions</a> which apply to this plan.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
                                <InfoIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                <h2 className="text-lg font-bold text-foreground mb-1">No Rates Available</h2>
                                <p className="text-sm text-muted-foreground">No details for tariff: <span className="font-bold text-foreground">{tariffCode}</span></p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center pt-2 pb-4">
                            <p className="text-xs text-muted-foreground mb-3">Need help?</p>
                            <div className="flex justify-center gap-3">
                                <a href="tel:1300707042" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                                    <PhoneIcon size={14} className="text-green-500" />
                                    1300 707 042
                                </a>
                                <a href="mailto:customerservice@gee.com.au" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                                    <MailIcon size={14} className="text-green-500" />
                                    Email
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Fixed Footer */}
                {mainOffer && (
                    <footer className="flex-none bg-white border-t border-slate-100 px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                        <div className="max-w-3xl mx-auto">
                            <Button
                                fullWidth
                                size="lg"
                                className="h-14 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20"
                                onClick={() => setStep('idcheck')}
                            >
                                Next
                            </Button>
                        </div>
                    </footer>
                )}
            </div>
        );
    }

    // === STEP 3: REVIEW ===
    if (step === 'review') {
        return (
            <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
                <header className="flex-none bg-white border-b border-slate-100 py-6 px-4 flex justify-center items-center z-10 shadow-sm relative">
                    <img src={MainLogo} alt="GEE Energy" className="h-10 md:h-12" />
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                        {/* Back + Title */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep('idcheck')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Back
                            </button>
                            <div className="flex flex-col items-center">
                                <h1 className="text-lg font-bold text-foreground">Review Your Details</h1>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mt-1">
                                    Customer ID: {customerIdDisplay}
                                </span>
                            </div>
                            <div className="w-12"></div>
                        </div>

                        {/* Consolidated Summary Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">

                            {/* Personal Info */}
                            <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                        <UserIcon size={16} />
                                    </div>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">First Name</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{payload.firstname || payload.firstName || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Last Name</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{payload.lastname || payload.lastName || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Date of Birth</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.dob || payload.dob || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{payload.number || payload.phone || payload.mobile || '—'}</div>
                                    </div>
                                    <div className="sm:col-span-2 md:col-span-4">
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.email || '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                        <MapPinIcon size={16} />
                                    </div>
                                    Property Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Address</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{payload.address || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">NMI</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{payload.nmi || '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Identity & Connection Details */}
                            <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                        <ActivityIcon size={16} />
                                    </div>
                                    Identity & Connection
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Connection Date</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.connectionDate || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ID Type</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">
                                            {ID_TYPE_OPTIONS.find(o => o.value === idForm.idType)?.label || '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                            {idForm.idType === '1' ? 'Medicare Number' : 'ID Number'}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idnumber || '—'}</div>
                                    </div>
                                    {idForm.idType === '0' && (
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Card Number</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.licenseCardNumber || '—'}</div>
                                        </div>
                                    )}
                                    {idForm.idType === '1' && (
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">IRN</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.medicareIrn || '—'}</div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Expiry Date</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idexpiary || '—'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">State/Country</div>
                                        <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idstate || idForm.idcountry || '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Installer Details */}
                            {payload.createdBy && (
                                <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                                    <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <InfoIcon size={16} />
                                        </div>
                                        Installer Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Company</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.company_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Contact</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.first_name} {payload.createdBy.last_name}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ABN</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.abn || '—'}</div>
                                        </div>
                                        <div className="sm:col-span-2 md:col-span-4">
                                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                            <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.createdBy.email || '—'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* PDRS Badge */}
                        {payload.isPdrs && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-emerald-600" />
                                <p className="text-sm font-medium text-emerald-800">This enrollment was submitted via the PDRS portal ({payload.portalname || 'Portal'}).</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center pt-2 pb-4">
                            <p className="text-xs text-muted-foreground mb-3">Need help?</p>
                            <div className="flex justify-center gap-3">
                                <a href="tel:1300707042" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                                    <PhoneIcon size={14} className="text-green-500" />
                                    1300 707 042
                                </a>
                                <a href="mailto:customerservice@gee.com.au" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                                    <MailIcon size={14} className="text-green-500" />
                                    Email
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Fixed Footer - Final Step */}
                <footer className="flex-none bg-white border-t border-slate-100 px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <div className="max-w-6xl mx-auto flex flex-col gap-4">
                        <label className="flex items-center justify-center gap-3 cursor-pointer group mb-1">
                            <div className="relative flex items-center shrink-0">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:bg-primary checked:border-primary transition-all shadow-sm hover:border-primary"
                                    checked={isNominationConfirmed}
                                    onChange={(e) => setIsNominationConfirmed(e.target.checked)}
                                />
                                <CheckIcon className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white left-[3px]" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 select-none">
                                I have read and agree to the <a href="/onboarding/BESS2 and Nomination Form.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold" onClick={(e) => e.stopPropagation()}>Nomination Form</a>
                            </span>
                        </label>
                        <Button
                            fullWidth
                            size="lg"
                            className={`h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${isNominationConfirmed ? 'shadow-lg shadow-primary/20' : 'opacity-50 grayscale'}`}
                            disabled={!isNominationConfirmed}
                            onClick={handleFinishEnrollment}
                        >
                            Finish Enrollment
                        </Button>
                    </div>
                </footer>
            </div>
        );
    }

    // === STEP 4: QUICK ID CHECK ===
    // Initialize form from payload once
    if (!idFormInit && payload && Object.keys(payload).length > 0) {
        setIdForm({
            idType: String(payload.idType ?? payload.idtype ?? '0'),
            idnumber: payload.idnumber || payload.idNumber || payload.license_number || payload.licenseNumber || payload.licence_number || payload.licenceNumber || '',
            licenseCardNumber: payload.licenseCardNumber || payload.license_card_number || payload.idcardnumber || payload.cardnumber || payload.cardNumber || '',
            idexpiary: payload.idexpiary || payload.idexpiry || payload.id_expiry || payload.license_expiry || payload.licenseExpiry || payload.expiry_date || '',
            idstate: payload.idstate || payload.idState || payload.license_state || payload.licenseState || payload.state || 'NSW',
            idcountry: payload.idcountry || payload.idCountry || payload.country || 'Australia',
            medicareCardType: String(payload.medicareCardType ?? payload.medicare_card_type ?? '0'),
            medicareIrn: payload.medicareIrn || payload.medicare_irn || '',
            address: payload.address || '',
            nmi: payload.nmi || '',
            state: payload.stateOrTerritory || payload.jurisdictionCode || payload.state || 'NSW',
            postcode: payload.postcode || '',
            firstName: payload.firstname || payload.firstName || '',
            lastName: payload.lastname || payload.lastName || '',
            email: payload.email || '',
            phone: payload.number || payload.phone || payload.mobile || '',
            title: payload.title || '',
            dob: payload.dob || '',
            connectionDate: payload.connectionDate || payload.connectiondate || payload.connection_date || '',
        });
        setIdFormInit(true);
    }
    const idType = Number(idForm.idType || (payload.idType ?? 0));

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
            <header className="flex-none bg-white border-b border-slate-100 py-6 px-4 flex justify-center items-center z-10 shadow-sm">
                <img src={MainLogo} alt="GEE Energy" className="h-10 md:h-12" />
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
                    {/* Back + Title */}
                    <div className="mb-8 text-center md:text-left">
                        <button
                            onClick={() => setStep('rates')}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Finalize Your Enrollment</h1>
                        <p className="text-sm text-gray-500 mt-1">Confirm your connection date and verify your identity</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* LEFT COLUMN: FORM */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <DatePicker
                                    label="Date of Birth"
                                    value={idForm.dob}
                                    onChange={(date) => setIdForm(f => ({ ...f, dob: date ? date.toISOString().split('T')[0] : '' }))}
                                />
                                <DatePicker
                                    label="Connection Date"
                                    value={idForm.connectionDate}
                                    onChange={(date) => setIdForm(f => ({ ...f, connectionDate: date ? date.toISOString().split('T')[0] : '' }))}
                                />
                            </div>

                            <Select
                                label="ID Type"
                                options={ID_TYPE_OPTIONS}
                                value={idForm.idType}
                                onChange={(val) => setIdForm(f => ({ ...f, idType: String(val) }))}
                            />

                            {/* === DRIVER LICENCE === */}
                            {idType === 0 && (
                                <div className="space-y-4">
                                    <Select
                                        label="State"
                                        options={STATE_OPTIONS}
                                        value={idForm.idstate}
                                        onChange={(val) => setIdForm(f => ({ ...f, idstate: String(val) }))}
                                    />
                                    <Input
                                        label="Licence Number"
                                        placeholder="Enter licence number"
                                        value={idForm.idnumber}
                                        onChange={(e) => setIdForm(f => ({ ...f, idnumber: e.target.value }))}
                                    />
                                    <Input
                                        label="Card Number"
                                        placeholder="Enter card number"
                                        value={idForm.licenseCardNumber}
                                        onChange={(e) => setIdForm(f => ({ ...f, licenseCardNumber: e.target.value }))}
                                    />
                                    <DatePicker
                                        label="Expiry Date"
                                        value={idForm.idexpiary}
                                        onChange={(date) => setIdForm(f => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                                    />
                                </div>
                            )}

                            {/* === MEDICARE === */}
                            {idType === 1 && (
                                <div className="space-y-4">
                                    <Select
                                        label="Card Type"
                                        options={[
                                            { value: '0', label: 'Green' },
                                            { value: '1', label: 'Blue' },
                                            { value: '2', label: 'Yellow' },
                                        ]}
                                        value={idForm.medicareCardType}
                                        onChange={(val) => setIdForm(f => ({ ...f, medicareCardType: String(val) }))}
                                    />
                                    <Input
                                        label="Medicare Number"
                                        placeholder="Enter medicare number"
                                        value={idForm.idnumber}
                                        onChange={(e) => setIdForm(f => ({ ...f, idnumber: e.target.value }))}
                                    />
                                    <Input
                                        label="IRN"
                                        placeholder="Enter IRN"
                                        value={idForm.medicareIrn}
                                        onChange={(e) => setIdForm(f => ({ ...f, medicareIrn: e.target.value }))}
                                    />
                                    <DatePicker
                                        label="Expiry Date"
                                        value={idForm.idexpiary}
                                        onChange={(date) => setIdForm(f => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                                    />
                                </div>
                            )}

                            {/* === PASSPORT === */}
                            {idType === 2 && (
                                <div className="space-y-4">
                                    <Select
                                        label="Country"
                                        options={COUNTRY_OPTIONS}
                                        value={idForm.idcountry}
                                        onChange={(val) => setIdForm(f => ({ ...f, idcountry: String(val) }))}
                                    />
                                    <Input
                                        label="Passport Number"
                                        placeholder="Enter passport number"
                                        value={idForm.idnumber}
                                        onChange={(e) => setIdForm(f => ({ ...f, idnumber: e.target.value }))}
                                    />
                                    <DatePicker
                                        label="Expiry Date"
                                        value={idForm.idexpiary}
                                        onChange={(date) => setIdForm(f => ({ ...f, idexpiary: date ? date.toISOString().split('T')[0] : '' }))}
                                    />
                                </div>
                            )}

                            {/* Confirmation Checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer group pt-2">
                                <div className="relative flex items-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 hover:border-primary/50"
                                        checked={idConfirmed}
                                        onChange={(e) => setIdConfirmed(e.target.checked)}
                                    />
                                    <CheckIcon className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">
                                    I confirm the above details are correct.
                                </span>
                            </label>
                        </div>

                        {/* RIGHT COLUMN: DOCUMENT GUIDES */}
                        <div className="space-y-6">
                            {idType === 0 && (
                                <div className="space-y-6">
                                    {/* Physical Licence Guide */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Physical Licence</h3>
                                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[260px]">
                                            <img
                                                src={`/Document Images/${(idForm.idstate || 'NSW').toLowerCase()}-licence${['NT', 'SA', 'TAS', 'VIC', 'WA'].includes(idForm.idstate) ? '-front' : idForm.idstate === 'QLD' ? '' : idForm.idstate === 'ACT' ? '' : ''}${idForm.idstate === 'QLD' ? '' : ''}.png`.replace('QLD-licence', 'qld-licenc').replace('TAS-licence', 'tas-licenc').replace('VIC-licence', 'vic-licence')}
                                                alt="Physical Licence Guide"
                                                className="w-full h-auto object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/Document Images/nsw-licence.png';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Digital Licence Guide (NSW and QLD only) */}
                                    {['NSW', 'QLD'].includes(idForm.idstate) && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-3">Digital Licence</h3>
                                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[220px]">
                                                <img
                                                    src={`/Document Images/${idForm.idstate.toLowerCase()}-digital-licence${idForm.idstate === 'QLD' ? '-front' : ''}.png`}
                                                    alt="Digital Licence Guide"
                                                    className="w-full h-auto object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {idType === 2 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Passport Guide</h3>
                                    <div className="bg-gray-100 border border-gray-200 rounded-2xl p-8 flex items-center justify-center">
                                        <div className="text-center">
                                            <UserIcon size={48} className="text-gray-400 mx-auto mb-4" />
                                            <p className="text-sm text-gray-600">Ensure the passport number and expiry date match your document exactly.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {idType === 1 && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Medicare Card Guide</h3>
                                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-w-[320px]">
                                        <img
                                            src={
                                                idForm.medicareCardType === '0' ? '/Document Images/standard-mdicare-card.png' :
                                                    idForm.medicareCardType === '1' ? '/Document Images/interim-medicar-card.png' :
                                                        '/Document Images/reciprocal-healthcare-card.png'
                                            }
                                            alt="Medicare Card Guide"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Note: Ensure your 10-digit Medicare number and IRN (position on card) are entered correctly.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Fixed Footer */}
            <footer className="flex-none bg-white border-t border-slate-100 px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-5xl mx-auto">
                    <Button
                        fullWidth
                        size="lg"
                        className={`h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${idConfirmed ? 'shadow-lg shadow-primary/20' : ''}`}
                        disabled={!idConfirmed}
                        onClick={() => setStep('review')}
                    >
                        Review Your Details
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default CustomerViewPage;
