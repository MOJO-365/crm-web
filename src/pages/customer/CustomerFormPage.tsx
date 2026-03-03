import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import {
    GET_CUSTOMER_BY_ID,
    GET_ACTIVE_RATES_HISTORY,
    GET_RATES_HISTORY,
    GET_RATES_HISTORY_BY_VERSION,
    CHECK_ADDRESS_EXISTS,
    CHECK_NMI_EXISTS,
    CREATE_CUSTOMER,
    UPDATE_CUSTOMER,
    GET_RISK_STATUSES,
    GET_MEASUREMENT_UNITS,
} from '@/graphql';
import { DNSP_MAP, SALE_TYPE_OPTIONS, BILLING_PREF_OPTIONS, ID_TYPE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { getData } from 'country-list';
import { secondaryApiAxios } from '@/lib/apollo';
import { formatDateTime } from '@/lib/date';
import {
    ChevronRightIcon,
    HomeIcon,
    UserIcon,
    CheckIcon,
    ZapIcon,
    PlugIcon,
    // PiggyBankIcon,
    Settings2Icon,
    ShieldIcon,
    LockIcon,
    CalendarIcon,
    MailIcon,
    CreditCardIcon,
    HashIcon,
    ClockIcon,
    MapPinIcon,
    PercentIcon,
    IdCardIcon,
    PhoneIcon,
    ActivityIcon,
    ShieldCheckIcon,
} from '@/components/icons';
import { sendVerification, checkVerification } from '@/lib/twilio';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import {
    uploadDocument,
    // getDocumentPreviewUrl, isImageFile, isPdfFile,
} from '@/lib/document-upload';
import DocumentPreview from '@/components/common/DocumentPreview';
import LocationAutocomplete from '../LocationAutocomplete';
import { Modal } from '@/components/common/Modal';
import { useAuthStore } from '@/stores/useAuthStore';

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Field = ({ label, required, hint, children, error }: { label: string, required?: boolean, hint?: string, children: React.ReactNode, error?: string }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium leading-none flex items-center gap-1 text-foreground">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
);

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 cursor-pointer ${checked ? 'bg-neutral-900' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

// ============================================================================
// TYPES
// ============================================================================

import type { CustomerFormData, RatePlan, CustomerDocument } from '@/types';

interface VersionOption {
    value: string;
    label: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const initialFormData: CustomerFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 0,
    relationshipStatus: 0,
    enquiryAmount: '',
    checkCreditScore: false,
    employerName: '',
    dob: '',
    propertyType: 0,
    businessName: '',
    abn: '',
    showAsBusinessName: false,
    showName: true,
    unitNumber: '',
    streetNumber: '',
    streetName: '',
    streetType: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    nmi: '',
    hasSolar: false,
    solarCapacity: '',
    inverterCapacity: '',
    vpp: false,
    vppConnected: false,
    vppSignupBonus: '',
    batteryBrand: '',
    batteryCapacity: '',
    snNumber: '',
    exportLimit: '',
    saleType: 0,
    connectionDate: '',
    idType: 0,
    idNumber: '',
    idState: '',
    idCountry: '',
    idExpiry: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    concession: false,
    lifeSupport: false,
    additionalDocument: null,
    billingPreference: 0,
    directDebit: false,
    accountType: 0,
    debitFirstName: '',
    debitLastName: '',
    bankName: '',
    bankAddress: '',
    bsb: '',
    accountNumber: '',
    paymentFrequency: 0,
    firstDebitDate: '',
    tariffCode: '',
    creditScore: undefined,
    riskStatus: undefined,
    discount: 0,
    previousBill: null,
    identityProof: null,
};

const generateGEECustomerId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `GEE${randomNum}`;
};

const streetTypeOptions = [
    { value: 'St', label: 'Street' },
    { value: 'Rd', label: 'Road' },
    { value: 'Ave', label: 'Avenue' },
    { value: 'Dr', label: 'Drive' },
    { value: 'Ct', label: 'Court' },
    { value: 'Pl', label: 'Place' },
    { value: 'Cres', label: 'Crescent' },
    { value: 'Way', label: 'Way' },
    { value: 'Ln', label: 'Lane' },
    { value: 'Blvd', label: 'Boulevard' },
];

// ============================================================================
// STEP BADGE COMPONENT
// ============================================================================

interface StepBadgeProps {
    index: number;
    label: string;
    active: boolean;
    done: boolean;
    status?: string;
    statusTone?: 'success' | 'warning' | 'error';
}

const StepBadge: React.FC<StepBadgeProps> = ({ index, label, active, done, status, statusTone }) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer";
    const activeClasses = active
        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
        : done
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-muted text-muted-foreground border-border hover:bg-muted/80";

    return (
        <div className={`${baseClasses} ${activeClasses}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${active ? 'bg-white text-neutral-900' : done ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {done ? <CheckIcon size={14} /> : index}
            </span>
            <span className="font-medium">{label}</span>
            {status && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusTone === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : statusTone === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}`}>
                    {status}
                </span>
            )}
        </div>
    );
};

const SummaryItem = ({ icon: Icon, label, value, className }: { icon: any, label: string, value: string | React.ReactNode, className?: string }) => (
    <div className={cn("flex items-start gap-2.5 py-1.5 border-b border-border/50 last:border-0", className)}>
        <div className="mt-0.5 p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
            <Icon size={12} />
        </div>
        <div className="space-y-0 min-w-0 flex-1">
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-0.5">{label}</p>
            <p className="text-[11px] font-bold text-foreground truncate">{value || '—'}</p>
        </div>
    </div>
);

// ============================================================================
// DOCUMENT PREVIEW COMPONENT
// ============================================================================



// ============================================================================
// RATE DETAILS COMPONENT
// ============================================================================

