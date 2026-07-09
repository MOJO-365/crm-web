
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, useBlocker } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import { cn, formatDate } from '@/lib/utils';
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
    GET_ACTIVE_BONUSES,
    GET_NEXT_CUSTOMER_ID,
    PREVIEW_SYSTEM_TEMPLATE,
    GET_USERS,
    CREATE_CUSTOMER_NOTE,
    MARK_WEB_ENROLLMENT_PROCESSED,
    SEND_PDRS_CONSENT_EMAIL,
    GET_ACTIVE_PLANS,
    GET_BATTERY_MAKES,
    GET_BATTERY_MODELS
} from '@/graphql';
import { DNSP_MAP, SALE_TYPE_OPTIONS, BILLING_PREF_OPTIONS, ID_TYPE_OPTIONS, STATE_OPTIONS, TITLE_OPTIONS } from '@/lib/constants';
import { getData } from 'country-list';
import { secondaryApiAxios, apiAxios } from '@/lib/apollo';
import { formatDateTime, formatSydneyTime } from '@/lib/date';
import {
    ChevronRightIcon,
    HomeIcon,
    UserIcon,
    CheckIcon,
    ZapIcon,
    ShieldIcon,
    CreditCardIcon,
    MapPinIcon,
    IdCardIcon,
    ActivityIcon,
    ShieldCheckIcon,
    DownloadIcon,
    MailIcon,
    CheckCircleIcon,
    SearchIcon,
    SpinnerIcon,
    AlertCircleIcon,
    FileTextIcon,
    PlugIcon,
    GiftIcon
} from '@/components/icons';
import { sendVerification, checkVerification, normalisePhone, denormalisePhone } from '@/lib/twilio';

// import { calculateDiscountedRate } from '@/lib/rate-utils';
import {
    uploadDocument,
    // getDocumentPreviewUrl, isImageFile, isPdfFile,
} from '@/lib/document-upload';
import DocumentPreview from '@/components/common/DocumentPreview';
import { RateDetailsView } from '@/components/common/RateDetailsView';
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

const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            onChange(!checked);
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

// ============================================================================
// TYPES
// ============================================================================

import type { CustomerFormData, RatePlan, CustomerDocument, Bonus } from '@/types';

interface VersionOption {
    value: string;
    label: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const initialFormData: CustomerFormData = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 0,
    relationshipStatus: 0,
    enquiryAmount: '',
    checkCreditScore: true,
    source: '',
    referralName: '',
    employerName: '',
    dob: '',
    propertyType: 0,
    planUid: '',
    businessName: '',
    legalName: '',
    abn: '',
    showAsBusinessName: false,
    showName: true,
    unitNumber: '',
    houseNumber: '',
    houseNumberSuffix: '',
    buildingName: '',
    floorLevelNumber: '',
    streetNumber: '',
    streetName: '',
    streetType: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    ownershipStatus: 0,
    flatOrUnitType: '',
    gnafPid: '',
    nmi: '',
    isVppAndIsBattery: false,
    hasSolar: true,
    solarCapacity: '',
    inverterCapacity: '',
    vpp: false,
    vppConnected: false,
    vppSignupBonus: '',
    hasBattery: false,
    isBattery: 0,
    batteryBrand: '',
    batteryCapacity: '',
    snNumber: '',
    exportLimit: '',
    batteryModel: '',
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
    licenseCardNumber: '',
    medicareCardType: 0,
    medicareIrn: '',
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
    ratePlanUid: undefined,
    creditScore: undefined,
    riskStatus: undefined,
    discount: 0,
    previousBill: null,
    identityProof: null,
    selectedBonuses: [],
    assignedToUid: undefined,
    pdrsEmailSent: 0,
    pdrsEmailSentAt: undefined,
    isCreditScoreFetched: false,
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

// const SummaryItem = ({ icon: Icon, label, value, className }: { icon: any, label: string, value: string | React.ReactNode, className?: string }) => (
//     <div className={cn("flex items-start gap-2.5 py-1.5 border-b border-border/50 last:border-0", className)}>
//         <div className="mt-0.5 p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
//             <Icon size={12} />
//         </div>
//         <div className="space-y-0 min-w-0 flex-1">
//             <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-0.5">{label}</p>
//             <p className="text-[11px] font-bold text-foreground truncate">{value || '—'}</p>
//         </div>
//     </div>
// );

// ============================================================================
// DOCUMENT PREVIEW COMPONENT
// ============================================================================



// ============================================================================
const applyPlanOverridesToOffer = (offer: any, planRatesJson: any, isDnspBased?: boolean, selectedDnsp?: any) => {
    if (!offer || !planRatesJson) return offer;
    try {
        let planRates;
        if (typeof planRatesJson === 'object') {
            planRates = planRatesJson;
        } else {
            planRates = JSON.parse(planRatesJson);
        }
        if (!Array.isArray(planRates) || planRates.length === 0) return offer;

        if (isDnspBased && selectedDnsp !== undefined && selectedDnsp !== null) {
            planRates = planRates.filter((r: any) => String(r.dnsp) === String(selectedDnsp));
        }

        const newOffer = { ...offer };
        let dynamicRates = typeof newOffer.dynamicRates === 'string'
            ? JSON.parse(newOffer.dynamicRates)
            : (newOffer.dynamicRates ? [...newOffer.dynamicRates] : []);

        let priceUnits = typeof newOffer.priceUnits === 'string'
            ? (() => { try { return JSON.parse(newOffer.priceUnits); } catch { return {}; } })()
            : (newOffer.priceUnits ? { ...newOffer.priceUnits } : {});

        const labelToKeyMap: Record<string, string> = {
            'ANYTIME': 'anytime',
            'PEAK': 'peak',
            'OFF-PEAK': 'offPeak',
            'SHOULDER': 'shoulder',
            'SUPPLY CHARGE': 'supplyCharge',
            'DEMAND': 'demand',
            'DEMAND(OP)': 'demandOp',
            'DEMAND(P)': 'demandP',
            'DEMAND(S)': 'demandS',
            'VPP ORCHESTRATION': 'vppOrcharge',
            'FEED-IN': 'fit',
            'PREMIUM FIT': 'fitPeak',
            'CRITICAL EVENT FIT': 'fitCritical',
            'BASE FIT': 'fitVpp',
            'CL1 USAGE': 'cl1Usage',
            'CL2 USAGE': 'cl2Usage',
            'CL1 SUPPLY': 'cl1Supply',
            'CL2 SUPPLY': 'cl2Supply'
        };

        planRates.forEach((pr: any) => {
            const upperName = pr.name.toUpperCase();
            if (pr.rateType === 'Fixed') {
                const standardKey = labelToKeyMap[upperName];
                const numericRate = parseFloat(String(pr.rate)) || 0;
                if (standardKey) {
                    const clKeys = ['cl1Usage', 'cl2Usage', 'cl1Supply', 'cl2Supply'];
                    if (clKeys.includes(standardKey)) {
                        const originalValue = parseFloat(String(offer[standardKey])) || 0;
                        if (originalValue === 0) {
                            newOffer[standardKey] = 0;
                        } else {
                            newOffer[standardKey] = numericRate;
                            if (pr.unit) {
                                priceUnits[standardKey] = pr.unit;
                            }
                        }
                    } else {
                        newOffer[standardKey] = numericRate;
                        if (pr.unit) {
                            priceUnits[standardKey] = pr.unit;
                        }
                    }
                } else {
                    const existingDyn = dynamicRates.find((dr: any) => dr.name.toUpperCase() === upperName);
                    if (existingDyn) {
                        existingDyn.value = numericRate;
                        if (pr.unit) existingDyn.unitId = pr.unit;
                        if (pr.dynamicType) existingDyn.type = String(pr.dynamicType).toLowerCase().replace(/\s+/g, '_');
                    } else {
                        dynamicRates.push({
                            name: pr.name,
                            value: numericRate,
                            unitId: pr.unit,
                            type: pr.dynamicType ? String(pr.dynamicType).toLowerCase().replace(/\s+/g, '_') : 'extra_charges',
                            applyDiscount: false
                        });
                    }
                }
            }
        });
        const planRateNames = planRates.map((pr: any) => pr.name.toUpperCase());
        Object.keys(labelToKeyMap).forEach(label => {
            if (!planRateNames.includes(label)) {
                const key = labelToKeyMap[label];
                newOffer[key] = 0;
            }
        });

        dynamicRates = dynamicRates.filter((dr: any) => planRateNames.includes(dr.name.toUpperCase()));

        newOffer.dynamicRates = dynamicRates;
        newOffer.priceUnits = priceUnits;
        return newOffer;
    } catch (err) {
        return offer;
    }
};

export const CustomerFormPage = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { prefillData, fromApprovals, approvalUid } = (location.state as any) || {};
    const isEditMode = !!uid && uid !== 'new';

