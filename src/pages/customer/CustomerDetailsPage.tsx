import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Input, DatePicker, Select, Tooltip, Switch as ToggleSwitch, ConfirmationPopover, Popover } from '@/components/ui';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import {
    PlusIcon, PencilIcon,
    CheckIcon, XIcon, MailIcon, Settings2Icon, PlugIcon, ZapIcon,
    EyeIcon, TrashIcon, UploadIcon, CalendarIcon, UserIcon, InfoIcon, ActivityIcon,
    IdCardIcon, ArrowLeftIcon, PhoneIcon, MoreHorizontalIcon, MapPinIcon, LockIcon,
    RefreshCwIcon, CreditCardIcon, FileTextIcon, PercentIcon, DownloadIcon
} from '@/components/icons';
import {
    GET_CUSTOMER_GENERAL_DETAILS,
    GET_CUSTOMER_SOLAR_VPP_DETAILS,
    GET_CUSTOMER_DEBIT_DETAILS,
    GET_CUSTOMER_UTILMATE_DETAILS,
    GET_CUSTOMER_DOCUMENTS,
    SOFT_DELETE_CUSTOMER,
    HARD_DELETE_CUSTOMER,
    GET_RATES_HISTORY_BY_VERSION,
    GET_AUDIT_LOGS,
    GET_CUSTOMER_EMAIL_LOGS,
    GET_CUSTOMER_NOTES,
    GET_NOTE_TYPES,
    GET_USERS,
    GET_DOCUMENT_TYPES,
    GET_RISK_STATUSES,
    CREATE_CUSTOMER_NOTE,
    DELETE_CUSTOMER_NOTE,
    SEND_OFFER_EMAIL,
    CREATE_NOTE_TYPE,
    CREATE_DOCUMENT_TYPE,
    SEND_REMINDER_EMAIL,
    CREATE_CUSTOMER,
    UPDATE_CUSTOMER,
    SEND_CUSTOMER_CREDENTIALS_EMAIL,
    GET_MEASUREMENT_UNITS,
    GET_CUSTOMER_MAINTENANCE,
    GET_ITEM_CATEGORIES,
    CREATE_CUSTOMER_MAINTENANCE,
    UPDATE_CUSTOMER_MAINTENANCE,
    DELETE_CUSTOMER_MAINTENANCE,
    CREATE_ITEM_CATEGORY
} from '@/graphql';
import { formatSydneyTime } from '@/lib/date';
import { secondaryApiAxios, apiAxios } from '@/lib/apollo';
import { cn } from '@/lib/utils';
import { getName } from 'country-list';
import type { MaintenanceRecord, MaintenanceResponse } from '@/types';

import {
    SALE_TYPE_LABELS, BILLING_PREF_LABELS, DNSP_LABELS, BATTERY_BRAND_OPTIONS,
    ID_TYPE_MAP, GENDER_LABELS, RELATIONSHIP_STATUS_LABELS,
    EMAIL_STATUS_MAP, EMAIL_TYPE_LABELS
} from '@/lib/constants';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { VppCertificateTab } from './components/VppCertificateTab';

interface CustomerAddress {
    id: string;
    unitNumber?: string;
    streetNumber?: string;
    streetName?: string;
    streetType?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    country?: string;
    fullAddress?: string;
    nmi?: string;
}

interface DocumentItem {
    id: string;
    uid: string;
    type?: string;
    name?: string;
    filename?: string;
    path?: string;
    size?: number;
    mimeType?: string;
    documentType?: {
        uid: string;
        name: string;
        color: string;
        category?: string;
    };
    startDate?: string;
    endDate?: string;
    createdAt: string;
    createdBy?: string;
    createdByUser?: {
        uid: string;
        name: string;
    };
}

// Extended customer details interface
interface CustomerDetails {
    uid: string;
    customerId?: string;
    title?: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    abn?: string;
    email?: string;
    number?: string;
    dob?: string;
    propertyType?: number;
    status: number;
    previousBill?: DocumentItem;
    identityProof?: DocumentItem;
    licenseDocument?: DocumentItem;
    additionalDocument?: DocumentItem;
    gender?: number;
    relationshipStatus?: number;
    enquiryAmount?: string | number;
    checkCreditScore?: number;
    employerName?: string;
    creditScore?: number;
    isCreditScoreFetched?: number;
    discount?: number;
    tariffCode?: string;
    signDate?: string;
    signedPdfPath?: string;
    emailSent?: number;
    offerEmailSentAt?: string;
    emailLogCount?: number;
    phoneVerifiedAt?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    address?: CustomerAddress;
    riskStatus?: string;
    enrollmentDetails?: {
        saletype?: number;
        connectiondate?: string;
        idtype?: number;
        idnumber?: string;
        idstate?: string;
        idcountry?: string;
        idexpiry?: string;
        concession?: boolean;
        lifesupport?: boolean;
        billingpreference?: number;
        licenseNumber?: string;
        licenseState?: string;
        licenseExpiry?: string;
    };
    ratePlan?: {
        uid?: string;
        codes?: string;
        planId?: string;
        dnsp?: number;
        state?: string;
        tariff?: string;
        type?: number;
        vpp?: number;
        discountApplies?: number;
        discountPercentage?: number;
        offers?: Array<{
            uid?: string;
            offerName?: string;
            anytime?: number;
            supplyCharge?: number;
            peak?: number;
            offPeak?: number;
            shoulder?: number;
            fit?: number;
            fitPeak?: number;
            fitCritical?: number;
            fitVpp?: number;
            cl1Supply?: number;
            cl1Usage?: number;
            cl2Supply?: number;
            cl2Usage?: number;
            demand?: number;
            demandOp?: number;
            demandP?: number;
            demandS?: number;
            vppOrcharge?: number;
            isActive?: boolean;
        }>;
    };
    rateOffer?: {
        uid?: string;
        offerName?: string;
        anytime?: number;
        supplyCharge?: number;
        peak?: number;
        offPeak?: number;
        shoulder?: number;
        fit?: number;
    };
    vppDetails?: {
        vpp?: number;
        vppConnected?: number;
        vppSignupBonus?: number;
    };
    msatDetails?: {
        msatConnected?: number;
        msatConnectedAt?: string;
        msatUpdatedAt?: string;
    };
    solarDetails?: {
        id?: string;
        customerUid?: string;
        hassolar?: number;
        solarcapacity?: number;
        invertercapacity?: number;
    };
    batteryDetails?: {
        batterybrand?: string;
        snnumber?: string;
        batterycapacity?: number;
        exportlimit?: number;
        inverterCapacity?: number;
        checkCode?: string;
    };
    utilmateDetails?: {
        id?: string;
        customerUid?: string;
        siteIdentifier?: string;
        accountNumber?: string;
        utilmateConnected?: number;
        utilmateConnectedAt?: string;
    };
    utilmateStatus?: string | number;
    vppCertificateDetails?: {
        isAllRequiredFilled: number;
        isVppCertificateEmailSent?: number;
        isVppCertificateEmailSentAt?: string;
    };
    rateVersion?: number;
    createdAt?: string;
    updatedAt?: string;
    debitDetails?: {
        id: string | number;
        customerUid: string;
        accountType?: number;
        companyName?: string;
        abn?: string;
        firstName?: string;
        lastName?: string;
        bankName?: string;
        bankAddress?: string;
        bsb?: string;
        accountNumber?: string;
        paymentFrequency?: number;
        firstDebitDate?: string;
        optIn?: number;
    };
    documents?: DocumentItem[];
    // Add missing fields for createCustomer input logic
    offerVersion?: number;
}

interface EmailLog {
    id: string;
    customerUid: string;
    customerId: string | null;
    emailTo: string | null;
    emailType: string | null;
    subject: string | null;
    body: string | null;
    status: number;
    errorMessage: string | null;
    sentAt: string | null;
    verifiedAt: string | null;
    createdAt: string;
    createdBy: string | null;
    tenant: string | null;
    verificationCode: string | null;
}

interface EmailLogsResponse {
    customerEmailLogs: {
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
        data: EmailLog[];
    };
}

const DOCUMENT_TYPE_OPTIONS = [
    { label: 'Other', value: 'other' }
];

