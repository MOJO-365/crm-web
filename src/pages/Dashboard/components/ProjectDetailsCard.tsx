import { useNavigate } from 'react-router-dom';
import {
    MapPinIcon,
    ZapIcon,
    IdCardIcon,
    CalendarIcon,
    Settings2Icon,
    PhoneIcon,
    MailIcon
} from '@/components/icons';
import {
    SALE_TYPE_LABELS,
    BILLING_PREF_LABELS,
    CUSTOMER_STATUS_MAP
} from '@/lib/constants';
import { formatSydneyTime } from '@/lib/date';

export interface ProjectDetailsCardProps {
    customer: {
        uid: string;
        customerId: string;
        firstName: string;
        lastName: string;
        email?: string;
        number?: string;
        dob?: string;
        propertyType?: number;
        status?: number;
        source?: string;
        discount?: number;
        createdAt?: string | Date;
        phoneVerifiedAt?: string | Date;
        address?: {
            fullAddress?: string;
            nmi?: string;
        };
        assignedToUser?: {
            name?: string;
        };
        enrollmentDetails?: {
            saletype?: number;
            connectiondate?: string;
            billingpreference?: number;
            lifesupport?: boolean;
            concession?: boolean;
        };
        debitDetails?: {
            accountType?: number;
            companyName?: string;
            abn?: string;
            firstName?: string;
            lastName?: string;
            bankName?: string;
            bsb?: string;
            accountNumber?: string;
            paymentFrequency?: number;
            firstDebitDate?: string;
            optIn?: number;
        };
        solarDetails?: {
            hassolar?: number;
            solarcapacity?: number | string;
        };
        batteryDetails?: {
            isbattery?: number;
            inverterCapacity?: number | string;
            batterybrand?: string;
            batterymodel?: string;
            batterycapacity?: number | string;
            snnumber?: string;
        };
        msatDetails?: {
            msatConnectedAt?: string | Date;
        };
    };
}

