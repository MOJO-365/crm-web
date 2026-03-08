import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_CUSTOMER_BILLING_INFO, SEARCH_CUSTOMERS_BASIC, GET_RISK_STATUSES } from '@/graphql';
import { SearchIcon, XIcon, SpinnerIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, UserIcon, HashIcon, BuildingIcon, EyeIcon, DownloadIcon } from '@/components/icons';
import { secondaryApiAxios } from '@/lib/apollo';
import { Modal, StatusField } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlusIcon } from '@/components/icons';
import { toast } from 'react-toastify';

interface CustomerResult {
    uid: string;
    firstName: string;
    lastName: string;
    customerId?: string;
    address?: { fullAddress?: string };
}

interface CustomerDetail {
    uid: string;
    firstName: string;
    lastName: string;
    customerId?: string;
    email?: string;
    number?: string;
    address?: {
        fullAddress?: string;
    };
    enrollmentDetails?: {
        billingpreference?: number;
    };
    debitDetails?: {
        optIn?: boolean;
        paymentFrequency?: string;
    };
    status?: number;
    discount?: number;
    riskStatus?: string;
    utilmateDetails?: {
        accountNumber?: string;
        siteIdentifier?: string;
    };
}

interface CustomerByIdResult {
    customer: CustomerDetail;
}

interface CustomersCursorResult {
    customersCursor: {
        data: CustomerResult[];
    };
}

interface AccountRecord {
    account_number: string;
    account_name: string;
    transaction_type: string;
    posted_date: string;
    amount: number;
    running_balance: number;
    allocated: string;
    description: string;
    transaction_date: string;
    invoice_due_date: string;
    notes: string;
}

function InfoRow({ label, value, icon: Icon, valueClassName }: { label: string; value: string | undefined | null, icon?: React.ElementType, valueClassName?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2.5 group">
            {Icon && (
                <div className="mt-0.5 shrink-0 text-muted-foreground/70 group-hover:text-primary transition-colors">
                    <Icon size={14} />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 mb-0.5">{label}</span>
                <span className={`text-sm font-medium text-foreground ${valueClassName || ''}`}>{value}</span>
            </div>
        </div>
    );
}

// Static data matching actual API response format
const STATIC_ACCOUNT_RECORDS: AccountRecord[] = [
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'REC11888',
        posted_date: '2026-03-05T10:30:00.000',
        amount: -76.77,
        running_balance: 0.00,
        allocated: 'Y',
        description: 'Receipt - CASH - Batch: 559',
        transaction_date: '04/03/2026',
        invoice_due_date: '',
        notes: 'Reference: 179998',
    },
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'INV1002396',
        posted_date: '2026-02-13T17:01:51.687',
        amount: 76.77,
        running_balance: 76.77,
        allocated: 'Y',
        description: 'Electricity Invoice - 202602/1002396 (0)',
        transaction_date: '13/02/2026',
        invoice_due_date: '27/02/2026',
        notes: '',
    },
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'INV1002394',
        posted_date: '2026-02-13T16:58:00.000',
        amount: -274.48,
        running_balance: 0.00,
        allocated: 'Y',
        description: 'Electricity Invoice - CR 1002394 (0)',
        transaction_date: '13/02/2026',
        invoice_due_date: '18/02/2026',
        notes: '',
    },
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'INV1002279',
        posted_date: '2026-02-04T14:22:10.000',
        amount: 274.48,
        running_balance: 274.48,
        allocated: 'Y',
        description: 'Electricity Invoice - 202602/1002279 (0)',
        transaction_date: '04/02/2026',
        invoice_due_date: '18/02/2026',
        notes: 'INCORRECT READS',
    },
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'INV1002427',
        posted_date: '2026-02-19T15:15:32.797',
        amount: -29.15,
        running_balance: 57.10,
        allocated: 'Y',
        description: 'Electricity Invoice - 202602/1002427 (0)',
        transaction_date: '19/02/2026',
        invoice_due_date: '05/03/2026',
        notes: 'REC-1002427',
    },
    {
        account_number: '100107',
        account_name: 'Jigarkumar Patel',
        transaction_type: 'INV1002401',
        posted_date: '2026-02-13T17:01:51.687',
        amount: 86.25,
        running_balance: 86.25,
        allocated: 'N',
        description: 'Electricity Invoice - 202602/1002401 (0)',
        transaction_date: '13/02/2026',
        invoice_due_date: '27/02/2026',
        notes: 'REC-1002401',
    },
];