const RateVersionTooltip = ({ version, children }: { version: string, children: React.ReactNode }) => {
    const { data, loading } = useQuery(GET_RATES_HISTORY_BY_VERSION, {
        variables: { version },
        skip: !version
    });

    const history = data?.ratesHistoryByVersion;
    const createdDate = history?.createdAt ? formatSydneyTime(history.createdAt) : 'Unknown';
    const isActive = history?.activeVersion === 1;

    return (
        <Tooltip
            position="bottom"
            className="whitespace-normal min-w-[220px] p-0 overflow-hidden bg-white dark:bg-neutral-900 border border-border shadow-xl text-foreground"
            content={
                loading ? (
                    <div className="p-3 text-xs text-muted-foreground">Loading details...</div>
                ) : history ? (
                    <div className="flex flex-col text-xs">
                        <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="font-semibold">Rate Version Details</span>
                        </div>
                        <div className="p-2 space-y-1">

                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={isActive ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                    {isActive ? 'Current Version' : 'Previous Version'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{createdDate}</span>
                            </div>
                            {history.createdByName && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">By:</span>
                                    <span>{history.createdByName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 text-xs text-muted-foreground">No history found</div>
                )
            }
        >
            <div className="cursor-help inline-flex items-center gap-1 hover:text-primary transition-colors duration-200">
                {children}
            </div>
        </Tooltip>
    );
};

// ============================================================
// Customer Email Logs Table Component
// ============================================================

// Table name -> friendly description map for customer activity logs
const activityTableNameMap: Record<string, string> = {
    customers: 'Customer Profile',
    customer_address: 'Address Details',
    customer_enrollment_details: 'Enrollment Information',
    customer_solar_system: 'Solar System',
    customer_battery_system: 'Battery System',
    customer_vpp: 'VPP Configuration',
    customer_msat: 'MSAT Connection',
    customer_debit_details: 'Billing & Debit',
    customer_documents: 'Documents',
    rates: 'Rate Plan',
    rate_offers: 'Rate Offer',
};

const activityOperationColors: Record<string, { bg: string; label: string }> = {
    INSERT: { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50', label: 'Created' },
    UPDATE: { bg: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50', label: 'Updated' },
    DELETE: { bg: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50', label: 'Deleted' },
};

const CustomerActivityLogTable = ({ customerUid }: { customerUid: string }) => {
    const [page, setPage] = useState(1);
    const [allLogs, setAllLogs] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [expandedUid, setExpandedUid] = useState<string | null>(null);
    const limit = 20;

    const { data, loading } = useQuery(GET_AUDIT_LOGS, {
        variables: { page, limit, recordId: customerUid },
        fetchPolicy: 'cache-and-network',
    });

    const meta = data?.auditLogs?.meta;
    const hasMore = meta ? page < meta.totalPages : false;

    useEffect(() => {
        if (data?.auditLogs?.data) {
            const fetchedLogs = data.auditLogs.data;
            if (page === 1) {
                setAllLogs(fetchedLogs);
            } else {
                setAllLogs(prev => {
                    const existingIds = new Set(prev.map((l: any) => l.id));
                    const newLogs = fetchedLogs.filter((l: any) => !existingIds.has(l.id));
                    return [...prev, ...newLogs];
                });
            }
            setIsLoadingMore(false);
        }
    }, [data, page]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const getChangedFields = (oldVals: string | null, newVals: string | null) => {
        try {
            const oldObj = oldVals ? JSON.parse(oldVals) : {};
            const newObj = newVals ? JSON.parse(newVals) : {};
            const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
            const changes: { field: string; from: any; to: any }[] = [];
            allKeys.forEach(key => {
                if (key === 'updated_at' || key === 'created_at' || key === 'uid' || key === 'id' || key === 'tenant') return;
                const oldVal = oldObj[key];
                const newVal = newObj[key];
                if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                    changes.push({
                        field: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        from: oldVal ?? '—',
                        to: newVal ?? '—',
                    });
                }
            });
            return changes;
        } catch {
            return [];
        }
    };

    if (loading && page === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Loading activity log...</p>
            </div>
        );
    }

    if (allLogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-neutral-950 rounded-xl border border-dashed border-border">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                    <ActivityIcon size={20} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No activity recorded yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Changes to this customer will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Summary */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    Showing {allLogs.length} of {meta?.totalRecords || allLogs.length} activities
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-1">
                    {allLogs.map((log: any) => {
                        const opInfo = activityOperationColors[log.operation] || { bg: 'bg-muted text-muted-foreground', label: log.operation };
                        const tableLabel = activityTableNameMap[log.tableName] || log.tableName;
                        const isExpanded = expandedUid === log.uid;
                        const changes = isExpanded ? getChangedFields(log.oldValues, log.newValues) : [];

                        return (
                            <div key={log.uid} className="relative pl-10">
                                {/* Timeline dot */}
                                <div className={cn(
                                    "absolute left-[12px] top-4 w-[11px] h-[11px] rounded-full border-2 bg-background z-10",
                                    log.operation === 'INSERT' ? 'border-emerald-500' :
                                        log.operation === 'DELETE' ? 'border-rose-500' : 'border-sky-500'
                                )} />

                                <button
                                    onClick={() => setExpandedUid(isExpanded ? null : log.uid)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                                        isExpanded
                                            ? "bg-muted/50 border-border shadow-sm"
                                            : "bg-background border-border/50 hover:border-border hover:bg-muted/30"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wide shrink-0', opInfo.bg)}>
                                                {opInfo.label}
                                            </span>
                                            <span className="text-sm font-medium text-foreground truncate">{tableLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                {formatSydneyTime(log.changedAt)}
                                            </span>
                                            <svg className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="mt-1 ml-1 p-3 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {log.operation === 'INSERT' && log.newValues ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created With</p>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                                    {getChangedFields(null, log.newValues).map((c, i) => (
                                                        <div key={i} className="flex items-baseline gap-2">
                                                            <span className="text-[11px] text-muted-foreground min-w-[100px]">{c.field}:</span>
                                                            <span className="text-[11px] font-medium text-foreground truncate">{String(c.to)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : log.operation === 'UPDATE' && changes.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Changes</p>
                                                <div className="space-y-1.5">
                                                    {changes.map((c, i) => (
                                                        <div key={i} className="flex items-baseline gap-2 text-[11px]">
                                                            <span className="text-muted-foreground min-w-[100px] shrink-0">{c.field}:</span>
                                                            <span className="text-rose-600 dark:text-rose-400 line-through truncate max-w-[150px]" title={String(c.from)}>{String(c.from)}</span>
                                                            <span className="text-muted-foreground">→</span>
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[150px]" title={String(c.to)}>{String(c.to)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : log.operation === 'DELETE' && log.oldValues ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deleted Record</p>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                                    {getChangedFields(log.oldValues, null).map((c, i) => (
                                                        <div key={i} className="flex items-baseline gap-2">
                                                            <span className="text-[11px] text-muted-foreground min-w-[100px]">{c.field}:</span>
                                                            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 line-through truncate">{String(c.from)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">No change details available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadMore}
                        isLoading={isLoadingMore}
                        className="text-xs"
                    >
                        Load More Activities
                    </Button>
                </div>
            )}
        </div>
    );
};

const CustomerEmailLogsTable = ({ customerUid }: { customerUid: string }) => {
    const [page, setPage] = useState(1);
    const [allLogs, setAllLogs] = useState<EmailLog[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const limit = 15;

    const { data, loading, error, refetch } = useQuery<EmailLogsResponse>(GET_CUSTOMER_EMAIL_LOGS, {
        variables: {
            customerUid,
            page,
            limit
        },
        fetchPolicy: 'cache-and-network',
    });

    const meta = data?.customerEmailLogs?.meta;
    const hasMore = meta ? page < meta.totalPages : false;

    useEffect(() => {
        if (data?.customerEmailLogs?.data) {
            const fetchedLogs = data.customerEmailLogs.data;
            if (page === 1) {
                setAllLogs(fetchedLogs);
            } else {
                setAllLogs(prev => {
                    const existingIds = new Set(prev.map(l => l.id));
                    const newLogs = fetchedLogs.filter(l => !existingIds.has(l.id));
                    return [...prev, ...newLogs];
                });
            }
            setIsLoadingMore(false);
        }
    }, [data, page]);

    // Poll for updates if any log is 'Pending' (status 0)
    useEffect(() => {
        const hasPendingLogs = allLogs.some(log => log.status === 0);
        let intervalId: NodeJS.Timeout;

        if (hasPendingLogs) {
            intervalId = setInterval(() => {
                refetch();
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [allLogs, refetch]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    const handleRefresh = async () => {
        await refetch();
        toast.success('Email logs refreshed');
    };

    const columns: Column<EmailLog>[] = [
        {
            key: 'subject',
            header: 'Subject',
            render: (log: EmailLog) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground truncate max-w-[280px]" title={log.subject || ''}>
                        {log.subject || 'No Subject'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {EMAIL_TYPE_LABELS[log.emailType || ''] || log.emailType}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            width: 'w-[120px]',
            render: (log: EmailLog) => {
                const statusInfo = EMAIL_STATUS_MAP[log.status] || { label: 'Unknown', color: 'bg-muted text-muted-foreground' };
                return (
                    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', statusInfo.color)}>
                        {statusInfo.label}
                    </span>
                );
            }
        },
        {
            key: 'sentAt',
            header: 'Date Sent',
            width: 'w-[180px]',
            render: (log: EmailLog) => (
                <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                        {log.sentAt ? formatSydneyTime(log.sentAt) : 'Not Sent'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        via {log.emailTo}
                    </span>
                </div>
            )
        },
        {
            key: 'actions',
            header: (
                <div className="flex justify-end">
                    <button
                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        onClick={handleRefresh}
                        title="Refresh Logs"
                    >
                        <RefreshCwIcon size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            ),
            width: 'w-[80px]',
            render: (log: EmailLog) => (
                <button
                    className="p-2 border rounded-lg transition-colors bg-white text-blue-600 border-blue-200 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40"
                    onClick={() => {
                        setSelectedLog(log);
                        setDetailModalOpen(true);
                    }}
                    title="View Email Details"
                >
                    <EyeIcon size={14} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <DataTable<EmailLog>
                columns={columns}
                data={allLogs}
                rowKey={(log) => log.id}
                loading={loading && page === 1}
                error={error?.message}
                maxHeightClass="max-h-[500px]"
                emptyMessage="No emails found for this customer."
                infiniteScroll
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
            />

            {/* Email Detail Modal */}
            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title="Email Details"
                size="full"
            >
                {selectedLog && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
                        <div className="space-y-4">
                            <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Metadata</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Status</p>
                                        <div className="mt-1">
                                            <span className={cn('px-2 py-0.5 text-xs font-bold rounded-full border', EMAIL_STATUS_MAP[selectedLog.status]?.color)}>
                                                {EMAIL_STATUS_MAP[selectedLog.status]?.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Type</p>
                                        <p className="text-sm font-medium mt-1">{EMAIL_TYPE_LABELS[selectedLog.emailType || ''] || selectedLog.emailType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Sent To</p>
                                        <p className="text-sm font-medium mt-1 truncate">{selectedLog.emailTo}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Sent At</p>
                                        <p className="text-sm font-medium mt-1">{selectedLog.sentAt ? formatSydneyTime(selectedLog.sentAt) : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedLog.errorMessage && (
                                <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Error</p>
                                    <p className="text-sm text-red-700">{selectedLog.errorMessage}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
                            <div className="px-4 py-3 bg-muted/30 border-b border-border">
                                <p className="text-sm font-bold text-foreground truncate">{selectedLog.subject}</p>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: selectedLog.body || '' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// ============================================================
// Customer Maintenance Table Component
// ============================================================

const MAINTENANCE_METHOD_LABELS: Record<number, string> = {
    1: 'Call',
    2: 'Email'
};

const MAINTENANCE_STATUS_MAP: Record<number, { label: string, color: string }> = {
    1: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' },
    2: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' },
    3: { label: 'In-Progress', color: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50' }
};

const MAINTENANCE_PRIORITY_MAP: Record<number, { label: string, color: string }> = {
    1: { label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400' },
    2: { label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' },
    3: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' },
    4: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' }
};

const MAINTENANCE_METHOD_OPTIONS = Object.entries(MAINTENANCE_METHOD_LABELS).map(([value, label]) => ({
    label,
    value: value
}));

const MAINTENANCE_STATUS_OPTIONS = Object.entries(MAINTENANCE_STATUS_MAP).map(([value, info]) => ({
    label: info.label,
    value: value
}));

const MAINTENANCE_PRIORITY_OPTIONS = Object.entries(MAINTENANCE_PRIORITY_MAP).map(([value, info]) => ({
    label: info.label,
    value: value
}));

const CustomerMaintenanceTable = ({
    customerUid,
    onEdit,
    onViewNotes,
    refreshKey
}: {
    customerUid: string,
    onEdit: (record: MaintenanceRecord) => void,
    onViewNotes: (record: MaintenanceRecord) => void,
    refreshKey: number
}) => {
    const { data, loading, error, refetch } = useQuery<MaintenanceResponse>(GET_CUSTOMER_MAINTENANCE, {
        variables: { customerUid },
        fetchPolicy: 'cache-and-network',
    });

    const [deleteMaintenance] = useMutation(DELETE_CUSTOMER_MAINTENANCE);

    useEffect(() => {
        refetch();
    }, [refreshKey, refetch]);

    const handleDelete = async (uid: string) => {
        try {
            await deleteMaintenance({ variables: { uid } });
            toast.success('Maintenance record deleted');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete record');
        }
    };

    const columns: Column<MaintenanceRecord>[] = [
        {
            key: 'callDate',
            header: 'Date',
            width: 'w-[150px]',
            render: (row) => formatSydneyTime(row.callDate)
        },
        {
            key: 'category',
            header: 'Category',
            render: (row) => row.category || 'N/A'
        },
        {
            key: 'method',
            header: 'Method',
            width: 'w-[100px]',
            render: (row) => MAINTENANCE_METHOD_LABELS[row.method || 0] || 'N/A'
        },
        {
            key: 'status',
            header: 'Status',
            width: 'w-[120px]',
            render: (row) => {
                const info = MAINTENANCE_STATUS_MAP[row.status] || { label: 'Unknown', color: '' };
                return (
                    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', info.color)}>
                        {info.label}
                    </span>
                );
            }
        },
        {
            key: 'priority',
            header: 'Priority',
            width: 'w-[100px]',
            render: (row) => {
                const info = MAINTENANCE_PRIORITY_MAP[row.priority] || { label: 'Unknown', color: '' };
                return (
                    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', info.color)}>
                        {info.label}
                    </span>
                );
            }
        },
        {
            key: 'takenCareByUser',
            header: 'Handled By',
            render: (row) => row.takenCareByUser?.name || 'N/A'
        },
        {
            key: 'notes',
            header: 'Notes',
            render: (row) => {
                if (!row.notes) return <span className="text-muted-foreground/50">—</span>;

                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewNotes(row)}
                        className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 hover:text-primary transition-all gap-1.5 border border-primary/20 bg-primary/5"
                    >
                        <FileTextIcon size={12} />
                        View Note
                    </Button>
                );
            }
        },
        {
            key: 'actions',
            header: '',
            width: 'w-[100px]',
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        title="Edit Record"
                    >
                        <PencilIcon size={14} />
                    </button>
                    <ConfirmationPopover
                        title="Delete Record?"
                        description="Are you sure you want to delete this maintenance record?"
                        onConfirm={() => handleDelete(row.uid)}
                    >
                        <button
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Delete Record"
                        >
                            <TrashIcon size={14} />
                        </button>
                    </ConfirmationPopover>
                </div>
            )
        }
    ];

    return (
        <DataTable<MaintenanceRecord>
            columns={columns}
            data={data?.customerMaintenance || []}
            rowKey={(row) => row.uid}
            loading={loading}
            error={error?.message}
            emptyMessage="No maintenance records found."
        />
    );
};


// ============================================================
// Maintenance Notes Modal Component
// ============================================================

const InlineMaintenanceNotes = ({
    onClose,
    maintenanceUid,
    customerUid,
    category,
    noteText,
    setNoteText,
    onAddNote,
    isAdding,
    canDelete
}: {
    onClose: () => void,
    maintenanceUid: string,
    customerUid: string,
    category: string,
    noteText: string,
    setNoteText: (val: string) => void,
    onAddNote: () => Promise<void>,
    isAdding: boolean,
    canDelete: boolean
}) => {
    const { data, loading, refetch } = useQuery(GET_CUSTOMER_NOTES, {
        variables: { customerUid, maintenanceUid },
        skip: !maintenanceUid,
        fetchPolicy: 'network-only',
    });

    const [deleteNote] = useMutation(DELETE_CUSTOMER_NOTE);

    const handleDelete = async (uid: string) => {
        try {
            await deleteNote({ variables: { uid } });
            refetch();
            toast.success('Note deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete note');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Settings2Icon size={20} />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-foreground tracking-tight">Maintenance Notes</h3>
                        <p className="text-xs text-muted-foreground">{category} - Activity log & follow-ups</p>
                    </div>
                </div>
            </div>

            {/* Note Input */}
            <div className="bg-muted/10 p-4 rounded-xl border border-border">
                <div className="flex w-full gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Type a new internal note for this maintenance..."
                            className="w-full h-[38px] min-h-[38px] max-h-[120px] p-2 pr-10 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && noteText.trim()) {
                                    e.preventDefault();
                                    onAddNote().then(() => refetch());
                                }
                            }}
                        />
                        <Button
                            size="sm"
                            className="absolute right-1 top-1 h-[30px] w-[30px] p-0 bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={() => onAddNote().then(() => refetch())}
                            disabled={!noteText.trim() || isAdding}
                            isLoading={isAdding}
                        >
                            <PlusIcon size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        <p className="mt-3 text-sm text-muted-foreground">Loading notes...</p>
                    </div>
                ) : (data?.customerNotes?.length || 0) > 0 ? (
                    data.customerNotes.map((note: any) => (
                        <div key={note.uid} className="group bg-white dark:bg-neutral-950 rounded-xl border border-border/50 hover:border-border p-4 transition-all hover:shadow-sm">
                            <div className="flex gap-3">
                                {/* Author Avatar */}
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 border border-primary/10">
                                    {(note.createdByName || 'S').charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Author & Time */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-foreground">{note.createdByName || 'System'}</span>
                                            <span className="text-[11px] text-muted-foreground">{formatSydneyTime(note.createdAt)}</span>
                                        </div>
                                        {canDelete && (
                                            <ConfirmationPopover
                                                title="Delete this note?"
                                                description="This action cannot be undone."
                                                onConfirm={() => handleDelete(note.uid)}
                                                confirmText="Delete"
                                                cancelText="Cancel"
                                                placement="left"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </Button>
                                            </ConfirmationPopover>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{note.message}</p>

                                    {/* Metadata Tags */}
                                    {(note.followUp || note.assignedToUser || note.noteType) && (
                                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                                            {note.noteType && (
                                                <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/50">
                                                    {note.noteType.name}
                                                </span>
                                            )}
                                            {note.followUp && (
                                                <span className="text-[11px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-orange-200/50 dark:border-orange-800/50">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    Follow up: {formatSydneyTime(note.followUp)}
                                                </span>
                                            )}
                                            {note.assignedToUser && (
                                                <span className="text-[11px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-blue-200/50 dark:border-blue-800/50">
                                                    <UserIcon className="w-3 h-3" />
                                                    Assigned to:  {note.assignedToUser.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-neutral-950 rounded-xl border border-dashed border-border">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                            <Settings2Icon size={20} />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No notes yet</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Add a note above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export function CustomerDetailsPage() {
    const { uid } = useParams();
    const navigate = useNavigate();
    // const canView = useAuthStore((state) => state.canViewMenu('customers'));
    // const canCreate = useAuthStore((state) => state.canCreateInMenu('customers'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('customers'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('customers'));
    const canManageNoteTypes = useAuthStore((state) => state.hasFeatureAccess('feature_manage_note_types'));
    const canManageDocumentTypes = useAuthStore((state) => state.hasFeatureAccess('feature_manage_document_types'));
    const canManageMaintenanceCategories = useAuthStore((state) => state.hasFeatureAccess('feature_manage_maintenance_categories'));

    // State
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<CustomerDetails | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewApiPath, setPreviewApiPath] = useState('');
    const [previewFileName, setPreviewFileName] = useState('');
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEmailSending, setIsEmailSending] = useState(false);

    // Detail Section State
    const [selectedDetailSection, setSelectedDetailSection] = useState<'general' | 'rates' | 'vpp_certificate' | 'debit' | 'utilmate' | 'notes' | 'documents' | 'electricity_bills' | 'email_logs' | 'activity_log' | 'maintenance'>('general');

    // Email Logs Refresh State
    const [emailLogsKey, setEmailLogsKey] = useState(0);

    // Notes State
    const [noteText, setNoteText] = useState('');
    const [noteFollowUp, setNoteFollowUp] = useState<Date | null>(null);
    const [noteAssignedTo, setNoteAssignedTo] = useState('');
    const [noteType, setNoteType] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [isAddingNewTypeInline, setIsAddingNewTypeInline] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [isAddingNoteType, setIsAddingNoteType] = useState(false);

    // Document operations state
    const [isDeletingDocument, setIsDeletingDocument] = useState<string | null>(null);
    const [isUploadingDocument, setIsUploadingDocument] = useState<string | null>(null);
    const [newDocumentType, setNewDocumentType] = useState<string>('');
    const [isAddingNewDocTypeInline, setIsAddingNewDocTypeInline] = useState(false);
    const [newDocTypeName, setNewDocTypeName] = useState('');
    const [newDocTypeCategory, setNewDocTypeCategory] = useState('0');
    const [isAddingDocType, setIsAddingDocType] = useState(false);
    const previousBillInputRef = useRef<HTMLInputElement>(null);
    const identityProofInputRef = useRef<HTMLInputElement>(null);
    const licenseDocumentInputRef = useRef<HTMLInputElement>(null);
    const newDocumentInputRef = useRef<HTMLInputElement>(null);

    // Action states
    const [sendingReminder, setSendingReminder] = useState(false);
    const [reminderSent, setReminderSent] = useState(false);
    const [freezingCustomer, setFreezingCustomer] = useState(false);
    const [freezeModalOpen, setFreezeModalOpen] = useState(false);
    // const [customerToFreeze, setCustomerToFreeze] = useState<CustomerDetails | null>(null); // Not needed since we use selectedCustomerDetails
    const [markingNotInterested, setMarkingNotInterested] = useState(false);
    const [notInterestedModalOpen, setNotInterestedModalOpen] = useState(false);
    const [isHardDelete, setIsHardDelete] = useState(false);
    const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');
    const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

    // VPP Form State
    const [isEditingVpp, setIsEditingVpp] = useState(false);
    const [vppForm, setVppForm] = useState({
        vppSignupBonus: '',
        batteryBrand: '',
        snNumber: '',
        batteryCapacity: '',
        exportLimit: '',
        inverterCapacity: '',
        checkCode: ''
    });

    // Date state for electricity bill upload
    const [billStartDate, setBillStartDate] = useState<string>('');
    const [billEndDate, setBillEndDate] = useState<string>('');
    const [isCheckingCreditScore, setIsCheckingCreditScore] = useState(false);
    const [showManualOfferButton, setShowManualOfferButton] = useState(false);
    const [isSendingOffer, setIsSendingOffer] = useState(false);
    const [vppConnectModalOpen, setVppConnectModalOpen] = useState(false);
    const [utilmateConnectModalOpen, setUtilmateConnectModalOpen] = useState(false);
    const [isGeneratingCredentials, setIsGeneratingCredentials] = useState(false);

    // Maintenance State
    const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
    const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
    const [maintenanceRefreshKey, setMaintenanceRefreshKey] = useState(0);
    const [editingMaintenance, setEditingMaintenance] = useState<any>(null);
    const [maintenanceForm, setMaintenanceForm] = useState({
        callDate: new Date(),
        category: '',
        takenCareByUid: '',
        method: 1 as number,
        status: 3 as number,
        priority: 2 as number,
        notes: ''
    });

    // Maintenance Notes Modal State
    const [selectedMaintenanceUid, setSelectedMaintenanceUid] = useState<string | null>(null);
    const [selectedMaintenanceCategory, setSelectedMaintenanceCategory] = useState<string | null>(null);
    const [maintenanceNoteText, setMaintenanceNoteText] = useState('');
    const [isAddingMaintenanceNote, setIsAddingMaintenanceNote] = useState(false);

    // Maintenance Category State
    const [isAddingNewCategoryInline, setIsAddingNewCategoryInline] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Utilmate Form State
    const [isEditingUtilmate, setIsEditingUtilmate] = useState(false);
    const [utilmateForm, setUtilmateForm] = useState({
        siteIdentifier: '',
        accountNumber: '',
        utilmateConnected: 0,
        utilmateConnectedAt: ''
    });

    // Tabs responsive state
    const [maxVisibleTabs, setMaxVisibleTabs] = useState(100);
    const [overflowOpen, setOverflowOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setMaxVisibleTabs(4); // Mobile: Icons only (fits more)
            else if (width < 768) setMaxVisibleTabs(5); // Tablet Portrait
            else if (width < 1024) setMaxVisibleTabs(5); // Tablet Landscape
            else if (width < 1280) setMaxVisibleTabs(6); // Laptop
            else setMaxVisibleTabs(12); // Desktop (Show all tabs)
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Queries
    const { loading: isLoadingDetails, refetch: refetchCustomer } = useQuery(GET_CUSTOMER_GENERAL_DETAILS, {
        variables: { uid },
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data?.customer) {
                setSelectedCustomerDetails(data.customer);
            }
        },
        onError: (err) => {
            console.error("Error fetching customer:", err);
            toast.error("Failed to load customer details");
            navigate('/customers');
        }
    });

    // Notes query
    const { data: notesData, loading: notesLoading, refetch: refetchNotes } = useQuery(GET_CUSTOMER_NOTES, {
        variables: { customerUid: uid || '' },
        skip: !uid || selectedDetailSection !== 'notes',
        fetchPolicy: 'network-only',
    });

    const { data: noteTypesData, refetch: refetchNoteTypes } = useQuery(GET_NOTE_TYPES, {
        skip: selectedDetailSection !== 'notes' && !noteModalOpen,
        fetchPolicy: 'network-only'
    });

    // Maintenance Categories Query
    const { data: categoriesData, refetch: refetchCategories } = useQuery(GET_ITEM_CATEGORIES, {
        fetchPolicy: 'network-only'
    });

    const categoryOptions = useMemo(() => {
        return categoriesData?.itemCategories?.map((c: any) => ({
            label: c.name,
            value: c.name
        })) || [];
    }, [categoriesData]);

    // Fetch users for note assignment
    const { data: userData } = useQuery(GET_USERS, {
        variables: { limit: 100 },
        skip: selectedDetailSection !== 'notes' && !noteModalOpen && !maintenanceModalOpen,
    });

    const userOptions = userData?.users?.data?.map((u: any) => ({
        label: u.name || 'Unknown User',
        value: u.uid
    })) || [];

    const { data: documentTypesData, refetch: refetchDocumentTypes } = useQuery(GET_DOCUMENT_TYPES, {
        skip: selectedDetailSection !== 'documents' && selectedDetailSection !== 'electricity_bills',
        fetchPolicy: 'cache-and-network'
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

    const loadingGeneral = false; // Replaced by primary query

    const { loading: loadingSolar, refetch: refetchSolarVpp } = useQuery(GET_CUSTOMER_SOLAR_VPP_DETAILS, {
        variables: { uid },
        skip: !uid || (selectedDetailSection !== 'vpp_certificate' && !vppConnectModalOpen && !freezeModalOpen),
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data?.customer) {
                setSelectedCustomerDetails(prev => prev ? ({ ...prev, ...data.customer }) : data.customer);
            }
        }
    });

    const { loading: loadingDebit } = useQuery(GET_CUSTOMER_DEBIT_DETAILS, {
        variables: { uid },
        skip: !uid || selectedDetailSection !== 'debit',
        onCompleted: (data) => {
            if (data?.customer) {
                setSelectedCustomerDetails(prev => prev ? ({ ...prev, ...data.customer }) : data.customer);
            }
        }
    });

    const { loading: loadingUtilmate } = useQuery(GET_CUSTOMER_UTILMATE_DETAILS, {
        variables: { uid },
        skip: !uid || (selectedDetailSection !== 'utilmate' && !utilmateConnectModalOpen),
        onCompleted: (data) => {
            if (data?.customer) {
                setSelectedCustomerDetails(prev => prev ? ({ ...prev, ...data.customer }) : data.customer);
            }
        }
    });

    const { loading: loadingDocuments } = useQuery(GET_CUSTOMER_DOCUMENTS, {
        variables: { uid },
        skip: !uid || (selectedDetailSection !== 'documents' && selectedDetailSection !== 'electricity_bills'),
        onCompleted: (data) => {
            if (data?.customer) {
                setSelectedCustomerDetails(prev => prev ? ({ ...prev, ...data.customer }) : data.customer);
            }
        }
    });

    const isTabLoading =
        (selectedDetailSection === 'general' && loadingGeneral) ||
        (selectedDetailSection === 'vpp_certificate' && loadingSolar) ||
        (selectedDetailSection === 'debit' && loadingDebit) ||
        (selectedDetailSection === 'utilmate' && loadingUtilmate) ||
        ((selectedDetailSection === 'documents' || selectedDetailSection === 'electricity_bills') && loadingDocuments);

    const docTypeOptions = [
        ...(documentTypesData?.documentTypes?.map((t: any) => ({
            label: t.name,
            value: t.uid
        })) || DOCUMENT_TYPE_OPTIONS)
    ];

    const noteTypeOptions = [
        { label: 'Select a note type...', value: '' },
        ...(noteTypesData?.noteTypes?.map((t: any) => ({
            label: t.name,
            value: t.uid
        })) || []),
    ];

    // Mutations
    const [createNote] = useMutation(CREATE_CUSTOMER_NOTE);
    const [deleteNote] = useMutation(DELETE_CUSTOMER_NOTE);
    const [sendOfferEmail] = useMutation(SEND_OFFER_EMAIL);
    const [softDeleteCustomer] = useMutation(SOFT_DELETE_CUSTOMER);
    const [hardDeleteCustomer] = useMutation(HARD_DELETE_CUSTOMER);
    const [createNoteType] = useMutation(CREATE_NOTE_TYPE);
    const [createDocumentTypeMutation] = useMutation(CREATE_DOCUMENT_TYPE);
    const [sendReminderEmail] = useMutation(SEND_REMINDER_EMAIL);
    const [createCustomer] = useMutation(CREATE_CUSTOMER);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
    const [sendCustomerCredentialsEmail] = useMutation(SEND_CUSTOMER_CREDENTIALS_EMAIL);
    const [createMaintenance] = useMutation(CREATE_CUSTOMER_MAINTENANCE);
    const [updateMaintenance] = useMutation(UPDATE_CUSTOMER_MAINTENANCE);
    const [createCategory] = useMutation(CREATE_ITEM_CATEGORY);

    // Effects
    useEffect(() => {
        if (selectedCustomerDetails) {
            setVppForm({
                vppSignupBonus: selectedCustomerDetails.vppDetails?.vppSignupBonus?.toString() || '',
                batteryBrand: selectedCustomerDetails.batteryDetails?.batterybrand || '',
                snNumber: selectedCustomerDetails.batteryDetails?.snnumber || '',
                batteryCapacity: selectedCustomerDetails.batteryDetails?.batterycapacity?.toString() || '',
                exportLimit: selectedCustomerDetails.batteryDetails?.exportlimit?.toString() || '',
                inverterCapacity: selectedCustomerDetails.batteryDetails?.inverterCapacity?.toString() || '',
                checkCode: selectedCustomerDetails.batteryDetails?.checkCode || ''
            });

            setUtilmateForm({
                siteIdentifier: selectedCustomerDetails.utilmateDetails?.siteIdentifier || '',
                accountNumber: selectedCustomerDetails.utilmateDetails?.accountNumber || '',
                utilmateConnected: selectedCustomerDetails.utilmateDetails?.utilmateConnected || 0,
                utilmateConnectedAt: selectedCustomerDetails.utilmateDetails?.utilmateConnectedAt || ''
            });
        }
    }, [selectedCustomerDetails]);

    // Handlers
    const handleCreateDocumentType = async () => {
        if (!newDocTypeName.trim()) return;
        setIsAddingDocType(true);
        try {
            await createDocumentTypeMutation({
                variables: {
                    name: newDocTypeName.trim(),
                    category: newDocTypeCategory,
                    color: newDocTypeCategory === '2' ? '#eab308' : '#64748b'
                }
            });
            await refetchDocumentTypes();
            setNewDocTypeName('');
            setIsAddingNewDocTypeInline(false);
            toast.success('Document type created');
        } catch (error: any) {
            console.error('Error creating document type:', error);
            toast.error(error.message || 'Failed to create document type');
        } finally {
            setIsAddingDocType(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim() || !uid) return;
        setIsAddingNote(true);
        try {
            await createNote({
                variables: {
                    customerUid: uid,
                    message: noteText.trim(),
                    followUp: noteFollowUp || undefined,
                    assignedTo: noteAssignedTo || undefined,
                    type: noteType
                },
            });
            setNoteText('');
            setNoteFollowUp(null);
            setNoteAssignedTo('');
            setNoteType('');
            setNoteModalOpen(false);
            refetchNotes();
            toast.success('Note added successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add note');
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleAddMaintenanceNote = async () => {
        if (!maintenanceNoteText.trim() || !selectedMaintenanceUid || !uid) return;
        setIsAddingMaintenanceNote(true);
        try {
            await createNote({
                variables: {
                    customerUid: uid,
                    maintenanceUid: selectedMaintenanceUid,
                    message: maintenanceNoteText.trim(),
                },
            });
            setMaintenanceNoteText('');
            toast.success('Maintenance note added');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add maintenance note');
        } finally {
            setIsAddingMaintenanceNote(false);
        }
    };

    const handleCreateNoteType = async () => {
        if (!newTypeName.trim()) return;
        setIsAddingNoteType(true);
        try {
            const { data } = await createNoteType({
                variables: { name: newTypeName.trim() }
            });
            if (data?.createNoteType?.uid) {
                toast.success('Note type added successfully');
                setNewTypeName('');
                setIsAddingNewTypeInline(false);
                await refetchNoteTypes();
                setNoteType(data.createNoteType.uid);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create note type');
        } finally {
            setIsAddingNoteType(false);
        }
    };

    const handleDeleteNote = async (noteUid: string) => {
        try {
            await deleteNote({ variables: { uid: noteUid } });
            refetchNotes();
            toast.success('Note deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete note');
        }
    };

    const handlePreviewOffer = async (uid: string) => {
        setIsLoadingPreview(true);
        const baseUrl = apiAxios.defaults.baseURL || '';

        let apiPath = '';
        let fileName = 'Offer_Preview.html';

        if (selectedCustomerDetails && selectedCustomerDetails.status > 2 && selectedCustomerDetails.signedPdfPath) {
            const path = selectedCustomerDetails.signedPdfPath;
            apiPath = `/documents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
            fileName = path.split('/').pop() || 'document.pdf';
        } else {
            apiPath = `/agreement/preview/${uid}?format=html`;
        }

        // Construct URL
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = apiPath.startsWith('/') ? apiPath : '/' + apiPath;
        const url = `${cleanBase}${cleanPath}`;

        setPreviewFileName(fileName);
        setPreviewApiPath(apiPath);
        setPreviewUrl(url);
        setPreviewModalOpen(true);
    };

    const handleDownloadPreview = async () => {
        if (!previewApiPath) return;
        setIsDownloading(true);
        try {
            let downloadPath = previewApiPath;
            let downloadFileName = previewFileName;

            // If it's an agreement preview currently in HTML format, switch to PDF for download
            if (downloadPath.includes('/agreement/preview/') && downloadPath.includes('format=html')) {
                downloadPath = downloadPath.replace('format=html', 'format=pdf');
                downloadFileName = downloadFileName.replace('.html', '.pdf');
            }

            const response = await apiAxios.get(downloadPath, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFileName);
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

    const handleDeleteDocument = async (docPath: string) => {
        if (!selectedCustomerDetails?.customerId) return;

        setIsDeletingDocument(docPath);
        try {
            await apiAxios.delete(`/documents/${encodeURIComponent(docPath).replace(/%2F/g, '/')}`);

            const result = await refetchCustomer();
            if (result.data?.customer) {
                setSelectedCustomerDetails(result.data.customer);
            }

            toast.success('Document deleted successfully');
        } catch (error: any) {
            console.error('Error deleting document:', error);
            toast.error(error.response?.data?.error || 'Failed to delete document');
        } finally {
            setIsDeletingDocument(null);
        }
    };

    const handleUploadDocument = async (documentType: string, file: File, startDate?: string, endDate?: string) => {
        if (!file) return;
        if (!selectedCustomerDetails?.customerId || !uid) return;

        setIsUploadingDocument(documentType);
        try {
            const formData = new FormData();
            formData.append('customerId', selectedCustomerDetails.customerId);
            formData.append('customer_uid', uid);
            let apiDocType = documentType;
            let docName = '';

            const option = docTypeOptions.find((o: any) => o.value === documentType);

            if (option) {
                docName = option.label;
                apiDocType = option.value;
            } else if (documentType === 'previousBill') {
                const billType = docTypeOptions.find(o => o.label === 'Previous Bill');
                apiDocType = billType?.value || 'previous_bill';
                docName = 'Previous Bill';
            } else if (documentType === 'identityProof') {
                const idType = docTypeOptions.find(o => o.label === 'Identity Proof');
                apiDocType = idType?.value || 'identity_proof';
                docName = 'Identity Proof';
            } else if (documentType === 'licenseDocument') {
                const licType = docTypeOptions.find(o => o.label === 'Driver\'s License') || docTypeOptions.find(o => o.label === 'License');
                apiDocType = licType?.value || 'license_document';
                docName = 'Driver\'s License';
            } else {
                docName = documentType;
            }

            formData.append('documentType', apiDocType);
            formData.append('name', docName);
            if (startDate) formData.append('startDate', startDate);
            if (endDate) formData.append('endDate', endDate);
            formData.append('file', file);

            await apiAxios.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const result = await refetchCustomer();
            if (result.data?.customer) {
                setSelectedCustomerDetails(result.data.customer);
            }

            toast.success('Document uploaded successfully');
            if (newDocumentInputRef.current) newDocumentInputRef.current.value = '';
            setNewDocumentType('');
            setBillStartDate('');
            setBillEndDate('');
        } catch (error: any) {
            console.error('Error uploading document:', error);
            toast.error(error.response?.data?.error || 'Failed to upload document');
        } finally {
            setIsUploadingDocument(null);
        }
    };

    const handleSaveVppDetails = async () => {
        if (!selectedCustomerDetails) return;
        try {
            // Priority: Sync with secondary API first
            try {
                await secondaryApiAxios.post('/api/v1/utilmate/user/add-user-battery', {
                    userId: selectedCustomerDetails.uid,
                    batteryBrand: vppForm.batteryBrand,
                    snNumber: vppForm.snNumber,
                    checkCode: vppForm.checkCode,
                    batteryUsableCapacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : 0,
                    inverterCapacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : 0
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. VPP details not saved.');
            }

            const input: any = {
                vppDetails: {
                    vpp: 1,
                    vppConnected: selectedCustomerDetails.vppDetails?.vppConnected || 0,
                    vppSignupBonus: vppForm.vppSignupBonus ? parseFloat(vppForm.vppSignupBonus) : undefined,
                },
                batteryDetails: vppForm.batteryBrand ? {
                    batterybrand: vppForm.batteryBrand,
                    snnumber: vppForm.snNumber || undefined,
                    batterycapacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : undefined,
                    exportlimit: vppForm.exportLimit ? parseFloat(vppForm.exportLimit) : undefined,
                    inverterCapacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : undefined,
                    checkCode: vppForm.checkCode || undefined,
                } : undefined,
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input
                }
            });

            toast.success('VPP details saved successfully');
            setIsEditingVpp(false);

            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                vppDetails: {
                    ...selectedCustomerDetails.vppDetails,
                    vpp: 1,
                    vppConnected: input.vppDetails.vppConnected,
                    vppSignupBonus: input.vppDetails.vppSignupBonus
                },
                batteryDetails: input.batteryDetails
            });

        } catch (error: any) {
            console.error('Error saving VPP details:', error);
            toast.error(error.message || 'Failed to save VPP details');
        }
    };

    const handleSaveUtilmateDetails = async () => {
        if (!selectedCustomerDetails) return;

        try {
            const input: any = {
                utilmateDetails: {
                    siteIdentifier: utilmateForm.siteIdentifier || undefined,
                    accountNumber: utilmateForm.accountNumber || undefined,
                    utilmateConnected: utilmateForm.utilmateConnected,
                    utilmateConnectedAt: utilmateForm.utilmateConnectedAt || undefined,
                },
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input
                }
            });

            toast.success('Utilmate details saved successfully');
            setIsEditingUtilmate(false);

            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                utilmateDetails: {
                    ...selectedCustomerDetails.utilmateDetails,
                    ...input.utilmateDetails
                }
            });

        } catch (error: any) {
            console.error('Error saving Utilmate details:', error);
            toast.error(error.message || 'Failed to save Utilmate details');
        }
    };

    const handleMaintenanceAction = (record: any = null) => {
        if (record) {
            setEditingMaintenance(record);
            setMaintenanceForm({
                callDate: new Date(record.callDate),
                category: record.category || '',
                takenCareByUid: record.takenCareByUser?.uid || record.takenCareByUid || '',
                method: record.method || 1,
                status: record.status || 3,
                priority: record.priority || 2,
                notes: record.notes || ''
            });
        } else {
            setEditingMaintenance(null);
            setMaintenanceForm({
                callDate: new Date(),
                category: '',
                takenCareByUid: '',
                method: 1,
                status: 3,
                priority: 2,
                notes: ''
            });
        }
        setMaintenanceModalOpen(true);
    };

    const handleSaveMaintenance = async () => {
        if (!uid) return;
        setIsSavingMaintenance(true);
        try {
            const input: any = {
                customerUid: uid,
                callDate: maintenanceForm.callDate.toISOString(),
                category: maintenanceForm.category,
                takenCareByUid: maintenanceForm.takenCareByUid || undefined,
                method: maintenanceForm.method,
                status: maintenanceForm.status,
                priority: maintenanceForm.priority,
                notes: maintenanceForm.notes
            };

            if (editingMaintenance) {
                await updateMaintenance({
                    variables: {
                        uid: editingMaintenance.uid,
                        ...input
                    }
                });
                toast.success('Maintenance record updated');
            } else {
                await createMaintenance({
                    variables: {
                        ...input
                    }
                });
                toast.success('Maintenance record added');
            }

            setMaintenanceModalOpen(false);
            setMaintenanceRefreshKey(prev => prev + 1);
        } catch (error: any) {
            console.error('Error saving maintenance:', error);
            toast.error(error.message || 'Failed to save maintenance record');
        } finally {
            setIsSavingMaintenance(false);
        }
    };

    const handleCreateMaintenanceCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsAddingCategory(true);
        try {
            await createCategory({
                variables: { name: newCategoryName }
            });
            await refetchCategories();
            setMaintenanceForm({ ...maintenanceForm, category: newCategoryName });
            setIsAddingNewCategoryInline(false);
            setNewCategoryName('');
            toast.success('Category added');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add category');
        } finally {
            setIsAddingCategory(false);
        }
    };


    const handleFreezeClick = () => {
        setFreezeModalOpen(true);
    };

    const handleDeleteCustomer = (hard: boolean = false) => {
        setDeleteConfirmName('');
        setIsHardDelete(hard);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCustomerDetails) return;
        if (deleteConfirmName !== selectedCustomerDetails.customerId) {
            toast.error("Customer ID does not match.");
            return;
        }

        setIsDeletingCustomer(true);
        try {
            if (isHardDelete) {
                await hardDeleteCustomer({
                    variables: {
                        uid: selectedCustomerDetails.uid
                    }
                });
                toast.success('Customer permanently deleted');
            } else {
                await softDeleteCustomer({
                    variables: {
                        uid: selectedCustomerDetails.uid
                    }
                });
                toast.success('Customer deleted successfully');
            }
            setDeleteModalOpen(false);
            navigate('/customers');
        } catch (error: any) {
            console.error('Error deleting customer:', error);
            toast.error(error.message || 'Failed to delete customer');
        } finally {
            setIsDeletingCustomer(false);
        }
    };

    const handleConfirmFreeze = async () => {
        const customer = selectedCustomerDetails;
        if (!customer) return;
        setFreezeModalOpen(false);
        setFreezingCustomer(true);
        try {
            const input: any = {
                tenant: 'vinitSolar',
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                number: customer.number,
                dob: customer.dob,
                propertyType: customer.propertyType,
                tariffCode: customer.tariffCode,
                discount: customer.discount,
                rateVersion: customer.rateVersion,
                previousCustomerUid: customer.uid,
                status: 1,
            };

            if (customer.address) {
                input.address = {
                    unitNumber: customer.address.unitNumber,
                    streetNumber: customer.address.streetNumber,
                    streetName: customer.address.streetName,
                    streetType: customer.address.streetType,
                    suburb: customer.address.suburb,
                    state: customer.address.state,
                    postcode: customer.address.postcode,
                    country: customer.address.country,
                    nmi: customer.address.nmi,
                };
            }

            if (customer.enrollmentDetails) {
                input.enrollmentDetails = {
                    saletype: customer.enrollmentDetails.saletype,
                    connectiondate: customer.enrollmentDetails.connectiondate,
                    idtype: customer.enrollmentDetails.idtype,
                    idnumber: customer.enrollmentDetails.idnumber,
                    idstate: customer.enrollmentDetails.idstate,
                    idcountry: customer.enrollmentDetails.idcountry,
                    idexpiry: customer.enrollmentDetails.idexpiry,
                    concession: customer.enrollmentDetails.concession,
                    lifesupport: customer.enrollmentDetails.lifesupport,
                    billingpreference: customer.enrollmentDetails.billingpreference,
                };
            }

            if (customer.vppDetails) {
                input.vppDetails = {
                    vpp: customer.vppDetails.vpp,
                    vppConnected: 0,
                    vppSignupBonus: customer.vppDetails.vppSignupBonus,
                };
            }

            if (customer.solarDetails) {
                input.solarDetails = {
                    hassolar: customer.solarDetails.hassolar,
                    solarcapacity: customer.solarDetails.solarcapacity,
                    invertercapacity: customer.solarDetails.invertercapacity,
                };
            }

            const { data } = await createCustomer({
                variables: { input }
            });

            if (data?.createCustomer?.uid) {
                await updateCustomer({
                    variables: {
                        uid: customer.uid,
                        input: { status: 4 }
                    }
                });

                toast.success('Customer frozen and new customer created successfully');
                refetchCustomer();
            }
        } catch (error: any) {
            console.error('Error freezing customer:', error);
            toast.error(error.message || 'Failed to freeze customer');
        } finally {
            setFreezingCustomer(false);
        }
    };

    const handleMarkNotInterested = async () => {
        if (!selectedCustomerDetails) return;
        setMarkingNotInterested(true);
        try {
            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input: { status: 5 }
                }
            });
            toast.success('Customer marked as Not Interested');
            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                status: 5
            });
        } catch (error: any) {
            console.error('Error marking customer as not interested:', error);
            toast.error(error.message || 'Failed to update customer status');
        } finally {
            setMarkingNotInterested(false);
            setNotInterestedModalOpen(false);
        }

    };



    const handleVppToggle = async (customerUid: string, newValue: boolean) => {
        if (!selectedCustomerDetails) return;

        if (newValue) {
            // Refresh details before opening modal to ensure battery details are up-to-date
            try {
                const { data } = await refetchSolarVpp();
                const latestDetails = data?.customer;

                setVppForm({
                    vppSignupBonus: latestDetails?.vppDetails?.vppSignupBonus?.toString() || selectedCustomerDetails?.vppDetails?.vppSignupBonus?.toString() || '',
                    batteryBrand: latestDetails?.batteryDetails?.batterybrand || selectedCustomerDetails?.batteryDetails?.batterybrand || '',
                    snNumber: latestDetails?.batteryDetails?.snnumber || selectedCustomerDetails?.batteryDetails?.snnumber || '',
                    batteryCapacity: latestDetails?.batteryDetails?.batterycapacity?.toString() || selectedCustomerDetails?.batteryDetails?.batterycapacity?.toString() || '',
                    exportLimit: latestDetails?.batteryDetails?.exportlimit?.toString() || selectedCustomerDetails?.batteryDetails?.exportlimit?.toString() || '',
                    inverterCapacity: latestDetails?.batteryDetails?.inverterCapacity?.toString() || selectedCustomerDetails?.batteryDetails?.inverterCapacity?.toString() || '',
                    checkCode: latestDetails?.batteryDetails?.checkCode || selectedCustomerDetails?.batteryDetails?.checkCode || ''
                });
            } catch (err) {
                console.error("Error refetching solar details for VPP toggle:", err);
                // Fallback to existing state if refetch fails
                setVppForm({
                    vppSignupBonus: selectedCustomerDetails?.vppDetails?.vppSignupBonus?.toString() || '',
                    batteryBrand: selectedCustomerDetails?.batteryDetails?.batterybrand || '',
                    snNumber: selectedCustomerDetails?.batteryDetails?.snnumber || '',
                    batteryCapacity: selectedCustomerDetails?.batteryDetails?.batterycapacity?.toString() || '',
                    exportLimit: selectedCustomerDetails?.batteryDetails?.exportlimit?.toString() || '',
                    inverterCapacity: selectedCustomerDetails?.batteryDetails?.inverterCapacity?.toString() || '',
                    checkCode: selectedCustomerDetails?.batteryDetails?.checkCode || ''
                });
            }
            setVppConnectModalOpen(true);
            return;
        }

        const previousValue = selectedCustomerDetails.vppDetails?.vppConnected;
        setSelectedCustomerDetails({
            ...selectedCustomerDetails,
            vppDetails: {
                ...selectedCustomerDetails.vppDetails,
                vppConnected: newValue ? 1 : 0
            }
        });


        try {


            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        vppDetails: {
                            vppConnected: newValue ? 1 : 0
                        },
                        skipStatusUpdate: true
                    }
                }
            });
            await refetchCustomer();
            toast.success(`VPP ${newValue ? 'connected' : 'disconnected'} successfully`);
        } catch (error: any) {
            console.error('Error updating VPP status:', error);
            toast.error(error.message || 'Failed to update VPP status');
            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                vppDetails: {
                    ...selectedCustomerDetails.vppDetails,
                    vppConnected: previousValue
                }
            });

        }
    };

    const handleConfirmVppConnect = async () => {
        if (!selectedCustomerDetails) return;

        try {
            // Priority: Sync with secondary API first
            try {
                await secondaryApiAxios.post('/api/v1/utilmate/user/add-user-battery', {
                    user_id: selectedCustomerDetails.customerId,
                    battery_brand: vppForm.batteryBrand,
                    battery_sn_number: vppForm.snNumber,
                    check_code: vppForm.checkCode,
                    battery_usable_capacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : 0,
                    inverter_capacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : 0
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. VPP not connected.');
            }

            const input: any = {
                vppDetails: {
                    vpp: 1,
                    vppConnected: 1,
                    vppSignupBonus: vppForm.vppSignupBonus ? parseFloat(vppForm.vppSignupBonus) : undefined,
                },
                batteryDetails: vppForm.batteryBrand ? {
                    batterybrand: vppForm.batteryBrand,
                    snnumber: vppForm.snNumber || undefined,
                    batterycapacity: vppForm.batteryCapacity ? parseFloat(vppForm.batteryCapacity) : undefined,
                    exportlimit: vppForm.exportLimit ? parseFloat(vppForm.exportLimit) : undefined,
                    inverterCapacity: vppForm.inverterCapacity ? parseFloat(vppForm.inverterCapacity) : undefined,
                    checkCode: vppForm.checkCode || undefined,
                } : undefined,
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input
                }
            });

            await refetchCustomer();
            toast.success('VPP Connected and details saved');
            setVppConnectModalOpen(false);

            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                vppDetails: {
                    ...selectedCustomerDetails.vppDetails,
                    vpp: 1,
                    vppConnected: 1,
                    vppSignupBonus: input.vppDetails.vppSignupBonus
                },
                batteryDetails: input.batteryDetails
            });

        } catch (error: any) {
            console.error('Error connecting VPP:', error);
            toast.error(error.message || 'Failed to connect VPP');
        }
    };

    const handleMsatToggle = async (customerUid: string, newValue: boolean) => {
        if (!selectedCustomerDetails) return;

        const previousValue = selectedCustomerDetails.msatDetails?.msatConnected;
        const now = new Date().toISOString();
        setSelectedCustomerDetails({
            ...selectedCustomerDetails,
            msatDetails: {
                ...selectedCustomerDetails.msatDetails,
                msatConnected: newValue ? 1 : 0,
                msatConnectedAt: newValue ? now : selectedCustomerDetails.msatDetails?.msatConnectedAt,
                msatUpdatedAt: now
            }
        });

        try {
            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        msatDetails: {
                            msatConnected: newValue ? 1 : 0,
                            msatConnectedAt: newValue ? now : undefined,
                            msatUpdatedAt: now
                        },
                        skipStatusUpdate: true
                    }
                }
            });
            toast.success(`MSAT ${newValue ? 'connected' : 'disconnected'} successfully`);
        } catch (error: any) {
            console.error('Error updating MSAT status:', error);
            toast.error(error.message || 'Failed to update MSAT status');
            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                msatDetails: {
                    ...selectedCustomerDetails.msatDetails,
                    msatConnected: previousValue
                }
            });
        }
    };

    const handleUtilmateToggle = async (customerUid: string, newValue: boolean) => {
        if (!selectedCustomerDetails) return;

        // if (newValue && selectedCustomerDetails.msatDetails?.msatConnected !== 1) {
        //     toast.error("Please connect to MSAT first before connecting to Utilmate.");
        //     return;
        // }

        if (newValue) {
            setUtilmateForm({
                siteIdentifier: selectedCustomerDetails?.utilmateDetails?.siteIdentifier || '',
                accountNumber: selectedCustomerDetails?.utilmateDetails?.accountNumber || '',
                utilmateConnected: 1,
                utilmateConnectedAt: selectedCustomerDetails?.utilmateDetails?.utilmateConnectedAt || ''
            });
            setUtilmateConnectModalOpen(true);
            return;
        }

        const previousValue = selectedCustomerDetails.utilmateDetails?.utilmateConnected;
        const now = new Date().toISOString();

        setSelectedCustomerDetails({
            ...selectedCustomerDetails,
            utilmateDetails: {
                ...selectedCustomerDetails.utilmateDetails,
                utilmateConnected: newValue ? 1 : 0,
                utilmateConnectedAt: newValue ? now : selectedCustomerDetails.utilmateDetails?.utilmateConnectedAt,
            }
        });

        setUtilmateForm(prev => ({
            ...prev,
            utilmateConnected: newValue ? 1 : 0,
            utilmateConnectedAt: newValue ? now : prev.utilmateConnectedAt
        }));


        try {


            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        utilmateStatus: newValue ? 1 : 0,
                        utilmateDetails: {
                            utilmateConnected: newValue ? 1 : 0,
                            utilmateConnectedAt: newValue ? now : undefined,
                        },
                        skipStatusUpdate: true
                    }
                }
            });
            toast.success(`Utilmate ${newValue ? 'connected' : 'disconnected'} successfully`);
        } catch (error: any) {
            console.error('Error updating Utilmate status:', error);
            toast.error(error.message || 'Failed to update Utilmate status');
            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                utilmateDetails: {
                    ...selectedCustomerDetails.utilmateDetails,
                    utilmateConnected: previousValue
                }
            });

            setUtilmateForm(prev => ({
                ...prev,
                utilmateConnected: previousValue || 0
            }));
        }

    };

    const handleConfirmUtilmateConnect = async () => {
        if (!selectedCustomerDetails) return;

        try {
            // Priority: Sync with secondary API first
            // try {
            //     await secondaryApiAxios.post('/api/v1/utilmate/user/add-user', {
            //         account_number: utilmateForm.accountNumber,
            //         site_identifier: utilmateForm.siteIdentifier,
            //         gee_id: selectedCustomerDetails.customerId || selectedCustomerDetails.uid,
            //         dnsp: (selectedCustomerDetails.ratePlan?.dnsp !== undefined && selectedCustomerDetails.ratePlan?.dnsp !== null) ? (DNSP_LABELS[selectedCustomerDetails.ratePlan.dnsp as keyof typeof DNSP_LABELS] || '') : '',
            //         nmi_number: selectedCustomerDetails.address?.nmi || ''
            //     });
            // } catch (secErr: any) {
            //     console.error('Failed to sync with secondary API', secErr);
            //     throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. Utilmate not connected.');
            // }

            const now = new Date().toISOString();
            const input: any = {
                utilmateStatus: 1,
                utilmateDetails: {
                    siteIdentifier: utilmateForm.siteIdentifier || undefined,
                    accountNumber: utilmateForm.accountNumber || undefined,
                    utilmateConnected: 1,
                    utilmateConnectedAt: now,
                },
                skipStatusUpdate: true
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input
                }
            });

            toast.success('Utilmate connected and details saved');
            setUtilmateConnectModalOpen(false);

            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                utilmateDetails: {
                    ...selectedCustomerDetails.utilmateDetails,
                    ...input.utilmateDetails
                }
            });

        } catch (error: any) {
            console.error('Error connecting Utilmate:', error);
            toast.error(error.message || 'Failed to connect Utilmate');
        }
    };

    const handleGenerateCredentials = async (customerId: string) => {
        setIsGeneratingCredentials(true);
        try {
            const response = await secondaryApiAxios.post(`/api/v1/utilmate/user/generate-credentials/${customerId}`);
            const password = response.data;

            toast.success('Credentials generated successfully');

            if (password && selectedCustomerDetails) {
                try {
                    const { data } = await sendCustomerCredentialsEmail({
                        variables: {
                            customerUid: selectedCustomerDetails.uid,
                            password
                        }
                    });
                    if (data?.sendCustomerCredentialsEmail?.success) {
                        toast.success('Credentials email sent successfully');
                    } else {
                        toast.error(data?.sendCustomerCredentialsEmail?.message || 'Failed to send credentials email');
                    }
                } catch (emailErr: any) {
                    console.error('Error sending credentials email:', emailErr);
                    toast.error('Credentials generated but email failed to send');
                }
            }
        } catch (error: any) {
            console.error('Error generating credentials:', error);
            const message = error.response?.data?.message || error.message || 'Failed to generate credentials';
            toast.error(message);
        } finally {
            setIsGeneratingCredentials(false);
        }
    };

    const handleCheckCreditScore = async (customerUid: string) => {
        if (!selectedCustomerDetails) return;
        setIsCheckingCreditScore(true);
        try {
            // Construct Equifax API Payload
            // const equifaxPayload = {
            //     "first-name": selectedCustomerDetails.firstName || '',
            //     "first-given-name": selectedCustomerDetails.lastName || '',
            //     "address": {
            //         "street-name": selectedCustomerDetails.address?.streetName || '',
            //         "street-type": selectedCustomerDetails.address?.streetType || '',
            //         "suburb": selectedCustomerDetails.address?.suburb || '',
            //         "state-code": selectedCustomerDetails.address?.state || ''
            //     },
            //     "license-number": selectedCustomerDetails.enrollmentDetails?.licenseNumber || '',
            //     "gender-code": selectedCustomerDetails.gender === 0 ? 'M' : (selectedCustomerDetails.gender === 1 ? 'F' : 'O'),
            //     "date-of-birth": selectedCustomerDetails.dob ? new Date(selectedCustomerDetails.dob).toISOString().split('T')[0] : '',
            //     "employer-name": selectedCustomerDetails.employerName || '',
            //     "account-type-code": "CC",
            //     "enquiry-amount": Number(selectedCustomerDetails.enquiryAmount) || 0,
            //     "relationship-code": String(selectedCustomerDetails.relationshipStatus || '1'),
            //     "client-reference": `${selectedCustomerDetails.customerId || selectedCustomerDetails.uid}-${Date.now()}`,
            //     "enquiry-client-reference": selectedCustomerDetails.number || ''
            // };

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
            const response = await secondaryApiAxios.post('/api/v1/equifax/user/get-credit-report', equifaxPayload);
            const score = response.data?.creditScoreData?.score?.score_masterscale || response.data?.creditScore;

            if (!score) {
                throw new Error('No credit score returned from Equifax');
            }

            console.log('Using dynamic credit score from Equifax:', score);

            // Look up matching risk status from the fetched lookup table
            let riskStatusUid: string | undefined = undefined;
            let matchedRiskStatus: any = null;
            if (score !== undefined && score !== null) {
                const scoreNum = parseInt(score.toString());
                matchedRiskStatus = riskStatuses.find((rs: any) => {
                    if (rs.scoreMin === null && rs.scoreMax === null) return false; // Skip "Pending"
                    const minOk = rs.scoreMin === null || scoreNum >= rs.scoreMin;
                    const maxOk = rs.scoreMax === null || scoreNum < rs.scoreMax;
                    return minOk && maxOk;
                });
                if (matchedRiskStatus) {
                    riskStatusUid = matchedRiskStatus.uid;
                }
            }

            // If API call succeeds, update backend status
            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        isCreditScoreFetched: 1,
                        creditScore: score ? parseInt(score.toString()) : undefined,
                        riskStatus: riskStatusUid
                    }
                }
            });
            setSelectedCustomerDetails({
                ...selectedCustomerDetails,
                isCreditScoreFetched: 1,
                creditScore: score ? parseInt(score.toString()) : undefined,
                riskStatus: riskStatusUid
            });
            toast.success('Credit score checked and updated');

            // --- Automation logic based on manualOffer flag ---
            if (matchedRiskStatus && matchedRiskStatus.manualOffer === 0) {
                // Auto-send offer (manualOffer = 0 means auto)
                setIsSendingOffer(true);
                try {
                    const result: any = await sendOfferEmail({
                        variables: { customerUid }
                    });

                    if (result.data?.sendOfferEmail?.success) {
                        const { data } = await refetchCustomer();

                        if (data?.customer) {
                            setSelectedCustomerDetails(data.customer);
                        }

                        if (data?.customer?.emailSent === 1 || data?.customer?.offerEmailSentAt || data?.customer?.status >= 2) {
                            toast.success('Offer email sent and status updated');
                        } else {
                            toast.success('Offer email sent');
                        }
                        // Add delay to ensure backend has processed the log
                        setTimeout(() => setEmailLogsKey((prev) => prev + 1), 1500);
                    } else {
                        toast.error(result.data?.sendOfferEmail?.message || 'Failed to send offer email');
                    }
                } catch (offerErr: any) {
                    console.error('Failed to send offer automatically:', offerErr);
                    toast.error(offerErr.message || 'Failed to send offer email');
                } finally {
                    setIsSendingOffer(false);
                }
            } else if (matchedRiskStatus && matchedRiskStatus.manualOffer === 1) {
                // Show manual send offer button (manualOffer = 1)
                setShowManualOfferButton(true);
            }
            // ----------------------------------------------

        } catch (error: any) {
            console.error('Error checking credit score:', error);
            toast.error(error.message || 'Failed to update credit score');
        } finally {
            setIsCheckingCreditScore(false);
            setIsSendingOffer(false);
        }
    };

    const handleManualSendOffer = async (customerUid: string) => {
        setIsSendingOffer(true);
        try {
            const result: any = await sendOfferEmail({
                variables: { customerUid }
            });
            if (result.data?.sendOfferEmail?.success) {
                toast.success('Offer email sent successfully');
                setTimeout(() => setEmailLogsKey((prev) => prev + 1), 1500);
                const { data } = await refetchCustomer();
                if (data?.customer) {
                    setSelectedCustomerDetails(data.customer);
                }
                setShowManualOfferButton(false);
                setIsSendingOffer(false);
            } else {
                toast.error(result.data?.sendOfferEmail?.message || 'Failed to send offer email');
                setIsSendingOffer(false);
            }
        } catch (error: any) {
            console.error('Error sending manual offer:', error);
            toast.error(error.message || 'Error sending offer email');
            setIsSendingOffer(false);
        } finally {
            // setIsSendingOffer(false); // Removed from finally block
        }
    };

    const handleSendReminder = async (customerUid: string) => {
        setSendingReminder(true);
        try {
            const { data } = await sendReminderEmail({
                variables: { customerUid }
            });

            if (data?.sendReminderEmail?.success) {
                toast.success(data.sendReminderEmail.message || 'Reminder sent successfully');
                setReminderSent(true);
                setTimeout(() => setEmailLogsKey((prev) => prev + 1), 1500);

                // Refetch customer to get updated status (Signature Pending)
                const { data: updatedData } = await refetchCustomer();
                if (updatedData?.customer) {
                    setSelectedCustomerDetails(updatedData.customer);
                }
            } else {
                toast.error(data?.sendReminderEmail?.message || 'Failed to send reminder');
            }
        } catch (error: any) {
            console.error('Error sending reminder:', error);
            toast.error(error.message || 'Failed to send reminder');
        } finally {
            setSendingReminder(false);
        }
    };

    const handleSendCertificateEmail = async () => {
        if (!uid) {
            toast.error('Customer ID not found.');
            return;
        }

        try {
            setIsEmailSending(true);
            await apiAxios.post(`/vpp-certificate/send/${uid}`);
            toast.success('VPP Certificate sent to customer!');
            // Update local state to reflect email sent using functional update
            setSelectedCustomerDetails(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    vppCertificateDetails: {
                        ...prev.vppCertificateDetails,
                        isAllRequiredFilled: prev.vppCertificateDetails?.isAllRequiredFilled ?? 0,
                        isVppCertificateEmailSent: 1,
                        isVppCertificateEmailSentAt: new Date().toISOString(),
                    }
                };
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            toast.error('Email sending failed.');
        } finally {
            setIsEmailSending(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm animate-in slide-in-from-top-4 duration-500 overflow-hidden">
                {/* Profile Header Section */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                <UserIcon size={30} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-1">
                                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                                            {selectedCustomerDetails ? `${selectedCustomerDetails.title ? selectedCustomerDetails.title + ' ' : ''}${selectedCustomerDetails.firstName} ${selectedCustomerDetails.lastName}` : 'Customer Details'}
                                        </h1>
                                        {selectedCustomerDetails && (
                                            <StatusField
                                                value={selectedCustomerDetails.status}
                                                type="customer_status"
                                                mode="badge"
                                                onChange={async (newStatus: any) => {
                                                    try {
                                                        await updateCustomer({
                                                            variables: {
                                                                uid: selectedCustomerDetails.uid,
                                                                input: { status: Number(newStatus) }
                                                            }
                                                        });
                                                        toast.success('Status updated');
                                                        setSelectedCustomerDetails({ ...selectedCustomerDetails, status: Number(newStatus) });
                                                    } catch (error) {
                                                        toast.error('Failed to update status');
                                                    }
                                                }}
                                            />
                                        )}
                                        {selectedCustomerDetails?.riskStatus !== undefined && selectedCustomerDetails.riskStatus !== null && (
                                            <StatusField
                                                value={selectedCustomerDetails.riskStatus}
                                                type="risk_status"
                                                mode="badge"
                                                riskStatuses={riskStatuses}
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs">Customer ID: </span>
                                        {selectedCustomerDetails?.customerId ? `${selectedCustomerDetails.customerId}` : "View and manage customer details"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <Tooltip content={`Send email to ${selectedCustomerDetails?.email}`} position="bottom">
                                        <a
                                            href={`mailto:${selectedCustomerDetails?.email}`}
                                            className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-primary transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <MailIcon size={14} />
                                            </div>
                                            <span className="font-medium">{selectedCustomerDetails?.email || '-'}</span>
                                        </a>
                                    </Tooltip>

                                    <Tooltip content={`Call ${selectedCustomerDetails?.number}`} position="bottom">
                                        <a
                                            href={`tel:${selectedCustomerDetails?.number}`}
                                            className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-primary transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <PhoneIcon size={14} />
                                            </div>
                                            <span className="font-medium">{selectedCustomerDetails?.number || '-'}</span>
                                        </a>
                                    </Tooltip>

                                    <Tooltip content="View on Google Maps" position="bottom">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCustomerDetails?.address?.fullAddress || '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 text-sm text-foreground/80 hover:text-primary transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <MapPinIcon size={14} />
                                            </div>
                                            <span className="font-medium truncate max-w-[350px]">
                                                {selectedCustomerDetails?.address?.fullAddress || '-'}
                                            </span>
                                        </a>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                            <Button variant="outline" onClick={() => navigate('/customers')} className="h-9 px-3 text-sm">
                                <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                                Back
                            </Button>
                            {canEdit && selectedCustomerDetails && !selectedCustomerDetails.isDeleted &&
                                //  selectedCustomerDetails.status !== 3 &&
                                (
                                    <Button onClick={() => navigate(`/customers/${uid}/edit`)} variant="outline" className="h-9 px-3 text-sm">
                                        <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                )}
                            {selectedCustomerDetails && !selectedCustomerDetails.isDeleted && (
                                (() => {
                                    const hasPreview = true;
                                    const hasNotInterested = selectedCustomerDetails.status !== 5;
                                    const hasFreeze = selectedCustomerDetails.status === 3;
                                    const hasActions = hasPreview || hasNotInterested || hasFreeze;
                                    if (!hasActions) return null;
                                    return (
                                        <Popover
                                            trigger={
                                                <Button variant="outline" className="h-9 w-9 p-0 flex items-center justify-center">
                                                    <MoreHorizontalIcon size={16} />
                                                </Button>
                                            }
                                            content={
                                                <div className="py-1.5 min-w-[200px]">
                                                    <button
                                                        onClick={() => {
                                                            handlePreviewOffer(selectedCustomerDetails.uid);
                                                        }}
                                                        disabled={isLoadingPreview}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                                                    >
                                                        <EyeIcon size={15} className="text-muted-foreground" />
                                                        {isLoadingPreview ? 'Loading...' : (selectedCustomerDetails.status > 2 ? 'View Signed Agreement' : 'Preview Offer')}
                                                    </button>
                                                    {hasNotInterested && (
                                                        <button
                                                            onClick={() => {
                                                                setNotInterestedModalOpen(true);
                                                                setActionsMenuOpen(false);
                                                            }}
                                                            disabled={markingNotInterested}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                                        >
                                                            <XIcon size={15} />
                                                            {markingNotInterested ? 'Updating...' : 'Not Interested'}
                                                        </button>
                                                    )}
                                                    {hasFreeze && (
                                                        <>
                                                            <div className="my-1 border-t border-border" />
                                                            <button
                                                                onClick={() => {
                                                                    handleFreezeClick();
                                                                }}
                                                                disabled={freezingCustomer}
                                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                                                            >
                                                                <LockIcon size={15} className="text-slate-500" />
                                                                {freezingCustomer ? 'Freezing...' : 'Freeze'}
                                                            </button>
                                                        </>
                                                    )}
                                                    {!selectedCustomerDetails.signedPdfPath && (
                                                        <>
                                                            <div className="my-1 border-t border-border" />
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteCustomer();
                                                                }}
                                                                disabled={isDeletingCustomer}
                                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                                            >
                                                                <TrashIcon size={15} />
                                                                {isDeletingCustomer ? 'Archiving...' : 'Archive'}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteCustomer(true);
                                                                }}
                                                                disabled={isDeletingCustomer}
                                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 font-semibold"
                                                            >
                                                                <TrashIcon size={15} className="text-red-600" />
                                                                {isDeletingCustomer ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            }
                                            isOpen={actionsMenuOpen}
                                            onOpenChange={setActionsMenuOpen}
                                            placement="bottom-end"
                                            showArrow={false}
                                        />
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Timeline Section (Integrated) */}
                {selectedCustomerDetails && (
                    <div className="px-6 pb-6 pt-0">
                        <div className="">
                            <div className="relative flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0">
                                {/* Vertical connector line for mobile - hidden on md+ */}
                                <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 md:hidden z-0" />

                                {[
                                    ...(selectedCustomerDetails.checkCreditScore === 1 ? [
                                        { label: 'Credit score', date: null, completed: selectedCustomerDetails.isCreditScoreFetched === 1, step: 0 },
                                    ] : []),
                                    { label: 'Offer sent', date: selectedCustomerDetails.offerEmailSentAt, completed: !!selectedCustomerDetails.offerEmailSentAt || selectedCustomerDetails.emailSent === 1, step: 1, isLoading: isSendingOffer },
                                    { label: 'Signed by customer', date: selectedCustomerDetails.signDate, completed: !!selectedCustomerDetails.signDate && selectedCustomerDetails.status > 2, showReminder: !!selectedCustomerDetails.offerEmailSentAt, step: 2 },
                                    ...(selectedCustomerDetails.vppDetails?.vpp === 1 ? [
                                        {
                                            label: 'Push to Gsync',
                                            // label: 'VPP connect',
                                            date: null,
                                            completed: selectedCustomerDetails.vppDetails?.vppConnected === 1,
                                            showToggle: true,
                                            disabled: selectedCustomerDetails.status < 3
                                            //  || selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0
                                            ,
                                            // disabledReason: selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0 ? "VPP certificate fields are required" : undefined,
                                            step: 3
                                        },
                                        {
                                            label: 'Vpp Certificate',
                                            date: null,
                                            completed: selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 1 && selectedCustomerDetails.vppCertificateDetails?.isVppCertificateEmailSent === 1,
                                            showToggle: false,
                                            showSendCertificate: selectedCustomerDetails.vppCertificateDetails?.isVppCertificateEmailSent !== 1,
                                            disabled: selectedCustomerDetails.vppDetails?.vppConnected === 0
                                            //  || selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0
                                            ,
                                            // disabledReason: selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0 ? "VPP certificate fields are required" : undefined,
                                            step: 3
                                        },
                                    ] : []),
                                    { label: 'Connected to MSAT', date: null, completed: selectedCustomerDetails.msatDetails?.msatConnected === 1, showToggle: true, disabled: !selectedCustomerDetails.signDate || (selectedCustomerDetails.vppDetails?.vpp === 1 && selectedCustomerDetails.vppDetails?.vppConnected !== 1), step: 4 },
                                    { label: 'Utilmate Connect', date: null, completed: selectedCustomerDetails.utilmateDetails?.utilmateConnected === 1, showToggle: true, disabled: false, step: 5 },
                                ].map((item: any, index) => (
                                    <div key={index} className="relative flex flex-row md:flex-col items-start md:items-center gap-3 md:gap-0 md:flex-1 w-full md:w-auto">
                                        {/* Horizontal connector line for desktop */}
                                        {index > 0 && (
                                            <div className={`hidden md:block absolute top-[14px] h-0.5 ${item.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ right: '50%', left: '-50%' }} />
                                        )}

                                        {/* Circle */}
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-background border-2 z-10 shrink-0 ${item.completed ? 'border-green-500 text-green-500' : item.isLoading ? 'border-primary text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                                            {item.isLoading ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : item.completed ? (
                                                <CheckIcon size={12} strokeWidth={3} />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <div className="flex flex-col md:items-center w-full min-w-0">
                                            <div className="flex items-center gap-1 md:mt-1.5 justify-start md:justify-center z-30 relative">
                                                <span className={`text-[11px] font-medium leading-tight ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                                                {item.step === 4 && (
                                                    <Tooltip
                                                        position="bottom"
                                                        className="whitespace-normal min-w-[220px] p-0 overflow-hidden bg-white dark:bg-neutral-900 border border-border shadow-xl text-foreground"
                                                        content={
                                                            <div className="flex flex-col text-[10px]">
                                                                <div className="px-3 py-1.5 bg-muted/50 border-b border-border flex items-center gap-2">
                                                                    <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                    </div>
                                                                    <span className="font-semibold text-[11px]">MSAT Details</span>
                                                                </div>
                                                                <div className="p-2 space-y-1">
                                                                    <div className="flex justify-between gap-4">
                                                                        <span className="text-muted-foreground">Status:</span>
                                                                        <span className={selectedCustomerDetails.msatDetails?.msatConnected === 1 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                                                            {selectedCustomerDetails.msatDetails?.msatConnected === 1 ? 'Connected' : 'Not Connected'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-4">
                                                                        <span className="text-muted-foreground">Connected:</span>
                                                                        <span>{selectedCustomerDetails.msatDetails?.msatConnectedAt ? formatSydneyTime(selectedCustomerDetails.msatDetails.msatConnectedAt) : '—'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-4">
                                                                        <span className="text-muted-foreground">Updated:</span>
                                                                        <span>{selectedCustomerDetails.msatDetails?.msatUpdatedAt ? formatSydneyTime(selectedCustomerDetails.msatDetails.msatUpdatedAt) : '—'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    >
                                                        <div className="cursor-help text-muted-foreground hover:text-foreground transition-colors p-0.5">
                                                            <InfoIcon size={12} />
                                                        </div>
                                                    </Tooltip>
                                                )}
                                            </div>
                                            {item.date && <span className="text-[9px] text-muted-foreground md:mt-0.5">{formatSydneyTime(item.date)}</span>}

                                            {item.showReminder && !selectedCustomerDetails.signDate && (
                                                <button
                                                    onClick={() => handleSendReminder(selectedCustomerDetails.uid)}
                                                    disabled={sendingReminder || reminderSent || selectedCustomerDetails.isDeleted}
                                                    className={`flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-md mt-1 relative z-30 ${reminderSent ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${sendingReminder || selectedCustomerDetails.isDeleted ? 'opacity-70' : ''}`}
                                                >
                                                    {sendingReminder ? (
                                                        <><div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                    ) : reminderSent ? (
                                                        <><CheckIcon size={9} />Sent</>
                                                    ) : (
                                                        <><MailIcon size={9} />Send reminder</>
                                                    )}
                                                </button>
                                            )}

                                            {item.showSendCertificate && selectedCustomerDetails.vppDetails?.vppConnected === 1 && (
                                                <div className="inline-block relative group">
                                                    <button
                                                        onClick={selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0 ? undefined : () => handleSendCertificateEmail()}
                                                        disabled={isEmailSending || selectedCustomerDetails.isDeleted || selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0}
                                                        className={`flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-md mt-1 relative z-30 ${selectedCustomerDetails.vppCertificateDetails?.isVppCertificateEmailSent === 1 ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'} ${(isEmailSending || selectedCustomerDetails.isDeleted || selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                                                    >
                                                        {isEmailSending ? (
                                                            <><div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                        ) : (
                                                            <><MailIcon size={9} />Send certificate</>
                                                        )}
                                                    </button>
                                                    {selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0 && (
                                                        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 hidden group-hover:block z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                                            Required to fill VPP certificate pending data
                                                            <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-t-[5px] border-t-gray-800 border-r-[5px] border-r-transparent"></span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {item.step === 0 && item.completed && selectedCustomerDetails.creditScore !== undefined && (
                                                <div className="flex items-center mt-1">
                                                    {(() => {
                                                        const match = riskStatuses.find((rs: any) => rs.uid === selectedCustomerDetails.riskStatus);
                                                        const hex = match?.color || '#64748B';
                                                        const label = match?.name || 'N/A';
                                                        return (
                                                            <div
                                                                className="inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold"
                                                                style={{
                                                                    backgroundColor: `${hex}1A`,
                                                                    borderColor: `${hex}33`,
                                                                    color: hex
                                                                }}
                                                            >
                                                                <span
                                                                    className="w-1 h-1 rounded-full mr-1 shrink-0"
                                                                    style={{ backgroundColor: hex }}
                                                                />
                                                                Score: {selectedCustomerDetails.creditScore} • {label}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            {item.step === 0 && !item.completed && (
                                                <button
                                                    onClick={() => handleCheckCreditScore(selectedCustomerDetails.uid)}
                                                    disabled={isCheckingCreditScore || selectedCustomerDetails.isDeleted}
                                                    className={`flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-md mt-1 relative z-30 bg-primary text-primary-foreground hover:bg-primary/90 ${isCheckingCreditScore || selectedCustomerDetails.isDeleted ? 'opacity-70' : ''}`}
                                                >
                                                    {isCheckingCreditScore ? (
                                                        <><div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Checking...</>
                                                    ) : (
                                                        <><ZapIcon size={9} />Check credit score</>
                                                    )}
                                                </button>
                                            )}

                                            {item.step === 0 && (showManualOfferButton || (selectedCustomerDetails.isCreditScoreFetched === 1 && selectedCustomerDetails.riskStatus !== undefined && (riskStatuses.find((rs: any) => rs.uid === selectedCustomerDetails.riskStatus)?.manualOffer === 1))) && !selectedCustomerDetails.offerEmailSentAt && (
                                                <button
                                                    onClick={() => handleManualSendOffer(selectedCustomerDetails.uid)}
                                                    disabled={isSendingOffer || selectedCustomerDetails.isDeleted}
                                                    className={`flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-md mt-1 relative z-30 bg-primary text-primary-foreground hover:bg-primary/90 ${isSendingOffer || selectedCustomerDetails.isDeleted ? 'opacity-70' : ''}`}
                                                >
                                                    {isSendingOffer ? (
                                                        <><div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                    ) : (
                                                        <><MailIcon size={9} />Send Offer</>
                                                    )}
                                                </button>
                                            )}


                                            {item.showToggle && (() => {
                                                const toggleComponent = (
                                                    <ConfirmationPopover
                                                        title="Disconnect?"
                                                        description="Are you sure you want to disconnect this service?"
                                                        enabled={item.completed}
                                                        onConfirm={() => {
                                                            if (item.step === 3) handleVppToggle(selectedCustomerDetails.uid, false);
                                                            else if (item.step === 4) handleMsatToggle(selectedCustomerDetails.uid, false);
                                                            else if (item.step === 5) handleUtilmateToggle(selectedCustomerDetails.uid, false);
                                                        }}
                                                    >
                                                        <div className="scale-75 origin-left md:origin-center">
                                                            <ToggleSwitch
                                                                checked={item.completed}
                                                                disabled={item.disabled || selectedCustomerDetails.isDeleted}
                                                                onChange={(val) => {
                                                                    if (val) {
                                                                        if (item.step === 3) handleVppToggle(selectedCustomerDetails.uid, true);
                                                                        else if (item.step === 4) handleMsatToggle(selectedCustomerDetails.uid, true);
                                                                        else if (item.step === 5) handleUtilmateToggle(selectedCustomerDetails.uid, true);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </ConfirmationPopover>
                                                );

                                                return (
                                                    <div className="mt-1 relative z-30 flex items-center h-6">
                                                        {item.disabledReason ? (
                                                            <Tooltip content={item.disabledReason} position="bottom">
                                                                <div className="cursor-not-allowed">
                                                                    <div className="pointer-events-none">
                                                                        {toggleComponent}
                                                                    </div>
                                                                </div>
                                                            </Tooltip>
                                                        ) : (
                                                            toggleComponent
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                            {item.step === 5 && item.completed && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-1 h-6 text-[9px] px-2 relative z-30 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 transition-colors"
                                                    disabled={isGeneratingCredentials || selectedCustomerDetails.isDeleted}
                                                    onClick={() => selectedCustomerDetails.customerId && handleGenerateCredentials(selectedCustomerDetails.customerId)}

                                                >
                                                    {isGeneratingCredentials ? (
                                                        <>
                                                            <div className="w-2.5 h-2.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-1" />
                                                            Gen...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IdCardIcon size={10} className="mr-1 text-emerald-500" />
                                                            Credentials
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading customer details...</p>
                </div>
            ) : selectedCustomerDetails ? (
                <div className="space-y-6">

                    {/* Horizontal Tabs Layout */}
                    <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-[600px]">
                        {/* Tab Navigation */}
                        <div className="border-b border-border bg-muted/30 flex items-center px-2 gap-1">
                            {(() => {

                                const allTabs = [
                                    { id: 'general', label: 'General', icon: Settings2Icon },
                                    { id: 'rates', label: 'Rates', icon: PercentIcon },
                                    ...(selectedCustomerDetails.vppDetails?.vpp === 1 ? [{
                                        id: 'vpp_certificate',
                                        label: 'Vpp Certificate',
                                        icon: FileTextIcon,
                                        highlight: selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0,
                                        tooltip: selectedCustomerDetails.vppCertificateDetails?.isAllRequiredFilled === 0 ? "VPP certificate fields are required" : undefined
                                    }] : []),
                                    { id: 'debit', label: 'Debit', icon: CreditCardIcon },
                                    { id: 'utilmate', label: 'Utilmate', icon: PlugIcon },
                                    {
                                        id: 'documents', label: 'Documents', icon: UploadIcon, badge: [
                                            { doc: selectedCustomerDetails.previousBill, show: true },
                                            { doc: selectedCustomerDetails.identityProof, show: selectedCustomerDetails.enrollmentDetails?.idtype !== 0 },
                                            { doc: selectedCustomerDetails.licenseDocument, show: selectedCustomerDetails.enrollmentDetails?.idtype === 0 },
                                            { doc: selectedCustomerDetails.additionalDocument, show: !!selectedCustomerDetails.additionalDocument },
                                            ...(selectedCustomerDetails?.documents?.filter(d =>
                                                d.uid !== selectedCustomerDetails?.previousBill?.uid &&
                                                d.uid !== selectedCustomerDetails?.identityProof?.uid &&
                                                d.uid !== selectedCustomerDetails?.licenseDocument?.uid &&
                                                d.uid !== selectedCustomerDetails?.additionalDocument?.uid &&
                                                (d.documentType?.category === '0' || d.documentType?.category === '1' || (!d.documentType?.category && d.type !== '2'))
                                            ).map(d => ({ doc: d, show: true })) || [])
                                        ].filter(item => item.show).length
                                    },
                                    { id: 'electricity_bills', label: 'Electricity Bills', icon: ZapIcon, badge: selectedCustomerDetails.documents?.filter(d => d.documentType?.category === '2' || d.type === '2').length },
                                    { id: 'notes', label: 'Notes', icon: FileTextIcon, badge: notesData?.customerNotes?.length },
                                    { id: 'email_logs', label: 'Email Logs', icon: MailIcon },
                                    { id: 'activity_log', label: 'Activity Log', icon: ActivityIcon },
                                    { id: 'maintenance', label: 'Maintenance', icon: RefreshCwIcon }
                                ].filter(item => {
                                    if (item.id === 'vpp_certificate') {
                                        const hasSolar = selectedCustomerDetails.solarDetails?.hassolar === 1;
                                        const isVpp = selectedCustomerDetails.vppDetails?.vpp === 1;
                                        return hasSolar || isVpp;
                                    }
                                    if (item.id === 'debit') {
                                        return !!selectedCustomerDetails.debitDetails && selectedCustomerDetails.debitDetails.optIn === 1;
                                    }
                                    if (item.id === 'utilmate') {
                                        return !!selectedCustomerDetails.utilmateDetails && selectedCustomerDetails.utilmateDetails.utilmateConnected === 1;
                                    }
                                    if (item.id === 'email_logs') {
                                        // Show email logs ONLY if there are any logs (count > 0)
                                        return (selectedCustomerDetails.emailLogCount || 0) > 0;
                                    }
                                    return true;
                                });

                                let primaryTabs = allTabs.slice(0, maxVisibleTabs);
                                let overflowTabs = allTabs.slice(maxVisibleTabs);
                                const isOverflowActive = overflowTabs.some(t => t.id === selectedDetailSection);

                                // If the selected tab is in the overflow, swap it with the last visible tab
                                if (isOverflowActive && primaryTabs.length > 0) {
                                    const selectedTabIndex = overflowTabs.findIndex(t => t.id === selectedDetailSection);
                                    if (selectedTabIndex !== -1) {
                                        const selectedTab = overflowTabs[selectedTabIndex];
                                        const lastPrimaryTab = primaryTabs[primaryTabs.length - 1];

                                        // create new arrays
                                        primaryTabs = [...primaryTabs.slice(0, primaryTabs.length - 1), selectedTab];
                                        overflowTabs = [...overflowTabs];
                                        overflowTabs[selectedTabIndex] = lastPrimaryTab;
                                    }
                                }

                                return (
                                    <>
                                        {primaryTabs.map((item: any) => {
                                            const tabButton = (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.id === 'email_logs' && selectedDetailSection === 'email_logs') {
                                                            setEmailLogsKey((prev) => prev + 1);
                                                        }
                                                        setSelectedDetailSection(item.id as any);
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 whitespace-nowrap outline-none",
                                                        selectedDetailSection === item.id
                                                            ? "border-primary bg-background text-primary"
                                                            : item.highlight
                                                                ? "border-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600"
                                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                    )}
                                                    title={!item.tooltip ? item.label : undefined}
                                                >
                                                    <item.icon className={cn("w-4 h-4", item.highlight && selectedDetailSection !== item.id ? "text-red-500" : "")} />
                                                    <span className="hidden sm:inline">{item.label}</span>
                                                    {item.highlight && (
                                                        <span className="ml-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 shadow-sm animate-in fade-in zoom-in duration-300">
                                                            <span className="relative flex h-1.5 w-1.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                                            </span>
                                                            Pending
                                                        </span>
                                                    )}
                                                    {item.badge !== undefined && item.badge > 0 && (
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-bold",
                                                            selectedDetailSection === item.id
                                                                ? "bg-primary/10 text-primary"
                                                                : item.highlight ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-muted text-muted-foreground"
                                                        )}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                            return item.tooltip ? (
                                                <Tooltip key={item.id} content={item.tooltip} position="bottom">
                                                    {tabButton}
                                                </Tooltip>
                                            ) : (
                                                tabButton
                                            );
                                        })}

                                        {overflowTabs.length > 0 && (
                                            <Popover
                                                trigger={
                                                    <button
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors duration-200 border-b-2 whitespace-nowrap outline-none ml-auto",
                                                            overflowTabs.some(t => t.id === selectedDetailSection)
                                                                ? "border-primary bg-background text-primary"
                                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        <MoreHorizontalIcon size={18} />
                                                        {overflowTabs.some(t => t.id === selectedDetailSection) && (
                                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                                                {overflowTabs.find(t => t.id === selectedDetailSection)?.label}
                                                            </span>
                                                        )}
                                                    </button>
                                                }
                                                content={
                                                    <div className="py-1 min-w-[200px]">
                                                        {overflowTabs.map((item: any) => {
                                                            const overflowBtn = (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => {
                                                                        setSelectedDetailSection(item.id as any);
                                                                        setOverflowOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left",
                                                                        selectedDetailSection === item.id
                                                                            ? "bg-primary/10 text-primary font-medium"
                                                                            : item.highlight
                                                                                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                                : "text-foreground hover:bg-muted/70"
                                                                    )}
                                                                >
                                                                    <item.icon className={cn("w-4 h-4 shrink-0", item.highlight && selectedDetailSection !== item.id ? "text-red-500" : "")} />
                                                                    <span>{item.label}</span>
                                                                    {item.highlight && (
                                                                        <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 shadow-sm">
                                                                            <span className="relative flex h-1.5 w-1.5">
                                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                                                            </span>
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                    {item.badge !== undefined && item.badge > 0 && (
                                                                        <span className={cn(
                                                                            "ml-auto px-1.5 py-0.5 rounded-full text-[10px]",
                                                                            item.highlight && selectedDetailSection !== item.id ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-muted"
                                                                        )}>
                                                                            {item.badge}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                            return item.tooltip ? (
                                                                <Tooltip key={item.id} content={item.tooltip} position="right">
                                                                    {overflowBtn}
                                                                </Tooltip>
                                                            ) : (
                                                                overflowBtn
                                                            );
                                                        })}
                                                    </div>
                                                }
                                                isOpen={overflowOpen}
                                                onOpenChange={setOverflowOpen}
                                                placement="bottom-end"
                                                showArrow={false}
                                            />
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto relative">
                            {isTabLoading && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] animate-in fade-in duration-300">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm font-medium text-muted-foreground">Fetching details...</p>
                                    </div>
                                </div>
                            )}

                            {selectedDetailSection === 'general' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                <Settings2Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">General Details</h3>
                                                <p className="text-xs text-muted-foreground">NMI, connection & enrollment</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property & Connection */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">NMI</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.nmi || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Property Type</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.businessName ? 'Commercial' : 'Residential'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Connection Date</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.enrollmentDetails?.connectiondate
                                                    ? formatSydneyTime(selectedCustomerDetails.enrollmentDetails.connectiondate)
                                                    : '-'}
                                            </p>
                                        </div>
                                        {selectedCustomerDetails.businessName && (
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">Business</label>
                                                <p className="font-medium">{selectedCustomerDetails.businessName}</p>
                                            </div>
                                        )}
                                        {selectedCustomerDetails.abn && (
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">ABN</label>
                                                <p className="font-medium">{selectedCustomerDetails.abn}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Personal Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Birth Date</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.dob ? formatSydneyTime(selectedCustomerDetails.dob) : '-'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Sale Type</label>
                                            <p className="font-medium">
                                                {SALE_TYPE_LABELS[selectedCustomerDetails.enrollmentDetails?.saletype as keyof typeof SALE_TYPE_LABELS] || 'Unknown'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Billing Preference</label>
                                            <p className="font-medium">
                                                {BILLING_PREF_LABELS[selectedCustomerDetails.enrollmentDetails?.billingpreference as keyof typeof BILLING_PREF_LABELS] || 'Unknown'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Life Support</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.enrollmentDetails?.lifesupport ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Concession</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.enrollmentDetails?.concession ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Identification / Driver's License */}
                                    {selectedCustomerDetails.enrollmentDetails?.idtype === 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">License Number</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.licenseNumber || '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">License State</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.licenseState || '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">License Expiry</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.licenseExpiry ? formatSydneyTime(selectedCustomerDetails.enrollmentDetails.licenseExpiry) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">ID Type</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.idtype !== undefined && selectedCustomerDetails.enrollmentDetails?.idtype !== null
                                                        ? ID_TYPE_MAP[selectedCustomerDetails.enrollmentDetails.idtype] || '-'
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">ID Number</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.idnumber || '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">ID Expiry</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enrollmentDetails?.idexpiry ? formatSydneyTime(selectedCustomerDetails.enrollmentDetails.idexpiry) : '-'}
                                                </p>
                                            </div>
                                            {selectedCustomerDetails.enrollmentDetails?.idtype === 2 ? (
                                                <div className="space-y-1">
                                                    <label className="text-xs text-muted-foreground uppercase font-semibold">ID Country</label>
                                                    <p className="font-medium">
                                                        {selectedCustomerDetails.enrollmentDetails?.idcountry
                                                            ? getName(selectedCustomerDetails.enrollmentDetails.idcountry) || selectedCustomerDetails.enrollmentDetails.idcountry
                                                            : '-'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <label className="text-xs text-muted-foreground uppercase font-semibold">ID State</label>
                                                    <p className="font-medium">
                                                        {selectedCustomerDetails.enrollmentDetails?.idstate || '-'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Credit Assessment (only when credit check was done) */}
                                    {selectedCustomerDetails.checkCreditScore === 1 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">Gender</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.gender !== undefined && selectedCustomerDetails.gender !== null
                                                        ? GENDER_LABELS[selectedCustomerDetails.gender as number] || '-'
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">Relationship Status</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.relationshipStatus !== undefined && selectedCustomerDetails.relationshipStatus !== null
                                                        ? RELATIONSHIP_STATUS_LABELS[selectedCustomerDetails.relationshipStatus as number] || '-'
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">Employer Name</label>
                                                <p className="font-medium">{selectedCustomerDetails.employerName || '-'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-muted-foreground uppercase font-semibold">Enquiry Amount</label>
                                                <p className="font-medium">
                                                    {selectedCustomerDetails.enquiryAmount ? `$${selectedCustomerDetails.enquiryAmount}` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedDetailSection === 'rates' && selectedCustomerDetails.ratePlan && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                                <ZapIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Rate Plan Details</h3>
                                                <p className="text-xs text-muted-foreground">Energy rate plan & offers</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg">DNSP: {DNSP_LABELS[selectedCustomerDetails.ratePlan.dnsp as keyof typeof DNSP_LABELS] || 'Unknown'}</span>
                                            {selectedCustomerDetails.rateVersion && (
                                                <div className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg flex items-center gap-1">
                                                    <span>Ver:</span>
                                                    <RateVersionTooltip version={String(selectedCustomerDetails.rateVersion)}>
                                                        <span className="underline decoration-dotted decoration-blue-700/50 dark:decoration-blue-400/50">{selectedCustomerDetails.rateVersion}</span>
                                                    </RateVersionTooltip>
                                                </div>
                                            )}
                                            {Number(selectedCustomerDetails.discount || 0) > 0 && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg">
                                                    {selectedCustomerDetails.discount}% Discount
                                                </span>
                                            )}
                                            {selectedCustomerDetails.vppDetails?.vpp === 1 && <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">VPP Active</span>}
                                        </div>
                                    </div>

                                    {selectedCustomerDetails.ratePlan.offers && selectedCustomerDetails.ratePlan.offers.length > 0 ? (
                                        <div className="space-y-6">
                                            {selectedCustomerDetails.ratePlan.offers.map((offer: any, idx) => {
                                                const discount = selectedCustomerDetails.discount ?? 0;
                                                const parsedPriceUnits: Record<string, string> = typeof offer.priceUnits === 'string'
                                                    ? (() => { try { return JSON.parse(offer.priceUnits); } catch { return {}; } })()
                                                    : (offer.priceUnits || {});

                                                const parsedDynamicRates = typeof offer.dynamicRates === 'string'
                                                    ? (() => { try { return JSON.parse(offer.dynamicRates); } catch { return []; } })()
                                                    : (offer.dynamicRates || []);

                                                const hasCL = (offer.cl1Usage || 0) > 0 || (offer.cl2Usage || 0) > 0 || (offer.cl1Supply || 0) > 0 || (offer.cl2Supply || 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'controlled_load');
                                                const hasFiT = (offer.fit || 0) > 0 || (offer.fitPeak || 0) > 0 || (offer.fitCritical || 0) > 0 || (offer.fitVpp || 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'fit' || r.type === 'extra_fit' || r.type === 'solar_fit');

                                                const formatUnit = (key: string, fallback: string) => {
                                                    const unitUid = parsedPriceUnits[key];
                                                    const unit = unitUid ? (unitMap[unitUid] || fallback) : fallback;
                                                    return unit ? `/${unit}` : '';
                                                };

                                                return (
                                                    <div key={offer.uid || idx} className="space-y-4">
                                                        <div className="flex flex-wrap gap-8">
                                                            {/* Column 1: Energy Rates */}
                                                            <div className="space-y-4 min-w-[180px] flex-1">
                                                                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                                                                    <Settings2Icon size={16} />
                                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Energy Rates</h4>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {[
                                                                        { label: 'Peak', value: offer.peak, type: 'peak' },
                                                                        { label: 'Off-Peak', value: offer.offPeak, type: 'offPeak' },
                                                                        { label: 'Shoulder', value: offer.shoulder, type: 'shoulder' },
                                                                        { label: 'Anytime', value: offer.anytime, type: 'anytime' },
                                                                        ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId }))
                                                                    ]
                                                                        .filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0)
                                                                        .sort((a, b) => calculateDiscountedRate(parseFloat(String(a.value || 0)), discount) - calculateDiscountedRate(parseFloat(String(b.value || 0)), discount))
                                                                        .map((rate: any, idx) => {
                                                                            const isAnytime = rate.type === 'anytime';
                                                                            const price = calculateDiscountedRate(parseFloat(String(rate.value || 0)), discount);
                                                                            const unit = rate.type === 'dynamic' ? (rate.unitId ? `/${unitMap?.[rate.unitId]}` : '/kWh') : formatUnit(rate.type, 'kWh');

                                                                            return (
                                                                                <div
                                                                                    key={idx}
                                                                                    className={cn(
                                                                                        "border rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm",
                                                                                        isAnytime
                                                                                            ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                                                                                            : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                                                                    )}
                                                                                >
                                                                                    <div className={cn(
                                                                                        "font-bold text-base tracking-tight",
                                                                                        isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                                                                                    )}>
                                                                                        ${price.toFixed(4)}{unit}
                                                                                    </div>
                                                                                    <div className={cn(
                                                                                        "text-[10px] font-bold uppercase tracking-wider opacity-80",
                                                                                        isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                                                                                    )}>
                                                                                        {rate.label}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>

                                                            {/* Column 2: Supply Charges */}
                                                            <div className="space-y-4 min-w-[180px] flex-1">
                                                                <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400">
                                                                    <PlugIcon size={16} />
                                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Supply Charges</h4>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {[
                                                                        { label: 'Supply', value: offer.supplyCharge, type: 'supplyCharge' },
                                                                        ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                                    ].filter(r => (parseFloat(String(r.value || 0)) ?? 0) > 0).map((r: any, id) => {
                                                                        const numericValue = parseFloat(String(r.value || '0'));
                                                                        const price = r.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                                        return (
                                                                            <div key={id} className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center space-y-0.5">
                                                                                <div className="text-purple-600 dark:text-purple-400 font-bold text-base tracking-tight">${price.toFixed(4)}{r.type === 'dynamic' ? (r.unitId ? `/${unitMap?.[r.unitId]}` : '/day') : formatUnit(r.type, 'day')}</div>
                                                                                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider opacity-80">{r.label}</div>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    {((offer.demand ?? 0) > 0 || (offer.demandOp ?? 0) > 0 || (offer.demandP ?? 0) > 0 || (offer.demandS ?? 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'demand_charges')) && (
                                                                        <>
                                                                            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mt-4">
                                                                                <ActivityIcon size={16} />
                                                                                <h4 className="text-sm font-bold uppercase tracking-wide">Demand Charges</h4>
                                                                            </div>
                                                                            <div className="space-y-3">
                                                                                {[
                                                                                    { label: 'Demand', value: offer.demand, type: 'demand' },
                                                                                    { label: 'Demand (Op)', value: offer.demandOp, type: 'demandOp' },
                                                                                    { label: 'Demand (P)', value: offer.demandP, type: 'demandP' },
                                                                                    { label: 'Demand (S)', value: offer.demandS, type: 'demandS' },
                                                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                                                ]
                                                                                    .filter((d: any) => (parseFloat(String(d.value || 0)) ?? 0) > 0)
                                                                                    .map((d, id) => {
                                                                                        const numericValue = parseFloat(String(d.value || '0'));
                                                                                        const price = d.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                                                        return (
                                                                                            <div key={id} className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm">
                                                                                                <div className="text-rose-600 dark:text-rose-400 font-bold text-base tracking-tight">${price.toFixed(4)}{d.type === 'dynamic' ? (d.unitId ? `/${unitMap?.[d.unitId]}` : '/kVA/day') : formatUnit(d.type === 'demand' ? 'demand' : d.type === 'demandOp' ? 'demandOp' : d.type === 'demandP' ? 'demandP' : 'demandS', 'kVA/day')}</div>
                                                                                                <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider opacity-80">{d.label}</div>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {((offer.vppOrcharge ?? 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'vpp_charges')) && (
                                                                        <>
                                                                            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mt-4">
                                                                                <ActivityIcon size={16} />
                                                                                <h4 className="text-sm font-bold uppercase tracking-wide">VPP Charges</h4>
                                                                            </div>
                                                                            <div className="space-y-3">
                                                                                {[
                                                                                    { label: 'Orchestration', value: offer.vppOrcharge, type: 'vppOrcharge' },
                                                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                                                ].filter(r => (parseFloat(String(r.value || 0)) ?? 0) > 0).map((r, id) => {
                                                                                    const numericValue = parseFloat(String(r.value || '0'));
                                                                                    const price = r.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                                                    return (
                                                                                        <div key={id} className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center space-y-0.5">
                                                                                            <div className="text-amber-600 dark:text-amber-400 font-bold text-base tracking-tight">${price.toFixed(4)}{r.type === 'dynamic' ? (r.unitId ? `/${unitMap?.[r.unitId]}` : '/day') : formatUnit('vppOrcharge', 'day')}</div>
                                                                                            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider opacity-80">{r.label}</div>
                                                                                        </div>
                                                                                    );
                                                                                })}
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
                                                                        {[
                                                                            { label: 'Feed-in', value: offer.fit, type: 'fit' },
                                                                            { label: 'PREMIUM FIT', value: offer.fitPeak, type: 'fitPeak' },
                                                                            { label: 'CRITICAL EVENT FIT', value: offer.fitCritical, type: 'fitCritical' },
                                                                            { label: 'BASE FIT', value: offer.fitVpp, type: 'fitVpp' },
                                                                            ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                                        ]
                                                                            .filter(rate => {
                                                                                const numericValue = parseFloat(String(rate.value || 0));
                                                                                if (numericValue <= 0) return false;
                                                                                const isVppActive = selectedCustomerDetails.vppDetails?.vpp === 1;
                                                                                const hasSolar = selectedCustomerDetails.solarDetails?.hassolar === 1;

                                                                                if (rate.type === 'fit') return !isVppActive;
                                                                                return isVppActive || !hasSolar;
                                                                            })
                                                                            .sort((a, b) => (parseFloat(String(a.value || 0)) ?? 0) - (parseFloat(String(b.value || 0)) ?? 0))
                                                                            .map((rate: any, idx) => {
                                                                                const unit = rate.type === 'dynamic' ? (rate.unitId ? `/${unitMap?.[rate.unitId]}` : '/kWh') : formatUnit(rate.type, 'kWh');
                                                                                const numericValue = parseFloat(String(rate.value || '0'));
                                                                                const price = rate.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                                                return (
                                                                                    <div
                                                                                        key={idx}
                                                                                        className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm"
                                                                                    >
                                                                                        <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">
                                                                                            ${price.toFixed(4)}{unit}
                                                                                        </div>
                                                                                        <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">
                                                                                            {rate.label}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
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
                                                                        {[
                                                                            { label: 'CL1 Usage', value: offer.cl1Usage, type: 'cl1_usage' },
                                                                            { label: 'CL2 Usage', value: offer.cl2Usage, type: 'cl2_usage' },
                                                                            { label: 'CL1 Supply', value: offer.cl1Supply, type: 'cl1_supply' },
                                                                            { label: 'CL2 Supply', value: offer.cl2Supply, type: 'cl2_supply' },
                                                                            ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                                        ]
                                                                            .filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0)
                                                                            .map((rate: any, idx) => {
                                                                                const numericValue = parseFloat(String(rate.value || 0));
                                                                                const isUsage = rate.type === 'cl1_usage' || rate.type === 'cl2_usage' || (rate.type === 'dynamic' && !(rate.unitId && unitMap?.[rate.unitId]?.toLowerCase().includes('day')));
                                                                                const shouldApplyDiscount = rate.type === 'dynamic' ? !!rate.applyDiscount : isUsage;
                                                                                const price = shouldApplyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                                                const unit = rate.type === 'dynamic' ? (rate.unitId ? `/${unitMap?.[rate.unitId]}` : (isUsage ? '/kWh' : '/day')) : (isUsage ? '/kWh' : '/day');
                                                                                return (
                                                                                    <div key={idx} className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm">
                                                                                        <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${price.toFixed(4)}{unit}</div>
                                                                                        <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">{rate.label}</div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Dynamic Rates Columns */}
                                                            {/* We only show rates that haven't been displayed in the specific columns above */}
                                                            {(() => {
                                                                const handledTypes = ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'];
                                                                const remainingDynamicRates = parsedDynamicRates.filter((r: any) => !handledTypes.includes(r.type));

                                                                if (remainingDynamicRates.length === 0) return null;

                                                                const fitRates = remainingDynamicRates.filter((r: any) => r.type === 'fit' || r.type === 'extra_fit');
                                                                const chargeRates = remainingDynamicRates.filter((r: any) => !r.type || r.type === 'charges' || r.type === 'extra_charges');
                                                                const untypedRates = remainingDynamicRates.filter((r: any) => !r.type); // Filter untyped rates from the remaining

                                                                const renderRatesColumn = (rates: any[], label: string, colorClass: string, icon: any = ActivityIcon) => {
                                                                    if (rates.length === 0) return null;
                                                                    const Icon = icon;
                                                                    return (
                                                                        <div className="space-y-4 min-w-[180px] flex-1">
                                                                            <div className={cn("flex items-center gap-2 mb-2",
                                                                                colorClass === 'indigo' ? "text-indigo-500 dark:text-indigo-400" : "text-teal-500 dark:text-teal-400"
                                                                            )}>
                                                                                <Icon size={16} />
                                                                                <h4 className="text-sm font-bold uppercase tracking-wide">{label}</h4>
                                                                            </div>
                                                                            <div className="space-y-3">
                                                                                {rates.map((dRate: any, id: number) => {
                                                                                    const unitName = dRate.unitId ? unitMap?.[dRate.unitId] : '';
                                                                                    const val = parseFloat(String(dRate.value || '0'));
                                                                                    const price = dRate.applyDiscount ? calculateDiscountedRate(val, discount) : val;
                                                                                    return (
                                                                                        <div key={id} className={cn(
                                                                                            colorClass === 'indigo' ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800" : "bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800",
                                                                                            "rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm"
                                                                                        )}>
                                                                                            <div className={cn(colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400", "font-bold text-base tracking-tight")}>
                                                                                                ${price.toFixed(4)}{unitName ? `/${unitName}` : ''}
                                                                                            </div>
                                                                                            <div className={cn(colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400", "text-[10px] font-bold uppercase tracking-wider opacity-80")}>
                                                                                                {dRate.name}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                };

                                                                return (
                                                                    <>
                                                                        {renderRatesColumn(chargeRates, "Extra Charges", "indigo")}
                                                                        {renderRatesColumn(fitRates, "Extra FiT", "teal", ZapIcon)}
                                                                        {untypedRates.length > 0 && renderRatesColumn(untypedRates, (selectedCustomerDetails.vppDetails?.vpp === 1 || offer.vpp === 1) ? "Extra FIT" : "Extra Charge", "indigo")}
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">No rate offers available.</p>
                                    )}
                                </div>
                            )}



                            {selectedDetailSection === 'vpp_certificate' && (
                                <VppCertificateTab
                                    customerUid={selectedCustomerDetails.uid}
                                    onUpdate={refetchCustomer}
                                    vppDetails={selectedCustomerDetails.vppDetails}
                                    solarDetails={selectedCustomerDetails.solarDetails}
                                    ratePlan={selectedCustomerDetails.ratePlan}
                                    isDeleted={selectedCustomerDetails.isDeleted}
                                    vppForm={vppForm}
                                    setVppForm={setVppForm}
                                    isEditingVpp={isEditingVpp}
                                    setIsEditingVpp={setIsEditingVpp}
                                    handleVppToggle={handleVppToggle}
                                    handleSaveVppDetails={handleSaveVppDetails}
                                />
                            )}

                            {selectedDetailSection === 'debit' && selectedCustomerDetails.debitDetails && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                <IdCardIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Direct Debit</h3>
                                                <p className="text-xs text-muted-foreground">Payment configuration & bank details</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>

                                    {/* Account Holder */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Holder</h4>
                                        <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                    <UserIcon size={20} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-base font-semibold text-foreground">
                                                        {selectedCustomerDetails.debitDetails.accountType === 0
                                                            ? selectedCustomerDetails.debitDetails.companyName
                                                            : `${selectedCustomerDetails.debitDetails.firstName} ${selectedCustomerDetails.debitDetails.lastName}`}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                                                            {selectedCustomerDetails.debitDetails.accountType === 0 ? 'Business' : 'Personal'}
                                                        </span>
                                                        {selectedCustomerDetails.debitDetails.accountType === 0 && selectedCustomerDetails.debitDetails.abn && (
                                                            <span className="text-xs text-muted-foreground">ABN: <span className="font-medium text-foreground">{selectedCustomerDetails.debitDetails.abn}</span></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bank Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                { label: 'Bank Name', value: selectedCustomerDetails.debitDetails.bankName },
                                                { label: 'BSB', value: selectedCustomerDetails.debitDetails.bsb },
                                                { label: 'Account Number', value: selectedCustomerDetails.debitDetails.accountNumber ? `•••• ${selectedCustomerDetails.debitDetails.accountNumber.slice(-4)}` : '-' },
                                            ].map((item, i) => (
                                                <div key={i} className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-border/50 hover:border-border transition-colors">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                                    <p className="text-sm font-semibold text-foreground mt-1.5 font-mono tracking-wide">{item.value || '—'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Schedule */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Schedule</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-border/50 hover:border-border transition-colors flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                    <CalendarIcon size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Frequency</span>
                                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                                        {selectedCustomerDetails.debitDetails.paymentFrequency === 0 ? 'Monthly' :
                                                            selectedCustomerDetails.debitDetails.paymentFrequency === 1 ? 'Fortnightly' : 'Weekly'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 border border-border/50 hover:border-border transition-colors flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                                    <CalendarIcon size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">First Debit Date</span>
                                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                                        {selectedCustomerDetails.debitDetails.firstDebitDate ? formatSydneyTime(selectedCustomerDetails.debitDetails.firstDebitDate, 'DD/MM/YYYY') : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {selectedDetailSection === 'utilmate' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                                <PlugIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Utilmate Integration</h3>
                                                <p className="text-xs text-muted-foreground">Utilmate & MSAT connection</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground">Utilmate Connected</span>
                                            <ToggleSwitch
                                                checked={selectedCustomerDetails.utilmateDetails?.utilmateConnected === 1}
                                                onChange={(checked) => handleUtilmateToggle(selectedCustomerDetails.uid, checked)}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">MSAT Status</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ToggleSwitch
                                                    checked={selectedCustomerDetails.msatDetails?.msatConnected === 1}
                                                    onChange={(checked) => handleMsatToggle(selectedCustomerDetails.uid, checked)}
                                                />
                                                <span className={cn("text-sm font-medium", selectedCustomerDetails.msatDetails?.msatConnected === 1 ? "text-green-600" : "text-muted-foreground")}>
                                                    {selectedCustomerDetails.msatDetails?.msatConnected === 1 ? "Connected" : "Disconnected"}
                                                </span>
                                            </div>
                                        </div>
                                    </div> */}

                                    {selectedCustomerDetails.utilmateDetails?.utilmateConnected === 1 && (
                                        <div className="space-y-4 pt-4 border-t border-dashed">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Site Identifier</label>
                                                    <Input
                                                        value={utilmateForm.siteIdentifier}
                                                        onChange={(e) => setUtilmateForm({ ...utilmateForm, siteIdentifier: e.target.value })}
                                                        disabled={!isEditingUtilmate}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Account Number</label>
                                                    <Input
                                                        value={utilmateForm.accountNumber}
                                                        onChange={(e) => setUtilmateForm({ ...utilmateForm, accountNumber: e.target.value })}
                                                        disabled={!isEditingUtilmate}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Connected At</label>
                                                    <Input
                                                        value={utilmateForm.utilmateConnectedAt ? formatSydneyTime(utilmateForm.utilmateConnectedAt) : '-'}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4">
                                                {isEditingUtilmate ? (
                                                    <>
                                                        <Button variant="outline" onClick={() => setIsEditingUtilmate(false)}>Cancel</Button>
                                                        <Button onClick={handleSaveUtilmateDetails}>Save Utilmate Details</Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline" onClick={() => setIsEditingUtilmate(true)}>
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Edit Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedDetailSection === 'documents' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                                <UploadIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Documents</h3>
                                                <p className="text-xs text-muted-foreground">Manage customer documents</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hidden file inputs for upload */}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                        className="hidden"
                                        ref={previousBillInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadDocument('previousBill', file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                        className="hidden"
                                        ref={identityProofInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadDocument('identityProof', file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                        className="hidden"
                                        ref={licenseDocumentInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadDocument('licenseDocument', file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                        className="hidden"
                                        ref={newDocumentInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file && newDocumentType) handleUploadDocument(newDocumentType, file);
                                            e.target.value = '';
                                        }}
                                    />

                                    <div className="overflow-hidden rounded-xl border border-border bg-background">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-muted/50 border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Document Type</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Uploaded By</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Uploaded At</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {!selectedCustomerDetails?.isDeleted && (
                                                    <tr className="bg-muted/30 border-b border-border animate-in fade-in slide-in-from-top-1">
                                                        <td className="px-4 py-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-end justify-between">
                                                                    <label className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Choose Type</label>
                                                                    {canManageDocumentTypes && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setIsAddingNewDocTypeInline(!isAddingNewDocTypeInline);
                                                                                setNewDocTypeName('');
                                                                            }}
                                                                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                                                                        >
                                                                            {isAddingNewDocTypeInline ? 'Cancel' : '+ Add New Type'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                {isAddingNewDocTypeInline ? (
                                                                    <div className="flex flex-col gap-2 p-2 border border-border rounded-lg bg-background/50">
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                placeholder="Type name..."
                                                                                value={newDocTypeName}
                                                                                onChange={(e) => setNewDocTypeName(e.target.value)}
                                                                                className="h-8 flex-1 text-xs"
                                                                                autoFocus
                                                                            />
                                                                            <Select
                                                                                options={[
                                                                                    { label: 'Personal (0)', value: '0' },
                                                                                    { label: 'Signed (1)', value: '1' },
                                                                                    { label: 'Electricity (2)', value: '2' }
                                                                                ]}
                                                                                value={newDocTypeCategory}
                                                                                onChange={(val) => setNewDocTypeCategory(val as string)}
                                                                                className="h-8 w-28 text-xs"
                                                                            />
                                                                        </div>
                                                                        <Button
                                                                            size="sm"
                                                                            className="h-8 w-full bg-neutral-900 text-white hover:bg-neutral-800 text-[10px]"
                                                                            onClick={handleCreateDocumentType}
                                                                            disabled={!newDocTypeName.trim() || isAddingDocType}
                                                                            isLoading={isAddingDocType}
                                                                        >
                                                                            Add Document Type
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-2">
                                                                        <Select
                                                                            options={docTypeOptions.filter(o => o.value !== '2')}
                                                                            value={newDocumentType}
                                                                            onChange={(val) => setNewDocumentType(val as string)}
                                                                            placeholder="Select Type..."
                                                                            className="flex-1 bg-background h-9"
                                                                        />
                                                                        {newDocumentType && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setNewDocumentType('');
                                                                                }}
                                                                                className="h-9 px-3 text-xs border-input hover:bg-accent hover:text-accent-foreground"
                                                                            >
                                                                                Clear
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-muted-foreground italic"></td>
                                                        <td className="px-4 py-4 text-center text-muted-foreground italic"></td>
                                                        <td className="px-4 py-4 text-right align-bottom">
                                                            <div className="flex flex-col gap-2 items-end">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 px-3 text-xs"
                                                                        disabled={!newDocumentType || isUploadingDocument !== null}
                                                                        onClick={() => newDocumentInputRef.current?.click()}
                                                                        isLoading={isUploadingDocument !== null && isUploadingDocument === newDocumentType}
                                                                    >
                                                                        <UploadIcon className="w-3.5 h-3.5 " />
                                                                        {/* Upload File */}
                                                                    </Button>
                                                                </div>
                                                                {isUploadingDocument && isUploadingDocument === newDocumentType && (
                                                                    <span className="text-[10px] text-primary animate-pulse font-medium">Uploading...</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {selectedCustomerDetails && [
                                                    {
                                                        doc: selectedCustomerDetails.previousBill,
                                                        label: selectedCustomerDetails.previousBill?.documentType?.name || 'Previous Bill',
                                                        type: 'previousBill',
                                                        category: '0',
                                                        show: true
                                                    },
                                                    {
                                                        doc: selectedCustomerDetails.identityProof,
                                                        label: selectedCustomerDetails.identityProof?.documentType?.name || 'Identity Proof',
                                                        type: 'identityProof',
                                                        category: '0',
                                                        show: selectedCustomerDetails.enrollmentDetails?.idtype !== 0
                                                    },
                                                    {
                                                        doc: selectedCustomerDetails.licenseDocument,
                                                        label: selectedCustomerDetails.licenseDocument?.documentType?.name || 'Driver\'s License',
                                                        type: 'licenseDocument',
                                                        category: '0',
                                                        show: selectedCustomerDetails.enrollmentDetails?.idtype === 0
                                                    },
                                                    {
                                                        doc: selectedCustomerDetails.additionalDocument,
                                                        label: selectedCustomerDetails.additionalDocument?.documentType?.name || 'Additional Document',
                                                        type: 'additionalDocument',
                                                        category: '0',
                                                        show: !!selectedCustomerDetails.additionalDocument
                                                    },
                                                    ...(selectedCustomerDetails?.documents?.filter(d =>
                                                        d.uid !== selectedCustomerDetails?.previousBill?.uid &&
                                                        d.uid !== selectedCustomerDetails?.identityProof?.uid &&
                                                        d.uid !== selectedCustomerDetails?.licenseDocument?.uid &&
                                                        d.uid !== selectedCustomerDetails?.additionalDocument?.uid &&
                                                        (d.documentType?.category === '0' || d.documentType?.category === '1' || (!d.documentType?.category && d.type !== '2'))
                                                    ).map(d => ({
                                                        doc: d,
                                                        label: d.documentType?.name || d.name || 'Document',
                                                        type: d.type || 'other',
                                                        category: d.documentType?.category || '0',
                                                        show: true
                                                    })) || [])
                                                ].filter(item => item.show).map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn(
                                                                    "w-8 h-8 rounded flex items-center justify-center",
                                                                    item.doc?.path ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                                )}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-foreground">{item.label}</span>
                                                                    {item.doc?.filename && (
                                                                        <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={item.doc.filename}>
                                                                            {item.doc.filename}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {item.doc?.path ? (
                                                                <span className="text-foreground font-medium">
                                                                    {item.doc.createdByUser?.name || item.doc.createdBy || 'System'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                            {item.doc?.path && item.doc.createdAt
                                                                ? formatSydneyTime(item.doc.createdAt)
                                                                : <span className="text-muted-foreground italic">—</span>
                                                            }
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {item.doc?.path ? (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-8 px-3 text-xs font-medium border-border hover:bg-muted transition-colors"
                                                                            onClick={() => item.doc?.path && window.open(`${apiAxios.defaults.baseURL}/documents/${encodeURIComponent(item.doc.path).replace(/%2F/g, '/')}`, '_blank')}
                                                                        >
                                                                            <EyeIcon className="w-3.5 h-3.5" />
                                                                            {/* View */}
                                                                        </Button>
                                                                        {canDelete && (
                                                                            <ConfirmationPopover
                                                                                title="Delete Document"
                                                                                description={`Are you sure you want to delete this ${item.label}? This action cannot be undone.`}
                                                                                confirmText="Delete"
                                                                                onConfirm={() => item.doc?.path && handleDeleteDocument(item.doc.path)}
                                                                                confirmVariant="destructive"
                                                                                placement="left"
                                                                            >
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 px-3 text-xs font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                                                                                    disabled={isDeletingDocument === item.doc!.path}
                                                                                    isLoading={isDeletingDocument === item.doc!.path}
                                                                                    loadingText="Deleting..."
                                                                                >
                                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                                    {/* Delete */}
                                                                                </Button>
                                                                            </ConfirmationPopover>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 px-3 text-xs font-medium border-primary/50 text-primary hover:bg-primary/10"
                                                                        onClick={() => {
                                                                            if (item.type === 'previousBill') previousBillInputRef.current?.click();
                                                                            else if (item.type === 'identityProof') identityProofInputRef.current?.click();
                                                                            else if (item.type === 'licenseDocument') licenseDocumentInputRef.current?.click();
                                                                        }}
                                                                        disabled={isUploadingDocument === item.type}
                                                                        isLoading={isUploadingDocument === item.type}
                                                                        loadingText="Uploading..."
                                                                    >
                                                                        <UploadIcon className="w-3.5 h-3.5 " />
                                                                        {/* Upload */}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedDetailSection === 'electricity_bills' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                <ZapIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Electricity Bills</h3>
                                                <p className="text-xs text-muted-foreground">Bills & usage data</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hidden file input for bill upload */}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
                                        className="hidden"
                                        ref={newDocumentInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadDocument('2', file, billStartDate, billEndDate);
                                            e.target.value = '';
                                        }}
                                    />

                                    <div className="overflow-hidden rounded-xl border border-border bg-background">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-muted/50 border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Bill Period</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Uploaded By</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Uploaded At</th>
                                                    <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {!selectedCustomerDetails?.isDeleted && (
                                                    <tr className="bg-muted/30 border-b border-border animate-in fade-in slide-in-from-top-1">
                                                        <td className="px-4 py-4 align-bottom">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Select Period</label>
                                                                <div className="flex gap-2 items-center">
                                                                    <DatePicker
                                                                        value={billStartDate}
                                                                        onChange={(d) => setBillStartDate(d ? d.toISOString() : '')}
                                                                        placeholder="Start Date"
                                                                        className="h-9 w-[130px] text-xs"
                                                                    />
                                                                    <span className="text-muted-foreground">—</span>
                                                                    <DatePicker
                                                                        value={billEndDate}
                                                                        onChange={(d) => setBillEndDate(d ? d.toISOString() : '')}
                                                                        placeholder="End Date"
                                                                        className="h-9 w-[130px] text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-muted-foreground italic"></td>
                                                        <td className="px-4 py-4 text-center text-muted-foreground italic"></td>
                                                        <td className="px-4 py-4 text-right align-bottom">
                                                            <div className="flex gap-2 justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setBillStartDate('');
                                                                        setBillEndDate('');
                                                                    }}
                                                                    className="h-8 px-3 text-xs border-input hover:bg-accent hover:text-accent-foreground"
                                                                >
                                                                    Clear
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-neutral-900 text-white hover:bg-neutral-800 h-8 px-3 text-xs"
                                                                    disabled={!billStartDate || !billEndDate || isUploadingDocument !== null}
                                                                    onClick={() => newDocumentInputRef.current?.click()}
                                                                    isLoading={isUploadingDocument === '2'}
                                                                >
                                                                    <UploadIcon className="w-3.5 h-3.5" />
                                                                    {/* Upload Bill */}
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {(selectedCustomerDetails?.documents?.filter(d => d.documentType?.category === '2' || d.type === '2')?.length || 0) > 0 ? (
                                                    selectedCustomerDetails?.documents
                                                        ?.filter(d => d.documentType?.category === '2' || d.type === '2')
                                                        .map((doc, idx) => (
                                                            <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-primary/10 text-primary w-8 h-8 rounded flex items-center justify-center">
                                                                            <ZapIcon className="w-4 h-4" />
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium text-foreground">
                                                                                {doc.startDate && doc.endDate
                                                                                    ? `${formatSydneyTime(doc.startDate, 'DD/MM/YYYY')} - ${formatSydneyTime(doc.endDate, 'DD/MM/YYYY')}`
                                                                                    : (doc.documentType?.name || doc.name || 'Electricity Bill')}
                                                                            </span>
                                                                            {doc.filename && (
                                                                                <span className="text-xs text-muted-foreground truncate max-w-[180px]" title={doc.filename}>
                                                                                    {doc.filename}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-muted-foreground">
                                                                    <span className="text-foreground font-medium">
                                                                        {doc.createdByUser?.name || doc.createdBy || 'System'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                                    {formatSydneyTime(doc.createdAt)}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-8 px-3 text-xs font-medium border-border hover:bg-muted transition-colors"
                                                                            onClick={() => doc.path && window.open(`${apiAxios.defaults.baseURL}/documents/${encodeURIComponent(doc.path).replace(/%2F/g, '/')}`, '_blank')}
                                                                        >
                                                                            <EyeIcon className="w-3.5 h-3.5" />
                                                                            {/* View */}
                                                                        </Button>
                                                                        {canDelete && (
                                                                            <ConfirmationPopover
                                                                                title="Delete Bill"
                                                                                description="Are you sure you want to delete this electricity bill? This action cannot be undone."
                                                                                confirmText="Delete"
                                                                                onConfirm={() => doc.path && handleDeleteDocument(doc.path)}
                                                                                confirmVariant="destructive"
                                                                            >
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 px-3 text-xs font-medium border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                                                                                    disabled={isDeletingDocument === doc.path}
                                                                                    isLoading={isDeletingDocument === doc.path}
                                                                                    loadingText="Deleting..."
                                                                                >
                                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                                    {/* Delete */}
                                                                                </Button>
                                                                            </ConfirmationPopover>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <ZapIcon className="w-8 h-8 text-muted-foreground/30" />
                                                                <p>No electricity bills uploaded yet</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedDetailSection === 'email_logs' && selectedCustomerDetails && (selectedCustomerDetails.emailLogCount || 0) > 0 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <MailIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Email Logs</h3>
                                                <p className="text-xs text-muted-foreground">History of all emails sent to this customer</p>
                                            </div>
                                        </div>
                                    </div>
                                    <CustomerEmailLogsTable customerUid={selectedCustomerDetails.uid} key={emailLogsKey} />
                                </div>
                            )}

                            {selectedDetailSection === 'activity_log' && selectedCustomerDetails && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                                <ActivityIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Activity Log</h3>
                                                <p className="text-xs text-muted-foreground">All changes made to this customer record</p>
                                            </div>
                                        </div>
                                    </div>
                                    <CustomerActivityLogTable customerUid={selectedCustomerDetails.uid} />
                                </div>
                            )}

                            {selectedDetailSection === 'maintenance' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    {!selectedMaintenanceUid ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground">Maintenance Details</h3>
                                                    <p className="text-sm text-muted-foreground">Track system updates, service calls, and maintenance tasks.</p>
                                                </div>
                                                <Button
                                                    onClick={() => handleMaintenanceAction()}
                                                    className="flex items-center gap-2"
                                                    size="sm"
                                                >
                                                    <PlusIcon size={16} />
                                                    Add Maintenance
                                                </Button>
                                            </div>

                                            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                                                <CustomerMaintenanceTable
                                                    customerUid={uid || ''}
                                                    onEdit={handleMaintenanceAction}
                                                    onViewNotes={(record) => {
                                                        setSelectedMaintenanceUid(record.uid);
                                                        setSelectedMaintenanceCategory(record.category ?? null);
                                                    }}
                                                    refreshKey={maintenanceRefreshKey}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <InlineMaintenanceNotes
                                            onClose={() => {
                                                setSelectedMaintenanceUid(null);
                                                setSelectedMaintenanceCategory(null);
                                                setMaintenanceNoteText('');
                                            }}
                                            maintenanceUid={selectedMaintenanceUid}
                                            customerUid={uid || ''}
                                            category={selectedMaintenanceCategory || 'Maintenance'}
                                            noteText={maintenanceNoteText}
                                            setNoteText={setMaintenanceNoteText}
                                            onAddNote={handleAddMaintenanceNote}
                                            isAdding={isAddingMaintenanceNote}
                                            canDelete={canDelete}
                                        />
                                    )}
                                </div>
                            )}


                            {selectedDetailSection === 'notes' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Settings2Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-md font-semibold text-foreground tracking-tight">Notes</h3>
                                                <p className="text-xs text-muted-foreground">Activity log & follow-ups</p>
                                            </div>
                                        </div>
                                        {!selectedCustomerDetails?.isDeleted && (
                                            <Button
                                                size="sm"
                                                className="bg-neutral-900 text-white hover:bg-neutral-800"
                                                onClick={() => setNoteModalOpen(true)}
                                                leftIcon={<PlusIcon size={14} />}
                                            >
                                                Add Note
                                            </Button>
                                        )}
                                    </div>

                                    {/* Notes List */}
                                    <div className="space-y-3">
                                        {notesLoading ? (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                                <p className="mt-3 text-sm text-muted-foreground">Loading notes...</p>
                                            </div>
                                        ) : (notesData?.customerNotes?.length || 0) > 0 ? (
                                            notesData.customerNotes.map((note: any) => (
                                                <div key={note.uid} className="group bg-white dark:bg-neutral-950 rounded-xl border border-border/50 hover:border-border p-4 transition-all hover:shadow-sm">
                                                    <div className="flex gap-3">
                                                        {/* Author Avatar */}
                                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 border border-primary/10">
                                                            {(note.createdByName || 'S').charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            {/* Author & Time */}
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-semibold text-foreground">{note.createdByName || 'System'}</span>
                                                                    <span className="text-[11px] text-muted-foreground">{formatSydneyTime(note.createdAt)}</span>
                                                                </div>
                                                                {canDelete && (
                                                                    <ConfirmationPopover
                                                                        title="Delete this note?"
                                                                        description="This action cannot be undone."
                                                                        onConfirm={() => handleDeleteNote(note.uid)}
                                                                        confirmText="Delete"
                                                                        cancelText="Cancel"
                                                                        placement="left"
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <TrashIcon className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </ConfirmationPopover>
                                                                )}
                                                            </div>

                                                            {/* Message */}
                                                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{note.message}</p>

                                                            {/* Metadata Tags */}
                                                            {(note.followUp || note.assignedToUser || note.noteType) && (
                                                                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                                                                    {note.noteType && (
                                                                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/50">
                                                                            {note.noteType.name}
                                                                        </span>
                                                                    )}
                                                                    {note.followUp && (
                                                                        <span className="text-[11px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-orange-200/50 dark:border-orange-800/50">
                                                                            <CalendarIcon className="w-3 h-3" />
                                                                            Follow up: {formatSydneyTime(note.followUp)}
                                                                        </span>
                                                                    )}
                                                                    {note.assignedToUser && (
                                                                        <span className="text-[11px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-blue-200/50 dark:border-blue-800/50">
                                                                            <UserIcon className="w-3 h-3" />
                                                                            Assigned to:  {note.assignedToUser.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-neutral-950 rounded-xl border border-dashed border-border">
                                                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                                                    <Settings2Icon size={20} />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">No notes yet</p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">Click "Add Note" to create the first one.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-lg font-semibold">Customer not found</h3>
                    <Button variant="link" onClick={() => navigate('/customers')}>Return to list</Button>
                </div>
            )
            }

            {/* Freeze Confirmation Modal */}
            <Modal
                isOpen={freezeModalOpen}
                onClose={() => setFreezeModalOpen(false)}
                title="Confirm Freeze Customer"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setFreezeModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            onClick={handleConfirmFreeze}
                            isLoading={freezingCustomer}
                            loadingText="Freezing..."
                        >
                            Confirm Freeze
                        </Button>
                    </>
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-3">
                        Are you sure you want to freeze customer{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedCustomerDetails?.firstName} {selectedCustomerDetails?.lastName}
                        </span>{' '}
                        ({selectedCustomerDetails?.customerId || selectedCustomerDetails?.uid})?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                        This will create a new customer record and mark the current one as Frozen.
                    </p>
                </div>
            </Modal>

            {/* Not Interested Confirmation Modal */}
            <Modal
                isOpen={notInterestedModalOpen}
                onClose={() => setNotInterestedModalOpen(false)}
                title="Confirm Not Interested"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setNotInterestedModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleMarkNotInterested}
                            isLoading={markingNotInterested}
                            loadingText="Updating..."
                        >
                            Confirm Not Interested
                        </Button>
                    </>
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-3">
                        Are you sure you want to mark customer{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedCustomerDetails?.firstName} {selectedCustomerDetails?.lastName}
                        </span>{' '}
                        as <span className="font-semibold text-red-600">Not Interested</span>?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                        This will update the customer's status. You can change it back later if needed.
                    </p>
                </div>
            </Modal>

            {/* VPP Connection Modal */}
            <Modal
                isOpen={vppConnectModalOpen}
                onClose={() => setVppConnectModalOpen(false)}
                title="Connect VPP - Battery Details"
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setVppConnectModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={handleConfirmVppConnect}
                        >
                            Connect & Save
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please provide battery details to connect VPP.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Battery Brand</label>
                            <Select
                                options={BATTERY_BRAND_OPTIONS}
                                value={vppForm.batteryBrand}
                                onChange={(val) => setVppForm({ ...vppForm, batteryBrand: val as string })}
                                placeholder="Select Brand..."
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">SN Number</label>
                            <Input
                                placeholder="e.g. SN12345678"
                                value={vppForm.snNumber}
                                onChange={(e) => setVppForm({ ...vppForm, snNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Battery Capacity</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="13.5"
                                    value={vppForm.batteryCapacity}
                                    onChange={(e) => setVppForm({ ...vppForm, batteryCapacity: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Export Limit</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="5.0"
                                    value={vppForm.exportLimit}
                                    onChange={(e) => setVppForm({ ...vppForm, exportLimit: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Inverter Capacity</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="6.0"
                                    value={vppForm.inverterCapacity}
                                    onChange={(e) => setVppForm({ ...vppForm, inverterCapacity: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium pointer-events-none">kW</span>
                            </div>
                        </div>
                        {vppForm.batteryBrand === 'Fox ESS' && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Check Code</label>
                                <Input
                                    placeholder="Verification Code"
                                    value={vppForm.checkCode}
                                    onChange={(e) => setVppForm({ ...vppForm, checkCode: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Utilmate Connection Modal */}
            <Modal
                isOpen={utilmateConnectModalOpen}
                onClose={() => setUtilmateConnectModalOpen(false)}
                title="Connect Utilmate"
                size="md"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setUtilmateConnectModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={handleConfirmUtilmateConnect}
                        >
                            Connect & Save
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please provide Utilmate details to connect.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Site Identifier</label>
                            <Input
                                placeholder="Site ID..."
                                value={utilmateForm.siteIdentifier}
                                onChange={(e) => setUtilmateForm({ ...utilmateForm, siteIdentifier: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Account Number</label>
                            <Input
                                placeholder="Account #..."
                                value={utilmateForm.accountNumber}
                                onChange={(e) => setUtilmateForm({ ...utilmateForm, accountNumber: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Preview Offer Modal */}
            <Modal
                isOpen={previewModalOpen}
                onClose={() => {
                    setPreviewModalOpen(false);
                    // Reset loading state when modal is closed
                    setIsLoadingPreview(false);
                }}
                title="Offer Preview"
                size="full"
            >
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
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleDownloadPreview}
                        leftIcon={<DownloadIcon size={16} />}
                        isLoading={isDownloading}
                        disabled={!previewUrl || isLoadingPreview || isDownloading}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setPreviewModalOpen(false);
                            setIsLoadingPreview(false);
                        }}
                    >
                        Close
                    </Button>
                </div>
            </Modal>

            {/* Add Note Modal */}
            <Modal
                isOpen={noteModalOpen}
                onClose={() => { setNoteModalOpen(false); setNoteText(''); }}
                title="Add Note"
                size="lg"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => { setNoteModalOpen(false); setNoteText(''); }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={async () => {
                                await handleAddNote();
                                setNoteModalOpen(false);
                            }}
                            disabled={!noteText.trim() || isAddingNote}
                            isLoading={isAddingNote}
                            loadingText="Adding..."
                        >
                            Add Note
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Note Type</label>
                                {canManageNoteTypes && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingNewTypeInline(!isAddingNewTypeInline);
                                            setNewTypeName('');
                                        }}
                                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        {isAddingNewTypeInline ? 'Cancel' : '+ Add New Type'}
                                    </button>
                                )}
                            </div>
                            {canManageNoteTypes && isAddingNewTypeInline ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type name..."
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        className="h-9"
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        className="h-9 px-3 bg-neutral-900 text-white hover:bg-neutral-800"
                                        onClick={handleCreateNoteType}
                                        disabled={!newTypeName.trim() || isAddingNoteType}
                                        isLoading={isAddingNoteType}
                                    >
                                        Add
                                    </Button>
                                </div>
                            ) : (
                                <Select
                                    options={noteTypeOptions}
                                    value={noteType}
                                    onChange={(val: any) => setNoteType(val as string)}
                                    className="w-full"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Assigned To</label>
                            <Select
                                options={userOptions}
                                value={noteAssignedTo}
                                onChange={(val: any) => setNoteAssignedTo(val as string)}
                                placeholder="Select a user..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Follow-up Date</label>
                            <DatePicker
                                value={noteFollowUp ? new Date(noteFollowUp) : null}
                                onChange={(date) => setNoteFollowUp(date)}
                                placeholder="Select follow-up date..."
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Note Message</label>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Write a note..."
                            className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                            autoFocus
                        />
                    </div>
                </div>
            </Modal>

            {/* Maintenance Modal */}
            <Modal
                isOpen={maintenanceModalOpen}
                onClose={() => setMaintenanceModalOpen(false)}
                title={editingMaintenance ? "Edit Maintenance" : "Add Maintenance"}
                size="lg"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setMaintenanceModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-neutral-900 text-white hover:bg-neutral-800"
                            onClick={handleSaveMaintenance}
                            disabled={!maintenanceForm.category.trim() || isSavingMaintenance}
                            isLoading={isSavingMaintenance}
                            loadingText="Saving..."
                        >
                            {editingMaintenance ? "Update Record" : "Save Maintenance"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Category</label>
                                {canManageMaintenanceCategories && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingNewCategoryInline(!isAddingNewCategoryInline);
                                            setNewCategoryName('');
                                        }}
                                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        {isAddingNewCategoryInline ? 'Cancel' : '+ Add New Category'}
                                    </button>
                                )}
                            </div>
                            {isAddingNewCategoryInline ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Category name..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="h-9"
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        className="h-9 px-3 bg-neutral-900 text-white hover:bg-neutral-800"
                                        onClick={handleCreateMaintenanceCategory}
                                        disabled={!newCategoryName.trim() || isAddingCategory}
                                        isLoading={isAddingCategory}
                                    >
                                        Add
                                    </Button>
                                </div>
                            ) : (
                                <Select
                                    options={categoryOptions}
                                    value={maintenanceForm.category}
                                    onChange={(val: any) => setMaintenanceForm({ ...maintenanceForm, category: val as string })}
                                    placeholder="Select category..."
                                    className="w-full"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Taken Care By</label>
                            <Select
                                options={userOptions}
                                value={maintenanceForm.takenCareByUid}
                                onChange={(val: any) => setMaintenanceForm({ ...maintenanceForm, takenCareByUid: val as string })}
                                placeholder="Select a user..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Call Method</label>
                            <Select
                                options={MAINTENANCE_METHOD_OPTIONS}
                                value={maintenanceForm.method?.toString()}
                                onChange={(val: any) => setMaintenanceForm({ ...maintenanceForm, method: Number(val) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Call Status</label>
                            <Select
                                options={MAINTENANCE_STATUS_OPTIONS}
                                value={maintenanceForm.status?.toString()}
                                onChange={(val: any) => setMaintenanceForm({ ...maintenanceForm, status: Number(val) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Priority</label>
                            <Select
                                options={MAINTENANCE_PRIORITY_OPTIONS}
                                value={maintenanceForm.priority?.toString()}
                                onChange={(val: any) => setMaintenanceForm({ ...maintenanceForm, priority: Number(val) })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Call Date</label>
                            <DatePicker
                                value={maintenanceForm.callDate}
                                onChange={(date) => setMaintenanceForm({ ...maintenanceForm, callDate: date || new Date() })}
                                placeholder="Select date..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                        <textarea
                            value={maintenanceForm.notes}
                            onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                            placeholder="Detailed maintenance notes..."
                            className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                        />
                    </div>
                </div>
            </Modal>


            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title={isHardDelete ? "Delete Customer Permanently" : "Archive Customer"}
                size="sm"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={cn("text-white", isHardDelete ? "bg-red-800 hover:bg-red-900 shadow-lg shadow-red-900/20" : "bg-red-600 hover:bg-red-700")}
                            onClick={handleConfirmDelete}
                            isLoading={isDeletingCustomer}
                            disabled={deleteConfirmName !== selectedCustomerDetails?.customerId}
                            loadingText={isHardDelete ? "Deleting..." : "Archiving..."}
                        >
                            {isHardDelete ? "Delete" : "Archive"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="mb-3">
                            Are you sure you want to {isHardDelete ? 'DELETE' : 'archive'} customer{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {selectedCustomerDetails?.firstName} {selectedCustomerDetails?.lastName}
                            </span>?
                        </p>
                        <div className={cn("border p-3 rounded-lg flex items-start gap-3 mb-4", isHardDelete ? "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-900/50" : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30")}>
                            <InfoIcon size={18} className="text-red-500 shrink-0 mt-0.5" />
                            <p className={cn("text-xs", isHardDelete ? "text-red-900 dark:text-red-300 font-medium" : "text-red-700 dark:text-red-400")}>
                                {isHardDelete
                                    ? "CRITICAL: This will permanently remove ALL customer data, history, documents, and notes. This action CANNOT be undone."
                                    : "This action will archive the record. The customer will be hidden from the primary list."}
                            </p>
                        </div>

                        {isHardDelete && (
                            <div className="flex items-center space-x-3 mb-4 p-3 rounded-md border border-red-200 bg-red-50/50 cursor-pointer hover:bg-red-100/50 transition-colors" onClick={() => setIsHardDelete(!isHardDelete)}>
                                <input
                                    type="checkbox"
                                    id="hard-delete-toggle"
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                    checked={isHardDelete}
                                    onChange={(e) => setIsHardDelete(e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <label htmlFor="hard-delete-toggle" className="text-xs font-semibold text-red-900 cursor-pointer select-none leading-tight">
                                    I understand that this action is permanent and all customer data will be removed forever.
                                </label>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">
                                To confirm, type <span className="text-foreground tracking-wider select-all">{selectedCustomerDetails?.customerId}</span> below:
                            </label>
                            <Input
                                placeholder="Type Customer ID here..."
                                value={deleteConfirmName}
                                onChange={(e) => setDeleteConfirmName(e.target.value)}
                                className="border-red-200 focus:border-red-500 focus:ring-red-500/20"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