export function ProjectDetailsCard({ customer }: ProjectDetailsCardProps) {
    const navigate = useNavigate();

    // Format helper to match CustomerDetailsPage
    const formatValDate = (dateString?: string | Date) => {
        if (!dateString) return '—';
        return formatSydneyTime(dateString, 'DD/MM/YYYY');
    };

    // Get Status info from CRM Status Map
    const statusInfo = customer.status !== undefined
        ? CUSTOMER_STATUS_MAP[customer.status]
        : null;

    const hasDebitData = !!customer.debitDetails;
    const hasSystemData = !!(
        customer.solarDetails?.solarcapacity ||
        customer.batteryDetails?.inverterCapacity ||
        customer.batteryDetails?.batterybrand ||
        customer.batteryDetails?.batterymodel ||
        customer.batteryDetails?.batterycapacity ||
        customer.batteryDetails?.snnumber
    );

    const visibleCards = 2 + (hasDebitData ? 1 : 0) + (hasSystemData ? 1 : 0);
    const gridColsClass = 
        visibleCards === 4 ? "xl:grid-cols-4" : 
        visibleCards === 3 ? "xl:grid-cols-3" : 
        "xl:grid-cols-2";

    return (
        <div className="flex-1 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)] border border-white/50 dark:border-white/5 rounded-[24px] p-8 flex flex-col gap-8 text-foreground transition-all duration-300 overflow-hidden">

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/[0.04] dark:border-white/[0.06] shrink-0">
                <div className="flex items-center">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            {customer.firstName} {customer.lastName}
                            {statusInfo && (
                                <span
                                    className="text-[10px] font-bold uppercase px-2.5 rounded-full tracking-wider"
                                    style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}
                                >
                                    {statusInfo.label}
                                </span>
                            )}
                        </h2>
                        {customer.address?.fullAddress ? (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.address.fullAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group w-fit"
                            >
                                <MapPinIcon size={14} className="shrink-0" />
                                <span className="truncate max-w-[300px] sm:max-w-md group-hover:underline underline-offset-2">{customer.address.fullAddress}</span>
                            </a>
                        ) : (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-neutral-400">
                                <MapPinIcon size={14} className="shrink-0" />
                                <span className="truncate max-w-[300px] sm:max-w-md">No Address Provided</span>
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-neutral-400 mt-0.5">
                            {customer.number && (
                                <a href={`tel:${customer.number}`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <PhoneIcon size={14} className="shrink-0" />
                                    <span>{customer.number}</span>
                                </a>
                            )}
                            {customer.email && (
                                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <MailIcon size={14} className="shrink-0" />
                                    <span className="truncate max-w-[150px] sm:max-w-[200px]">{customer.email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <button
                        onClick={() => navigate(`/customers/${customer.uid}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
                    >
                        View Full Profile
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500">
                        <span>Customer ID:</span>
                        <span className="font-mono font-semibold text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                            {customer.customerId}
                        </span>
                    </div>
                </div>
            </div>


            {/* Widgets Grid */}
            <div>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-5 pb-2`}>

                    {/* Section 1: General Details */}
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 border border-black/[0.03] dark:border-white/[0.04] flex flex-col gap-5 h-full transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2c2c2e] shadow-sm flex items-center justify-center text-amber-500">
                                <Settings2Icon size={16} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">General</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">NMI</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 font-mono">{customer.address?.nmi || '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Property Type</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.propertyType === 1 ? 'Commercial' : customer.propertyType === 0 ? 'Residential' : '—'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Sale Type</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.enrollmentDetails?.saletype !== undefined ? SALE_TYPE_LABELS[customer.enrollmentDetails.saletype] : '—'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Billing Pref.</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.enrollmentDetails?.billingpreference !== undefined ? BILLING_PREF_LABELS[customer.enrollmentDetails.billingpreference] : '—'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Life Support</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.enrollmentDetails?.lifesupport ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Concession</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.enrollmentDetails?.concession ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Billing & Direct Debit */}
                    {hasDebitData && (
                        <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 border border-black/[0.03] dark:border-white/[0.04] flex flex-col gap-5 h-full transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2c2c2e] shadow-sm flex items-center justify-center text-emerald-500">
                                    <IdCardIcon size={16} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Direct Debit</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                <div className="flex flex-col gap-1 col-span-2">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Account Holder</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                                        {customer.debitDetails!.accountType === 0
                                            ? customer.debitDetails!.companyName
                                            : `${customer.debitDetails!.firstName || ''} ${customer.debitDetails!.lastName || ''}`.trim() || '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Bank Name</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">{customer.debitDetails!.bankName || '—'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Frequency</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                        {customer.debitDetails!.paymentFrequency === 0 ? 'Monthly' :
                                            customer.debitDetails!.paymentFrequency === 1 ? 'Fortnightly' :
                                                customer.debitDetails!.paymentFrequency === 2 ? 'Weekly' : '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">BSB</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 font-mono">{customer.debitDetails!.bsb || '—'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Account No.</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 font-mono">
                                        {customer.debitDetails!.accountNumber ? `•••• ${customer.debitDetails!.accountNumber.slice(-4)}` : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Solar & Battery System */}
                    {hasSystemData && (
                        <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 border border-black/[0.03] dark:border-white/[0.04] flex flex-col gap-5 h-full transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2c2c2e] shadow-sm flex items-center justify-center text-sky-500">
                                    <ZapIcon size={16} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Info</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">System Size</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                        {customer.solarDetails?.solarcapacity ? `${customer.solarDetails.solarcapacity}kW` : '0kW'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Inverter</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                        {customer.batteryDetails?.inverterCapacity ? `${customer.batteryDetails.inverterCapacity}kW` : '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Battery Brand</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                                        {customer.batteryDetails?.batterybrand || '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Battery Model</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                                        {customer.batteryDetails?.batterymodel || '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Capacity</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                        {customer.batteryDetails?.batterycapacity ? `${customer.batteryDetails.batterycapacity}kWh` : '—'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Serial No.</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 font-mono truncate" title={customer.batteryDetails?.snnumber}>
                                        {customer.batteryDetails?.snnumber || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Project Dates Timeline */}
                    <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 border border-black/[0.03] dark:border-white/[0.04] flex flex-col gap-5 h-full transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2c2c2e] shadow-sm flex items-center justify-center text-indigo-500">
                                <CalendarIcon size={16} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Timeline</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Connection</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {customer.enrollmentDetails?.connectiondate ? formatValDate(customer.enrollmentDetails.connectiondate) : '—'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">First Debit</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {formatValDate(customer.debitDetails?.firstDebitDate)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Lead Entered</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">{formatValDate(customer.createdAt)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Meter App.</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {formatValDate(customer.msatDetails?.msatConnectedAt || customer.createdAt)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">Activation</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                    {formatValDate(customer.phoneVerifiedAt || customer.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