    // Form state
    const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [prefillLeadUid, setPrefillLeadUid] = useState<string | null>(null);
    const [prefillNotes, setPrefillNotes] = useState<string>('');


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
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [previewStep, setPreviewStep] = useState<'offer' | 'email'>('offer');
    const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string; isCustom: boolean } | null>(null);
    const [isLoadingEmailPreview, setIsLoadingEmailPreview] = useState(false);
    const [isWithoutSignature, setIsWithoutSignature] = useState(false);
    const [showCreditCheckWarning, setShowCreditCheckWarning] = useState(false);

    const [fetchSystemTemplate] = useLazyQuery(PREVIEW_SYSTEM_TEMPLATE);

    // Duplicate check state
    const [duplicateErrors, setDuplicateErrors] = useState<{ address?: string; nmi?: string }>({});
    const [addressSearch, setAddressSearch] = useState('');
    const [isNmiLookupLoading, setIsNmiLookupLoading] = useState(false);
    const [isAbrLookupLoading, setIsAbrLookupLoading] = useState(false);
    const [nmiOptions, setNmiOptions] = useState<any[]>([]);
    const [isNmiModalOpen, setIsNmiModalOpen] = useState(false);
    const [selectedNmiForTariff, setSelectedNmiForTariff] = useState<any | null>(null);
    // Rate plans
    const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);
    const [isCustomDiscountMode, setIsCustomDiscountMode] = useState(false);
    const { hasFeatureAccess, user } = useAuthStore();
    const canAccessCustomDiscount = hasFeatureAccess('feature_custom_discount');
    const canViewAllCustomers = hasFeatureAccess('feature_view_all_customers');
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    useEffect(() => {
        if (!isEditMode && user?.uid && !canViewAllCustomers && formData.assignedToUid !== user.uid) {
            setFormData(prev => ({
                ...prev,
                assignedToUid: user.uid
            }));
        }
    }, [isEditMode, user?.uid, canViewAllCustomers, formData.assignedToUid]);
    const eighteenYearsAgo = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    }, []);

    // Queries & Mutations
    const { data: batteryMakesData, loading: batteryMakesLoading } = useQuery(GET_BATTERY_MAKES);
    const { data: batteryModelsData, loading: batteryModelsLoading } = useQuery(GET_BATTERY_MODELS, {
        variables: { makeUid: formData.batteryBrand },
        skip: !formData.batteryBrand
    });

    const { data: customerData, loading: isLoadingCustomer } = useQuery(GET_CUSTOMER_BY_ID, {
        variables: { uid },
        skip: !isEditMode,
        fetchPolicy: 'network-only',
    });

    const { data: activePlansData } = useQuery(GET_ACTIVE_PLANS, { fetchPolicy: 'cache-first' });
    const planOptions = useMemo(() => {
        if (!activePlansData?.activePlans) return [];
        return activePlansData.activePlans
            .filter((plan: any) => {
                // Always keep the currently selected plan in the options
                if (formData.planUid && plan.uid === formData.planUid) {
                    return true;
                }
                // Match state if a state is selected
                if (formData.state) {
                    if (!plan.state) {
                        return false; // Filter out plans without a state
                    }
                    const planStates = plan.state.split(',').map((s: string) => s.trim().toUpperCase());
                    if (!planStates.includes(formData.state.toUpperCase())) {
                        return false;
                    }
                }
                // Match property type (0 = residential, 1 = commercial)
                if (plan.propertyType !== undefined && plan.propertyType !== null && plan.propertyType !== formData.propertyType) {
                    return false;
                }
                // If NMI has VPP battery (B1 register), only show plans that require both solar AND battery
                if (formData.isVppAndIsBattery) {
                    if (!plan.isSolarRequired || !plan.isBatteryRequired) {
                        return false;
                    }
                } else {
                    // If plan requires solar, customer must have solar
                    if (plan.isSolarRequired && !formData.hasSolar) {
                        return false;
                    }
                    // If plan requires battery, customer must have battery
                    if (plan.isBatteryRequired && !formData.hasBattery) {
                        return false;
                    }
                }
                return true;
            })
            .map((plan: any) => ({
                label: plan.title,
                value: plan.uid
            }));
    }, [activePlansData, formData.hasSolar, formData.hasBattery, formData.propertyType, formData.planUid, formData.isVppAndIsBattery, formData.state]);

    const selectedPlan = useMemo(() => {
        if (!activePlansData?.activePlans || !formData.planUid) return null;
        return activePlansData.activePlans.find((p: any) => p.uid === formData.planUid);
    }, [activePlansData, formData.planUid]);

    const { data: usersData } = useQuery(GET_USERS, {
        variables: { limit: 1000, status: 'ACTIVE', onlyVisibleRoles: true },
        fetchPolicy: 'cache-first'
    });
    const userOptions = useMemo(() => {
        const options = (usersData?.users?.data || []).map((u: any) => ({
            value: u.uid,
            label: u.name || u.email
        }));

        // Ensure current user is always in the list to prevent UID showing as pre-filled
        if (user?.uid && !options.find((o: any) => o.value === user.uid)) {
            options.unshift({
                value: user.uid,
                label: user.name || 'Me'
            });
        }

        return options;
    }, [usersData, user]);

    // Document upload state
    const [generatedCustomerId, setGeneratedCustomerId] = useState<string>('');
    const { data: nextIdData } = useQuery(GET_NEXT_CUSTOMER_ID, {
        skip: isEditMode,
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (!isEditMode && nextIdData?.getNextCustomerId) {
            setGeneratedCustomerId(nextIdData.getNextCustomerId);
        }
    }, [nextIdData, isEditMode]);

    useEffect(() => {
        if (isEditMode && customerData?.customer?.customerId) {
            setGeneratedCustomerId(customerData.customer.customerId);
        }
    }, [customerData, isEditMode]);

    // Handle lead prefill data
    useEffect(() => {
        const prefill = (location.state as any)?.prefillData;
        if (!isEditMode && prefill) {
            console.log('[Prefill] Loading lead data into customer form:', prefill);
            if (prefill.uid) setPrefillLeadUid(prefill.uid);
            setFormData(prev => ({
                ...prev,
                title: prefill.title || prev.title,
                firstName: prefill.firstname || prev.firstName,
                lastName: prefill.lastname || prev.lastName,
                email: prefill.email || prev.email,
                phone: denormalisePhone(prefill.number || prev.phone),
                unitNumber: (prefill.unitnumber || prev.unitNumber)?.toString().trim().replace(/^(unit|unit\s+)/i, '') || '',
                streetNumber: prefill.streetnumber || prev.streetNumber,
                streetName: prefill.streetname || prev.streetName,
                streetType: prefill.streettype || prev.streetType,
                suburb: prefill.suburb || prev.suburb,
                state: prefill.state || prev.state,
                postcode: prefill.postcode || prev.postcode,
                country: prefill.country || prev.country,
                nmi: prefill.nmi || prev.nmi,
                source: prefill.source || prev.source,
                referralName: prefill.referralName || prev.referralName,
            }));

            if (prefill.notes) {
                setPrefillNotes(prefill.notes);
            }

            if (prefill.fullAddress) {
                setAddressSearch(prefill.fullAddress);
            }
        }
    }, [location.state, isEditMode]);

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
    const [createCustomerNote] = useMutation(CREATE_CUSTOMER_NOTE);
    const [markEnrollmentProcessed] = useMutation(MARK_WEB_ENROLLMENT_PROCESSED);
    const [sendPdrsConsentEmail] = useMutation(SEND_PDRS_CONSENT_EMAIL);

    const isPdrs = useMemo(() => {
        if (isEditMode) {
            const portal = customerData?.customer?.portalName?.toUpperCase();
            return portal === 'PEERLESSGROUP' || portal === 'PDRS';
        }
        const prefillPortal = (prefillData?.portalname || prefillData?.portalName || '')?.toUpperCase();
        return prefillPortal === 'PEERLESSGROUP' || prefillPortal === 'PDRS';
    }, [prefillData, customerData, isEditMode]);

    const requiresNominationForm = useMemo(() => {
        if (!activePlansData?.activePlans || !formData.planUid) return false;
        const selectedPlan = activePlansData.activePlans.find((p: any) => p.uid === formData.planUid);
        return !!selectedPlan?.attachNominationForm;
    }, [activePlansData, formData.planUid]);

    // isPdrsOrNomination removed, using isPdrs directly
    // Set Peerless Group defaults (VPP = true, Solar = true, VPP Bonus = $600) on initial load for new customers
    useEffect(() => {
        if (isPdrs && !isEditMode) {
            setFormData(prev => ({
                ...prev,
                vpp: true,
                hasSolar: true,
                vppSignupBonus: '600'
            }));
        }
    }, [isPdrs, isEditMode]);

    // Automatically select VPP Signup Bonus if the loaded customer's battery brand is "Unknown"
    useEffect(() => {
        if (isPdrs && isEditMode && customerData?.customer && batteryMakesData?.batteryMakes) {
            const batteryBrandUid = customerData.customer.batteryDetails?.batterybrand || '';
            const makeObj = batteryMakesData.batteryMakes.find((m: any) => m.uid === batteryBrandUid);
            if (makeObj?.make?.toLowerCase() === 'unknown') {
                setFormData(prev => ({
                    ...prev,
                    vppSignupBonus: '600'
                }));
            }
        }
    }, [isPdrs, isEditMode, customerData, batteryMakesData]);

    const isGeeEnergy = useMemo(() => {
        let portal = '';
        if (isEditMode) {
            portal = customerData?.customer?.portalName || '';
        } else {
            portal = prefillData?.portalname || prefillData?.portalName || '';
        }
        return portal.toUpperCase().includes('GEE');
    }, [prefillData, customerData, isEditMode]);

    // Get customer's rate version for historic rates lookup
    const customerRateVersion = customerData?.customer?.rateVersion;

    // Use selected version override or fall back to customer's saved version
    const activeVersionForLookup = selectedVersion || customerRateVersion;

    // Fetch historic rates by version (for edit mode or when selection overrides)
    const { data: historicRatesData } = useQuery(GET_RATES_HISTORY_BY_VERSION, {
        variables: { version: activeVersionForLookup },
        skip: !activeVersionForLookup,
        fetchPolicy: 'network-only',
    });

    const { data: bonusesData } = useQuery(GET_ACTIVE_BONUSES, {
        fetchPolicy: 'cache-and-network'
    });
    const activeBonuses: Bonus[] = bonusesData?.activeBonuses || [];





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
                // Temporarily disabled VPP filtering as requested by user
                // const vppMatch = formData.vpp ? rp.vpp === 1 : rp.vpp !== 1;
                return stateMatch && activeMatch; // && vppMatch;
            })
            .map(rp => ({
                value: rp.uid, // Use UID as unique value to avoid selection ambiguity in the UI
                label: `${rp.codes} - ${rp.tariff} (${rp.state})`,
                codeString: rp.codes, // Preserve code string for matching logic
            }));
    }, [ratePlans, formData.state, formData.vpp]);

    const countryOptions = useMemo(() => {
        return getData().map((country) => ({
            value: country.code,
            label: country.name,
        }));
    }, []);




    const initializedFormForUid = React.useRef<string | null>(null);
    const initializedRatePlanForUid = React.useRef<string | null>(null);

    // Load Data
    useEffect(() => {
        if (customerData?.customer && initializedFormForUid.current !== uid) {
            const c = customerData.customer;

            setFormData({
                title: c.title || '',
                firstName: c.firstName || '',
                lastName: c.lastName || '',
                email: c.email || '',
                phone: denormalisePhone(c.number || ''),
                gender: c.gender || 0,
                relationshipStatus: c.relationshipStatus || 0,
                enquiryAmount: c.enquiryAmount?.toString() || '',
                checkCreditScore: c.checkCreditScore === 1,
                employerName: c.employerName || '',
                dob: c.dob ? formatSydneyTime(c.dob, 'YYYY-MM-DD') : '',
                source: c.source || '',
                referralName: c.referralName || '',
                propertyType: c.propertyType || 0,
                businessName: c.businessName || '',
                legalName: c.legalName || '',
                assignedToUid: c.assignedToUid || undefined,
                abn: c.abn || '',
                showAsBusinessName: c.showAsBusinessName || false,
                showName: c.showName ?? true,
                unitNumber: c.address?.unitNumber || '',
                houseNumber: c.address?.houseNumber || '',
                houseNumberSuffix: c.address?.houseNumberSuffix || '',
                buildingName: c.address?.buildingName || '',
                floorLevelNumber: c.address?.floorLevelNumber || '',
                streetNumber: c.address?.streetNumber || '',
                streetName: c.address?.streetName || '',
                streetType: c.address?.streetType || '',
                suburb: c.address?.suburb || '',
                state: c.address?.state || '',
                flatOrUnitType: c.address?.flatOrUnitType || '',
                gnafPid: c.address?.gnafPid || '',
                postcode: c.address?.postcode || '',
                country: c.address?.country || 'Australia',
                nmi: c.address?.nmi || '',
                hasSolar: c.solarDetails?.hassolar === 1 || c.vppDetails?.vpp === 1,
                solarCapacity: c.solarDetails?.solarcapacity?.toString() || '',
                inverterCapacity: c.solarDetails?.invertercapacity?.toString() || '',
                vpp: c.vppDetails?.vpp === 1,
                vppConnected: c.vppDetails?.vppConnected === 1,
                vppSignupBonus: c.batteryDetails?.isbattery === 1 ? '' : (c.vppDetails?.vppSignupBonus != null ? c.vppDetails.vppSignupBonus.toString() : (isPdrs ? '600' : '')),
                hasBattery: c.batteryDetails?.isbattery === 1,
                isBattery: c.batteryDetails?.isbattery === 1 ? 1 : 0,
                batteryBrand: c.batteryDetails?.batterybrand || '',
                batteryCapacity: c.batteryDetails?.batterycapacity?.toString() || '',
                snNumber: c.batteryDetails?.snnumber || '',
                exportLimit: c.batteryDetails?.exportlimit?.toString() || '',
                batteryModel: c.batteryDetails?.batterymodel || '',
                saleType: c.enrollmentDetails?.saletype || 0,
                connectionDate: c.enrollmentDetails?.connectiondate ? formatSydneyTime(c.enrollmentDetails.connectiondate, 'YYYY-MM-DD') : '',
                idType: c.enrollmentDetails?.idtype || 0,
                idNumber: c.enrollmentDetails?.idnumber || '',
                idState: c.enrollmentDetails?.idstate || '',
                idCountry: c.enrollmentDetails?.idcountry || '',
                idExpiry: c.enrollmentDetails?.idexpiry ? formatSydneyTime(c.enrollmentDetails.idexpiry, 'YYYY-MM-DD') : '',
                licenseNumber: c.enrollmentDetails?.licenseNumber || '',
                licenseState: c.enrollmentDetails?.licenseState || '',
                licenseExpiry: c.enrollmentDetails?.licenseExpiry ? formatSydneyTime(c.enrollmentDetails.licenseExpiry, 'YYYY-MM-DD') : '',
                licenseCardNumber: c.enrollmentDetails?.licenseCardNumber || '',
                medicareCardType: c.enrollmentDetails?.medicareCardType || 0,
                medicareIrn: c.enrollmentDetails?.medicareIrn || '',
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
                firstDebitDate: c.debitDetails?.firstDebitDate ? formatSydneyTime(c.debitDetails.firstDebitDate, 'YYYY-MM-DD') : '',
                tariffCode: c.tariffCode || '',
                ratePlanUid: c.ratePlanUid || c.ratePlan?.uid || undefined,
                planUid: c.planUid || '',
                discount: c.discount || 0,
                creditScore: c.creditScore,
                riskStatus: c.riskStatus,
                previousBill: c.previousBill || null,
                identityProof: c.identityProof || null,
                licenseDocument: c.licenseDocument || null,
                additionalDocument: c.additionalDocument || null,
                selectedBonuses: c.batteryDetails?.isbattery === 1 ? [] : (c.selectedBonuses || []),
                pdrsEmailSent: c.pdrsEmailSent || 0,
                pdrsEmailSentAt: c.pdrsEmailSentAt || undefined,
                isCreditScoreFetched: c.isCreditScoreFetched === 1
            });

            if (c.phoneVerifiedAt) {
                setPhoneVerified(true);
                setPhoneVerifiedAt(c.phoneVerifiedAt);
                setOtpSent(true);
            }

            // Prefill address search field
            if (c.address) {
                if (c.address.fullAddress) {
                    setAddressSearch(c.address.fullAddress);
                } else {
                    setAddressSearch([
                        c.address.unitNumber ? `${c.address.flatOrUnitType || 'Unit'} ${c.address.unitNumber}` : '',
                        c.address.streetNumber,
                        c.address.streetName,
                        c.address.streetType,
                        c.address.suburb,
                        c.address.state,
                        c.address.postcode
                    ].filter(Boolean).join(', ').trim());
                }
            }

            console.log('[Edit Mode] Customer data loaded:', c);

            if (c.rateVersion && !selectedVersion) {
                setSelectedVersion(c.rateVersion);
            }

            initializedFormForUid.current = uid || null;
        }
    }, [customerData, uid, selectedVersion]);

    // Initial Rate Plan Selection
    useEffect(() => {
        if (customerData?.customer && ratePlans.length > 0 && initializedRatePlanForUid.current !== uid) {
            const c = customerData.customer;
            if (c.tariffCode) {
                const rp = (c.ratePlan?.uid)
                    ? ratePlans.find((r: any) => r.uid === c.ratePlan?.uid)
                    : ratePlans.find((r: any) => r.codes === c.tariffCode);
                if (rp) setSelectedRatePlan(rp);
            }
            initializedRatePlanForUid.current = uid || null;
        }
    }, [customerData, ratePlans, uid]);

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
                            houseNumber: formData.houseNumber || undefined,
                            buildingName: formData.buildingName || undefined,
                            floorLevelNumber: formData.floorLevelNumber || undefined,
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

    const autoSelectTariff = (selectedTariff: string, nmiItem?: any) => {
        if (!selectedTariff || !tariffOptions?.length) return;

        // Custom matching logic based on NMI register data
        if (nmiItem) {
            const registers = [
                ...(nmiItem.registers || []),
                ...(nmiItem.meters?.flatMap((m: any) => m.registers || []) || [])
            ];

            // Only look at registers matching the current tariff code if multiple exist
            const relevantRegisters = registers.filter((r: any) => r.tariffCode === selectedTariff);

            const hasCL1Interval = relevantRegisters.some((r: any) => r.networkAdditionalInfo === "Controlled load 1 Interval");
            const hasCL2Interval = relevantRegisters.some((r: any) => r.networkAdditionalInfo === "Controlled load 2 Interval");
            const hasTOUSeasonal = relevantRegisters.some((r: any) => r.networkAdditionalInfo === "TOU seasonal interval");

            let targetTariffName = "";
            if (hasCL1Interval) targetTariffName = "TOU with CL1";
            else if (hasCL2Interval) targetTariffName = "TOU with CL2";
            else if (hasTOUSeasonal) targetTariffName = "TOU";

            let matchedRatePlan = null;
            const currentState = (formData.state || nmiItem?.address?.state || '').toLowerCase();

            if (targetTariffName) {
                matchedRatePlan = ratePlans.find(rp =>
                    rp.tariff === targetTariffName &&
                    rp.state?.toLowerCase() === currentState &&
                    (formData.vpp ? rp.vpp === 1 : rp.vpp !== 1)
                );
            }

            // Fallback: If controlledLoad is true and there is additional info, match rate with non-zero CL usage
            if (!matchedRatePlan && (nmiItem?.controlledLoad?.hasControlledLoad || relevantRegisters.some((r: any) => r.controlledLoad))) {
                const hasAnyAdditionalInfo = relevantRegisters.some((r: any) => r.networkAdditionalInfo);
                if (hasAnyAdditionalInfo) {
                    matchedRatePlan = ratePlans.find(rp => {
                        if (rp.state?.toLowerCase() !== currentState) return false;
                        if (formData.vpp ? rp.vpp !== 1 : rp.vpp === 1) return false;

                        const activeOffer = rp.offers?.find((o: any) => !o.isDeleted && o.isActive !== false);
                        if (!activeOffer) return false;

                        return (parseFloat(String(activeOffer.cl1Usage || 0)) > 0 || parseFloat(String(activeOffer.cl2Usage || 0)) > 0);
                    });
                }
            }

            if (matchedRatePlan) {
                console.log('✅ Custom tariff matched via NMI data:', matchedRatePlan.tariff);
                updateField('tariffCode', matchedRatePlan.codes);
                handleTariffChange(matchedRatePlan.codes);
                return;
            }
        }

        const s = selectedTariff.toLowerCase().trim();
        const sNoPrefix = s.startsWith('vpp ') ? s.substring(4) : s;

        // 1. Try exact matches first (best quality)
        let matchedTariff = tariffOptions.find((opt: any) => {
            const v = (opt.codeString || opt.value).toLowerCase().trim();
            const vNoPrefix = v.startsWith('vpp ') ? v.substring(4) : v;
            return v === s || vNoPrefix === sNoPrefix;
        });

        // 2. Try exact matches on label components
        if (!matchedTariff) {
            matchedTariff = tariffOptions.find((opt: any) => {
                const l = opt.label.toLowerCase().trim();
                const firstPart = l.split(' - ')[0]?.trim();
                return l === s || firstPart === s || firstPart === `vpp ${s}`;
            });
        }

        // 3. Try "part of a list" match (e.g. "N73" inside "N73/N54")
        if (!matchedTariff) {
            matchedTariff = tariffOptions.find((opt: any) => {
                const parts = (opt.codeString || opt.value).toLowerCase().split(/[\/\s,]+/);
                return parts.includes(s) || parts.includes(sNoPrefix);
            });
        }

        // 4. Fallback to broad partial match
        if (!matchedTariff) {
            matchedTariff = tariffOptions.find((opt: any) =>
                (opt.codeString || opt.value)?.toLowerCase().includes(s) ||
                opt?.label?.toLowerCase().includes(s)
            );
        }

        if (matchedTariff) {
            updateField('tariffCode', matchedTariff.codeString || matchedTariff.value);
            handleTariffChange(matchedTariff.value);
        } else {
            console.warn('⚠️ No matching tariff found for:', selectedTariff);
            updateField('tariffCode', '');
            handleTariffChange('');
        }
    };

    const handleNmiLookup = async () => {
        try {
            setIsNmiLookupLoading(true);

            const body = {
                jurisdictionCode: formData.state || 'NSW',
                stateOrTerritory: formData.state || 'NSW',
                postcode: formData.postcode || '',
                houseNumber: formData.houseNumber || formData.streetNumber || '',
                houseNumberSuffix: formData.houseNumberSuffix || '',
                streetName: formData.streetName || '',
                StreetType: formData.streetType || '',
                SuburbOrPlaceOrLocality: formData.suburb || '',
                flatOrUnitNumber: formData.unitNumber || '',
                floorOrLevelNumber: formData.floorLevelNumber || '',
                buildingOrPropertyName: formData.buildingName || ''
            };

            const response = await fetch(`${import.meta.env.VITE_MSAT_API_URL}/api/nmi-lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            const results = Array.isArray(data?.results) ? data.results :
                            (Array.isArray(data?.data) ? data.data :
                            (Array.isArray(data) ? data : []));

            // ✅ Multiple NMIs → open modal
            if (results.length > 1) {
                setNmiOptions(results);
                setIsNmiModalOpen(true);
                return;
            }

            // ✅ Extract NMI + Tariff
            const item =
                results[0] ||
                data?.results?.[0] ||
                data?.data?.[0] ||
                data?.data ||
                data;

            const nmi =
                item?.nmi ||
                data?.nmi ||
                data?.nationalMeterIdentifier ||
                (typeof data === 'string' ? data : null);

            const customerType = item?.customerType;

            // ✅ Extract Tariffs from registers
            const allTariffs = Array.from(new Set([
                item?.network?.tariff,
                ...(item?.registers?.map((r: any) => r.tariffCode) || []),
                ...(item?.meters?.flatMap((m: any) => m.registers?.map((r: any) => r.tariffCode)) || [])
            ].filter(Boolean)));

            if (nmi) {
                // ✅ If multiple tariffs found, open modal even for single results
                if (allTariffs.length > 1 && !isNmiModalOpen) {
                    setNmiOptions(results.length > 0 ? results : [item]);
                    setSelectedNmiForTariff(item);
                    setIsNmiModalOpen(true);
                    return;
                }

                updateField('nmi', nmi);
                updateField('isVppAndIsBattery', !!item?.isVppAndIsBattery);
                checkNmiDuplicate(nmi);

                // ✅ Auto tariff match (use primary tariff or first found)
                const tariff = allTariffs[0] as string;
                if (tariff) {
                    autoSelectTariff(tariff, item);
                }

                // ✅ Auto property type mapping
                if (customerType === 'RESIDENTIAL') {
                    updateField('propertyType', 0);
                } else if (customerType === 'BUSINESS' || customerType === 'COMMERCIAL') {
                    updateField('propertyType', 1);
                }

                // ✅ Auto-prefill address
                const address = item?.address;
                if (address) {
                    const displayHouseNumber = address.houseNumberTo
                        ? `${address.houseNumber}-${address.houseNumberTo}`
                        : address.houseNumber || '';

                    updateField('unitNumber', address.flatOrUnitNumber || '');
                    updateField('houseNumber', displayHouseNumber);
                    updateField('houseNumberSuffix', address.houseNumberSuffix || '');
                    updateField('streetNumber', displayHouseNumber);
                    updateField('streetName', address.streetName || '');
                    updateField('streetType', address.streetType || '');
                    updateField('suburb', address.suburb || '');
                    updateField('state', address.state || '');
                    updateField('postcode', address.postcode || '');
                    updateField('flatOrUnitType', address.flatOrUnitType || '');
                    updateField('gnafPid', address.gnafPid || '');

                    setAddressSearch([
                        address.flatOrUnitNumber
                            ? (address.flatOrUnitType ? `${address.flatOrUnitType} ${address.flatOrUnitNumber}` : `Unit ${address.flatOrUnitNumber}`)
                            : '',
                        address.houseNumberTo
                            ? `${address.houseNumber}-${address.houseNumberTo}${address.houseNumberSuffix || ''}`
                            : (address.houseNumber || '') + (address.houseNumberSuffix || ''),
                        address.streetName,
                        address.streetType,
                        address.suburb,
                        address.state,
                        address.postcode
                    ].filter(Boolean).join(', ').trim());
                }

                toast.success('NMI successfully found');
            } else {
                console.log('❌ NMI Lookup Response:', data);
                toast.error('NMI not found for this address');
            }

        } catch (error) {
            console.error('❌ Error fetching NMI:', error);
            toast.error('Failed to lookup NMI');
        } finally {
            setIsNmiLookupLoading(false);
        }
    };

    const handleNmiTariffLookup = async () => {
        if (!formData.nmi || formData.nmi.length < 10) {
            toast.error('Please enter a valid NMI first');
            return;
        }

        try {
            setIsNmiLookupLoading(true);

            const nmiLookupBody = {
                jurisdictionCode: formData.state || 'NSW',
                stateOrTerritory: formData.state || 'NSW',
                postcode: formData.postcode || '',
                houseNumber: formData.houseNumber || formData.streetNumber || '',
                houseNumberSuffix: formData.houseNumberSuffix || '',
                streetName: formData.streetName || '',
                StreetType: formData.streetType || '',
                SuburbOrPlaceOrLocality: formData.suburb || '',
                flatOrUnitNumber: formData.unitNumber || '',
                floorOrLevelNumber: formData.floorLevelNumber || '',
                buildingOrPropertyName: formData.buildingName || '',
                nmi: formData.nmi
            };

            const response = await fetch(`${import.meta.env.VITE_MSAT_API_URL}/api/nmi-lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nmiLookupBody)
            });

            const data = await response.json();

            // Find the result matching the entered NMI
            const results = Array.isArray(data?.results) ? data.results :
                            (Array.isArray(data?.data) ? data.data :
                            (Array.isArray(data) ? data : []));

            // If multiple NMIs found, open modal for selection
            if (results.length > 1) {
                setNmiOptions(results);
                setIsNmiModalOpen(true);
                return;
            }

            const item = results[0];

            if (!item) {
                toast.error('NMI not found');
                return;
            }

            // If multiple tariffs, open modal for selection
            const allTariffs = Array.from(new Set([
                item?.network?.tariff,
                ...(item?.registers?.map((r: any) => r.tariffCode) || []),
                ...(item?.meters?.flatMap((m: any) => m.registers?.map((r: any) => r.tariffCode)) || [])
            ].filter(Boolean)));

            if (allTariffs.length > 1) {
                setNmiOptions([item]);
                setSelectedNmiForTariff(item);
                setIsNmiModalOpen(true);
                return;
            }

            // Single tariff — auto-select
            updateField('nmi', item.nmi);
            updateField('isVppAndIsBattery', !!item?.isVppAndIsBattery);
            checkNmiDuplicate(item.nmi);

            const tariff = allTariffs[0] as string;
            if (tariff) {
                autoSelectTariff(tariff, item);
            }

            if (item.customerType === 'RESIDENTIAL') {
                updateField('propertyType', 0);
            } else if (item.customerType === 'BUSINESS' || item.customerType === 'COMMERCIAL') {
                updateField('propertyType', 1);
            }

            const address = item?.address;
            if (address) {
                const displayHouseNumber = address.houseNumberTo
                    ? `${address.houseNumber}-${address.houseNumberTo}`
                    : address.houseNumber || '';

                updateField('unitNumber', address.flatOrUnitNumber || '');
                updateField('houseNumber', displayHouseNumber);
                updateField('houseNumberSuffix', address.houseNumberSuffix || '');
                updateField('streetNumber', displayHouseNumber);
                updateField('streetName', address.streetName || '');
                updateField('streetType', address.streetType || '');
                updateField('suburb', address.suburb || '');
                updateField('state', address.state || '');
                updateField('postcode', address.postcode || '');
                updateField('flatOrUnitType', address.flatOrUnitType || '');
                updateField('gnafPid', address.gnafPid || '');

                setAddressSearch([
                    address.flatOrUnitNumber
                        ? (address.flatOrUnitType ? `${address.flatOrUnitType} ${address.flatOrUnitNumber}` : `Unit ${address.flatOrUnitNumber}`)
                        : '',
                    address.houseNumberTo
                        ? `${address.houseNumber}-${address.houseNumberTo}${address.houseNumberSuffix || ''}`
                        : (address.houseNumber || '') + (address.houseNumberSuffix || ''),
                    address.streetName,
                    address.streetType,
                    address.suburb,
                    address.state,
                    address.postcode
                ].filter(Boolean).join(', ').trim());
            }

            toast.success(`Tariff ${tariff || 'N/A'} resolved successfully`);
        } catch (error) {
            console.error('❌ NMI Tariff Lookup Error:', error);
            toast.error('Failed to lookup NMI tariff');
        } finally {
            setIsNmiLookupLoading(false);
        }
    };

    const handleAbrLookup = async () => {
        if (!formData.abn?.trim()) {
            toast.error('Please enter an ABN first');
            return;
        }

        try {
            setIsAbrLookupLoading(true);

            const webToken = import.meta.env.VITE_WEB_TOKEN || 'GSYNC_WEB_v1_0tuu903stcif2kzsx7t8fyy';
            const abnClean = formData.abn.replace(/\s+/g, '');

            const response = await fetch(`/api/web/abr-lookup?abn=${abnClean}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Web-Token': webToken
                }
            });

            const data = await response.json();

            if (data.success && data.data) {
                const entity = data.data;
                setFormData(prev => ({
                    ...prev,
                    legalName: entity.legalName || prev.legalName,
                    businessName: entity.businessName || prev.businessName,
                }));
                toast.success('Business details updated from ABR');
            } else {
                toast.error(data.message || 'ABN not found');
            }
        } catch (error) {
            console.error('❌ ABR Lookup Error:', error);
            toast.error('Failed to lookup ABN');
        } finally {
            setIsAbrLookupLoading(false);
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

    const handleTariffChange = (uidOrCode: string) => {
        // Try finding by UID first (preferred for uniqueness in UI), fallback to code string
        const rp = ratePlans.find(r => r.uid === uidOrCode) || ratePlans.find(r => r.codes === uidOrCode);
        const finalCode = rp ? rp.codes : uidOrCode;

        setFormData(prev => ({ ...prev, tariffCode: finalCode, ratePlanUid: rp ? rp.uid : undefined }));
        setSelectedRatePlan(rp || null);
        if (rp) {
            setFormData(prev => ({ ...prev, discount: rp.discountPercentage || 0 }));
        }
    };

    // Clear tariff code if it doesn't match available options for current state/vpp
    useEffect(() => {
        // Only run if we have rate plans loaded (to avoid clearing on initial mount while loading)
        // AND we have a state selected (since tariffOptions depends on state)
        if (ratePlans.length > 0 && formData.state && formData.tariffCode) {
            // Check if either the current selected UID or the current code string exists in available options
            const exists = tariffOptions.some(opt =>
                opt.value === selectedRatePlan?.uid || opt.codeString === formData.tariffCode
            );
            if (!exists) {
                setFormData(prev => ({ ...prev, tariffCode: '', ratePlanUid: undefined }));
                setSelectedRatePlan(null);
            }
        }
    }, [tariffOptions, ratePlans.length, formData.state, formData.vpp, formData.tariffCode, selectedRatePlan]);

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Field-level validation
    const validateField = (name: string, value: any): string => {
        // Required fields
        let isRequired = ['firstName', 'lastName', 'email', 'phone', 'streetNumber', 'streetName', 'suburb', 'postcode', 'nmi'].includes(name);

        if (name === 'referralName' && formData.source === 'Referral') {
            isRequired = true;
        }

        // Conditional demographic requirements
        if (formData.checkCreditScore) {
            const requiredFields = ['gender', 'relationshipStatus', 'enquiryAmount', 'dob', 'licenseNumber', 'licenseState', 'licenseExpiry'];
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
                if (value.replace(/\s/g, '').length < 9) return 'Mobile number must be at least 9 digits';
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

        // Trim values on blur for string fields
        const value = formData[field];
        if (typeof value === 'string') {
            updateField(field, value.trim());
        }

        const error = validateField(field, formData[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const updateField = (field: keyof CustomerFormData, value: any) => {
        // Enforce input masking for specific fields
        let finalValue = value;

        if (field === 'phone' || field === 'nmi') {
            // Remove non-numeric characters for these fields if user is typing
            if (typeof value === 'string') {
                finalValue = value.replace(/\D/g, '');

                // For phone, prevent starting with 0
                if (field === 'phone' && finalValue.startsWith('0')) {
                    finalValue = finalValue.substring(1);
                }
            }
        }

        // Standardize Name fields: first letter of each word capital
        if (['firstName', 'lastName', 'debitFirstName', 'debitLastName'].includes(field)) {
            if (typeof value === 'string') {
                finalValue = value.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            }
        }

        // Clear phone verification if phone number changes from the original
        if (field === 'phone') {
            const originalPhone = customerData?.customer?.number;
            const currentPhone = typeof value === 'string' ? value.replace(/\D/g, '') : value;
            // Also account for the leading 0 removal
            let normalizedCurrent = currentPhone;
            if (typeof normalizedCurrent === 'string' && normalizedCurrent.startsWith('0')) {
                normalizedCurrent = normalizedCurrent.substring(1);
            }
            let normalizedOriginal = originalPhone?.replace(/\D/g, '');
            if (normalizedOriginal?.startsWith('0')) {
                normalizedOriginal = normalizedOriginal.substring(1);
            }

            if (normalizedCurrent !== normalizedOriginal) {
                setPhoneVerified(false);
                setPhoneVerifiedAt(null);
            } else if (customerData?.customer?.phoneVerifiedAt) {
                // If they change it back to the original verified number, restore verification
                setPhoneVerified(true);
                setPhoneVerifiedAt(customerData.customer.phoneVerifiedAt);
            }
        }

        // Standardize Email to lowercase and trimmed
        if (field === 'email') {
            if (typeof value === 'string') {
                finalValue = value.toLowerCase().trim();
            }
        }

        // Handle Date objects from DatePicker
        if (value instanceof Date) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            finalValue = `${year}-${month}-${day}`;
        }

        setFormData(prev => ({ ...prev, [field]: finalValue }));
        setIsFormDirty(true);

        // Clear demographic errors if Check Credit Score is toggled off
        if (field === 'checkCreditScore') {
            if (!finalValue) {
                setErrors(prev => ({
                    ...prev,
                    gender: '',
                    relationshipStatus: '',
                    employerName: '',
                    enquiryAmount: '',
                    dob: ''
                }));
            }
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
            formData.email?.trim()
        );
    }, [formData]);

    const step3Valid = useMemo(() => {
        if (formData.checkCreditScore) {
            return !!(
                formData.licenseNumber?.trim() &&
                formData.licenseState &&
                formData.licenseExpiry &&
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
    const handleSubmit = async (targetStatus: number = 1, isUpdateOnly: boolean = false) => {
        const loadingStatus = isUpdateOnly ? 3 : (isWithoutSignature ? 4 : targetStatus);
        setSubmittingStatus(loadingStatus);

        // If we are submitting as active (1), set status to 2 (Signature Pending)
        let finalStatus = targetStatus;
        if (isUpdateOnly && customerData?.customer?.status !== undefined) {
            finalStatus = customerData.customer.status;
        } else if (targetStatus === 1 && !isWithoutSignature) {
            finalStatus = 2;
        }

        // If PDRS, and sending email (not update only), set to Consent Pending (7)
        if (isPdrs && isEditMode && !isUpdateOnly) {
            finalStatus = 7;
        }

        // Temporarily disable dirty check to allow navigation
        setIsFormDirty(false);
        try {
            // Determine if an update email should be triggered based on significant field changes
            const hasSignificantChanges = () => {
                if (!isEditMode || !customerData?.customer) return false;
                const c = customerData.customer;

                // Significant fields that trigger an "Updated" email
                const checks = [
                    formData.firstName !== (c.firstName || ''),
                    formData.lastName !== (c.lastName || ''),
                    formData.businessName !== (c.businessName || ''),
                    formData.legalName !== (c.legalName || ''),
                    formData.abn !== (c.abn || ''),
                    normalisePhone(formData.phone) !== normalisePhone(c.number || ''),

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

                    // Secondary ID & Concession
                    formData.idType !== (c.enrollmentDetails?.idtype || 0),
                    formData.idNumber !== (c.enrollmentDetails?.idnumber || ''),
                    formData.idState !== (c.enrollmentDetails?.idstate || ''),
                    formData.licenseNumber !== (c.enrollmentDetails?.licenseNumber || ''),
                    formData.medicareIrn !== (c.enrollmentDetails?.medicareIrn || ''),
                    formData.medicareCardType !== (c.enrollmentDetails?.medicareCardType || 0),
                    (formData.concession ? 1 : 0) !== (c.enrollmentDetails?.concession || 0),
                    (formData.lifeSupport ? 1 : 0) !== (c.enrollmentDetails?.lifesupport || 0),

                    // Bonuses
                    JSON.stringify(formData.selectedBonuses || []) !== JSON.stringify(c.selectedBonuses || []),
                ];

                return checks.some(changed => changed);
            };

            const significantChanges = hasSignificantChanges();

            let signatureClears = {};
            if (isEditMode && significantChanges) {
                signatureClears = {
                    signDate: null,
                    signedPdfPath: null,
                    signatureUrl: null,
                    consentSignatureBase64: null,
                    signedConsent: null,
                    signedConsentAt: null,
                };
            }

            const input = {
                title: formData.title,
                email: formData.email,
                source: formData.source || undefined,
                referralName: formData.referralName || undefined,
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                legalName: formData.legalName,
                abn: formData.abn,
                showAsBusinessName: formData.showAsBusinessName,
                showName: formData.showName,
                number: normalisePhone(formData.phone),

                dob: formData.dob || null,
                phoneVerifiedAt: phoneVerifiedAt,
                propertyType: formData.propertyType,
                assignedToUid: formData.assignedToUid,
                tariffCode: formData.tariffCode,
                ratePlanUid: formData.ratePlanUid || selectedRatePlan?.uid || null,
                planUid: formData.planUid ? formData.planUid : null,
                discount: formData.discount,
                status: finalStatus,
                gender: formData.gender,
                relationshipStatus: formData.relationshipStatus,
                enquiryAmount: formData.enquiryAmount ? parseFloat(formData.enquiryAmount) : undefined,
                checkCreditScore: formData.checkCreditScore ? 1 : 0,
                employerName: formData.employerName,
                isCreditScoreFetched: formData.isCreditScoreFetched ? 1 : 0,
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
                    licenseCardNumber: formData.licenseCardNumber,
                    medicareCardType: String(formData.medicareCardType),
                    medicareIrn: formData.medicareIrn,
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
                    flatOrUnitType: formData.flatOrUnitType || undefined,
                    gnafPid: formData.gnafPid || undefined,
                },
                solarDetails: formData.hasSolar ? {
                    hassolar: 1,
                    solarcapacity: formData.solarCapacity ? parseFloat(formData.solarCapacity) : undefined,
                    invertercapacity: formData.inverterCapacity ? parseFloat(formData.inverterCapacity) : undefined,
                } : { hassolar: 0 },
                batteryDetails: formData.hasBattery ? {
                    isbattery: 1,
                    batterybrand: formData.batteryBrand,
                    snnumber: formData.snNumber || undefined,
                    batterycapacity: formData.batteryCapacity ? parseFloat(formData.batteryCapacity) : undefined,
                    exportlimit: formData.exportLimit ? parseFloat(formData.exportLimit) : undefined,
                    batterymodel: formData.batteryModel || undefined,
                } : { isbattery: 0 },
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
                triggerWelcomeEmail: (!isUpdateOnly && !isPdrs) ? ((!isEditMode && finalStatus === 2) || isWithoutSignature) : undefined,
                triggerUpdateEmail: (isEditMode && !isPdrs) ? (isUpdateOnly ? significantChanges : !isWithoutSignature) : undefined,
                isWithoutSignature: isWithoutSignature || undefined,
                selectedBonuses: formData.selectedBonuses,
                leadUid: prefillLeadUid || undefined,
                ...signatureClears
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

                // Lead conversion is now handled in the backend resolver via leadUid input

                // If there are prefilled notes from the lead, add them as a customer note
                if (prefillNotes && savedCustomer?.uid) {
                    try {
                        await createCustomerNote({
                            variables: {
                                customerUid: savedCustomer.uid,
                                message: prefillNotes,
                                type: 'General'
                            }
                        });
                        console.log('[Lead Conversion] Successfully transferred lead notes to customer:', savedCustomer.uid);
                    } catch (noteErr) {
                        console.error('[Lead Conversion] Failed to create note from lead:', noteErr);
                    }
                }
            }
            // Credit Score Check (After customer is created/updated)
            if (!isEditMode && formData.checkCreditScore && !formData.isCreditScoreFetched && savedCustomer?.uid) {
                try {
                    const equifaxPayload = {
                        "credit_report_request": {
                            "first-name": formData.firstName,
                            "first-given-name": formData.lastName,
                            "address": {
                                "street-name": formData.streetName,
                                "street-type": formData.streetType,
                                "suburb": formData.suburb,
                                "state-code": formData.state
                            },
                            "gender-code": formData.gender === 0 ? 'M' : (formData.gender === 1 ? 'F' : 'O'),
                            "license-number": formData.licenseNumber,
                            "license-state": formData.licenseState,
                            "date-of-birth": formData.dob,
                            "employer-name": formData.employerName,
                            "account-type-code": "CC",
                            "enquiry-amount": Math.floor(Number(formData.enquiryAmount) || 0),
                            "relationship-code": String(formData.relationshipStatus || '1'),
                            "client-reference": savedCustomer.customerId || savedCustomer.uid,
                            "enquiry-client-reference": formData.phone || ''
                        },
                        "type": "PROD" // Change to TEST if required by environment
                    };

                    const response = await secondaryApiAxios.post('/v1/equifax/user/get-credit-report', equifaxPayload);
                    let score: number | undefined;
                    let riskStatusUid: string | undefined;

                    // Handle various response formats
                    const responseData = response?.data !== undefined ? response.data : response;

                    if (responseData?.creditScoreData?.score?.score_masterscale) {
                        score = parseInt(responseData.creditScoreData.score.score_masterscale);
                    } else if (responseData?.creditScore) {
                        score = parseInt(responseData.creditScore);
                    } else if (Array.isArray(responseData) && responseData.length >= 2) {
                        const v1 = parseInt(responseData[0]);
                        const v2 = parseInt(responseData[1]);
                        score = v1 > 100 ? v1 : v2;
                    } else if (typeof responseData === 'string') {
                        const parts = responseData.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            const v1 = parseInt(parts[0]);
                            const v2 = parseInt(parts[1]);
                            score = v1 > 100 ? v1 : v2;
                        } else if (parts.length === 1 && !isNaN(parseInt(parts[0]))) {
                            score = parseInt(parts[0]);
                        }
                    } else if (typeof responseData === 'number') {
                        score = responseData;
                    }

                    if (score !== undefined && !isNaN(score)) {
                        const matched = riskStatuses.find((rs: any) => {
                            if (rs.scoreMin === null && rs.scoreMax === null) return false;
                            const minOk = rs.scoreMin === null || score! >= rs.scoreMin;
                            const maxOk = rs.scoreMax === null || score! < rs.scoreMax;
                            return minOk && maxOk;
                        });
                        if (matched) {
                            riskStatusUid = matched.uid;
                        }
                    }

                    if (riskStatusUid) {
                        await updateCustomer({
                            variables: {
                                uid: savedCustomer.uid,
                                input: {
                                    creditScore: score,
                                    isCreditScoreFetched: 1,
                                    riskStatus: riskStatusUid
                                }
                            }
                        });
                        updateField('isCreditScoreFetched', true);
                        toast.success(`Credit check passed. Score: ${score}`);
                    }
                } catch (error) {
                    console.error('Credit check failed:', error);
                    toast.warn('Automated credit check failed. Customer was saved without credit score.');
                }
            }

            // Trigger PDRS email if applicable (only on update as requested)
            // Send in background without awaiting so UI does not get stuck
            if (isEditMode && !isUpdateOnly && isPdrs && savedCustomer?.uid && finalStatus === 7) {
                sendPdrsConsentEmail({ variables: { customerUid: savedCustomer.uid } })
                    .catch((emailErr) => {
                        console.error('[PDRS] Failed to send consent email in background:', emailErr);
                        toast.error('PDRS consent email failed to send');
                    });
            }

            // Clear customer cache to ensure fresh data on customers page
            apolloClient.cache.evict({ fieldName: 'customers' });
            apolloClient.cache.evict({ fieldName: 'customersCursor' });
            if (savedCustomer?.uid) {
                apolloClient.cache.evict({ fieldName: 'customer', args: { uid: savedCustomer.uid } });
                apolloClient.cache.evict({ id: `Customer:${savedCustomer.uid}` });
            }
            apolloClient.cache.gc();

            // Handle redirection

            // If we came from approvals, mark the enrollment as processed
            if (fromApprovals && approvalUid) {
                try {
                    await markEnrollmentProcessed({ variables: { uid: approvalUid } });
                    console.log('[Approvals] Marked web enrollment as processed:', approvalUid);
                } catch (err) {
                    console.error('[Approvals] Failed to mark enrollment as processed:', err);
                }
            }

            if (fromApprovals) {
                navigate('/customers/approvals');
                return;
            }

            navigate('/customers');
        } catch (err: any) {
            console.error('Failed to save customer:', err);

            let errorMessage = 'Failed to save customer';
            if (err.graphQLErrors && err.graphQLErrors.length > 0) {
                errorMessage = err.graphQLErrors[0].message;
            } else if (err.networkError && (err.networkError as any).response?.data?.errors?.length > 0) {
                errorMessage = (err.networkError as any).response.data.errors[0].message;
            } else if (err.networkError && (err.networkError as any).result?.errors?.length > 0) {
                errorMessage = (err.networkError as any).result.errors[0].message;
            } else if (err.response?.data?.errors?.length > 0) {
                errorMessage = err.response.data.errors[0].message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
            // Re-enable dirty check if failed
            setIsFormDirty(true);
        } finally { setSubmittingStatus(null); }
    };

    const handlePreviewOffer = async (targetUid: string, isWithoutSignatureOverride?: boolean) => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        setPreviewModalOpen(true);
        setIsLoadingPreview(true);
        try {
            const offer = selectedRatePlan?.offers?.[0];
            const discount = formData.discount ?? selectedPlan?.discount ?? 0;
            const isDnspBased = selectedPlan?.isDnspBased ?? customerData?.plan?.isDnspBased;
            const dnsp = selectedRatePlan?.dnsp;
            const overriddenOffer = offer ? applyPlanOverridesToOffer(offer, selectedPlan?.ratesJson || customerData?.plan?.ratesJson, isDnspBased, dnsp) : null;
            const charges = overriddenOffer ? {
                supplyCharge: overriddenOffer.supplyCharge,
                anytime: overriddenOffer.anytime,
                peak: overriddenOffer.peak,
                shoulder: overriddenOffer.shoulder,
                offPeak: overriddenOffer.offPeak,
                cl1Usage: overriddenOffer.cl1Usage,
                cl2Usage: overriddenOffer.cl2Usage,
                cl1Supply: overriddenOffer.cl1Supply,
                cl2Supply: overriddenOffer.cl2Supply,
                demand: overriddenOffer.demand,
                demandOp: overriddenOffer.demandOp,
                demandP: overriddenOffer.demandP,
                demandS: overriddenOffer.demandS,
                fit: overriddenOffer.fit,
                fitPeak: overriddenOffer.fitPeak,
                fitCritical: overriddenOffer.fitCritical,
                fitVpp: overriddenOffer.fitVpp,
                vppOrchestration: overriddenOffer.vppOrcharge,
                vppSignupBonus: formData.vppSignupBonus ? parseFloat(formData.vppSignupBonus) : 0,
                dynamicRates: overriddenOffer.dynamicRates || [],
                priceUnits: typeof overriddenOffer.priceUnits === 'string'
                    ? (() => { try { return JSON.parse(overriddenOffer.priceUnits); } catch { return {}; } })()
                    : (overriddenOffer.priceUnits || {}),
            } : {};

            const addressString = [
                formData.unitNumber ? `${formData.flatOrUnitType || 'Unit'} ${formData.unitNumber}` : '',
                formData.streetNumber,
                formData.streetName,
                formData.streetType,
                formData.suburb,
                formData.state,
                formData.postcode,
            ].filter(Boolean).join(' ');

            const today = new Date().toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });

            const data = {
                customerNumber: generatedCustomerId || targetUid || 'NEW',
                accountNumber: generatedCustomerId || targetUid || 'NEW',
                nmi: formData.nmi || '',
                siteAddress: addressString,
                mailingAddress: addressString,
                name: `${formData.title ? `${formData.title} ` : ''}${formData.firstName} ${formData.lastName}`.trim(),
                businessName: (formData.showAsBusinessName && formData.businessName) ? formData.businessName : '',
                email: formData.email || '',
                mobile: normalisePhone(formData.phone),
                businessContact: normalisePhone(formData.phone),

                contractStart: today,
                connectionDate: formData.connectionDate ? new Date(formData.connectionDate).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }) : today,
                offerAcceptance: today,
                signatureTimestamp: today,
                hasSolar: formData.hasSolar,
                showName: formData.showName ?? true,
                charges: charges,
                hasVpp: formData.vpp,
                vppSignupBonus: formData.vppSignupBonus ? parseFloat(formData.vppSignupBonus) : 0,
                vppOrchestration: offer?.vppOrcharge || 0,
                planName: selectedPlan?.title || selectedPlan?.planName || formData.tariffCode || '',
                discount: discount,
                showAsBusinessName: formData.showAsBusinessName,
                tenant: 'mojo',
                ratePlanUid: selectedRatePlan?.uid,
                planUid: formData.planUid || selectedPlan?.uid || undefined,
                selectedBonuses: activeBonuses.filter((b: Bonus) =>
                    formData.selectedBonuses.includes(b.uid) ||
                    (formData.isBattery === 1 && (selectedPlan?.bonusUids || []).includes(b.uid))
                ),
                uid: targetUid === 'new' ? undefined : targetUid,
                isBattery: formData.isBattery,
                isWithoutSignature: isWithoutSignatureOverride !== undefined ? isWithoutSignatureOverride : isWithoutSignature
            };

            setPreviewData(data);

            const response = await apiAxios.post('/agreement/preview-html', data);
            const blob = new Blob([response.data], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            setPreviewUrl(url);
        } catch (err: any) {
            console.error('Failed to generate preview:', err);
            toast.error('Failed to generate offer preview');
            setPreviewModalOpen(false);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handlePreviewPdrsConsent = async () => {
        setIsLoadingEmailPreview(true);
        setPreviewStep('email');
        setPreviewModalOpen(true);
        try {
            const { data } = await fetchSystemTemplate({
                variables: { eventType: 'CUSTOMER_DRAFT' },
                fetchPolicy: 'network-only'
            });
            if (data?.previewSystemTemplate) {
                let preview = { ...data.previewSystemTemplate };

                // Replace placeholders for a more realistic preview
                const companyName = '[[ Company Name ]]';
                const firstName = formData.firstName || '[[FIRST_NAME]]';
                const lastName = formData.lastName || '[[LAST_NAME]]';

                if (preview.body) {
                    preview.body = preview.body
                        .replace(/\[\[COMPANY_NAME\]\]/g, companyName)
                        .replace(/\[\[REFERRER_NAME\]\]/g, companyName)
                        .replace(/\[\[FIRST_NAME\]\]/g, firstName)
                        .replace(/\[\[LAST_NAME\]\]/g, lastName);
                }

                setEmailPreview(preview);
            } else {
                toast.error('Could not load PDRS consent template');
            }
        } catch (error) {
            console.error('Failed to fetch PDRS consent preview:', error);
            toast.error('Failed to load PDRS consent preview');
        } finally {
            setIsLoadingEmailPreview(false);
        }
    };

    const handleNextToEmailPreview = async () => {
        setIsLoadingEmailPreview(true);
        try {
            const eventType = isPdrs ? 'CUSTOMER_DRAFT' : (isWithoutSignature ? 'AGREEMENT_SIGNED' : (isEditMode ? 'CUSTOMER_UPDATED' : 'CUSTOMER_CREATED'));

            const currentRatePlanUid = formData.ratePlanUid || selectedRatePlan?.uid || null;
            const currentPlanUid = formData.planUid ? formData.planUid : null;
            const isPlanUpdated = Boolean(isEditMode && customerData?.customer && (
                (customerData.customer.planUid !== currentPlanUid) || 
                (customerData.customer.ratePlanUid !== currentRatePlanUid)
            ));

            const { data } = await fetchSystemTemplate({
                variables: {
                    eventType,
                    isWithoutSignature: !!isWithoutSignature,
                    isPlanUpdated
                },
                fetchPolicy: 'network-only'
            });

            if (data?.previewSystemTemplate) {
                let preview = { ...data.previewSystemTemplate };

                // Replace placeholders for a more realistic preview
                const companyName = '[[ Company Name ]]';
                const firstName = formData.firstName || '[[FIRST_NAME]]';
                const lastName = formData.lastName || '[[LAST_NAME]]';

                if (preview.body) {
                    preview.body = preview.body
                        .replace(/\[\[COMPANY_NAME\]\]/g, companyName)
                        .replace(/\[\[REFERRER_NAME\]\]/g, companyName)
                        .replace(/\[\[FIRST_NAME\]\]/g, firstName)
                        .replace(/\[\[LAST_NAME\]\]/g, lastName);
                }

                setEmailPreview(preview);
                setPreviewStep('email');
            } else {
                toast.error('Could not load email template');
            }
        } catch (error) {
            console.error('Failed to fetch email preview:', error);
            toast.error('Failed to load email preview');
        } finally {
            setIsLoadingEmailPreview(false);
        }
    };

    // const handleBackToOfferPreview = () => {
    //     setPreviewStep('offer');
    // };

    const handleDownloadPreview = async () => {
        if (!previewData) return;
        setIsDownloading(true);
        try {
            // Re-map to expected format if needed, and add a placeholder signature if none exists
            const downloadBody = {
                ...previewData,
                signatureImage: previewData.signatureImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            };

            const response = await apiAxios.post('/agreement/html', downloadBody, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Offer_Summary.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download the file.');
        } finally {
            setIsDownloading(false);
        }
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
                                            {/* <Field label="Customer ID">
                                                <div className="flex items-center">
                                                    <div className="flex items-center justify-center h-10 px-3 bg-muted border border-r-0 border-border rounded-l-xl text-sm font-bold text-primary whitespace-nowrap">
                                                        #
                                                    </div>
                                                    <Input
                                                        containerClassName="w-full"
                                                        className="rounded-l-none font-bold text-primary bg-primary/5 border-primary/20"
                                                        value={generatedCustomerId || 'Generating...'}
                                                        readOnly
                                                        placeholder="GEE03000"
                                                    />
                                                </div>
                                            </Field> */}

                                            <Field label="Mobile" required error={errors.phone}>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center justify-center h-10 px-3 bg-muted border border-r-0 border-border rounded-l-xl text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                            +61
                                                        </div>
                                                        <Input containerClassName="w-full sm:w-56" className="rounded-l-none" placeholder="400 000 000" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} onBlur={() => handleBlur('phone')} />
                                                    </div>
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
                                                <Input
                                                    label="ABN"
                                                    required
                                                    error={errors.abn}
                                                    placeholder="e.g. 12 345 678 901"
                                                    value={formData.abn}
                                                    onChange={(e) => updateField('abn', e.target.value)}
                                                    rightIcon={
                                                        formData.abn?.trim()?.length >= 11 ? (
                                                            <button
                                                                type="button"
                                                                onClick={handleAbrLookup}
                                                                disabled={isAbrLookupLoading}
                                                                className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                                                                title="Lookup Business Name from ABR"
                                                            >
                                                                {isAbrLookupLoading ? <SpinnerIcon className="animate-spin" size={12} /> : <SearchIcon size={12} />}
                                                                Lookup
                                                            </button>
                                                        ) : undefined
                                                    }
                                                />
                                                <Input
                                                    label="Legal Name"
                                                    error={errors.legalName}
                                                    placeholder="Legal entity name"
                                                    value={formData.legalName}
                                                    onChange={(e) => updateField('legalName', e.target.value)}
                                                />
                                                <Input label="Business Name" required error={errors.businessName} placeholder="Registered business name" value={formData.businessName} onChange={(e) => updateField('businessName', e.target.value)} />
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
                                                <span className="text-sm text-neutral-600 w-20 text-right">{formData.hasSolar ? 'Has Solar' : 'No Solar'}</span>
                                                <ToggleSwitch checked={formData.hasSolar} onChange={(checked) => updateField('hasSolar', checked)} disabled={false} />
                                                {/* <div className="transform transition-transform group-open:rotate-180"><ChevronRightIcon size={16} className="rotate-90" /></div> */}
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

                                    {/* Battery Section - Collapsible */}
                                    <details open={formData.hasBattery} className="rounded-xl border border-border group mt-6">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-accent rounded-xl">
                                            <div className="flex items-center gap-2 font-medium">
                                                <PlugIcon size={20} className="text-green-500" />
                                                <span>Battery at this property?</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-neutral-600 w-24 text-right">{formData.hasBattery ? 'Has Battery' : 'No Battery'}</span>
                                                <ToggleSwitch checked={formData.hasBattery} onChange={(checked) => {
                                                    updateField('hasBattery', checked);
                                                    if (checked) {
                                                        updateField('isBattery', 1);
                                                        updateField('vpp', true);
                                                        updateField('isVpp', 1);

                                                        updateField('selectedBonuses', []);

                                                        const makeObj = batteryMakesData?.batteryMakes?.find((m: any) => m.uid === formData.batteryBrand);
                                                        const isUnknown = makeObj?.make?.toLowerCase() === 'unknown' || !formData.batteryBrand;

                                                        if (isUnknown) {
                                                            if (isPdrs) {
                                                                updateField('vppSignupBonus', '600');
                                                            } else {
                                                                updateField('vppSignupBonus', null);
                                                            }
                                                        } else {
                                                            updateField('vppSignupBonus', null);
                                                        }
                                                    } else {
                                                        updateField('isBattery', 0);
                                                        if (isPdrs) {
                                                            updateField('vpp', true);
                                                            updateField('isVpp', 1);
                                                            updateField('vppSignupBonus', '600');
                                                        } else {
                                                            updateField('vpp', false);
                                                            updateField('isVpp', 0);
                                                        }
                                                    }
                                                }} disabled={false} />
                                            </div>
                                        </summary>

                                        {formData.hasBattery && (
                                            <div className="p-4 border-t border-border space-y-6 bg-muted/30">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Select
                                                        label="Manufacturer"
                                                        value={formData.batteryBrand}
                                                        onChange={(val) => {
                                                            updateField('batteryBrand', val);
                                                            updateField('batteryModel', ''); // Reset model

                                                            updateField('selectedBonuses', []);

                                                            const makeObj = batteryMakesData?.batteryMakes?.find((m: any) => m.uid === val);
                                                            const isUnknown = makeObj?.make?.toLowerCase() === 'unknown' || !val;

                                                            if (isUnknown) {
                                                                if (isPdrs) {
                                                                    updateField('vppSignupBonus', '600');
                                                                } else {
                                                                    updateField('vppSignupBonus', null);
                                                                }
                                                            } else {
                                                                updateField('vppSignupBonus', null);
                                                            }
                                                        }}
                                                        options={batteryMakesData?.batteryMakes?.map((m: any) => ({ label: m.make, value: m.uid })) || []}
                                                        placeholder="Select Manufacturer"
                                                        isLoading={batteryMakesLoading}
                                                    />
                                                    <Select
                                                        label="Model"
                                                        value={formData.batteryModel}
                                                        onChange={(val) => {
                                                            updateField('batteryModel', val);
                                                            const modelObj = batteryModelsData?.batteryModels?.find((m: any) => m.uid === val);
                                                            if (modelObj?.capacity) {
                                                                updateField('batteryCapacity', modelObj.capacity.toString());
                                                            }
                                                        }}
                                                        options={batteryModelsData?.batteryModels?.map((m: any) => ({ label: m.model, value: m.uid })) || []}
                                                        placeholder={formData.batteryBrand ? "Select Model" : "Select Manufacturer first"}
                                                        isLoading={batteryModelsLoading}
                                                        disabled={!formData.batteryBrand}
                                                    />
                                                    <Input label="Serial Number" placeholder="SN Number" value={formData.snNumber} onChange={(e) => updateField('snNumber', e.target.value)} />
                                                    <Input label="Capacity (kWh)" type="number" step="any" placeholder="13.5" value={formData.batteryCapacity} onChange={(e) => updateField('batteryCapacity', e.target.value)} />
                                                </div>
                                            </div>
                                        )}
                                    </details>

                                    {/* VPP Section - Standalone */}
                                    {isEditMode && (
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
                                                    <ToggleSwitch checked={formData.vpp} onChange={(checked) => {
                                                        updateField('vpp', checked);
                                                        if (checked) {
                                                            updateField('hasSolar', true);
                                                            updateField('isVpp', 1);
                                                            if (isPdrs && !formData.hasBattery) {
                                                                updateField('vppSignupBonus', '600');
                                                            }
                                                        } else {
                                                            updateField('isVpp', 0);
                                                            // Clear bonuses when VPP is unchecked
                                                            updateField('vppSignupBonus', null);
                                                            updateField('selectedBonuses', []);
                                                        }
                                                    }} disabled={false} />
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
                                                            onClick={() => updateField('vppSignupBonus', Number(formData.vppSignupBonus) === 600 ? null : '600')}
                                                            disabled={formData.hasBattery}
                                                            className={cn(
                                                                "shrink-0 transition-all font-semibold shadow-sm",
                                                                Number(formData.vppSignupBonus) === 600
                                                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent"
                                                                    : "bg-transparent border-primary/20 text-primary hover:bg-primary/10"
                                                            )}
                                                            variant={Number(formData.vppSignupBonus) === 600 ? 'default' : 'outline'}
                                                        >
                                                            {Number(formData.vppSignupBonus) === 600 ? (
                                                                <><CheckIcon className="w-3 h-3 mr-1.5" /> Bonus Applied</>
                                                            ) : (
                                                                'Add $600 Bonus'
                                                            )}
                                                        </Button>
                                                    </div>

                                                    {/* Battery details moved to Customer Modal on VPP Connect */}

                                                    {/* Dynamic Bonuses */}
                                                    {activeBonuses.filter((b: Bonus) => b.uid !== 'vpp_signup_bonus_uid').map((bonus: Bonus) => {
                                                        const isApplied = formData.selectedBonuses.includes(bonus.uid);
                                                        return (
                                                            <div key={bonus.uid} className="p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
                                                                <div>
                                                                    <div className="text-sm font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                                                                        <ZapIcon size={14} />
                                                                        {bonus.name}
                                                                    </div>
                                                                    {bonus.description && (
                                                                        <div className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                                                                            {bonus.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const newSelected = isApplied
                                                                            ? formData.selectedBonuses.filter(uid => uid !== bonus.uid)
                                                                            : [...formData.selectedBonuses, bonus.uid];
                                                                        updateField('selectedBonuses', newSelected);
                                                                    }}
                                                                    disabled={formData.hasBattery}
                                                                    className={cn(
                                                                        "shrink-0 transition-all font-semibold shadow-sm",
                                                                        isApplied
                                                                            ? "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent"
                                                                            : "bg-transparent border-primary/20 text-primary hover:bg-primary/10"
                                                                    )}
                                                                    variant={isApplied ? 'default' : 'outline'}
                                                                >
                                                                    {isApplied ? (
                                                                        <><CheckIcon className="w-3 h-3 mr-1.5" /> Bonus Applied</>
                                                                    ) : (
                                                                        `Add $${bonus.amount} Bonus`
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}


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
                                                        const unitNumber = place.unitNumber || '';
                                                        let streetNumber = place.streetNumber || '';
                                                        let houseNumberSuffix = '';
                                                        
                                                        // Extract suffix if streetNumber ends with a letter (e.g. '47a' or '47 A' -> '47', 'A')
                                                        const suffixMatch = streetNumber.match(/^(\d+)\s*([a-zA-Z])$/);
                                                        if (suffixMatch) {
                                                            streetNumber = suffixMatch[1];
                                                            houseNumberSuffix = suffixMatch[2].toUpperCase();
                                                        }

                                                        const houseNumberRaw = place.houseNumber || '';
                                                        const houseNumber = (houseNumberRaw === place.streetNumber || houseNumberRaw === unitNumber) ? '' : houseNumberRaw;

                                                        const newAddressData = {
                                                            unitNumber,
                                                            houseNumber,
                                                            houseNumberSuffix,
                                                            buildingName: place.buildingName || '',
                                                            floorLevelNumber: place.floorLevelNumber || '',
                                                            streetNumber,
                                                            streetName: place.streetName || '',
                                                            streetType: place.streetType || '',
                                                            suburb: place.suburb || '',
                                                            state: place.state || '',
                                                            postcode: place.postcode || '',
                                                            country: place.country || 'Australia',
                                                            nmi: '',
                                                            tariffCode: '',
                                                            ratePlanUid: undefined,
                                                        };
                                                        setFormData(prev => ({ ...prev, ...newAddressData }));
                                                        setSelectedRatePlan(null);
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
                                                rightIcon={
                                                    formData.nmi?.length >= 10 ? (
                                                        <button
                                                            type="button"
                                                            onClick={handleNmiTariffLookup}
                                                            disabled={isNmiLookupLoading}
                                                            className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                                                            title="Resolve Tariff for this NMI"
                                                        >
                                                            {isNmiLookupLoading ? <SpinnerIcon className="animate-spin" size={12} /> : <SearchIcon size={12} />}
                                                            Resolve
                                                        </button>
                                                    ) : (formData.streetType && formData.suburb && (formData.houseNumber || formData.streetNumber) && formData.state && formData.postcode && formData.streetName) ? (
                                                        <button
                                                            type="button"
                                                            onClick={handleNmiLookup}
                                                            disabled={isNmiLookupLoading}
                                                            className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50"
                                                            title="Lookup NMI from Address"
                                                        >
                                                            {isNmiLookupLoading ? <SpinnerIcon className="animate-spin" size={12} /> : <SearchIcon size={12} />}
                                                            Lookup
                                                        </button>
                                                    ) : undefined
                                                }
                                            />
                                        </div>

                                        {/* Auto-sync License Fields when ID Type is Licence - MOVED TO TOP LEVEL */}

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                                            <div className="col-span-2 lg:col-span-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Detailed Breakdown</div>
                                            <Input label="Flat/Unit Type" disabled className="bg-background font-medium" value={formData.flatOrUnitType || ''} onChange={(e) => updateField('flatOrUnitType', e.target.value)} placeholder="e.g. HSE" />
                                            <Input label="Unit No." disabled className="bg-background font-medium" value={formData.unitNumber} onChange={(e) => updateField('unitNumber', e.target.value)} onBlur={() => handleBlur('unitNumber')} placeholder="e.g. 5" />
                                            <Input label="House No." disabled className="bg-background font-medium" value={formData.houseNumber} onChange={(e) => updateField('houseNumber', e.target.value)} onBlur={() => handleBlur('houseNumber')} placeholder="e.g. 10A" />
                                            <Input label="Building Name" disabled className="bg-background font-medium" value={formData.buildingName} onChange={(e) => updateField('buildingName', e.target.value)} onBlur={() => handleBlur('buildingName')} placeholder="e.g. Eureka Tower" />
                                            <Input label="Floor/Level" disabled className="bg-background font-medium" value={formData.floorLevelNumber} onChange={(e) => updateField('floorLevelNumber', e.target.value)} onBlur={() => handleBlur('floorLevelNumber')} placeholder="e.g. 25" />
                                            <Input label="Street No." disabled required error={errors.streetNumber} className="bg-background font-medium" value={formData.streetNumber} onChange={(e) => updateField('streetNumber', e.target.value)} onBlur={() => handleBlur('streetNumber')} placeholder="e.g. 123" />
                                            <Input label="Street Name" disabled required error={errors.streetName} className="bg-background font-medium" value={formData.streetName} onChange={(e) => updateField('streetName', e.target.value)} onBlur={() => handleBlur('streetName')} placeholder="e.g. Smith" />
                                            <Select label="Type" disabled options={streetTypeOptions} value={formData.streetType} onChange={(val) => updateField('streetType', val)} placeholder="Type" />
                                            <Input label="Suburb" disabled required error={errors.suburb} className="bg-background font-medium" value={formData.suburb} onChange={(e) => updateField('suburb', e.target.value)} onBlur={() => handleBlur('suburb')} placeholder="e.g. Collingwood" />
                                            <Select label="State" disabled options={STATE_OPTIONS} value={formData.state} onChange={(val) => updateField('state', val as string)} placeholder="State" />
                                            <Input label="Postcode" disabled required error={errors.postcode} className="bg-background font-medium" value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} onBlur={() => handleBlur('postcode')} maxLength={4} placeholder="e.g. 3066" />
                                            <Input label="Country" disabled className="bg-background font-medium" value={formData.country} onChange={(e) => updateField('country', e.target.value)} />

                                            {/* <div className="col-span-2 lg:col-span-4 mt-2 pt-3 border-t border-border/50">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1.5 leading-none">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    Formatted Address Preview
                                                </div>
                                                <div className="text-sm font-medium text-foreground bg-primary/5 py-3 px-4 rounded-lg border border-primary/10 shadow-sm transition-all duration-200 hover:bg-primary/10">
                                                    {[
                                                        formData.buildingName,
                                                        formData.unitNumber ? (formData.unitNumber.toLowerCase().includes('level') || formData.unitNumber.toLowerCase().includes('floor') ? formData.unitNumber : `${formData.flatOrUnitType || 'Unit'} ${formData.unitNumber}`) : '',
                                                        formData.floorLevelNumber && formData.floorLevelNumber !== formData.unitNumber ? (formData.floorLevelNumber.toLowerCase().includes('level') || formData.floorLevelNumber.toLowerCase().includes('floor') ? formData.floorLevelNumber : `Level ${formData.floorLevelNumber}`) : '',
                                                        formData.houseNumber && formData.houseNumber !== formData.streetNumber ? formData.houseNumber : '',
                                                        [formData.streetNumber, formData.streetName, formData.streetType].filter(Boolean).join(' '),
                                                        `${formData.suburb} ${formData.state} ${formData.postcode}`.trim(),
                                                        formData.country
                                                    ].filter(Boolean).join(', ')}
                                                </div>
                                            </div> */}
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
                                        <Select
                                            label="Tariff Code"
                                            required
                                            options={tariffOptions}
                                            value={selectedRatePlan?.uid || ''} // Use UID for uniqueness to avoid selecting multiple items with same code
                                            onChange={(val) => handleTariffChange(val as string)}
                                            placeholder="Select tariff"
                                        />
                                        <div className="flex flex-col w-full">
                                            <Select
                                                label="Plan"
                                                options={[{ label: 'None', value: '' }, ...planOptions]}
                                                value={formData.planUid || ''}
                                                onChange={(val) => {
                                                     const planUid = val as string;
                                                     updateField('planUid', planUid);
                                                     if (planUid && activePlansData?.activePlans) {
                                                         const selected = activePlansData.activePlans.find((p: any) => p.uid === planUid);
                                                         if (selected) {
                                                             const defaultDiscount = (selected.discount !== undefined && selected.discount !== null) ? selected.discount : 0;
                                                             updateField('discount', defaultDiscount);
                                                             if (!['0', '5', '7', '10', '13', '15'].includes(defaultDiscount.toString())) {
                                                                 setIsCustomDiscountMode(true);
                                                             } else {
                                                                 setIsCustomDiscountMode(false);
                                                             }

                                                             // Prefill based on plan requirements
                                                             if (selected.isBatteryRequired) {
                                                                 updateField('isBattery', 1);
                                                                 updateField('hasBattery', true);
                                                                 updateField('vpp', true);
                                                             }
                                                             if (selected.isSolarRequired) {
                                                                 updateField('hasSolar', true);
                                                             }
                                                         }
                                                     }
                                                 }}
                                                placeholder="Select plan"
                                            />
                                            {(() => {
                                                if (formData.isBattery !== 1) return null;
                                                if (!formData.vpp || !formData.planUid || !activePlansData?.activePlans || !activeBonuses) return null;
                                                const selectedPlanDetails = activePlansData.activePlans.find((p: any) => p.uid === formData.planUid);
                                                if (!selectedPlanDetails?.bonusUids?.length) return null;
                                                const planBonuses = activeBonuses.filter((b: any) => selectedPlanDetails.bonusUids.includes(b.uid));
                                                if (planBonuses.length === 0) return null;
                                                return (
                                                    <div className="relative group mt-1.5 inline-flex w-max">
                                                        <div
                                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium cursor-help shadow-sm animate-in fade-in slide-in-from-top-1"
                                                        >
                                                            <GiftIcon size={12} />
                                                            <span>Plan Bonus</span>
                                                        </div>
                                                        {/* Custom Tooltip */}
                                                        <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-64 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <div className="p-3 bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-xl shadow-black/5 text-sm text-foreground whitespace-normal font-normal">
                                                                <div className="font-semibold text-green-600 dark:text-green-500 mb-2 flex items-center gap-2">
                                                                    <GiftIcon size={14} />
                                                                    Included Bonuses
                                                                </div>
                                                                <ul className="space-y-2">
                                                                    {planBonuses.map((b: any) => (
                                                                        <li key={b.uid} className="flex items-start gap-2">
                                                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                                                                            <span className="text-muted-foreground text-xs leading-relaxed">{b.description || b.name}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        {/* Discount Field with Pill Selector (Hidden for now) */}
                                        {false && selectedRatePlan?.discountApplies === 1 && (
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
                                        {selectedRatePlan?.offers?.map((offer) => (
                                            <RateDetailsView
                                                key={offer.id}
                                                offer={offer}
                                                discount={formData.discount || selectedPlan?.discount || 0}
                                                hasSolar={formData.hasSolar}
                                                vpp={formData.vpp}
                                                units={unitMap}
                                                isVppPlan={selectedRatePlan?.vpp === 1}
                                                planRatesJson={selectedPlan?.ratesJson}
                                                isDnspBased={selectedPlan?.isDnspBased}
                                                selectedDnsp={selectedRatePlan?.dnsp}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Sign-up */}
                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <Select label="Title" options={TITLE_OPTIONS} value={formData.title} onChange={(val) => updateField('title', val as string)} onBlur={() => handleBlur('title')} />
                                            <Input label="First Name" required error={errors.firstName} placeholder="e.g. Alex" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} />
                                            <Input label="Last Name" required error={errors.lastName} placeholder="e.g. Taylor" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} />
                                            <DatePicker
                                                label="Date of Birth"
                                                required={formData.checkCreditScore}
                                                error={errors.dob}
                                                value={formData.dob}
                                                onChange={(date) => updateField('dob', date)}
                                                maxDate={eighteenYearsAgo}
                                                onBlur={() => handleBlur('dob')}
                                            />
                                            <Input label="Email" required helperText="We'll send confirmations here" error={errors.email} type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} onBlur={() => handleBlur('email')} />
                                            {canViewAllCustomers && (
                                                <Select
                                                    label="Assigned To"
                                                    options={userOptions}
                                                    value={formData.assignedToUid || ''}
                                                    onChange={(val) => updateField('assignedToUid', val as string)}
                                                    placeholder="Select User"
                                                />
                                            )}

                                            {formData.source === 'Referral' && (
                                                <Input
                                                    label="Referral Name"
                                                    required
                                                    error={errors.referralName}
                                                    placeholder="Who referred this customer?"
                                                    value={formData.referralName || ''}
                                                    onChange={(e) => updateField('referralName', e.target.value)}
                                                    onBlur={() => handleBlur('referralName')}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Enrollment & Identity — two side-by-side vertical boxes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Box 1: Enrollment */}
                                        <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enrollment</h3>
                                            <Select label="Sale Type" options={SALE_TYPE_OPTIONS} value={formData.saleType.toString()} onChange={(val) => updateField('saleType', parseInt(val as string))} />
                                            <DatePicker
                                                label="Connection Date"
                                                error={errors.connectionDate}
                                                value={formData.connectionDate}
                                                onChange={(date) => updateField('connectionDate', date)}
                                                onBlur={() => handleBlur('connectionDate')}
                                            />
                                            <Select label="Billing Preference" options={BILLING_PREF_OPTIONS} value={formData.billingPreference.toString()} onChange={(val) => updateField('billingPreference', parseInt(val as string))} />

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
                                        </div>

                                        {/* Box 2: Identity */}
                                        <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Identity</h3>
                                            <Select
                                                label="ID Type"
                                                options={ID_TYPE_OPTIONS}
                                                value={formData.idType.toString()}
                                                onChange={(val) => {
                                                    const newType = parseInt(val as string);
                                                    updateField('idType', newType);
                                                    if (newType === 2) {
                                                        updateField('idState', '');
                                                    } else {
                                                        updateField('idCountry', '');
                                                    }
                                                }}
                                            />
                                            <Input label="ID Number" placeholder="Number" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} />

                                            {formData.idType === 0 && (
                                                <Input label="License Card Number" placeholder="Enter card number" value={formData.licenseCardNumber} onChange={(e) => updateField('licenseCardNumber', e.target.value)} />
                                            )}

                                            {formData.idType === 1 && (
                                                <>
                                                    <Select
                                                        label="Medicare Card Type"
                                                        options={[
                                                            { value: '0', label: 'Standard (Green)' },
                                                            { value: '1', label: 'Interim (Blue)' },
                                                            { value: '2', label: 'Reciprocal (Yellow)' }
                                                        ]}
                                                        value={formData.medicareCardType?.toString() || '0'}
                                                        onChange={(val) => updateField('medicareCardType', parseInt(val as string))}
                                                    />
                                                    <Input label="Medicare IRN" placeholder="Enter individual reference number" value={formData.medicareIrn} onChange={(e) => updateField('medicareIrn', e.target.value)} />
                                                </>
                                            )}
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
                                            <DatePicker label="ID Expiry" value={formData.idExpiry} onChange={(date) => updateField('idExpiry', date)} minDate={new Date()} />

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
                                                                onChange={(date) => updateField('dob', date)}
                                                                maxDate={eighteenYearsAgo}
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
                                                            <DatePicker label="License Expiry" required={formData.checkCreditScore} value={formData.licenseExpiry} onChange={(date) => updateField('licenseExpiry', date)} minDate={new Date()} onBlur={() => handleBlur('licenseExpiry')} error={errors.licenseExpiry} />

                                                            <Field label="Driver's License" error={errors.licenseDocument}>
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
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.title ? `${formData.title} ` : ''}{formData.firstName} {formData.lastName}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.email}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Mobile:</span> <span className="font-medium">{formData.phone} {phoneVerified && '✓'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{formatDate(formData.dob, { includeTime: false }) || '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="capitalize font-medium">{formData.propertyType === 1 ? 'Commercial' : 'Residential'}</span></p>
                                                    {formData.propertyType === 1 && (
                                                        <>
                                                            {formData.legalName && (
                                                                <p className="flex justify-between"><span className="text-muted-foreground">Legal Name:</span> <span className="font-medium">{formData.legalName}</span></p>
                                                            )}
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
                                                    <p className="flex justify-between border-b pb-2 mb-2"><span className="text-muted-foreground">Driver's License:</span> <span className="font-medium">{formData.licenseNumber} {formData.licenseState ? `(${formData.licenseState})` : '—'}</span></p>
                                                    <p className="flex justify-between border-b pb-2 mb-2"><span className="text-muted-foreground">License Expiry:</span> <span className="font-medium">{formatDate(formData.licenseExpiry, { includeTime: false }) || '—'}</span></p>

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
                                                        {formData.unitNumber && `${formData.flatOrUnitType || 'Unit'} ${formData.unitNumber}, `}{formData.streetNumber} {formData.streetName} {formData.streetType}
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
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Discount:</span> <span className="font-medium badge bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">{(formData.discount || selectedPlan?.discount || 0) > 0 ? `${formData.discount || selectedPlan?.discount}%` : '0%'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Distributor:</span> <span className="font-medium">{selectedRatePlan?.dnsp !== undefined ? (DNSP_MAP[selectedRatePlan.dnsp.toString()] || selectedRatePlan.dnsp) : '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Tariff Type:</span> <span className="font-medium">{selectedRatePlan?.tariff || '—'}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Pricing Version:</span> <span className="font-medium font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{activeVersionForLookup || activeRateVersion}</span></p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2"><IdCardIcon size={16} className="text-blue-600" /> Enrollment Details</h3>
                                                <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Sale Type:</span> <span className="font-medium">{SALE_TYPE_OPTIONS.find(o => o.value === formData.saleType.toString())?.label}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Connection Date:</span> <span className="font-medium">{formatDate(formData.connectionDate, { includeTime: false })}</span></p>
                                                    <p className="flex justify-between"><span className="text-muted-foreground">Billing:</span> <span className="font-medium">{BILLING_PREF_OPTIONS.find(o => o.value === formData.billingPreference.toString())?.label}</span></p>

                                                    <div className="pt-2 border-t border-border mt-2">
                                                        <p className="flex text-xs font-semibold text-muted-foreground mb-1 uppercase">Other ID (Optional)</p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="font-medium">{ID_TYPE_OPTIONS.find(o => o.value === formData.idType.toString())?.label}</span></p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">ID Number:</span> <span className="font-medium">{formData.idNumber || '—'}</span></p>
                                                        <p className="flex justify-between"><span className="text-muted-foreground">Expiry:</span> <span className="font-medium">{formatDate(formData.idExpiry, { includeTime: false }) || '—'}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rate Details - Full Width Section */}
                                        {selectedRatePlan?.offers?.[0] && (
                                            <RateDetailsView
                                                offer={selectedRatePlan.offers![0]}
                                                discount={formData.discount ?? selectedPlan?.discount ?? 0}
                                                hasSolar={formData.hasSolar}
                                                vpp={formData.vpp}
                                                units={unitMap}
                                                isVppPlan={selectedRatePlan?.vpp === 1}
                                                planRatesJson={selectedPlan?.ratesJson}
                                                isDnspBased={selectedPlan?.isDnspBased}
                                                selectedDnsp={selectedRatePlan?.dnsp}
                                                className="md:col-span-2"
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

                                                    {(formData.vpp && !formData.hasBattery) && (
                                                        <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                            <p className="font-medium text-xs uppercase text-muted-foreground mb-1">VPP Participant</p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">VPP Participant:</span> <span className="font-medium">Yes</span></p>
                                                            {(Number(formData.vppSignupBonus) === 600 || (formData.selectedBonuses && formData.selectedBonuses.length > 0)) && (
                                                                <div className="flex justify-between items-start gap-2 mt-2">
                                                                    <span className="text-muted-foreground shrink-0">Signup Bonus:</span>
                                                                    <div className="flex flex-col items-end">
                                                                        {Number(formData.vppSignupBonus) === 600 && (
                                                                            <span className="font-medium text-right text-green-600">$50 monthly bill credit for 12 months (total $600)</span>
                                                                        )}
                                                                        {formData.selectedBonuses && formData.selectedBonuses.length > 0 && (
                                                                            <span className="font-medium text-right text-green-600">
                                                                                {activeBonuses
                                                                                    ?.filter((b: any) => formData.selectedBonuses?.includes(b.uid))
                                                                                    .map((b: any) => b.description)
                                                                                    .join(', ')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(() => {
                                                                if (formData.isBattery !== 1) return null;
                                                                if (!formData.vpp || !formData.planUid || !activePlansData?.activePlans || !activeBonuses) return null;
                                                                const selectedPlanDetails = activePlansData.activePlans.find((p: any) => p.uid === formData.planUid);
                                                                if (!selectedPlanDetails?.bonusUids?.length) return null;
                                                                const planBonuses = activeBonuses.filter((b: any) => selectedPlanDetails.bonusUids.includes(b.uid));
                                                                if (planBonuses.length === 0) return null;

                                                                return (
                                                                    <div className="flex justify-between items-start gap-2 mt-2">
                                                                        <span className="text-muted-foreground shrink-0">Plan Bonus:</span>
                                                                        <div className="flex flex-col items-end">
                                                                            <span className="font-medium text-right text-green-600">
                                                                                {planBonuses.map((b: any) => b.description || b.name).join(', ')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}

                                                    {(formData.hasBattery) && (
                                                        <div className="space-y-1 text-sm bg-card p-3 rounded border border-border">
                                                            <p className="font-medium text-xs uppercase text-muted-foreground mb-1">Battery System</p>
                                                            <p className="flex justify-between"><span className="text-muted-foreground">Has Battery:</span> <span className="font-medium">Yes</span></p>
                                                            {formData.batteryBrand && <p className="flex justify-between"><span className="text-muted-foreground">Battery Brand:</span> <span className="font-medium">{batteryMakesData?.batteryMakes?.find((m: any) => m.uid === formData.batteryBrand)?.make || formData.batteryBrand}</span></p>}
                                                            {formData.snNumber && <p className="flex justify-between"><span className="text-muted-foreground">SN Number:</span> <span className="font-medium">{formData.snNumber}</span></p>}
                                                            {formData.batteryCapacity && <p className="flex justify-between"><span className="text-muted-foreground">Battery Capacity:</span> <span className="font-medium">{formData.batteryCapacity} kW</span></p>}
                                                            {formData.exportLimit && <p className="flex justify-between"><span className="text-muted-foreground">Export Limit:</span> <span className="font-medium">{formData.exportLimit} kW</span></p>}

                                                            {(Number(formData.vppSignupBonus) === 600 || (formData.selectedBonuses && formData.selectedBonuses.length > 0)) && (
                                                                <div className="flex justify-between items-start gap-2 mt-2">
                                                                    <span className="text-muted-foreground shrink-0">Signup Bonus:</span>
                                                                    <div className="flex flex-col items-end">
                                                                        {Number(formData.vppSignupBonus) === 600 && (
                                                                            <span className="font-medium text-right text-green-600">$50 monthly bill credit for 12 months (total $600)</span>
                                                                        )}
                                                                        {formData.selectedBonuses && formData.selectedBonuses.length > 0 && (
                                                                            <span className="font-medium text-right text-green-600">
                                                                                {activeBonuses
                                                                                    ?.filter((b: any) => formData.selectedBonuses?.includes(b.uid))
                                                                                    .map((b: any) => b.description)
                                                                                    .join(', ')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {(() => {
                                                                if (formData.isBattery !== 1) return null;
                                                                if (!formData.vpp || !formData.planUid || !activePlansData?.activePlans || !activeBonuses) return null;
                                                                const selectedPlanDetails = activePlansData.activePlans.find((p: any) => p.uid === formData.planUid);
                                                                if (!selectedPlanDetails?.bonusUids?.length) return null;
                                                                const planBonuses = activeBonuses.filter((b: any) => selectedPlanDetails.bonusUids.includes(b.uid));
                                                                if (planBonuses.length === 0) return null;

                                                                return (
                                                                    <div className="flex justify-between items-start gap-2 mt-2">
                                                                        <span className="text-muted-foreground shrink-0">Plan Bonus:</span>
                                                                        <div className="flex flex-col items-end">
                                                                            <span className="font-medium text-right text-green-600">
                                                                                {planBonuses.map((b: any) => b.description || b.name).join(', ')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
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
                                        {isEditMode && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleSubmit(customerData?.customer?.status, true)}
                                                isLoading={submittingStatus === 3}
                                                disabled={submittingStatus !== null}
                                                loadingText="Updating..."
                                            >
                                                Update Only
                                            </Button>
                                        )}
                                        {isGeeEnergy && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-amber-950/20"
                                                onClick={() => {
                                                    if (!formData.checkCreditScore) {
                                                        setShowCreditCheckWarning(true);
                                                        return;
                                                    }
                                                    setIsWithoutSignature(true);
                                                    if (isPdrs && isEditMode) {
                                                        handlePreviewPdrsConsent();
                                                    } else {
                                                        handlePreviewOffer(uid || 'new', true);
                                                    }
                                                }}
                                                isLoading={submittingStatus === 4 || isLoadingEmailPreview}
                                                disabled={submittingStatus !== null}
                                            >
                                                Send Offer without Signature
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setIsWithoutSignature(false);
                                                if (isPdrs && isEditMode) {
                                                    handlePreviewPdrsConsent();
                                                } else {
                                                    handlePreviewOffer(uid || 'new', false);
                                                }
                                            }}
                                            isLoading={submittingStatus === 1 || isLoadingEmailPreview}
                                            disabled={submittingStatus !== null}
                                            loadingText="Saving..."
                                        >
                                            {isPdrs && isEditMode
                                                ? 'Update & Send PDRS Email'
                                                : (isEditMode ? 'Update & Send Email' : 'Create Customer & Send Email')}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isNmiModalOpen}
                    onClose={() => {
                        setIsNmiModalOpen(false);
                        setSelectedNmiForTariff(null);
                    }}
                    title={<span className="text-primary">{selectedNmiForTariff ? 'Select Tariff' : 'Select NMI'}</span>}
                    footer={
                        <div className="flex justify-between items-center w-full">
                            {selectedNmiForTariff ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedNmiForTariff(null)}
                                    className="border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    Back to NMIs
                                </Button>
                            ) : <div />}
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsNmiModalOpen(false);
                                    setSelectedNmiForTariff(null);
                                }}
                                className="border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                        </div>
                    }
                >
                    <div className="max-h-[400px] overflow-y-auto pr-1">
                        {!selectedNmiForTariff ? (
                            <div className="space-y-2">
                                {nmiOptions.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`border p-3 rounded-md cursor-pointer transition ${formData.nmi === item?.nmi
                                            ? 'border-primary bg-primary/10'
                                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            }`}
                                        onClick={() => {
                                            if (!item) return;
                                            setSelectedNmiForTariff(item);
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm">
                                                    NMI: <span className="text-primary">{item?.nmi}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {item?.address?.flatOrUnitNumber ? `${item.address.flatOrUnitType || 'Unit'} ${item.address.flatOrUnitNumber}, ` : ''}
                                                    {item?.address?.houseNumber}{item?.address?.houseNumberTo ? `-${item.address.houseNumberTo}` : ''}{item?.address?.houseNumberSuffix || ''} {item?.address?.streetName} {item?.address?.streetType},{" "}
                                                    {item?.address?.suburb} {item?.address?.postcode}
                                                </p>
                                            </div>
                                            <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-3 bg-muted rounded-lg border border-border">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Selected Property</p>
                                    <p className="font-bold text-sm text-primary">{selectedNmiForTariff.nmi}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedNmiForTariff.address?.flatOrUnitNumber ? `${selectedNmiForTariff.address.flatOrUnitType || 'Unit'} ${selectedNmiForTariff.address.flatOrUnitNumber}, ` : ''}
                                        {selectedNmiForTariff.address?.houseNumber}{selectedNmiForTariff.address?.houseNumberTo ? `-${selectedNmiForTariff.address.houseNumberTo}` : ''}{selectedNmiForTariff.address?.houseNumberSuffix || ''} {selectedNmiForTariff.address?.streetName} {selectedNmiForTariff.address?.streetType}, {selectedNmiForTariff.address?.suburb}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-foreground uppercase tracking-tight flex items-center gap-2">
                                        <ZapIcon size={12} className="text-primary" /> Available Tariffs / Registers
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(() => {
                                            const allRegisters = [
                                                ...(selectedNmiForTariff.registers || []),
                                                ...(selectedNmiForTariff.meters?.flatMap((m: any) => m.registers || []) || [])
                                            ];

                                            const validRegisters = allRegisters.filter((r: any) => {
                                                const id = (r.registerId || '').toUpperCase();
                                                const type = (r.type || '').toLowerCase();
                                                const info = (r.networkAdditionalInfo || '').toLowerCase();

                                                // Exclude B1/B2 IDs, or anything mentioning Export or Generation
                                                return id !== 'B1' && id !== 'B2' &&
                                                    !type.includes('export') &&
                                                    !info.includes('generation');
                                            });

                                            const tariffs = Array.from(new Set(validRegisters.map((r: any) => r.tariffCode).filter(Boolean))) as string[];

                                            if (tariffs.length === 0) return <p className="text-xs text-muted-foreground italic p-2 bg-neutral-50 rounded">No tariffs found for this NMI</p>;

                                            return tariffs.map((t, tidx) => {
                                                // Find register type for helpful label
                                                const register = validRegisters.find((r: any) => r.tariffCode === t);

                                                return (
                                                    <button
                                                        key={tidx}
                                                        type="button"
                                                        onClick={() => {
                                                            const item = selectedNmiForTariff;
                                                            updateField('nmi', item.nmi);
                                                            updateField('isVppAndIsBattery', !!item?.isVppAndIsBattery);
                                                            checkNmiDuplicate(item.nmi);
                                                            autoSelectTariff(t, item);

                                                            if (item.customerType === 'RESIDENTIAL') {
                                                                updateField('propertyType', 0);
                                                            } else if (item.customerType === 'BUSINESS' || item.customerType === 'COMMERCIAL') {
                                                                updateField('propertyType', 1);
                                                            }

                                                            const addr = item.address;
                                                            if (addr) {
                                                                const displayHouseNumber = addr.houseNumberTo
                                                                    ? `${addr.houseNumber}-${addr.houseNumberTo}`
                                                                    : addr.houseNumber || '';

                                                                updateField('unitNumber', addr.flatOrUnitNumber || '');
                                                                updateField('houseNumber', displayHouseNumber);
                                                                updateField('houseNumberSuffix', addr.houseNumberSuffix || '');
                                                                updateField('streetNumber', displayHouseNumber);
                                                                updateField('streetName', addr.streetName || '');
                                                                updateField('streetType', addr.streetType || '');
                                                                updateField('suburb', addr.suburb || '');
                                                                updateField('state', addr.state || '');
                                                                updateField('postcode', addr.postcode || '');
                                                                updateField('flatOrUnitType', addr.flatOrUnitType || '');
                                                                updateField('gnafPid', addr.gnafPid || '');

                                                                setAddressSearch([
                                                                    addr.flatOrUnitNumber ? `${addr.flatOrUnitType || 'Unit'} ${addr.flatOrUnitNumber}` : '',
                                                                    addr.houseNumberTo
                                                                        ? `${addr.houseNumber}-${addr.houseNumberTo}${addr.houseNumberSuffix || ''}`
                                                                        : (addr.houseNumber || '') + (addr.houseNumberSuffix || ''),
                                                                    addr.streetName,
                                                                    addr.streetType,
                                                                    addr.suburb,
                                                                    addr.state,
                                                                    addr.postcode
                                                                ].filter(Boolean).join(', ').trim());
                                                            }

                                                            setIsNmiModalOpen(false);
                                                            setSelectedNmiForTariff(null);
                                                            toast.success(`NMI and Tariff ${t} selected successfully`);
                                                        }}
                                                        className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all font-bold group"
                                                    >
                                                        <div className="text-left">
                                                            <div className="text-sm text-primary">{t}</div>
                                                            {register?.type && (
                                                                <div className="text-[10px] font-medium text-muted-foreground uppercase">
                                                                    {register.networkAdditionalInfo === 'Controlled load 1 Interval' ? 'CL1' :
                                                                        register.networkAdditionalInfo === 'Flat All time with demand Int' ? 'Anytime' :
                                                                            register.networkAdditionalInfo === 'Controlled load 2 Interval' ? 'CL2' :
                                                                                register.networkAdditionalInfo}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <CheckIcon className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
                <Modal
                    isOpen={showCreditCheckWarning}
                    onClose={() => setShowCreditCheckWarning(false)}
                    size="sm"
                    title={
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                            <AlertCircleIcon size={22} className="shrink-0" />
                            <span className="font-bold text-base">Credit Score Warning</span>
                        </div>
                    }
                    footer={
                        <div className="flex justify-end gap-3 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreditCheckWarning(false)}
                                className="border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                                onClick={() => {
                                    setShowCreditCheckWarning(false);
                                    setIsWithoutSignature(true);
                                    if (isPdrs && isEditMode) {
                                        handlePreviewPdrsConsent();
                                    } else {
                                        handlePreviewOffer(uid || 'new', true);
                                    }
                                }}
                            >
                                Yes, Send Offer
                            </Button>
                        </div>
                    }
                >
                    <div className="py-2 text-neutral-600 dark:text-neutral-300">
                        <p className="text-sm leading-relaxed">
                            Are you sure you don't want to check a credit score of customer?
                        </p>
                    </div>
                </Modal>
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

                {/* Preview Offer Modal */}
                <Modal
                    isOpen={previewModalOpen}
                    onClose={() => {
                        setPreviewModalOpen(false);
                        setIsLoadingPreview(false);
                        setPreviewStep('offer');
                    }}
                    title={previewStep === 'offer' ? "Offer Preview" : ((isPdrs && isEditMode) ? "PDRS Consent Preview" : "Email Preview")}
                    size="full"
                    footer={
                        <div className="flex justify-end gap-2 w-full">
                            {previewStep === 'offer' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleDownloadPreview}
                                        leftIcon={<DownloadIcon size={16} />}
                                        isLoading={isDownloading}
                                        disabled={!previewUrl || isLoadingPreview || isDownloading}
                                    >
                                        Download PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setPreviewModalOpen(false);
                                            setIsLoadingPreview(false);
                                            setPreviewStep('offer');
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="bg-neutral-900 text-white hover:bg-neutral-800"
                                        onClick={handleNextToEmailPreview}
                                        isLoading={isLoadingEmailPreview}
                                        disabled={!previewUrl || isLoadingPreview}
                                        rightIcon={<ChevronRightIcon size={16} />}
                                    >
                                        Next (Email Preview)
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setPreviewModalOpen(false);
                                            setIsLoadingPreview(false);
                                            setPreviewStep('offer');
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="bg-neutral-900 text-white hover:bg-neutral-800"
                                        isLoading={submittingStatus !== null}
                                        onClick={async () => {
                                            if (isPdrs && isEditMode) {
                                                // For PDRS, keep modal open until process finishes
                                                await handleSubmit(customerData?.customer?.status || 2);
                                                setPreviewModalOpen(false);
                                                setPreviewStep('offer');
                                            } else {
                                                setPreviewModalOpen(false);
                                                setPreviewStep('offer');
                                                handleSubmit(1);
                                            }
                                        }}
                                    >
                                        Confirm & Send
                                    </Button>
                                </>
                            )}
                        </div>
                    }
                >
                    {previewStep === 'offer' ? (
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
                                        title="Offer Preview"
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
                    ) : (
                        <div className="flex flex-col gap-4 mb-4">
                            <div className={`p-3 rounded-md flex items-start gap-2 mb-2 border ${emailPreview?.isCustom
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50"
                                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50"
                                }`}>
                                {emailPreview?.isCustom ? (
                                    <CheckCircleIcon size={18} className="text-green-600 dark:text-green-400 mt-0.5" />
                                ) : (
                                    <MailIcon size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                                )}
                                <div>
                                    <p className={`text-sm font-medium ${emailPreview?.isCustom ? "text-green-800 dark:text-green-300" : "text-amber-800 dark:text-amber-300"
                                        }`}>
                                        {emailPreview?.isCustom ? "Dynamic Template In Use" : "Default Template Notice"}
                                    </p>
                                    <p className={`text-xs ${emailPreview?.isCustom ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
                                        }`}>
                                        {emailPreview?.isCustom
                                            ? "This is your custom dynamic template that is currently assigned to this event."
                                            : "This is the default system template that will be sent to the customer for this event."}
                                    </p>
                                </div>
                            </div>

                            {/* Attachments Preview */}
                            {(() => {
                                const predictedAttachments: string[] = [];
                                const isVpp = !!formData.vpp;
                                const hasVppBonus = Number(formData.vppSignupBonus) === 600;
                                const isTransfer = isEditMode && !!(customerData as any)?.customer?.previousCustomerUid;
                                const willAttachPdfs = isTransfer || isWithoutSignature;

                                // BESS2 & Nomination Form for VPP+$600 customers or if plan requires it
                                if ((isVpp && hasVppBonus) || requiresNominationForm) {
                                    predictedAttachments.push('BESS2 and Nomination Form.pdf');
                                }

                                // Static PDFs + Agreement PDF for transfer or without-signature
                                if (willAttachPdfs) {
                                    predictedAttachments.push('GEE_Welcome_Pack.pdf');
                                    predictedAttachments.push('GEE Direct Debit Request Form.pdf');
                                    predictedAttachments.push('GEE_Agreement.pdf');
                                }

                                // Offer Summary PDF for agreement-signed (without signature)
                                if (isWithoutSignature && !isTransfer) {
                                    predictedAttachments.push('Offer Summary.pdf');
                                }

                                if (predictedAttachments.length === 0) return null;

                                return (
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                        <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <FileTextIcon size={12} />
                                            Attachments ({predictedAttachments.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {predictedAttachments.map((fileName, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-foreground bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-border/50 shadow-sm">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                        <FileTextIcon size={13} />
                                                    </div>
                                                    <span className="font-medium text-xs truncate max-w-[200px]" title={fileName}>
                                                        {fileName}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 italic">These files will be attached to the email sent to the customer.</p>
                                    </div>
                                );
                            })()}

                            <div className="rounded-lg border border-border bg-card overflow-hidden">
                                <div className="px-4 py-3 border-b border-border bg-muted/30">
                                    <p className="text-sm font-semibold text-foreground">Subject: {emailPreview?.subject}</p>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[55vh] bg-white dark:bg-slate-950">
                                    {isLoadingEmailPreview ? (
                                        <div className="flex items-center justify-center py-20">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                        </div>
                                    ) : emailPreview?.body ? (
                                        <div
                                            className="prose dark:prose-invert prose-sm max-w-none preview-email-body"
                                            dangerouslySetInnerHTML={{ __html: emailPreview.body }}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground italic py-10 text-center">No email body content available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </Modal>

                {/* Sidebar: Live Summary */}
                {/* <aside className="w-full xl:w-[200px] shrink-0 xl:sticky xl:top-6 order-last xl:order-none">
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
                                <SummaryItem icon={PercentIcon} label="% Discount" value={`${formData.discount ?? selectedPlan?.discount ?? 0}%`} />
                                <SummaryItem icon={ZapIcon} label="Sale type" value={SALE_TYPE_OPTIONS.find(o => o.value === formData.saleType.toString())?.label} />
                                <SummaryItem icon={CalendarIcon} label="Connection date" value={formData.connectionDate} />
                                <SummaryItem icon={UserIcon} label="Name" value={`${formData.title ? `${formData.title} ` : ''}${formData.firstName} ${formData.lastName}`} />
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
                </aside> */}
            </div>
        </div>
    );
};