const RateDetailsView = ({ offer, discount, hasSolar, vpp, units = {} }: { offer: any, discount: number, hasSolar: boolean, vpp: boolean, units?: Record<string, string> }) => {
    const hasCL = (offer.cl1Usage || 0) > 0 || (offer.cl2Usage || 0) > 0 || (offer.cl1Supply || 0) > 0 || (offer.cl2Supply || 0) > 0;
    const hasFiT = (offer.fit || 0) > 0 || (offer.fitPeak || 0) > 0 || (offer.fitCritical || 0) > 0 || (offer.fitVpp || 0) > 0;

    const formatUnit = (key: string, fallback: string) => {
        const unitUid = offer.priceUnits?.[key];
        const isDemand = ['demand', 'demandOp', 'demandP', 'demandS'].includes(key);
        const resolvedFallback = isDemand ? '' : fallback;
        const unit = units[unitUid] || resolvedFallback;
        return unit ? `/${unit}` : '';
    };

    return (
        <div className="md:col-span-2 p-5 bg-card border border-border rounded-xl">
            <h4 className="text-sm font-bold text-foreground mb-5">{offer.offerName || 'DEFAULT MARKET OFFER'}</h4>
            <div className="flex flex-wrap gap-5">
                {/* Column 1: Energy Rates */}
                <div className="space-y-2 min-w-[180px] flex-1">
                    <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-2">
                        <Settings2Icon size={14} />
                        <span className="text-xs font-bold uppercase tracking-wide">Energy Rates</span>
                    </div>
                    {[
                        { label: 'Peak', value: offer.peak, type: 'peak' },
                        { label: 'Off-Peak', value: offer.offPeak, type: 'offPeak' },
                        { label: 'Shoulder', value: offer.shoulder, type: 'shoulder' },
                        { label: 'Anytime', value: offer.anytime, type: 'anytime' }
                    ]
                        .filter(rate => (rate.value ?? 0) > 0)
                        .sort((a, b) => calculateDiscountedRate(a.value ?? 0, discount) - calculateDiscountedRate(b.value ?? 0, discount))
                        .map((rate, idx) => {
                            const isAnytime = rate.type === 'anytime';
                            const price = calculateDiscountedRate(rate.value ?? 0, discount);
                            return (
                                <div key={idx} className={cn(
                                    "border rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm",
                                    isAnytime ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                )}>
                                    <div className={cn(
                                        "font-bold text-sm",
                                        isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                                    )}>${price.toFixed(4)}{formatUnit(rate.type, 'kWh')}</div>
                                    <div className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider opacity-80",
                                        isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                                    )}>{rate.label}</div>
                                </div>
                            );
                        })}
                </div>

                {/* Column 2: Supply Charges */}
                <div className="space-y-2 min-w-[180px] flex-1">
                    <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400 mb-2">
                        <PlugIcon size={14} />
                        <span className="text-xs font-bold uppercase tracking-wide">Supply Charges</span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                        <div className="text-purple-600 dark:text-purple-400 font-bold text-sm">${offer.supplyCharge.toFixed(4)}{formatUnit('supplyCharge', 'day')}</div>
                        <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider opacity-80">Supply</div>
                    </div>

                    {((offer.demand ?? 0) > 0 || (offer.demandOp ?? 0) > 0 || (offer.demandP ?? 0) > 0 || (offer.demandS ?? 0) > 0) && (
                        <>
                            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mb-2 mt-4">
                                <ActivityIcon size={14} />
                                <span className="text-xs font-bold uppercase tracking-wide">Demand Charges</span>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Demand', value: offer.demand },
                                    { label: 'Demand (Op)', value: offer.demandOp },
                                    { label: 'Demand (P)', value: offer.demandP },
                                    { label: 'Demand (S)', value: offer.demandS }
                                ]
                                    .filter((d): d is { label: string, value: number } => (d.value ?? 0) > 0)
                                    .map((d, id) => (
                                        <div key={id} className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                            <div className="text-rose-600 dark:text-rose-400 font-bold text-sm">${d.value.toFixed(4)}{formatUnit(d.label === 'Demand' ? 'demand' : d.label === 'Demand (Op)' ? 'demandOp' : d.label === 'Demand (P)' ? 'demandP' : 'demandS', 'kVA/day')}</div>
                                            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider opacity-80">{d.label}</div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}

                    {(offer.vppOrcharge || 0) > 0 && (
                        <>
                            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mb-2 mt-4">
                                <ActivityIcon size={14} />
                                <span className="text-xs font-bold uppercase tracking-wide">VPP Orchestration Charges</span>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">${offer.vppOrcharge.toFixed(4)}{formatUnit('vppOrcharge', 'day')}</div>
                                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider opacity-80">Orchestration</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Column 3: Solar FiT */}
                {hasFiT && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400 mb-2">
                            <ZapIcon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Solar FiT</span>
                        </div>
                        {[
                            { label: 'Feed-in', value: offer.fit, type: 'fit' },
                            { label: 'PREMIUM FIT', value: offer.fitPeak, type: 'fitPeak' },
                            { label: 'CRITICAL EVENT FIT', value: offer.fitCritical, type: 'fitCritical' },
                            { label: 'BASE FIT', value: offer.fitVpp, type: 'fitVpp' }
                        ]
                            .filter(rate => {
                                if ((rate.value ?? 0) <= 0) return false;
                                if (rate.type === 'fit') return !vpp;
                                return vpp || !hasSolar;
                            })
                            .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
                            .map((rate, idx) => (
                                <div key={idx} className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                    <div className="text-teal-800 dark:text-teal-300 font-bold text-sm">${(rate.value ?? 0).toFixed(4)}{formatUnit(rate.type, 'kWh')}</div>
                                    <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">{rate.label}</div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Column 4: Controlled Load */}
                {hasCL && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-green-500 dark:text-green-400 mb-2">
                            <PlugIcon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Controlled Load</span>
                        </div>
                        {[
                            { label: 'CL1 Usage', value: offer.cl1Usage, type: 'cl1_usage' },
                            { label: 'CL2 Usage', value: offer.cl2Usage, type: 'cl2_usage' },
                            { label: 'CL1 Supply', value: offer.cl1Supply, type: 'cl1_supply' },
                            { label: 'CL2 Supply', value: offer.cl2Supply, type: 'cl2_supply' }
                        ]
                            .filter(rate => (rate.value ?? 0) > 0)
                            .map((rate, idx) => {
                                const isUsage = rate.type.endsWith('_usage');
                                const price = isUsage ? calculateDiscountedRate(rate.value ?? 0, discount) : (rate.value ?? 0);
                                const unit = isUsage ? 'kWh' : 'day';
                                return (
                                    <div key={idx} className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                        <div className="text-green-600 dark:text-green-400 font-bold text-sm">${price.toFixed(4)}{formatUnit(rate.type === 'cl1_usage' ? 'cl1Usage' : rate.type === 'cl2_usage' ? 'cl2Usage' : rate.type === 'cl1_supply' ? 'cl1Supply' : 'cl2Supply', unit)}</div>
                                        <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">{rate.label}</div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Column 5: Dynamic Rates */}
                {offer.dynamicRates && offer.dynamicRates.length > 0 && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-2">
                            <ActivityIcon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Dynamic Rates</span>
                        </div>
                        {offer.dynamicRates.map((rate: any, idx: number) => {
                            const unitName = units[rate.unitId] || '';
                            return (
                                <div key={idx} className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                    <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">${Number(rate.value).toFixed(4)}{unitName ? `/${unitName}` : ''}</div>
                                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider opacity-80">{rate.name}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CustomerFormPage = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const isEditMode = uid && uid !== 'new';

    // Form state
    const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});


    // Step state
    const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4>(0);
    const apolloClient = useApolloClient();

    // Phone verification state
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneVerifiedAt, setPhoneVerifiedAt] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string>('');
    const [restrictedFeatureError, setRestrictedFeatureError] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [submittingStatus, setSubmittingStatus] = useState<number | null>(null);

    // Duplicate check state
    const [duplicateErrors, setDuplicateErrors] = useState<{ address?: string; nmi?: string }>({});
    const [addressSearch, setAddressSearch] = useState('');

    // Rate plans
    const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);
    const [isCustomDiscountMode, setIsCustomDiscountMode] = useState(false);
    const { hasFeatureAccess } = useAuthStore();
    const canAccessCustomDiscount = hasFeatureAccess('feature_custom_discount');
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    // Queries & Mutations
    const { data: customerData, loading: isLoadingCustomer } = useQuery(GET_CUSTOMER_BY_ID, {
        variables: { uid },
        skip: !isEditMode,
        fetchPolicy: 'network-only',
    });

    // Document upload state
    const [generatedCustomerId] = useState(() => isEditMode ? (customerData?.customer?.customerId || generateGEECustomerId()) : generateGEECustomerId());
    const [uploadingPreviousBill, setUploadingPreviousBill] = useState(false);
    const [uploadingLicense, setUploadingLicense] = useState(false);
    const [uploadingIdentityProof, setUploadingIdentityProof] = useState(false);

    const { data: activeRatesData } = useQuery(GET_ACTIVE_RATES_HISTORY, {
        fetchPolicy: 'network-only',
    });

    // Risk statuses from lookup table
    const { data: riskStatusesData } = useQuery(GET_RISK_STATUSES, {
        fetchPolicy: 'cache-and-network'
    });
    const riskStatuses = riskStatusesData?.riskStatuses || [];

    // Fetch measurement units
    const { data: unitsData } = useQuery(GET_MEASUREMENT_UNITS, {
        fetchPolicy: 'cache-first'
    });
    const unitMap = useMemo(() => {
        const map: Record<string, string> = {};
        unitsData?.measurementUnits?.forEach((u: any) => {
            map[u.uid] = u.name;
        });
        return map;
    }, [unitsData]);

    // Fetch all global rate versions for the dropdown
    const { data: allVersionsData } = useQuery(GET_RATES_HISTORY, {
        variables: { limit: 100 },
        fetchPolicy: 'network-only'
    });

    // Get active rate version for saving to customer
    const activeRateVersion = useMemo(() => {
        return activeRatesData?.globalActiveRatesHistory?.version || null;
    }, [activeRatesData]);

    const versionOptions = useMemo(() => {
        const versions = allVersionsData?.ratesHistory?.data || [];
        const options: VersionOption[] = versions.map((v: any, key: number) => ({
            value: v.version,
            label: `v-${versions.length - key} (${new Date(v.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'Australia/Sydney' })}) ${v.version === activeRateVersion ? '[ACTIVE]' : ''}`
        }));

        // Add assigned version if not in list
        const assignedVer = customerData?.customer?.rateVersion;
        if (assignedVer && !options.some(o => o.value === assignedVer)) {
            options.push({
                value: assignedVer,
                label: `v-${assignedVer} [ASSIGNED]`
            });
        }

        return options;
    }, [allVersionsData, activeRateVersion, customerData]);

    const [checkAddressExists] = useLazyQuery(CHECK_ADDRESS_EXISTS);
    const [checkNmiExists] = useLazyQuery(CHECK_NMI_EXISTS);
    const [createCustomer] = useMutation(CREATE_CUSTOMER);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    // Get customer's rate version for historic rates lookup
    const customerRateVersion = customerData?.customer?.rateVersion;

    // Use selected version override or fall back to customer's saved version
    const activeVersionForLookup = selectedVersion || customerRateVersion;

    // Fetch historic rates by version (for edit mode or when selection overrides)
    const { data: historicRatesData } = useQuery(GET_RATES_HISTORY_BY_VERSION, {
        variables: { version: activeVersionForLookup },
        skip: !activeVersionForLookup,
        fetchPolicy: 'cache-first',
    });

    // Derived Data - Parse rate plans from active or historic rates
    const ratePlans: RatePlan[] = useMemo(() => {
        // Use historic rates if version is selected/assigned
        if (activeVersionForLookup && historicRatesData?.ratesHistoryByVersion?.newRecord) {
            try {
                const parsed = typeof historicRatesData.ratesHistoryByVersion.newRecord === 'string'
                    ? JSON.parse(historicRatesData.ratesHistoryByVersion.newRecord)
                    : historicRatesData.ratesHistoryByVersion.newRecord;
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Failed to parse historic newRecord:', e);
            }
        }

        // Otherwise use active rates (for new customers or fallback)
        const record = activeRatesData?.globalActiveRatesHistory;
        if (!record?.newRecord) return [];
        try {
            const parsed = typeof record.newRecord === 'string' ? JSON.parse(record.newRecord) : record.newRecord;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to parse newRecord:', e);
            return [];
        }
    }, [activeVersionForLookup, historicRatesData, activeRatesData]);


    const tariffOptions = useMemo(() => {
        if (!formData.state) return [];
        return ratePlans
            .filter(rp => {
                const stateMatch = rp.state?.toLowerCase() === formData.state?.toLowerCase();
                const activeMatch = !rp.isDeleted && rp.isActive !== false;
                // Only show VPP plans (vpp=1) if customer is a VPP participant
                // If not a VPP participant, exclude VPP plans entirely
                const vppMatch = formData.vpp ? rp.vpp === 1 : rp.vpp !== 1;
                return stateMatch && activeMatch && vppMatch;
            })
            .map(rp => ({
                value: rp.codes,
                label: `${rp.codes} - ${rp.tariff} (${rp.state})`,
            }));
    }, [ratePlans, formData.state, formData.vpp]);

    const countryOptions = useMemo(() => {
        return getData().map((country) => ({
            value: country.code,
            label: country.name,
        }));
    }, []);



    // Load Data
    useEffect(() => {
        if (customerData?.customer) {
            const c = customerData.customer;
            setFormData({
                firstName: c.firstName || '',
                lastName: c.lastName || '',
                email: c.email || '',
                phone: c.number || '',
                gender: c.gender || 0,
                relationshipStatus: c.relationshipStatus || 0,
                enquiryAmount: c.enquiryAmount?.toString() || '',
                checkCreditScore: c.checkCreditScore === 1,
                employerName: c.employerName || '',
                dob: c.dob ? c.dob.split('T')[0] : '',
                propertyType: c.propertyType || 0,
                businessName: c.businessName || '',
                abn: c.abn || '',
                showAsBusinessName: c.showAsBusinessName || false,
                showName: c.showName ?? true,
                unitNumber: c.address?.unitNumber || '',
                streetNumber: c.address?.streetNumber || '',
                streetName: c.address?.streetName || '',
                streetType: c.address?.streetType || '',
                suburb: c.address?.suburb || '',
                state: c.address?.state || '',
                postcode: c.address?.postcode || '',
                country: c.address?.country || 'Australia',
                nmi: c.address?.nmi || '',
                hasSolar: c.solarDetails?.hassolar === 1,
                solarCapacity: c.solarDetails?.solarcapacity?.toString() || '',
                inverterCapacity: c.solarDetails?.invertercapacity?.toString() || '',
                vpp: c.vppDetails?.vpp === 1,
                vppConnected: c.vppDetails?.vppConnected === 1,
                vppSignupBonus: c.vppDetails?.vppSignupBonus?.toString() || '',
                batteryBrand: c.batteryDetails?.batterybrand || '',
                batteryCapacity: c.batteryDetails?.batterycapacity?.toString() || '',
                snNumber: c.batteryDetails?.snnumber || '',
                exportLimit: c.batteryDetails?.exportlimit?.toString() || '',
                saleType: c.enrollmentDetails?.saletype || 0,
                connectionDate: c.enrollmentDetails?.connectiondate ? c.enrollmentDetails.connectiondate.split('T')[0] : '',
                idType: c.enrollmentDetails?.idtype || 0,
                idNumber: c.enrollmentDetails?.idnumber || '',
                idState: c.enrollmentDetails?.idstate || '',
                idCountry: c.enrollmentDetails?.idcountry || '',
                idExpiry: c.enrollmentDetails?.idexpiry ? c.enrollmentDetails.idexpiry.split('T')[0] : '',
                licenseNumber: c.enrollmentDetails?.licenseNumber || '',
                licenseState: c.enrollmentDetails?.licenseState || '',
                licenseExpiry: c.enrollmentDetails?.licenseExpiry ? c.enrollmentDetails.licenseExpiry.split('T')[0] : '',
                concession: c.enrollmentDetails?.concession === 1,
                lifeSupport: c.enrollmentDetails?.lifesupport === 1,
                billingPreference: c.enrollmentDetails?.billingpreference || 0,
                directDebit: c.debitDetails?.optIn === 1,
                accountType: c.debitDetails?.accountType || 0,
                debitFirstName: c.debitDetails?.firstName || '',
                debitLastName: c.debitDetails?.lastName || '',
                bankName: c.debitDetails?.bankName || '',
                bankAddress: c.debitDetails?.bankAddress || '',
                bsb: c.debitDetails?.bsb || '',
                accountNumber: c.debitDetails?.accountNumber || '',
                paymentFrequency: c.debitDetails?.paymentFrequency || 0,
                firstDebitDate: c.debitDetails?.firstDebitDate ? c.debitDetails.firstDebitDate.split('T')[0] : '',
                tariffCode: c.tariffCode || '',
                discount: c.discount || 0,
                creditScore: c.creditScore,
                riskStatus: c.riskStatus,
                previousBill: c.previousBill || null,
                identityProof: c.identityProof || null,
                licenseDocument: c.licenseDocument || null,
                additionalDocument: c.additionalDocument || null,
            });

            if (c.phoneVerifiedAt) {
                setPhoneVerified(true);
                setPhoneVerifiedAt(c.phoneVerifiedAt);
                setOtpSent(true);
            }

            // Prefill address search field
            if (c.address) {
                const fullAddress = [
                    c.address.unitNumber ? `${c.address.unitNumber}/` : '',
                    c.address.streetNumber,
                    c.address.streetName,
                    c.address.streetType,
                    c.address.suburb,
                    c.address.state,
                    c.address.postcode
                ].filter(Boolean).join(' ').trim();
                setAddressSearch(fullAddress);
            }

            if (c.tariffCode && ratePlans.length > 0) {
                const rp = ratePlans.find(r => r.codes === c.tariffCode);
                if (rp) setSelectedRatePlan(rp);
            }

            console.log('[Edit Mode] Customer data loaded:', c);

            if (c.rateVersion && !selectedVersion) {
                setSelectedVersion(c.rateVersion);
            }
        }
    }, [customerData, ratePlans]);

    // Duplicate Check - Address
    useEffect(() => {
        if (isEditMode) return;
        const { streetNumber, streetName, suburb, postcode } = formData;
        if (!streetNumber || !streetName || !suburb || !postcode) return;

        const timer = setTimeout(async () => {
            try {
                const { data } = await checkAddressExists({
                    variables: {
                        address: {
                            unitNumber: formData.unitNumber || undefined,
                            streetNumber: formData.streetNumber,
                            streetName: formData.streetName,
                            streetType: formData.streetType || undefined,
                            suburb: formData.suburb,
                            postcode: formData.postcode,
                            state: formData.state || undefined,
                            country: formData.country || undefined,
                        }
                    }
                });
                if (data?.checkAddressExists) {
                    const existing = data.checkAddressExists;
                    setDuplicateErrors(prev => ({
                        ...prev,
                        address: `Address already exists: ${existing.firstName} ${existing.lastName} (${existing.customerId})`
                    }));
                } else {
                    setDuplicateErrors(prev => ({ ...prev, address: undefined }));
                }
            } catch (err) { console.error('Address check failed:', err); }
        }, 800);
        return () => clearTimeout(timer);
    }, [formData.unitNumber, formData.streetNumber, formData.streetName, formData.streetType, formData.suburb, formData.postcode, formData.state, isEditMode, checkAddressExists]);

    // Duplicate Check - NMI
    useEffect(() => {
        if (isEditMode) return;
        const nmi = formData.nmi;
        if (!nmi || nmi.length < 10) return;

        const timer = setTimeout(async () => {
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
            } catch (err) { console.error('NMI check failed:', err); }
        }, 800);
        return () => clearTimeout(timer);
    }, [formData.nmi, isEditMode, checkNmiExists]);

    // Immediate duplicate check functions
    const checkAddressDuplicate = async (addressData: {
        unitNumber?: string;
        streetNumber: string;
        streetName: string;
        streetType?: string;
        suburb: string;
        postcode: string;
        state?: string;
        country?: string;
    }) => {
        if (isEditMode) return;
        if (!addressData.streetNumber || !addressData.streetName || !addressData.suburb || !addressData.postcode) return;

        try {
            const { data } = await checkAddressExists({
                variables: {
                    address: {
                        unitNumber: addressData.unitNumber || undefined,
                        streetNumber: addressData.streetNumber,
                        streetName: addressData.streetName,
                        streetType: addressData.streetType || undefined,
                        suburb: addressData.suburb,
                        postcode: addressData.postcode,
                        state: addressData.state || undefined,
                        country: addressData.country || undefined,
                    }
                }
            });
            if (data?.checkAddressExists) {
                const existing = data.checkAddressExists;
                setDuplicateErrors(prev => ({
                    ...prev,
                    address: `Address already exists: ${existing.firstName} ${existing.lastName} (${existing.customerId})`
                }));
            } else {
                setDuplicateErrors(prev => ({ ...prev, address: undefined }));
            }
        } catch (err) {
            console.error('Address check failed:', err);
        }
    };

    const checkNmiDuplicate = async (nmi: string) => {
        if (isEditMode) return;
        if (!nmi || nmi.length < 10) return;

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

    // Handlers
    const handleSendOTP = async () => {
        if (!formData.phone?.trim()) return toast.error('Enter a mobile number first');
        if (phoneVerified) return toast.info('Phone is already verified');
        setOtpSending(true);
        try {
            await sendVerification(formData.phone);
            setOtpSent(true);
            toast.success('Verification code sent');
        } catch (err: any) { toast.error(err.message || 'Failed to send verification code'); }
        finally { setOtpSending(false); }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode.trim()) return setVerificationError('Enter code');
        setOtpVerifying(true);
        setVerificationError('');
        try {
            const ok = await checkVerification(formData.phone, otpCode);
            if (ok) {
                setPhoneVerified(true);
                setPhoneVerifiedAt(new Date().toISOString());
                toast.success('Phone verified successfully');
                setVerificationError('');
            } else { setVerificationError('Invalid code'); }
        } catch (err: any) { setVerificationError('Verification failed'); }
        finally { setOtpVerifying(false); }
    };

    const handleTariffChange = (code: string) => {
        setFormData(prev => ({ ...prev, tariffCode: code }));
        const rp = ratePlans.find(r => r.codes === code);
        setSelectedRatePlan(rp || null);
        if (rp) {
            setFormData(prev => ({ ...prev, discount: rp.discountPercentage || 0 }));
        }
    };

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Field-level validation
    const validateField = (name: string, value: any): string => {
        // Required fields
        let isRequired = ['firstName', 'lastName', 'email', 'phone', 'streetNumber', 'streetName', 'suburb', 'postcode', 'nmi'].includes(name);

        // Conditional demographic requirements
        if (formData.checkCreditScore) {
            const requiredFields = ['gender', 'relationshipStatus', 'enquiryAmount', 'dob', 'licenseNumber', 'licenseState', 'licenseExpiry'];
            if (formData.idType === 0) {
                requiredFields.push('licenseDocument');
            }
            if (requiredFields.includes(name)) {
                isRequired = true;
            }
        }

        if (isRequired && (value === undefined || value === null || (typeof value === 'string' && !value.trim()))) {
            return 'This field is required';
        }

        switch (name) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
                break;
            case 'phone':
                if (!/^\d+$/.test(value.replace(/\s/g, ''))) return 'Mobile number must contain digits only';
                if (value.replace(/\s/g, '').length < 10) return 'Mobile number must be at least 10 digits';
                break;
            case 'nmi':
                if (!/^\d+$/.test(value)) return 'NMI must contain digits only';
                // if (value.length !== 10 && value.length !== 11) return 'NMI must be 10 or 11 digits';
                break;
            case 'postcode':
                if (!/^\d{4}$/.test(value)) return 'Postcode must be 4 digits';
                break;
        }
        return '';
    };

    const handleBlur = (field: keyof CustomerFormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const updateField = (field: keyof CustomerFormData, value: any) => {
        // Enforce input masking for specific fields
        let finalValue = value;

        if (field === 'phone' || field === 'nmi') {
            // Remove non-numeric characters for these fields if user is typing
            // Allow spaces for phone for readability if desired, but request said "only number should be able to write"
            // Let's implement strict number enforcement for simplicity as per request
            if (typeof value === 'string') {
                finalValue = value.replace(/\D/g, '');
            }
        }


        setFormData(prev => ({ ...prev, [field]: finalValue }));
        setIsFormDirty(true);

        // Clear demographic errors if Check Credit Score is toggled off
        if (field === 'checkCreditScore' && !finalValue) {
            setErrors(prev => ({
                ...prev,
                gender: '',
                relationshipStatus: '',
                employerName: '',
                enquiryAmount: '',
                dob: ''
            }));
        }

        // If already touched, validate immediately
        if (touched[field]) {
            const error = validateField(field, finalValue);
            setErrors(prev => ({ ...prev, [field]: error }));
        } else if (errors[field]) {
            // Clear error if it exists but field is "untouched" (unlikely but good safety) or just clear it
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validation
    const step0Valid = useMemo(() => {
        const required = !!(
            formData.phone?.trim() &&
            formData.streetNumber?.trim() &&
            formData.streetName?.trim() &&
            formData.suburb?.trim() &&
            formData.postcode?.trim() &&
            formData.nmi?.trim() &&
            !duplicateErrors.address &&
            !duplicateErrors.nmi
        );
        if (formData.propertyType === 1) {
            return required && !!(formData.businessName?.trim() && formData.abn?.trim());
        }
        return required;
    }, [formData, duplicateErrors]);

    const step1Valid = useMemo(() => !!formData.tariffCode, [formData.tariffCode]);

    const step2Valid = useMemo(() => {
        return !!(
            formData.firstName?.trim() &&
            formData.lastName?.trim() &&
            formData.email?.trim() &&
            formData.connectionDate
        );
    }, [formData]);

    const step3Valid = useMemo(() => {
        if (formData.checkCreditScore) {
            return !!(
                formData.licenseNumber?.trim() &&
                formData.licenseState &&
                formData.licenseExpiry &&
                (formData.idType !== 0 || formData.licenseDocument) &&
                formData.employerName?.trim() &&
                formData.enquiryAmount?.trim() &&
                formData.gender !== undefined &&
                formData.relationshipStatus !== undefined &&
                formData.dob
            );
        }

        return true;
    }, [formData]);

    const canProceed = () => {
        switch (currentStep) {
            case 0: return step0Valid;
            case 1: return step1Valid;
            case 2: return step2Valid;
            case 3: return step3Valid;
            default: return true;
        }
    };

    const allStepsValid = useMemo(() => step0Valid && step1Valid && step2Valid && step3Valid, [step0Valid, step1Valid, step2Valid, step3Valid]);

    // Submit
    const handleSubmit = async (targetStatus: number = 1) => {
        setSubmittingStatus(targetStatus);

        // If phone is verified and we are submitting as active (1), set status to 2 (Signature Pending)
        let finalStatus = targetStatus;
        if (targetStatus === 1 && phoneVerified) {
            finalStatus = 2;
        }

        // Temporarily disable dirty check to allow navigation
        setIsFormDirty(false);
        try {
            let creditScoreData = {};

            // Credit Score Check (Only on Create)
            if (!isEditMode && formData.checkCreditScore) {
                try {


                    const equifaxPayload = {
                        "first-name": "Pal",
                        "first-given-name": "Patel",
                        "address": {
                            "street-name": "COOYAL",
                            "street-type": "PL",
                            "suburb": "GLENWOOD",
                            "state-code": "NSW"
                        },
                        "license-number": "DL123456",
                        "gender-code": "M",
                        "date-of-birth": "2003-03-19",
                        "employer-name": "DATA FISH PTY LTD",
                        "account-type-code": "CC",
                        "enquiry-amount": 1000,
                        "relationship-code": "1",
                        "client-reference": "T3D-20251209051318-ed8bc2",
                        "enquiry-client-reference": "12344556"
                    };
                    // const equifaxPayload = {
                    //     "first-name": formData.firstName,
                    //     "first-given-name": formData.lastName,
                    //     "address": {
                    //         "street-name": formData.streetName,
                    //         "street-type": formData.streetType,
                    //         "suburb": formData.suburb,
                    //         "state-code": formData.state
                    //     },
                    //     "license-number": formData.licenseNumber,
                    //     "gender-code": formData.gender === 0 ? 'M' : (formData.gender === 1 ? 'F' : 'O'),
                    //     "date-of-birth": formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '',
                    //     "employer-name": formData.employerName,
                    //     "account-type-code": "CC",
                    //     "enquiry-amount": Number(formData.enquiryAmount) || 0,
                    //     "relationship-code": String(formData.relationshipStatus || '1'),
                    //     "client-reference": `REF-${Date.now()}`,
                    //     "enquiry-client-reference": formData.phone || ''
                    // };

                    const response = await secondaryApiAxios.post('/api/v1/equifax/user/get-credit-report', equifaxPayload);

                    let score: number | undefined;
                    let riskStatusUid: string | undefined;

                    // Handle various response formats
                    if (response.data?.creditScoreData?.score?.score_masterscale) {
                        // Standard Equifax Nested Response
                        score = parseInt(response.data.creditScoreData.score.score_masterscale);
                    } else if (response.data?.creditScore) {
                        // Direct Object Response
                        score = parseInt(response.data.creditScore);
                    } else if (Array.isArray(response.data) && response.data.length >= 2) {
                        // Array Response - pick the larger value as score
                        const v1 = parseInt(response.data[0]);
                        const v2 = parseInt(response.data[1]);
                        score = v1 > 100 ? v1 : v2;
                    } else if (typeof response.data === 'string') {
                        // Text response "1 577" or similar
                        const parts = response.data.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            const v1 = parseInt(parts[0]);
                            const v2 = parseInt(parts[1]);
                            score = v1 > 100 ? v1 : v2;
                        } else if (parts.length === 1 && !isNaN(parseInt(parts[0]))) {
                            score = parseInt(parts[0]);
                        }
                    } else if (typeof response.data === 'number') {
                        score = response.data;
                    }

                    // Look up risk status from the database lookup table by score range
                    if (score !== undefined && !isNaN(score)) {
                        const matched = riskStatuses.find((rs: any) => {
                            if (rs.scoreMin === null && rs.scoreMax === null) return false; // Skip "Pending"
                            const minOk = rs.scoreMin === null || score! >= rs.scoreMin;
                            const maxOk = rs.scoreMax === null || score! < rs.scoreMax;
                            return minOk && maxOk;
                        });
                        if (matched) {
                            riskStatusUid = matched.uid;
                        }
                    }

                    if (riskStatusUid) {
                        creditScoreData = {
                            creditScore: score,
                            isCreditScoreFetched: 1,
                            riskStatus: riskStatusUid
                        };
                        // toast.success(`Credit check passed. Score: ${score}`);
                    }

                } catch (error) {
                    console.error('Credit check failed:', error);
                    toast.error('Credit check failed. Customer creation aborted.');
                    setIsFormDirty(true);
                    setSubmittingStatus(null);
                    return; // Abort creation if credit check fails (optional, but safer)
                }
            }

            // Determine if an update email should be triggered based on significant field changes
            const hasSignificantChanges = () => {
                if (!isEditMode || !customerData?.customer) return false;
                const c = customerData.customer;

                // Significant fields that trigger an "Updated" email
                const checks = [
                    formData.firstName !== (c.firstName || ''),
                    formData.lastName !== (c.lastName || ''),
                    formData.businessName !== (c.businessName || ''),
                    formData.abn !== (c.abn || ''),
                    formData.phone !== (c.number || ''),
                    formData.propertyType !== (c.propertyType || 0),
                    formData.tariffCode !== (c.tariffCode || ''),
                    formData.discount !== (c.discount || 0),
                    (activeVersionForLookup || activeRateVersion) !== (c.rateVersion || ''),

                    // Address fields
                    formData.unitNumber !== (c.address?.unitNumber || ''),
                    formData.streetNumber !== (c.address?.streetNumber || ''),
                    formData.streetName !== (c.address?.streetName || ''),
                    formData.streetType !== (c.address?.streetType || ''),
                    formData.suburb !== (c.address?.suburb || ''),
                    formData.state !== (c.address?.state || ''),
                    formData.postcode !== (c.address?.postcode || ''),
                    formData.nmi !== (c.address?.nmi || ''),

                    // Solar/Battery details
                    (formData.hasSolar ? 1 : 0) !== (c.solarDetails?.hassolar || 0),
                    formData.solarCapacity !== (c.solarDetails?.solarcapacity?.toString() || ''),
                    formData.inverterCapacity !== (c.solarDetails?.invertercapacity?.toString() || ''),

                    // VPP details
                    (formData.vpp ? 1 : 0) !== (c.vppDetails?.vpp || 0),
                    (formData.vppConnected ? 1 : 0) !== (c.vppDetails?.vppConnected || 0),
                    formData.vppSignupBonus !== (c.vppDetails?.vppSignupBonus?.toString() || ''),

                    // Debit details
                    (formData.directDebit ? 1 : 0) !== (c.debitDetails?.optIn || 0),
                    formData.bankName !== (c.debitDetails?.bankName || ''),
                    formData.bsb !== (c.debitDetails?.bsb || ''),
                    formData.accountNumber !== (c.debitDetails?.accountNumber || ''),
                ];

                return checks.some(changed => changed);
            };

            const significantChanges = hasSignificantChanges();

            const input = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                abn: formData.abn,
                showAsBusinessName: formData.showAsBusinessName,
                showName: formData.showName,
                number: formData.phone,
                dob: formData.dob || null,
                phoneVerifiedAt: phoneVerifiedAt,
                propertyType: formData.propertyType,
                tariffCode: formData.tariffCode,
                discount: formData.discount,
                status: finalStatus,
                gender: formData.gender,
                relationshipStatus: formData.relationshipStatus,
                enquiryAmount: formData.enquiryAmount ? parseFloat(formData.enquiryAmount) : undefined,
                checkCreditScore: formData.checkCreditScore ? 1 : 0,
                employerName: formData.employerName,
                ...creditScoreData, // Add credit score data to input
                enrollmentDetails: {
                    saletype: formData.saleType,
                    connectiondate: formData.connectionDate || null,
                    idtype: formData.idType,
                    idnumber: formData.idNumber || undefined,
                    idstate: formData.idState || undefined,
                    idcountry: formData.idCountry || undefined,
                    idexpiry: formData.idExpiry || null,
                    concession: formData.concession ? 1 : 0,
                    lifesupport: formData.lifeSupport ? 1 : 0,
                    billingpreference: formData.billingPreference,
                    licenseNumber: formData.licenseNumber,
                    licenseState: formData.licenseState,
                    licenseExpiry: formData.licenseExpiry || null,
                },
                address: {
                    unitNumber: formData.unitNumber || undefined,
                    streetNumber: formData.streetNumber,
                    streetName: formData.streetName,
                    streetType: formData.streetType || undefined,
                    suburb: formData.suburb,
                    state: formData.state,
                    postcode: formData.postcode,
                    country: formData.country || 'Australia',
                    nmi: formData.nmi || undefined,
                },
                solarDetails: formData.hasSolar ? {
                    hassolar: 1,
                    solarcapacity: formData.solarCapacity ? parseFloat(formData.solarCapacity) : undefined,
                    invertercapacity: formData.inverterCapacity ? parseFloat(formData.inverterCapacity) : undefined,
                } : { hassolar: 0 },
                batteryDetails: formData.batteryBrand ? {
                    batterybrand: formData.batteryBrand,
                    snnumber: formData.snNumber || undefined,
                    batterycapacity: formData.batteryCapacity ? parseFloat(formData.batteryCapacity) : undefined,
                    exportlimit: formData.exportLimit ? parseFloat(formData.exportLimit) : undefined,
                } : undefined,
                vppDetails: {
                    vpp: formData.vpp ? 1 : 0,
                    vppConnected: formData.vppConnected ? 1 : 0,
                    vppSignupBonus: formData.vppSignupBonus ? parseFloat(formData.vppSignupBonus) : (formData.vppSignupBonus === null ? null : undefined),
                },
                debitDetails: undefined,
                previousBill: formData.previousBill?.uid,
                identityProof: formData.identityProof?.uid,
                licenseDocument: formData.licenseDocument?.uid,
                rateVersion: activeVersionForLookup || activeRateVersion,
                customerId: isEditMode ? undefined : generatedCustomerId,
                triggerWelcomeEmail: isEditMode ? (finalStatus === 2) : undefined,
                triggerUpdateEmail: isEditMode ? significantChanges : undefined,
            };

            let savedCustomer;
            if (isEditMode) {
                const { data } = await updateCustomer({ variables: { uid, input } });
                savedCustomer = data?.updateCustomer;
                toast.success(savedCustomer?.message || 'Customer updated successfully');
            } else {
                const { data } = await createCustomer({ variables: { input } });
                savedCustomer = data?.createCustomer;
                toast.success(savedCustomer?.message || 'Customer created successfully');
            }

            // Clear customer cache to ensure fresh data on customers page
            apolloClient.cache.evict({ fieldName: 'customers' });
            apolloClient.cache.evict({ fieldName: 'customersCursor' });
            apolloClient.cache.gc();

            // Handle redirection
            const customerUid = savedCustomer?.uid || uid;
            if (finalStatus === 2 && customerUid) {
                // Redirect to details page if an offer was sent
                navigate(`/customers/${customerUid}`);
            } else {
                // Otherwise redirect back to the list (for drafts)
                navigate('/customers');
            }
        } catch (err: any) {
            console.error('Failed to save customer:', err);
            toast.error(err.message || 'Failed to save customer');
            // Re-enable dirty check if failed
            setIsFormDirty(true);
        } finally { setSubmittingStatus(null); }
    };

    // Navigation Blocking
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isFormDirty && currentLocation.pathname !== nextLocation.pathname
    );

    // Browser Refresh/Close Warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isFormDirty]);

    // Auto-sync License Fields when ID Type is Licence (0)
    useEffect(() => {
        if (formData.idType === 0) {
            updateField('licenseNumber', formData.idNumber);
            updateField('licenseState', formData.idState);
            updateField('licenseExpiry', formData.idExpiry);
        }
    }, [formData.idType, formData.idNumber, formData.idState, formData.idExpiry]);

    if (isEditMode && isLoadingCustomer) {
        return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="cursor-pointer hover:text-foreground" onClick={() => navigate('/customers')}>Customers</span>
                <ChevronRightIcon size={14} />
                <span className="text-foreground font-medium">{isEditMode ? 'Edit Customer' : 'New Customer'}</span>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6 min-w-0 w-full">
                    {/* Stepper */}
                    <div className="flex flex-wrap gap-3">
                        <div onClick={() => setCurrentStep(0)}><StepBadge index={1} label="Contact" active={currentStep === 0} done={currentStep > 0} status={phoneVerified ? 'Verified' : undefined} statusTone={phoneVerified ? 'success' : undefined} /></div>
                        <div onClick={() => step0Valid && setCurrentStep(1)}><StepBadge index={2} label="Pricing" active={currentStep === 1} done={currentStep > 1} /></div>
                        <div onClick={() => step1Valid && setCurrentStep(2)}><StepBadge index={3} label="Sign-up" active={currentStep === 2} done={currentStep > 2} /></div>
                        <div onClick={() => step2Valid && setCurrentStep(3)}><StepBadge index={4} label="Credit Score" active={currentStep === 3} done={currentStep > 3} /></div>
                        <div onClick={() => step3Valid && setCurrentStep(4)}><StepBadge index={5} label="Confirm" active={currentStep === 4} done={false} /></div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-background rounded-xl border border-border shadow-sm p-6 lg:p-6 flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
                        {/* Form Content - Scrollable */}
                        <div className="flex-1 p-2 overflow-y-auto scrollbar-thin">

                            {/* Step 0: Contact & Property */}
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    {/* Identity & Contact */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                                            <UserIcon size={20} /> Identity
                                        </h2>


                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Field label="Mobile" required error={errors.phone}>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <Input containerClassName="w-full sm:w-64" placeholder="+61 400 000 000" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} onBlur={() => handleBlur('phone')} />
                                                    <Button
                                                        onClick={handleSendOTP}
                                                        type="button"
                                                        variant="outline"
                                                        className={`gap-2 ${otpSending || !formData.phone || phoneVerified
                                                            ? 'border-neutral-300 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 opacity-60'
                                                            : 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                                                            }`}
                                                        disabled={otpSending || !formData.phone || phoneVerified}
                                                        isLoading={otpSending}
                                                        loadingText="Sending…"
                                                    >
                                                        {otpSent ? 'Resend' : 'Send code'}
                                                    </Button>
                                                    <div className="relative">
                                                        <input
                                                            className={`w-28 px-3 py-2 rounded-xl border bg-background text-foreground ${phoneVerified
                                                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                                                                : verificationError
                                                                    ? 'border-red-500 focus:ring-red-200'
                                                                    : 'border-border'
                                                                }`}
                                                            placeholder="Code"
                                                            value={otpCode}
                                                            onChange={(e) => {
                                                                setOtpCode(e.target.value);
                                                                if (verificationError) setVerificationError('');
                                                            }}
                                                            disabled={phoneVerified}
                                                            maxLength={6}
                                                        />
                                                        {verificationError && (
                                                            <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium whitespace-nowrap">
                                                                {verificationError}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Button
                                                        onClick={handleVerifyOTP}
                                                        type="button"
                                                        variant="outline"
                                                        className={`gap-2 ${phoneVerified
                                                            ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                                            : 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                                                            } ${otpVerifying || phoneVerified || !otpSent || !otpCode
                                                                ? 'opacity-70'
                                                                : ''
                                                            }`}
                                                        disabled={otpVerifying || phoneVerified || !otpSent || !otpCode}
                                                        isLoading={otpVerifying}
                                                        loadingText="Verifying…"
                                                    >
                                                        {phoneVerified ? 'Verified ✓' : 'Verify'}
                                                    </Button>
                                                    {phoneVerified && phoneVerifiedAt && (
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            at {formatDateTime(phoneVerifiedAt)}
                                                        </span>
                                                    )}
                                                </div>
                                            </Field>

                                            <Field label="Property Type">
                                                <div className="flex gap-2">
                                                    {(['residential', 'commercial'] as const).map((type, idx) => (
                                                        <Button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => updateField('propertyType', idx)}
                                                            variant="outline"
                                                            className={`capitalize ${formData.propertyType === idx ? 'bg-primary text-white border-primary hover:bg-primary/90 hover:text-white' : 'bg-background text-foreground border-border hover:bg-accent'}`}
                                                        >
                                                            {type}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Field>
                                        </div>

                                        {formData.propertyType === 1 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-xl border border-dashed border-border">
                                                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="showAsBusinessName"
                                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                            checked={formData.showAsBusinessName}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked;
                                                                if (!newValue && !formData.showName) {
                                                                    // Prevent unchecking if it's the last one, or force specific behavior?
                                                                    // User requirement: "both cannot be unchecked"
                                                                    // If I uncheck this, showName MUST be true.
                                                                    // If showName is false, keep this checked OR check showName.
                                                                    // Decision: Auto-check the other is smoother.
                                                                    updateField('showName', true);
                                                                }
                                                                updateField('showAsBusinessName', newValue);
                                                            }}
                                                        />
                                                        <label htmlFor="showAsBusinessName" className="text-sm cursor-pointer select-none">Show as Business Name</label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="showName"
                                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                            checked={formData.showName ?? true}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked;
                                                                if (!newValue && !formData.showAsBusinessName) {
                                                                    updateField('showAsBusinessName', true);
                                                                }
                                                                updateField('showName', newValue);
                                                            }}
                                                        />
                                                        <label htmlFor="showName" className="text-sm cursor-pointer select-none">Show Name in Offer</label>
                                                    </div>
                                                </div>
                                                <Input label="Business Name" required error={errors.businessName} placeholder="Registered business name" value={formData.businessName} onChange={(e) => updateField('businessName', e.target.value)} />
                                                <Input label="ABN" required error={errors.abn} placeholder="e.g. 12 345 678 901" value={formData.abn} onChange={(e) => updateField('abn', e.target.value)} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Solar & VPP - Collapsible */}
                                    <details open={formData.hasSolar} className="rounded-xl border border-border group">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-accent rounded-xl">
                                            <div className="flex items-center gap-2 font-medium">
                                                <ZapIcon size={20} className="text-yellow-500" />
                                                <span>Solar at this property?</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ToggleSwitch checked={formData.hasSolar} onChange={(checked) => updateField('hasSolar', checked)} />
                                                <span className="text-sm text-neutral-600 w-20 text-right">{formData.hasSolar ? 'Has Solar' : 'No Solar'}</span>
                                                <div className="transform transition-transform group-open:rotate-180"><ChevronRightIcon size={16} className="rotate-90" /></div>
                                            </div>
                                        </summary>

                                        {formData.hasSolar && (
                                            <div className="p-4 border-t border-border space-y-6 bg-muted/30">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input label="Solar Capacity (kW)" type="number" step="any" placeholder="6.6" value={formData.solarCapacity} onChange={(e) => updateField('solarCapacity', e.target.value)} />
                                                    <Input label="Inverter Capacity (kW)" type="number" step="any" placeholder="5.0" value={formData.inverterCapacity} onChange={(e) => updateField('inverterCapacity', e.target.value)} />
                                                </div>
                                            </div>
                                        )}
                                    </details>

                                    {/* VPP Section - Standalone */}
                                    <div className={`rounded-xl border transition-all duration-300 ${formData.vpp ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.vpp ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                    <ZapIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">VPP Participant</span>
                                                    <span className="text-xs text-muted-foreground">Enroll customer in Virtual Power Plant</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-medium ${formData.vpp ? 'text-primary' : 'text-muted-foreground'}`}>
                                                    {formData.vpp ? 'Active' : 'Inactive'}
                                                </span>
                                                <ToggleSwitch checked={formData.vpp} onChange={(checked) => updateField('vpp', checked)} />
                                            </div>
                                        </div>

                                        {formData.vpp && (
                                            <div className="p-4 pt-0 space-y-5 animate-in slide-in-from-top-2 duration-300">
                                                {/* Signup Bonus Card */}
                                                <div className="p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                                            <ZapIcon size={14} />
                                                            VPP SIGNUP BONUS
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                                                            Eligible customers receive a $50 monthly bill credit for 12 months, totaling $600 in value.
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => updateField('vppSignupBonus', formData.vppSignupBonus === '600' ? null : '600')}
                                                        className={cn(
                                                            "shrink-0 transition-all font-semibold shadow-sm",
                                                            formData.vppSignupBonus === '600'
                                                                ? "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent"
                                                                : "bg-transparent border-primary/20 text-primary hover:bg-primary/10"
                                                        )}
                                                        variant={formData.vppSignupBonus === '600' ? 'default' : 'outline'}
                                                    >
                                                        {formData.vppSignupBonus === '600' ? (
                                                            <><CheckIcon className="w-3 h-3 mr-1.5" /> Bonus Applied</>
                                                        ) : (
                                                            'Add $600 Bonus'
                                                        )}
                                                    </Button>
                                                </div>

                                                {/* Battery details moved to Customer Modal on VPP Connect */}
                                            </div>
                                        )}
                                    </div>


                                    {/* Address */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                                            <HomeIcon size={20} /> Address
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Field label="Address" hint="Start typing to verify address" required error={duplicateErrors.address}>
                                                <LocationAutocomplete
                                                    value={addressSearch}
                                                    onChange={setAddressSearch}
                                                    onSelect={(place) => {
                                                        setAddressSearch(place.address);
                                                        const newAddressData = {
                                                            unitNumber: place.unitNumber || '',
                                                            streetNumber: place.streetNumber || '',
                                                            streetName: place.streetName || '',
                                                            streetType: place.streetType || '',
                                                            suburb: place.suburb || '',
                                                            state: place.state || '',
                                                            postcode: place.postcode || '',
                                                            country: place.country || 'Australia',
                                                        };
                                                        setFormData(prev => ({ ...prev, ...newAddressData }));
                                                        // Immediately check for duplicate address
                                                        checkAddressDuplicate(newAddressData);
                                                    }}
                                                    placeholder="Start typing address..."
                                                />
                                            </Field>
                                            <Input
                                                label="NMI"
                                                required
                                                helperText="10-11 digits"
                                                error={errors.nmi || duplicateErrors.nmi}
                                                value={formData.nmi}
                                                onChange={(e) => updateField('nmi', e.target.value)}
                                                onBlur={() => {
                                                    handleBlur('nmi');
                                                    // Immediately check for duplicate NMI
                                                    checkNmiDuplicate(formData.nmi);
                                                }}
                                                maxLength={11}
                                                placeholder="1234567890"
                                            />
                                        </div>

                                        {/* Auto-sync License Fields when ID Type is Licence - MOVED TO TOP LEVEL */}

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                                            <div className="col-span-2 lg:col-span-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Detailed Breakdown</div>
                                            <Input label="Unit No." disabled className="bg-background" value={formData.unitNumber} onChange={(e) => updateField('unitNumber', e.target.value)} onBlur={() => handleBlur('unitNumber')} placeholder="e.g. 5" />
                                            <Input label="Street No." disabled required error={errors.streetNumber} className="bg-background" value={formData.streetNumber} onChange={(e) => updateField('streetNumber', e.target.value)} onBlur={() => handleBlur('streetNumber')} placeholder="e.g. 123" />
                                            <Input label="Street Name" disabled required error={errors.streetName} className="bg-background" value={formData.streetName} onChange={(e) => updateField('streetName', e.target.value)} onBlur={() => handleBlur('streetName')} placeholder="e.g. Smith" />
                                            <Select label="Type" disabled options={streetTypeOptions} value={formData.streetType} onChange={(val) => updateField('streetType', val)} placeholder="Type" />
                                            <Input label="Suburb" disabled required error={errors.suburb} className="bg-background" value={formData.suburb} onChange={(e) => updateField('suburb', e.target.value)} onBlur={() => handleBlur('suburb')} placeholder="e.g. Collingwood" />
                                            <Select label="State" disabled options={STATE_OPTIONS} value={formData.state} onChange={(val) => updateField('state', val as string)} placeholder="State" />
                                            <Input label="Postcode" disabled required error={errors.postcode} className="bg-background" value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} onBlur={() => handleBlur('postcode')} maxLength={4} placeholder="e.g. 3066" />
                                            <Input label="Country" disabled className="bg-background" value={formData.country} onChange={(e) => updateField('country', e.target.value)} />
                                        </div>


                                    </div>
                                </div>
                            )}

                            {/* Step 1: Pricing */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-border pb-2">
                                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                            <ShieldIcon size={20} className="text-neutral-700" /> Select tariff & discount
                                            {isEditMode ? (
                                                <div className="ml-4 flex items-center gap-2 min-w-[240px]">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">Rate Version</span>
                                                    <Select
                                                        containerClassName="w-full"
                                                        placeholder="Select version"
                                                        options={versionOptions}
                                                        value={activeVersionForLookup || activeRateVersion || ''}
                                                        onChange={(val) => {
                                                            setSelectedVersion(val as string);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="ml-2 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-mono tracking-tight flex items-center gap-1">
                                                    <span className="opacity-60 text-[10px] font-bold">v-</span>
                                                    {activeRateVersion}
                                                </div>
                                            )}
                                        </h2>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Role limited</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                        <Select label="Tariff Code" required options={tariffOptions} value={formData.tariffCode} onChange={(val) => handleTariffChange(val as string)} placeholder="Select tariff" />
                                        {/* Discount Field with Pill Selector */}
                                        {selectedRatePlan?.discountApplies === 1 && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-title leading-none block">
                                                    Discount
                                                </label>

                                                <div className="flex flex-wrap items-center gap-2 min-h-[40px] pt-1.5">
                                                    {/* Standard Options */}
                                                    {['0', '5', '7', '10', '13', '15'].map((opt) => {
                                                        const isActive = !isCustomDiscountMode && formData.discount?.toString() === opt;
                                                        return (
                                                            <button
                                                                key={opt}
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsCustomDiscountMode(false);
                                                                    updateField('discount', parseFloat(opt));
                                                                }}
                                                                className={cn(
                                                                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-all h-8",
                                                                    isActive
                                                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                                        : "bg-white text-neutral-600 border-border hover:border-neutral-400 hover:text-neutral-900"
                                                                )}
                                                            >
                                                                {opt}%
                                                            </button>
                                                        );
                                                    })}

                                                    {/* Custom Option */}
                                                    {canAccessCustomDiscount && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsCustomDiscountMode(true);
                                                                }}
                                                                className={cn(
                                                                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-all h-8",
                                                                    (isCustomDiscountMode || (formData.discount !== undefined && !['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '')))
                                                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                                        : "bg-white text-neutral-600 border-border hover:border-neutral-400 hover:text-neutral-900"
                                                                )}
                                                            >
                                                                Custom
                                                            </button>

                                                            {/* Custom Input - Inline */}
                                                            <div className={cn(
                                                                "overflow-hidden transition-all duration-300 ease-in-out flex items-center gap-2",
                                                                (isCustomDiscountMode || (formData.discount !== undefined && !['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '')))
                                                                    ? "w-[120px] opacity-100"
                                                                    : "w-0 opacity-0"
                                                            )}>
                                                                <div className="relative w-full">
                                                                    <Input
                                                                        type="number"
                                                                        value={!['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '') ? (formData.discount ?? '') : ''}
                                                                        onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
                                                                        placeholder="0"
                                                                        className="h-8 text-xs pr-6"
                                                                        min={0}
                                                                        max={100}
                                                                        step={0.01}
                                                                    />
                                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">%</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {selectedRatePlan?.offers?.map((offer) => {
                                            const discount = formData.discount || 0;
                                            const hasCL = (offer.cl1Usage || 0) > 0 || (offer.cl2Usage || 0) > 0 || (offer.cl1Supply || 0) > 0 || (offer.cl2Supply || 0) > 0;
                                            const hasFiT = (offer.fit || 0) > 0 || (offer.fitPeak || 0) > 0 || (offer.fitCritical || 0) > 0 || (offer.fitVpp || 0) > 0;

                                            // Calculate yearly savings estimation
                                            // Typical annual usage: 4000 kWh residential, 10000 kWh commercial
                                            // const typicalKwh = formData.propertyType === 1 ? 10000 : 4000;

                                            // // Get primary energy rate (anytime if flat rate, or weighted average for TOU)
                                            // const getBaseEnergyRate = () => {
                                            //     if (offer.anytime > 0) return offer.anytime;
                                            //     // For TOU tariffs, use weighted average (40% peak, 30% shoulder, 30% off-peak typical distribution)
                                            //     const touRates = [];
                                            //     if (offer.peak > 0) touRates.push({ rate: offer.peak, weight: 0.4 });
                                            //     if (offer.shoulder > 0) touRates.push({ rate: offer.shoulder, weight: 0.3 });
                                            //     if (offer.offPeak > 0) touRates.push({ rate: offer.offPeak, weight: 0.3 });
                                            //     if (touRates.length === 0) return 0;
                                            //     // Normalize weights
                                            //     const totalWeight = touRates.reduce((sum, r) => sum + r.weight, 0);
                                            //     return touRates.reduce((sum, r) => sum + (r.rate * r.weight / totalWeight), 0);
                                            // };

                                            // const baseRate = getBaseEnergyRate();
                                            // const usageCost = baseRate * typicalKwh;
                                            // const yearlySaving = (usageCost * discount) / 100;



                                            return (
                                                <div key={offer.id} className="p-6 bg-card border border-border rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div>
                                                            <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">{offer.offerName}</h3>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-8">
                                                        {/* Column 1: Energy Rates */}
                                                        <div className="space-y-4 min-w-[180px] flex-1">
                                                            <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                                                                <Settings2Icon size={16} />
                                                                <h4 className="text-sm font-bold uppercase tracking-wide">Energy Rates</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {(offer.peak ?? 0) > 0 && (
                                                                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center space-y-0.5">
                                                                        <div className="text-blue-600 dark:text-blue-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.peak ?? 0, discount).toFixed(4)}/kWh</div>
                                                                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider opacity-80">Peak</div>
                                                                    </div>
                                                                )}
                                                                {(offer.offPeak ?? 0) > 0 && (
                                                                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center space-y-0.5">
                                                                        <div className="text-blue-600 dark:text-blue-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.offPeak ?? 0, discount).toFixed(4)}/kWh</div>
                                                                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider opacity-80">Off-Peak</div>
                                                                    </div>
                                                                )}
                                                                {(offer.shoulder ?? 0) > 0 && (
                                                                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center space-y-0.5">
                                                                        <div className="text-blue-600 dark:text-blue-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.shoulder ?? 0, discount).toFixed(4)}/kWh</div>
                                                                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider opacity-80">Shoulder</div>
                                                                    </div>
                                                                )}
                                                                {(offer.anytime ?? 0) > 0 && (
                                                                    <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-center space-y-0.5">
                                                                        <div className="text-orange-600 dark:text-orange-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.anytime ?? 0, discount).toFixed(4)}/kWh</div>
                                                                        <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider opacity-80">Anytime</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Column 2: Supply Charges */}
                                                        <div className="space-y-4 min-w-[180px] flex-1">
                                                            <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400">
                                                                <PlugIcon size={16} />
                                                                <h4 className="text-sm font-bold uppercase tracking-wide">Supply Charges</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center space-y-0.5">
                                                                    <div className="text-purple-600 dark:text-purple-400 font-bold text-base tracking-tight">${(offer.supplyCharge ?? 0).toFixed(4)}/day</div>
                                                                    <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider opacity-80">Supply</div>
                                                                </div>

                                                                {((offer.demand ?? 0) > 0 || (offer.demandOp ?? 0) > 0 || (offer.demandP ?? 0) > 0 || (offer.demandS ?? 0) > 0) && (
                                                                    <>
                                                                        <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mt-4">
                                                                            <ActivityIcon size={16} />
                                                                            <h4 className="text-sm font-bold uppercase tracking-wide">Demand Charges</h4>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            {[
                                                                                { label: 'Demand', value: offer.demand },
                                                                                { label: 'Demand (Op)', value: offer.demandOp },
                                                                                { label: 'Demand (P)', value: offer.demandP },
                                                                                { label: 'Demand (S)', value: offer.demandS }
                                                                            ]
                                                                                .filter((d): d is { label: string, value: number } => (d.value ?? 0) > 0)
                                                                                .map((d, id) => {
                                                                                    const unitKey = d.label === 'Demand' ? 'demand' : d.label === 'Demand (Op)' ? 'demandOp' : d.label === 'Demand (P)' ? 'demandP' : 'demandS';
                                                                                    const unitUid = offer.priceUnits?.[unitKey as keyof typeof offer.priceUnits] as string | undefined;
                                                                                    const unit = unitUid ? unitMap?.[unitUid] : '';
                                                                                    return (
                                                                                        <div key={id} className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm">
                                                                                            <div className="text-rose-600 dark:text-rose-400 font-bold text-base tracking-tight">${d.value.toFixed(4)}{unit ? `/${unit}` : ''}</div>
                                                                                            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider opacity-80">{d.label}</div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {(offer.vppOrcharge ?? 0) > 0 && (
                                                                    <>
                                                                        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mt-4">
                                                                            <ActivityIcon size={16} />
                                                                            <h4 className="text-sm font-bold uppercase tracking-wide">VPP Orchestration Charges</h4>
                                                                        </div>
                                                                        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-amber-600 dark:text-amber-400 font-bold text-base tracking-tight">${(offer.vppOrcharge ?? 0).toFixed(4)}/day</div>
                                                                            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider opacity-80">Orchestration</div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Column 3: Solar FiT */}
                                                        {hasFiT && (
                                                            <div className="space-y-4 min-w-[180px] flex-1">
                                                                <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400">
                                                                    <ZapIcon size={16} />
                                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Solar FiT</h4>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {(offer.fit ?? 0) > 0 && !formData.vpp && (
                                                                        <div className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">${(offer.fit ?? 0).toFixed(4)}/kWh</div>
                                                                            <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">Feed-in</div>
                                                                        </div>
                                                                    )}
                                                                    {(formData.vpp || !formData.hasSolar) && (
                                                                        <>
                                                                            {(offer.fitPeak ?? 0) > 0 && (
                                                                                <div className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5">
                                                                                    <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">${(offer.fitPeak ?? 0).toFixed(4)}/kWh</div>
                                                                                    <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">PREMIUM FiT</div>
                                                                                </div>
                                                                            )}
                                                                            {(offer.fitCritical ?? 0) > 0 && (
                                                                                <div className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5">
                                                                                    <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">${(offer.fitCritical ?? 0).toFixed(4)}/kWh</div>
                                                                                    <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">CRITICAL EVENT FiT</div>
                                                                                </div>
                                                                            )}
                                                                            {(offer.fitVpp ?? 0) > 0 && (
                                                                                <div className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5">
                                                                                    <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">${(offer.fitVpp ?? 0).toFixed(4)}/kWh</div>
                                                                                    <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">BASE FIT</div>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Column 4: Controlled Load */}
                                                        {hasCL && (
                                                            <div className="space-y-4 min-w-[180px] flex-1">
                                                                <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
                                                                    <PlugIcon size={16} />
                                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Controlled Load</h4>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {(offer.cl1Usage ?? 0) > 0 && (
                                                                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.cl1Usage ?? 0, discount).toFixed(4)}/kWh</div>
                                                                            <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">CL1 Usage</div>
                                                                        </div>
                                                                    )}
                                                                    {(offer.cl1Supply ?? 0) > 0 && (
                                                                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${(offer.cl1Supply ?? 0).toFixed(4)}/day</div>
                                                                            <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">CL1 Supply</div>
                                                                        </div>
                                                                    )}
                                                                    {(offer.cl2Usage ?? 0) > 0 && (
                                                                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${calculateDiscountedRate(offer.cl2Usage ?? 0, discount).toFixed(4)}/kWh</div>
                                                                            <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">CL2 Usage</div>
                                                                        </div>
                                                                    )}
                                                                    {(offer.cl2Supply ?? 0) > 0 && (
                                                                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5">
                                                                            <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${(offer.cl2Supply ?? 0).toFixed(4)}/day</div>
                                                                            <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">CL2 Supply</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Column 5: Dynamic Rates */}
                                                        {offer.dynamicRates && offer.dynamicRates.length > 0 && (
                                                            <div className="space-y-4 min-w-[180px] flex-1">
                                                                <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                                                                    <ActivityIcon size={16} />
                                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Dynamic Rates</h4>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {offer.dynamicRates.map((dRate: any, id: number) => {
                                                                        const unitName = dRate.unitId ? unitMap?.[dRate.unitId] : '';
                                                                        const val = parseFloat(String(dRate.value || '0'));
                                                                        return (
                                                                            <div key={id} className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm">
                                                                                <div className="text-indigo-600 dark:text-indigo-400 font-bold text-base tracking-tight">${val.toFixed(4)}{unitName ? `/${unitName}` : ''}</div>
                                                                                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider opacity-80">{dRate.name}</div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Sign-up */}
                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Personal & Enrollment Details</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <Input label="First Name" required error={errors.firstName} placeholder="e.g. Alex" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} />
                                                <Input label="Last Name" required error={errors.lastName} placeholder="e.g. Taylor" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} />
                                                <DatePicker label="Date of Birth" required={formData.checkCreditScore} error={errors.dob} value={formData.dob} onChange={(date) => updateField('dob', date ? date.toISOString().split('T')[0] : '')} maxDate={new Date()} onBlur={() => handleBlur('dob')} />
                                                <Input label="Email" required helperText="We'll send confirmations here" error={errors.email} type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} onBlur={() => handleBlur('email')} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <Select label="Sale Type" options={SALE_TYPE_OPTIONS} value={formData.saleType.toString()} onChange={(val) => updateField('saleType', parseInt(val as string))} />
                                            <DatePicker label="Connection Date" required value={formData.connectionDate} onChange={(date) => updateField('connectionDate', date ? date.toISOString().split('T')[0] : '')} />
                                            <Select label="Billing Preference" options={BILLING_PREF_OPTIONS} value={formData.billingPreference.toString()} onChange={(val) => updateField('billingPreference', parseInt(val as string))} />
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                                        {/* <div className="col-span-full font-medium mb-2 flex items-center gap-2 text-muted-foreground"><IdCardIcon size={16} /> Secondary Identity (Medicare/Passport)</div> */}
                                        <Select
                                            label="ID Type"
                                            options={ID_TYPE_OPTIONS}
                                            value={formData.idType.toString()}
                                            onChange={(val) => {
                                                const newType = parseInt(val as string);
                                                updateField('idType', newType);
                                                // Reset state/country fields when type changes to avoid confusion
                                                if (newType === 2) { // Passport
                                                    updateField('idState', '');
                                                } else {
                                                    updateField('idCountry', '');
                                                }
                                            }}
                                        />
                                        <Input label="ID Number" placeholder="Number" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} />

                                        {formData.idType === 2 ? (
                                            <Select
                                                label="ID Country"
                                                options={countryOptions}
                                                value={formData.idCountry}
                                                onChange={(val) => updateField('idCountry', val as string)}
                                                placeholder="Select Country"
                                            />
                                        ) : (
                                            <Select
                                                label="ID State"
                                                options={STATE_OPTIONS}
                                                value={formData.idState}
                                                onChange={(val) => updateField('idState', val as string)}
                                            />
                                        )}

                                        <DatePicker label="ID Expiry" value={formData.idExpiry} onChange={(date) => updateField('idExpiry', date ? date.toISOString().split('T')[0] : '')} minDate={new Date()} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <Field label="Previous Bill">
                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    disabled={uploadingPreviousBill}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setUploadingPreviousBill(true);
                                                        try {
                                                            // Use generatedCustomerId for new customers, or existing customerId/uid for edits
                                                            // For new customers, we use generatedCustomerId for both customerId and uid params to ensure folder creation matches
                                                            const targetId = isEditMode ? (customerData?.customer?.customerId || uid) : generatedCustomerId;
                                                            const result = await uploadDocument(file, targetId!, 'previous_bill', isEditMode ? (uid || undefined) : generatedCustomerId, 'Previous Bill');
                                                            updateField('previousBill', {
                                                                id: result.id,
                                                                uid: result.uid,
                                                                filename: result.filename,
                                                                path: result.path,
                                                                size: result.size,
                                                                mimeType: result.contentType || 'application/pdf',
                                                                createdAt: new Date().toISOString()
                                                            } as CustomerDocument);
                                                            toast.success('Previous bill uploaded successfully');
                                                        } catch (error) {
                                                            toast.error(error instanceof Error ? error.message : 'Failed to upload file');
                                                        } finally {
                                                            setUploadingPreviousBill(false);
                                                        }
                                                    }}
                                                />
                                                {uploadingPreviousBill && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                                {formData.previousBill && !uploadingPreviousBill && (
                                                    <DocumentPreview path={formData.previousBill.path} label="Previous Bill" />
                                                )}
                                            </div>
                                        </Field>
                                        {formData.idType === 0 ? (
                                            <Field label="Driver's License" required={formData.checkCreditScore} error={errors.licenseDocument}>
                                                <div className="space-y-2">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        disabled={uploadingLicense}
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setUploadingLicense(true);
                                                            try {
                                                                const targetId = isEditMode ? (customerData?.customer?.customerId || uid) : generatedCustomerId;
                                                                const result = await uploadDocument(file, targetId!, 'drivers_license', isEditMode ? (uid || undefined) : generatedCustomerId, 'Driver License');
                                                                updateField('licenseDocument', {
                                                                    id: result.id,
                                                                    uid: result.uid,
                                                                    filename: result.filename,
                                                                    path: result.path,
                                                                    size: result.size,
                                                                    mimeType: result.contentType || 'application/pdf',
                                                                    createdAt: new Date().toISOString()
                                                                } as CustomerDocument);
                                                            } catch (error) {
                                                                toast.error(error instanceof Error ? error.message : 'Failed to upload license');
                                                            } finally {
                                                                setUploadingLicense(false);
                                                            }
                                                        }}
                                                    />
                                                    {uploadingLicense && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                                    {formData.licenseDocument && !uploadingLicense && (
                                                        <DocumentPreview path={formData.licenseDocument.path} label="License" />
                                                    )}
                                                </div>
                                            </Field>
                                        ) : (
                                            <Field label="Identity Proof">
                                                <div className="space-y-2">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        disabled={uploadingIdentityProof}
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            setUploadingIdentityProof(true);
                                                            try {
                                                                // Use generatedCustomerId for new customers, or existing customerId/uid for edits
                                                                const targetId = isEditMode ? (customerData?.customer?.customerId || uid) : generatedCustomerId;
                                                                const result = await uploadDocument(file, targetId!, 'identity_proof', isEditMode ? (uid || undefined) : generatedCustomerId, 'Identity Proof');
                                                                updateField('identityProof', {
                                                                    id: result.id,
                                                                    uid: result.uid,
                                                                    filename: result.filename,
                                                                    path: result.path,
                                                                    size: result.size,
                                                                    mimeType: result.contentType || 'application/pdf',
                                                                    createdAt: new Date().toISOString()
                                                                } as CustomerDocument);
                                                                toast.success('Identity proof uploaded successfully');
                                                            } catch (error) {
                                                                toast.error(error instanceof Error ? error.message : 'Failed to upload file');
                                                            } finally {
                                                                setUploadingIdentityProof(false);
                                                            }
                                                        }}
                                                    />
                                                    {uploadingIdentityProof && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                                    {formData.identityProof && !uploadingIdentityProof && (
                                                        <DocumentPreview path={formData.identityProof.path} label="Identity Proof" />
                                                    )}
                                                </div>
                                            </Field>
                                        )}

                                    </div>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="concession"
                                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                checked={formData.concession}
                                                onChange={(e) => {
                                                    const c = e.target.checked;
                                                    if (c) {
                                                        setRestrictedFeatureError(true);
                                                    } else {
                                                        updateField('concession', false);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="concession" className="text-sm cursor-pointer select-none">Concession Card Holder</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="lifeSupport"
                                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                checked={formData.lifeSupport}
                                                onChange={(e) => {
                                                    const c = e.target.checked;
                                                    if (c) {
                                                        setRestrictedFeatureError(true);
                                                    } else {
                                                        updateField('lifeSupport', false);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="lifeSupport" className="text-sm cursor-pointer select-none">Life Support Equipment</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Credit Score */}
                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                                            <IdCardIcon size={20} /> Credit Score & Identification
                                        </h2>


                                        {/* Credit Score Check Toggle Card */}
                                        <div className={cn(
                                            "mt-8 overflow-hidden rounded-2xl border transition-all duration-500",
                                            formData.checkCreditScore
                                                ? "bg-gradient-to-br from-blue-50/80 via-white to-blue-50/50 border-blue-200 shadow-sm"
                                                : "bg-card border-border shadow-sm hover:border-neutral-300"
                                        )}>
                                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                                                        formData.checkCreditScore
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-0"
                                                            : "bg-muted text-muted-foreground rotate-0"
                                                    )}>
                                                        <ShieldCheckIcon size={24} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-base font-semibold text-foreground tracking-tight">
                                                            Check Credit Score
                                                        </h3>
                                                        <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                                                            Identity Verification
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 px-4 py-2 bg-background/50 rounded-xl border border-border/50 backdrop-blur-sm self-end md:self-auto">
                                                    <ToggleSwitch
                                                        checked={formData.checkCreditScore}
                                                        onChange={(checked) => updateField('checkCreditScore', checked)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Conditional Demographical Fields - Refined Card */}
                                            {formData.checkCreditScore && (
                                                <div className="border-t border-blue-100 bg-white/40 p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-700">
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                                        <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                                                            Additional Verification Details
                                                        </h4>
                                                        <div className="h-px bg-gradient-to-r from-blue-100 to-transparent flex-1"></div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                                                        <div className="space-y-1">
                                                            <DatePicker
                                                                label="Date of Birth"
                                                                required={formData.checkCreditScore}
                                                                error={errors.dob}
                                                                value={formData.dob}
                                                                onChange={(date) => updateField('dob', date ? date.toISOString().split('T')[0] : '')}
                                                                maxDate={new Date()}
                                                                onBlur={() => handleBlur('dob')}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Select
                                                                label="Gender"
                                                                required={formData.checkCreditScore}
                                                                error={errors.gender}
                                                                options={[
                                                                    { value: '0', label: 'Male' },
                                                                    { value: '1', label: 'Female' },
                                                                    { value: '2', label: 'Other' }
                                                                ]}
                                                                value={formData.gender.toString()}
                                                                onChange={(val) => updateField('gender', parseInt(val as string))}
                                                                onBlur={() => handleBlur('gender')}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Select
                                                                label="Relationship Status"
                                                                required={formData.checkCreditScore}
                                                                error={errors.relationshipStatus}
                                                                options={[
                                                                    { value: '0', label: 'Married' },
                                                                    { value: '1', label: 'Unmarried' }
                                                                ]}
                                                                value={formData.relationshipStatus.toString()}
                                                                onChange={(val) => updateField('relationshipStatus', parseInt(val as string))}
                                                                onBlur={() => handleBlur('relationshipStatus')}
                                                            />
                                                        </div>

                                                        <div className="space-y-1 md:col-span-2">
                                                            <Input
                                                                label="Employer Name"
                                                                error={errors.employerName}
                                                                placeholder="Company Pty Ltd"
                                                                value={formData.employerName}
                                                                onChange={(e) => updateField('employerName', e.target.value)}
                                                                onBlur={() => handleBlur('employerName')}
                                                                leftIcon={<ActivityIcon size={16} className="text-blue-500/50" />}
                                                                className="bg-white/50"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Input
                                                                label="Enquiry Amount ($)"
                                                                required={formData.checkCreditScore}
                                                                error={errors.enquiryAmount}
                                                                type="number"
                                                                placeholder="0.00"
                                                                value={formData.enquiryAmount}
                                                                onChange={(e) => updateField('enquiryAmount', e.target.value)}
                                                                onBlur={() => handleBlur('enquiryAmount')}
                                                                leftIcon={<CreditCardIcon size={16} className="text-blue-500/50" />}
                                                                className="bg-white/50 font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* License Details - Standard Grid */}
                                                    <div className="mt-8 border-t border-blue-100 pt-8">
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                                            <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                                                                License Verification
                                                            </h4>
                                                            <div className="h-px bg-gradient-to-r from-blue-100 to-transparent flex-1"></div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                            <Input label="Driver's License No." required={formData.checkCreditScore} placeholder="D123456" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} onBlur={() => handleBlur('licenseNumber')} error={errors.licenseNumber} />
                                                            <Select label="License State" required={formData.checkCreditScore} options={STATE_OPTIONS} value={formData.licenseState} onChange={(val) => updateField('licenseState', val as string)} onBlur={() => handleBlur('licenseState')} error={errors.licenseState} />
                                                            <DatePicker label="License Expiry" required={formData.checkCreditScore} value={formData.licenseExpiry} onChange={(date) => updateField('licenseExpiry', date ? date.toISOString().split('T')[0] : '')} minDate={new Date()} onBlur={() => handleBlur('licenseExpiry')} error={errors.licenseExpiry} />

                                                            <Field label="Driver's License" required={formData.checkCreditScore} error={errors.licenseDocument}>
                                                                <div className="space-y-2">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                        disabled={uploadingLicense}
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (!file) return;
                                                                            setUploadingLicense(true);
                                                                            try {
                                                                                const targetId = isEditMode ? (customerData?.customer?.customerId || uid) : generatedCustomerId;
                                                                                const result = await uploadDocument(file, targetId!, 'drivers_license', isEditMode ? (uid || undefined) : generatedCustomerId, 'Driver License');
                                                                                updateField('licenseDocument', {
                                                                                    id: result.id,
                                                                                    uid: result.uid,
                                                                                    filename: result.filename,
                                                                                    path: result.path,
                                                                                    size: result.size,
                                                                                    mimeType: result.contentType || 'application/pdf',
                                                                                    createdAt: new Date().toISOString()
                                                                                } as CustomerDocument);
                                                                            } catch (error) {
                                                                                toast.error(error instanceof Error ? error.message : 'Failed to upload license');
                                                                            } finally {
                                                                                setUploadingLicense(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {uploadingLicense && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                                                    {formData.licenseDocument && !uploadingLicense && (
                                                                        <DocumentPreview path={formData.licenseDocument.path} label="License" />
                                                                    )}
                                                                </div>
                                                            </Field>

                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Confirmation */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Review & Confirm</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><UserIcon size={16} className="text-blue-600" /> Customer Information</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.email}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Mobile:</span> <span className="font-medium">{formData.phone} {phoneVerified && '✓'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{formData.dob || '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="capitalize font-medium">{formData.propertyType === 1 ? 'Commercial' : 'Residential'}</span></p>
                                                    {formData.propertyType === 1 && (
                                                        <>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Business:</span> <span className="font-medium">{formData.businessName}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">ABN:</span> <span className="font-medium">{formData.abn}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Show as Business:</span> <span className="font-medium text-xs bg-muted px-1.5 py-0.5 rounded">{formData.showAsBusinessName ? 'Yes' : 'No'}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Show Name in Offer:</span> <span className="font-medium text-xs bg-muted px-1.5 py-0.5 rounded">{(formData.showName ?? true) ? 'Yes' : 'No'}</span></p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><IdCardIcon size={16} className="text-blue-600" /> Identity & Credit Score</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <p className="flex justify-between border-b pb-2 mb-2"><span className="text-muted-foreground">Driver's License:</span> <span className="font-medium">{formData.licenseNumber} ({formData.licenseState})</span></p>
                                                    <p className="flex justify-between border-b pb-2 mb-2"><span className="text-muted-foreground">License Expiry:</span> <span className="font-medium">{formData.licenseExpiry || '—'}</span></p>

                                                    <p className="flex justify-between pt-1"><span className="text-muted-foreground">Check Credit Score:</span> <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded uppercase ${formData.checkCreditScore ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>{formData.checkCreditScore ? 'Enabled' : 'Disabled'}</span></p>

                                                    {formData.checkCreditScore && (
                                                        <div className="pt-2 mt-2 border-t border-border/50 animate-in fade-in duration-300">
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Gender:</span> <span className="font-medium">{formData.gender === 0 ? 'Male' : formData.gender === 1 ? 'Female' : 'Other'}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Relationship Status:</span> <span className="font-medium">{formData.relationshipStatus === 0 ? 'Married' : 'Unmarried'}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Employer:</span> <span className="font-medium">{formData.employerName || '—'}</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Enquiry Amount:</span> <span className="font-medium">{formData.enquiryAmount ? `$${formData.enquiryAmount}` : '—'}</span></p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><MapPinIcon size={16} className="text-blue-600" /> Service Address</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <div className="font-medium">
                                                        {formData.unitNumber && `Unit ${formData.unitNumber}, `}{formData.streetNumber} {formData.streetName} {formData.streetType}
                                                        <br />
                                                        {formData.suburb}, {formData.state} {formData.postcode}
                                                        <br />
                                                        {formData.country}
                                                    </div>
                                                    <div className="pt-2 border-t border-border mt-2">
                                                        <p className="flex justify-between"><span className="text-muted-foreground">NMI:</span> <span className="font-mono bg-muted px-1 rounded">{formData.nmi}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><ShieldIcon size={16} className="text-blue-600" /> Plan & Pricing</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Tariff Code:</span> <span className="font-medium">{formData.tariffCode}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Discount:</span> <span className="font-medium badge bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">{formData.discount > 0 ? `${formData.discount}%` : '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Distributor:</span> <span className="font-medium">{selectedRatePlan?.dnsp !== undefined ? (DNSP_MAP[selectedRatePlan.dnsp.toString()] || selectedRatePlan.dnsp) : '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Tariff Type:</span> <span className="font-medium">{selectedRatePlan?.tariff || '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Pricing Version:</span> <span className="font-medium font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{activeVersionForLookup || activeRateVersion}</span></p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><IdCardIcon size={16} className="text-blue-600" /> Enrollment Details</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Sale Type:</span> <span className="font-medium">{SALE_TYPE_OPTIONS.find(o => o.value === formData.saleType.toString())?.label}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Connection Date:</span> <span className="font-medium">{formData.connectionDate}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Billing:</span> <span className="font-medium">{BILLING_PREF_OPTIONS.find(o => o.value === formData.billingPreference.toString())?.label}</span></p>

                                                    <div className="pt-2 border-t border-border mt-2">
                                                        <p className="flex text-xs font-semibold text-muted-foreground mb-1 uppercase">Other ID (Optional)</p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="font-medium">{ID_TYPE_OPTIONS.find(o => o.value === formData.idType.toString())?.label}</span></p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">ID Number:</span> <span className="font-medium">{formData.idNumber || '—'}</span></p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">Expiry:</span> <span className="font-medium">{formData.idExpiry || '—'}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rate Details - Full Width Section */}
                                        {selectedRatePlan?.offers?.[0] && (
                                            <RateDetailsView
                                                offer={selectedRatePlan.offers[0]}
                                                discount={formData.discount || 0}
                                                hasSolar={formData.hasSolar}
                                                vpp={formData.vpp}
                                                units={unitMap}
                                            />
                                        )}

                                        {(formData.hasSolar || formData.batteryBrand || formData.vpp) && (
                                            <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg">
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><ZapIcon size={16} className="text-blue-600" /> Technical Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {formData.hasSolar && (
                                                        <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                            <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Solar System</p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Has Solar:</span> <span className="font-medium">Yes</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Solar Capacity:</span> <span className="font-medium">{formData.solarCapacity} kW</span></p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Inverter Capacity:</span> <span className="font-medium">{formData.inverterCapacity} kW</span></p>
                                                        </div>
                                                    )}

                                                    <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                        <p className="font-medium text-xs uppercase text-muted-foreground mb-1">VPP Participant</p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">VPP Participant:</span> <span className="font-medium">Yes</span></p>
                                                        {formData.batteryBrand && <p className="flex justify-between"><span className="text-muted-foreground">Battery Brand:</span> <span className="font-medium">{formData.batteryBrand}</span></p>}
                                                        {formData.snNumber && <p className="flex justify-between"><span className="text-muted-foreground">SN Number:</span> <span className="font-medium">{formData.snNumber}</span></p>}
                                                        {formData.batteryCapacity && <p className="flex justify-between"><span className="text-muted-foreground">Battery Capacity:</span> <span className="font-medium">{formData.batteryCapacity} kW</span></p>}
                                                        {formData.exportLimit && <p className="flex justify-between"><span className="text-muted-foreground">Export Limit:</span> <span className="font-medium">{formData.exportLimit} kW</span></p>}
                                                        {formData.vppSignupBonus === '600' && (
                                                            <div className="flex justify-between items-start gap-2">
                                                                <span className="text-muted-foreground shrink-0">Signup Bonus:</span>
                                                                <span className="font-medium text-right text-green-600">$50 monthly bill credit for 12 months (total $600)</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {(formData.concession || formData.lifeSupport) && (
                                            <div className="md:col-span-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                                                <h3 className="font-medium mb-2 flex items-center gap-2 text-amber-800"><ShieldIcon size={16} /> Important Declarations</h3>
                                                <div className="flex gap-4">
                                                    {formData.concession && <span className="px-2 py-1 bg-card rounded border border-amber-200 dark:border-amber-700 text-xs font-medium text-amber-900 dark:text-amber-300">Concession Card Holder</span>}
                                                    {formData.lifeSupport && <span className="px-2 py-1 bg-card rounded border border-amber-200 dark:border-amber-700 text-xs font-medium text-amber-900 dark:text-amber-300">Life Support Equipment</span>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Uploaded Documents */}
                                        {(formData.previousBill || formData.identityProof || formData.licenseDocument) && (
                                            <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg">
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><IdCardIcon size={16} className="text-blue-600" /> Uploaded Documents</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {formData.previousBill && (
                                                        <DocumentPreview path={formData.previousBill.path} label="Previous Bill" />
                                                    )}
                                                    {formData.licenseDocument && (
                                                        <DocumentPreview path={formData.licenseDocument.path} label="Driver's License" />
                                                    )}
                                                    {formData.identityProof && (
                                                        <DocumentPreview path={formData.identityProof.path} label="Secondary Identity" />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Navigation - Fixed at bottom */}
                        <div className="flex items-center justify-between pt-6 border-t border-border mt-auto shrink-0">
                            <Button type="button" variant="ghost" onClick={() => currentStep > 0 ? setCurrentStep((currentStep - 1) as any) : navigate('/customers')}>
                                {currentStep === 0 ? 'Cancel' : 'Back'}
                            </Button>
                            <div className="flex gap-3">

                                {allStepsValid && !isEditMode && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleSubmit(0)}
                                        isLoading={submittingStatus === 0}
                                        disabled={submittingStatus !== null}
                                    // className="mr-2"
                                    >
                                        Save as Draft
                                    </Button>
                                )}
                                {currentStep < 4 && <Button type="button" onClick={() => setCurrentStep((currentStep + 1) as any)} disabled={!canProceed()}>Next</Button>}

                                {currentStep === 4 && (
                                    <>
                                        <Button
                                            type="button"
                                            onClick={() => handleSubmit(1)}
                                            isLoading={submittingStatus === 1}
                                            disabled={submittingStatus !== null}
                                            loadingText="Saving..."
                                        >
                                            {isEditMode ? 'Update Customer' : 'Create Customer'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={blocker.state === 'blocked'}
                    onClose={() => blocker.reset && blocker.reset()}
                    title={<span className="text-red-600">Unsaved Changes</span>}
                    footer={
                        <div className="flex gap-2">
                            {allStepsValid && !isEditMode && (
                                <Button
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => {
                                        blocker.reset && blocker.reset();
                                        handleSubmit(0);
                                    }}
                                >
                                    Save as Draft
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => blocker.reset && blocker.reset()} className="border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Stay
                            </Button>
                            <Button variant="destructive" onClick={() => blocker.proceed && blocker.proceed()}>
                                Leave & Discard
                            </Button>
                        </div>
                    }
                >
                    <p className="text-sm text-muted-foreground">
                        You have unsaved changes. Are you sure you want to leave? All your progress will be lost.
                    </p>
                </Modal>

                <Modal
                    isOpen={restrictedFeatureError}
                    onClose={() => setRestrictedFeatureError(false)}
                    title={<span className="text-red-600">Internal server error</span>}
                    footer={
                        <Button variant="default" onClick={() => setRestrictedFeatureError(false)} className="bg-neutral-900 text-white hover:bg-neutral-800">
                            Understood
                        </Button>
                    }
                >
                    <p className="text-sm text-muted-foreground">
                        There is an internal server error while processing the concession card option. My manager will be in touch with you as soon as possible as I am facing an error.
                    </p>
                </Modal>

                {/* Sidebar: Live Summary */}
                <aside className="w-full xl:w-[200px] shrink-0 xl:sticky xl:top-6 order-last xl:order-none">
                    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                Live summary
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight leading-none">Live</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-y-0.5">
                                <SummaryItem icon={PhoneIcon} label="Mobile" value={formData.phone} />
                                <SummaryItem icon={MapPinIcon} label="Address" value={`${formData.unitNumber ? `${formData.unitNumber}/` : ''}${formData.streetNumber || ''} ${formData.streetName || ''} ${formData.streetType || ''}${formData.suburb ? `, ${formData.suburb}` : ''} ${formData.state || ''} ${formData.postcode || ''}`} />
                                <SummaryItem icon={UserIcon} label="Customer type" value={formData.propertyType === 1 ? 'Commercial' : 'Residential'} />
                                <SummaryItem icon={ZapIcon} label="Solar" value={formData.hasSolar ? 'Yes' : 'No'} />
                                <SummaryItem icon={HashIcon} label="NMI" value={formData.nmi} />
                                <SummaryItem icon={LockIcon} label="Tariff" value={formData.tariffCode} />
                                <SummaryItem icon={CreditCardIcon} label="DNSP" value={selectedRatePlan?.dnsp !== undefined ? (DNSP_MAP[selectedRatePlan.dnsp.toString()] || selectedRatePlan.dnsp) : '—'} />
                                <SummaryItem icon={ClockIcon} label="Tariff Type" value={selectedRatePlan?.tariff || '—'} />
                                <SummaryItem icon={PercentIcon} label="% Discount" value={`${formData.discount}%`} />
                                <SummaryItem icon={ZapIcon} label="Sale type" value={SALE_TYPE_OPTIONS.find(o => o.value === formData.saleType.toString())?.label} />
                                <SummaryItem icon={CalendarIcon} label="Connection date" value={formData.connectionDate} />
                                <SummaryItem icon={UserIcon} label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                                <SummaryItem icon={MailIcon} label="Email" value={formData.email} />
                                <SummaryItem icon={CalendarIcon} label="DOB" value={formData.dob} />
                                <SummaryItem icon={IdCardIcon} label="License" value={formData.licenseNumber || '—'} />
                                <SummaryItem icon={IdCardIcon} label="Secondary ID" value={formData.idNumber ? `${ID_TYPE_OPTIONS.find(o => o.value === formData.idType.toString())?.label} ${formData.idNumber}` : '—'} />
                                <SummaryItem icon={CreditCardIcon} label="Billing" value={BILLING_PREF_OPTIONS.find(o => o.value === formData.billingPreference.toString())?.label} />
                                {formData.creditScore !== undefined && (
                                    <div className="flex items-center gap-2.5 py-2 mt-1 border-t border-border/50">
                                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                                            <ShieldCheckIcon size={12} />
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">Credit Assessment</p>
                                            <div className="flex items-center">
                                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 ${riskStatuses.find((rs: any) => rs.uid === formData.riskStatus)?.color || 'text-primary bg-primary/5 border-primary/10'}`}>
                                                    Score: {formData.creditScore} • {riskStatuses.find((rs: any) => rs.uid === formData.riskStatus)?.name || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