export function CustomerBillingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const customerUid = searchParams.get('customer');

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isExternalNavigation] = useState(() => !!searchParams.get('customer'));

    const [accountRecords, setAccountRecords] = useState<AccountRecord[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [recordsError, setRecordsError] = useState<string | null>(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [receiptForm, setReceiptForm] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        reference: ''
    });
    const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [currentInvoiceRecord, setCurrentInvoiceRecord] = useState<AccountRecord | null>(null);


    // Fetch customer by UID if provided in query params
    const { data: customerData, loading: customerLoading } = useQuery<CustomerByIdResult>(GET_CUSTOMER_BILLING_INFO, {
        variables: { uid: selectedCustomer?.uid || customerUid },
        skip: !selectedCustomer?.uid && !customerUid,
    });

    const { data: riskStatusData } = useQuery(GET_RISK_STATUSES);
    const riskStatuses = riskStatusData?.riskStatuses || [];

    // Search customers by name with debounce
    const [searchCustomers, { data: searchData, loading: searchLoading }] = useLazyQuery<CustomersCursorResult>(SEARCH_CUSTOMERS_BASIC);

    // Fetch account records when a customer is selected
    const fetchAccountRecords = useCallback(async (accountNumber: string) => {
        setRecordsLoading(true);
        setRecordsError(null);
        try {
            // First, generate credentials / get token for this customer
            // const tokenResponse = await secondaryApiAxios.post(`/api/v1/utilmate/user/generate-credentials/${accountNumber}`);
            const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IjEwMDExNCIsInN1YiI6IjEwMDExNCIsImlhdCI6MTc3Mjc2NjgwNiwiZXhwIjoxNzcyNzY3NzA2fQ.sHweQ-wkUvmk8Fyky875pmKCPXE9fwYePKzWuxi5YKB6yk2Cw19W4uwd_2vf8xKm12dYFIedz9guu69Wg1B4Vg';
            // const response = {
            //     data: STATIC_ACCOUNT_RECORDS
            // }
            const response = await secondaryApiAxios.post('/api/v1/utilmate/user/account-records', {
                companycode: 'GEE',
                methodcode: 'GETACCREC',
                parameters: [
                    { account_number: accountNumber },
                    { start_date: '2020-01-01' },
                    { end_date: '2026-12-31' },
                ],
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.data && Array.isArray(response.data.data)) {
                setAccountRecords(response.data.data);
            } else {
                setAccountRecords(STATIC_ACCOUNT_RECORDS);
            }
        } catch (err: any) {
            console.error('Failed to fetch account records:', err);
            setAccountRecords(STATIC_ACCOUNT_RECORDS);
            setRecordsError(null);
        } finally {
            setRecordsLoading(false);
        }
    }, []);

    // Set selected customer when fetched by UID (initial load from query param)
    useEffect(() => {
        if (customerData?.customer && !selectedCustomer) {
            const c = customerData.customer;
            setSelectedCustomer({
                uid: c.uid,
                firstName: c.firstName,
                lastName: c.lastName,
                customerId: c.customerId,
                address: c.address,
            });
            setSearchTerm(`${c.firstName} ${c.lastName}`);
        }
    }, [customerData, selectedCustomer]);

    // Fetch account records when customer detail is available
    useEffect(() => {
        if (customerData?.customer?.customerId) {
            const accountNumber = customerData?.customer?.utilmateDetails?.accountNumber;
            if (accountNumber) {
                fetchAccountRecords(accountNumber);
            }
        }
    }, [customerData?.customer?.customerId, customerData?.customer?.utilmateDetails?.accountNumber, fetchAccountRecords]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Trigger search when debounced value changes
    useEffect(() => {
        if (debouncedSearch.length >= 2 && !selectedCustomer) {
            searchCustomers({
                variables: {
                    first: 10,
                    searchName: debouncedSearch,
                },
            });
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [debouncedSearch, selectedCustomer, searchCustomers]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectCustomer = useCallback((customer: CustomerResult) => {
        setSelectedCustomer(customer);
        setSearchTerm(`${customer.firstName} ${customer.lastName}`);
        setShowDropdown(false);
        setSearchParams({ customer: customer.uid });
    }, [setSearchParams]);

    const handleClearSelection = useCallback(() => {
        setSelectedCustomer(null);
        setSearchTerm('');
        setSearchParams({});
        setAccountRecords([]);
        setRecordsError(null);
        setSearchFilter('');
        setCurrentPage(1);
        setIsReceiptModalOpen(false);
        setReceiptForm({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            reference: ''
        });
        inputRef.current?.focus();
    }, [setSearchParams]);

    const handleReceiptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiptForm.amount || !receiptForm.date) {
            toast.error('Amount and Date are required');
            return;
        }

        setIsSubmittingReceipt(true);
        // Simulate API call for now
        setTimeout(() => {
            toast.success('Receipt added successfully');
            setIsSubmittingReceipt(false);
            setIsReceiptModalOpen(false);
            setReceiptForm({
                amount: '',
                date: new Date().toISOString().split('T')[0],
                reference: ''
            });
        }, 1000);
    };

    const handlePreviewInvoice = async (record: AccountRecord) => {
        if (!record.transaction_type.startsWith('INV')) return;
        console.log(record, "record");
        setDownloadingInvoice(record.transaction_type);
        setCurrentInvoiceRecord(record);
        setIsLoadingPreview(true);
        setPreviewModalOpen(true);
        try {
            const invoiceNumber = record.transaction_type.replace('INV', '');
            const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IjEwMDExNCIsInN1YiI6IjEwMDExNCIsImlhdCI6MTc3Mjc2NjgwNiwiZXhwIjoxNzcyNzY3NzA2fQ.sHweQ-wkUvmk8Fyky875pmKCPXE9fwYePKzWuxi5YKB6yk2Cw19W4uwd_2vf8xKm12dYFIedz9guu69Wg1B4Vg';

            const response = await secondaryApiAxios.post('/api/v1/utilmate/user/invoice', {
                companycode: "GEE",
                methodcode: "GETINVOICEPDF",
                parameters: {
                    account_number: record.account_number,
                    invoice_number: invoiceNumber
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const isPdf = response.headers['content-type']?.includes('pdf') || response.data?.type === 'application/pdf';

            if (!isPdf && response.data?.type === 'application/json') {
                const text = await response.data.text();
                try {
                    const json = JSON.parse(text);
                    if (json.data && typeof json.data === 'string') {
                        const linkSource = `data:application/pdf;base64,${json.data}`;
                        const fetchResp = await fetch(linkSource);
                        const blob = await fetchResp.blob();
                        const url = window.URL.createObjectURL(blob);
                        setPreviewUrl(url);
                        setDownloadingInvoice(null);
                        setIsLoadingPreview(false);
                        return;
                    }
                } catch (e) { }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setDownloadingInvoice(null);
            setIsLoadingPreview(false);
        } catch (err) {
            console.error('Failed to load invoice preview', err);
            toast.error('Failed to load invoice preview');
            setDownloadingInvoice(null);
            setIsLoadingPreview(false);
            setPreviewModalOpen(false);
        }
    };

    const handleDownloadAction = () => {
        if (!previewUrl) return;
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = `Invoice_${currentInvoiceRecord?.transaction_type || 'Document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    const searchResults = searchData?.customersCursor?.data || [];
    const detail = customerData?.customer;

    const formatCurrency = (val: number) => {
        if (val === 0) return '$0.00';
        const prefix = val < 0 ? '-' : '';
        return `${prefix}$${Math.abs(val).toFixed(2)}`;
    };

    // Filter and paginate records
    const filteredRecords = useMemo(() => {
        if (!searchFilter.trim()) return accountRecords;
        const q = searchFilter.toLowerCase();
        return accountRecords.filter(r =>
            r.transaction_type.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.notes.toLowerCase().includes(q) ||
            r.transaction_date.toLowerCase().includes(q)
        );
    }, [accountRecords, searchFilter]);

    const totalCount = filteredRecords.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRecords.slice(start, start + pageSize);
    }, [filteredRecords, currentPage, pageSize]);

    const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {isExternalNavigation && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="h-10 w-10 shrink-0 rounded-full"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Customer Billing</h1>
                    <p className="text-muted-foreground">Manage customer billing cycles</p>
                </div>
            </div>

            {/* Customer Search */}
            {!isExternalNavigation && (
                <div className="relative max-w-md" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Customer
                    </label>
                    <div className="relative">
                        <SearchIcon
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (selectedCustomer) {
                                    setSelectedCustomer(null);
                                    setSearchParams({});
                                }
                            }}
                            placeholder="Search customer by name..."
                            disabled={customerLoading}
                            className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-50"
                        />
                        {(customerLoading || searchLoading) && (
                            <SpinnerIcon
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                        )}
                        {selectedCustomer && !customerLoading && (
                            <button
                                onClick={handleClearSelection}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <XIcon size={16} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showDropdown && !selectedCustomer && (
                        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchLoading ? (
                                <div className="flex items-center justify-center py-4 text-muted-foreground">
                                    <SpinnerIcon size={16} className="mr-2" />
                                    <span className="text-sm">Searching...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((customer) => (
                                    <button
                                        key={customer.uid}
                                        onClick={() => handleSelectCustomer(customer)}
                                        className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-foreground">
                                                {customer.firstName} {customer.lastName}
                                            </span>
                                            {customer.customerId && (
                                                <span className="text-xs text-muted-foreground">
                                                    #{customer.customerId}
                                                </span>
                                            )}
                                        </div>
                                        {customer.address?.fullAddress && (
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                {customer.address.fullAddress}
                                            </p>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                    No customers found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Selected Customer Detail Card */}
            {selectedCustomer && detail && (
                <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm mt-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-muted/30 border-b border-border gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <UserIcon size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight text-foreground flex items-center gap-2">
                                    {detail.firstName} {detail.lastName}
                                    {detail.customerId && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                                            ID: {detail.customerId}
                                        </span>
                                    )}
                                    {detail.riskStatus && riskStatuses.length > 0 && (
                                        <StatusField
                                            type="risk_status"
                                            value={detail.riskStatus}
                                            mode="badge"
                                            riskStatuses={riskStatuses}
                                            icon={<CreditCardIcon size={14} />}
                                            className="ml-1"
                                        />
                                    )}
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Column 1: Contact */}
                        <div className="space-y-4">
                            <InfoRow icon={PhoneIcon} label="Phone" value={detail.number} />
                            <InfoRow icon={MapPinIcon} label="Postal Address" value={detail.address?.fullAddress} />
                        </div>

                        {/* Column 2: Balance */}
                        <div className="space-y-4">
                            <InfoRow icon={MailIcon} label="Email" value={detail.email} />
                            <InfoRow icon={CreditCardIcon} label="Total Balance" value="$0.00" />
                        </div>

                        {/* Column 3: Billing */}
                        <div className="space-y-4">
                            <InfoRow icon={HashIcon} label="Account Number" value={detail.utilmateDetails?.accountNumber || '-'} />
                            <InfoRow icon={CreditCardIcon} label="Overdue" value="$0.00" valueClassName="text-red-500" />
                        </div>

                        {/* Column 4: Delivery */}
                        <div className="space-y-4">
                            <InfoRow icon={BuildingIcon} label="Site Identifier" value={detail.utilmateDetails?.siteIdentifier || '-'} />
                            <InfoRow icon={CreditCardIcon} label="Current" value="$0.00" />
                        </div>
                    </div>
                </div>
            )}

            {/* Loading state for detail card */}
            {
                selectedCustomer && !detail && customerLoading && (
                    <div className="border border-border rounded-lg p-6 bg-background flex items-center justify-center">
                        <SpinnerIcon size={18} className="mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Loading customer details...</span>
                    </div>
                )
            }

            {/* Transaction List */}
            {
                selectedCustomer && detail && (
                    <div className="p-3 sm:p-5 bg-background rounded-lg border border-border shadow-sm">
                        {/* Header with Add Receipt Button */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Transaction List</h2>
                            <Button
                                size="sm"
                                leftIcon={<PlusIcon size={16} />}
                                onClick={() => setIsReceiptModalOpen(true)}
                            >
                                Add Receipt
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="mb-4">

                            <div className="relative w-full sm:max-w-sm">
                                <SearchIcon
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                />
                                <input
                                    type="text"
                                    value={searchFilter}
                                    onChange={(e) => {
                                        setSearchFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search"
                                    className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {recordsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <SpinnerIcon size={18} className="mr-2 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Loading transactions...</span>
                            </div>
                        ) : recordsError ? (
                            <div className="py-6 text-center text-sm text-red-500">{recordsError}</div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No transactions found
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/30">
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Balance</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Posted Date</th>
                                                <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">Amount</th>
                                                <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground">Allocated</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">ID</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Description</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Transaction Date</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Due Date</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedRecords.map((record, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors"
                                                >
                                                    <td className="px-4 py-2.5 whitespace-nowrap">
                                                        <span className={record.running_balance === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}>
                                                            {formatCurrency(record.running_balance)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-foreground whitespace-nowrap">
                                                        {record.transaction_date}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                                        <span className={record.amount < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                            {formatCurrency(record.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <span className={`text-xs font-medium ${record.allocated === 'Y'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-amber-600 dark:text-amber-400'
                                                            }`}>
                                                            {record.allocated}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-foreground font-mono text-xs whitespace-nowrap">
                                                        {record.transaction_type.startsWith('INV') ? (
                                                            <button
                                                                onClick={() => handlePreviewInvoice(record)}
                                                                disabled={downloadingInvoice === record.transaction_type}
                                                                title="Preview Invoice PDF"
                                                                className="text-primary hover:underline flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                                                            >
                                                                <EyeIcon size={14} className="text-primary" />
                                                                {record.transaction_type}
                                                                {downloadingInvoice === record.transaction_type && <SpinnerIcon size={12} className="animate-spin text-muted-foreground" />}
                                                            </button>
                                                        ) : (
                                                            record.transaction_type
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-green-600 dark:text-green-400 whitespace-nowrap">
                                                        {record.description}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-foreground whitespace-nowrap">
                                                        {record.transaction_date}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-foreground whitespace-nowrap">
                                                        {record.invoice_due_date || '—'}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-red-600 dark:text-red-400 whitespace-nowrap">
                                                        {record.notes || ''}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card Layout */}
                                <div className="md:hidden space-y-3">
                                    {paginatedRecords.map((record, idx) => (
                                        <div key={idx} className="border border-border rounded-lg p-3 bg-background hover:bg-accent/20 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono text-xs text-foreground font-medium">
                                                    {record.transaction_type.startsWith('INV') ? (
                                                        <button
                                                            onClick={() => handlePreviewInvoice(record)}
                                                            disabled={downloadingInvoice === record.transaction_type}
                                                            title="Preview Invoice PDF"
                                                            className="text-primary hover:underline flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                                                        >
                                                            <EyeIcon size={14} className="text-primary" />
                                                            {record.transaction_type}
                                                            {downloadingInvoice === record.transaction_type && <SpinnerIcon size={12} className="animate-spin text-muted-foreground" />}
                                                        </button>
                                                    ) : (
                                                        record.transaction_type
                                                    )}
                                                </span>
                                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${record.allocated === 'Y'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    {record.allocated === 'Y' ? 'Allocated' : 'Unallocated'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-green-600 dark:text-green-400 mb-2 break-words">
                                                {record.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                                <div>
                                                    <span className="text-muted-foreground">Amount: </span>
                                                    <span className={record.amount < 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                                                        {formatCurrency(record.amount)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Balance: </span>
                                                    <span className={record.running_balance === 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-foreground font-medium'}>
                                                        {formatCurrency(record.running_balance)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Date: </span>
                                                    <span className="text-foreground">{record.transaction_date}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Due: </span>
                                                    <span className="text-foreground">{record.invoice_due_date || '—'}</span>
                                                </div>
                                            </div>
                                            {record.notes && (
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">{record.notes}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Items per page:</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="border border-border rounded px-2 py-1 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <span className="text-sm text-muted-foreground">
                                            {startItem}-{endItem} of {totalCount}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage <= 1}
                                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="First page"
                                            >
                                                {'|<'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage <= 1}
                                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Previous page"
                                            >
                                                {'<'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage >= totalPages}
                                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Next page"
                                            >
                                                {'>'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage >= totalPages}
                                                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                title="Last page"
                                            >
                                                {'>|'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )
            }

            {/* Add Receipt Modal */}
            <Modal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                title="Add Receipt"
            >
                <form onSubmit={handleReceiptSubmit} className="space-y-4">
                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={receiptForm.amount}
                        onChange={(e) => setReceiptForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={receiptForm.date}
                        onChange={(e) => setReceiptForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                    />
                    <Input
                        label="Reference"
                        placeholder="Enter reference"
                        value={receiptForm.reference}
                        onChange={(e) => setReceiptForm(prev => ({ ...prev, reference: e.target.value }))}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsReceiptModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmittingReceipt}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Preview Offer/Invoice Modal */}
            <Modal
                isOpen={previewModalOpen}
                onClose={() => {
                    setPreviewModalOpen(false);
                    setIsLoadingPreview(false);
                }}
                title={`Invoice Preview - ${currentInvoiceRecord?.transaction_type || ''}`}
                size="full"
            >
                <div className="flex-1 h-[70vh] w-full bg-muted/20 rounded-md border overflow-hidden mb-4 relative">
                    {previewUrl && !isLoadingPreview ? (
                        <iframe
                            src={previewUrl}
                            className="w-full h-full"
                            title="Invoice Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3" />
                                <p className="text-sm font-medium">Loading preview...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setPreviewModalOpen(false);
                            setIsLoadingPreview(false);
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownloadAction}
                        disabled={!previewUrl || isLoadingPreview}
                        className="bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                        <DownloadIcon size={16} className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </Modal>
        </div >
    );
}
