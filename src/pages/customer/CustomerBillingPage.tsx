import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_CUSTOMER_BILLING_INFO, SEARCH_CUSTOMERS_BASIC, GET_RISK_STATUSES } from '@/graphql';
import { SearchIcon, XIcon, SpinnerIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, UserIcon, HashIcon, BuildingIcon, EyeIcon, EyeOffIcon, DownloadIcon } from '@/components/icons';
import { secondaryApiAxios, apiAxios } from '@/lib/apollo';
import { Modal, StatusField, DataTable, type Column } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { PlusIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

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
    uid: string;
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
    show_to_customer: string | boolean | number;
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
    const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());

    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);
        const to = new Date();
        return { from, to };
    });

    const formatDateToYYYYMMDD = useCallback((date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);


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
    const fetchAccountRecords = useCallback(async (customerUid: string) => {
        if (!dateRange.from || !dateRange.to) return;
        setRecordsLoading(true);
        setRecordsError(null);
        try {
            const from = formatDateToYYYYMMDD(dateRange.from);
            const to = formatDateToYYYYMMDD(dateRange.to);

            const response = await apiAxios.get('/myAccountcrm/user/records/all', {
                params: {
                    from,
                    to,
                    customer_uid: customerUid,
                },
                headers: {
                    'x-web-token': import.meta.env.VITE_MACRM_TOKEN,
                }
            });

            const records = response?.data?.data || response?.data;

            if (Array.isArray(records)) {
                setAccountRecords(records);
            } else {
                setAccountRecords([]);
            }
        } catch (err) {
            console.error('Failed to fetch account records:', err);
            setAccountRecords([]);
            setRecordsError(null);
        } finally {
            setRecordsLoading(false);
        }
    }, [dateRange, formatDateToYYYYMMDD]);

    // Initialize visibleRows from accountRecords
    useEffect(() => {
        if (accountRecords.length > 0) {
            const initialVisible = new Set<string>();
            accountRecords.forEach(record => {
                const rowId = `${record.transaction_type}-${record.transaction_date}`;
                if (String(record.show_to_customer) === 'true' || record.show_to_customer === 1 || record.show_to_customer === true) {
                    initialVisible.add(rowId);
                }
            });
            setVisibleRows(initialVisible);
        }
    }, [accountRecords]);

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
        const customerUid = customerData?.customer?.uid;
        if (customerUid) {
            fetchAccountRecords(customerUid);
        }
    }, [customerData?.customer?.uid, fetchAccountRecords]);

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

    const handleToggleVisibility = useCallback(async (record: AccountRecord, nextVisible: boolean) => {
        const rowId = `${record.transaction_type}-${record.transaction_date}`;

        if (!record.uid) {
            toast.error('Record UID not found');
            return;
        }

        // Optimistic update
        setVisibleRows(prev => {
            const next = new Set(prev);
            if (nextVisible) next.add(rowId);
            else next.delete(rowId);
            return next;
        });

        try {
            await apiAxios.put('/myAccountcrm/user/records/visibility', {
                uid: record.uid,
                show_to_customer: nextVisible
            }, {
                headers: {
                    'x-web-token': import.meta.env.VITE_MACRM_TOKEN,
                }
            });
            // toast.success(`Visibility updated for ${record.transaction_type}`);
        } catch (err) {
            console.error('Failed to update visibility:', err);
            toast.error('Failed to update visibility');
            // Revert on failure
            setVisibleRows(prev => {
                const next = new Set(prev);
                if (nextVisible) next.delete(rowId);
                else next.add(rowId);
                return next;
            });
        }
    }, []);

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

            const response = await secondaryApiAxios.post('/v1/utilmate/user/invoice', {
                companycode: "GEE",
                methodcode: "GETINVOICEPDF",
                parameters: {
                    account_number: record.account_number,
                    invoice_number: invoiceNumber
                }
            }, {
                headers: {
                    'x-api-key': import.meta.env.VITE_UTILMATE_API_KEY,
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
                } catch {
                    /* ignore parsing errors */
                }
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

    const latestBalance = useMemo(() => {
        if (accountRecords.length === 0) return 0;
        // Sort by transaction_date descending
        const sorted = [...accountRecords].sort((a, b) => {
            const dateA = new Date(a.transaction_date).getTime();
            const dateB = new Date(b.transaction_date).getTime();
            return dateB - dateA;
        });
        return sorted[0].running_balance;
    }, [accountRecords]);

    const columns = useMemo<Column<AccountRecord>[]>(() => [
        {
            key: 'running_balance',
            header: 'Balance',
            render: (record) => (
                <span className={record.running_balance === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}>
                    {formatCurrency(record.running_balance)}
                </span>
            )
        },
        {
            key: 'posted_date',
            header: 'Posted Date',
            render: (record) => record.transaction_date
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (record) => (
                <div className="text-right">
                    <span className={record.amount < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(record.amount)}
                    </span>
                </div>
            )
        },
        {
            key: 'allocated',
            header: 'Allocated',
            render: (record) => (
                <div className="text-center">
                    <span className={`text-xs font-medium ${record.allocated === 'Y'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                        }`}>
                        {record.allocated}
                    </span>
                </div>
            )
        },
        {
            key: 'transaction_type',
            header: 'ID',
            render: (record) => (
                <span className="font-mono text-xs whitespace-nowrap">
                    {record.transaction_type.startsWith('INV') ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewInvoice(record)}
                            isLoading={downloadingInvoice === record.transaction_type}
                            title="Preview Invoice PDF"
                            className="h-8 px-3 font-mono text-[11px] text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full border border-primary/10 shadow-sm hover:shadow-md transition-all active:scale-95 gap-2"
                            leftIcon={<EyeIcon size={14} />}
                        >
                            {record.transaction_type}
                        </Button>
                    ) : (
                        record.transaction_type
                    )}
                </span>
            )
        },
        {
            key: 'description',
            header: 'Description',
            width: 'w-[300px]',
            render: (record) => (
                <span className="text-green-600 dark:text-green-400">
                    {record.description}
                </span>
            )
        },
        {
            key: 'transaction_date',
            header: 'Transaction Date',
            render: (record) => (
                <span className="whitespace-nowrap">
                    {record.transaction_date}
                </span>
            )
        },
        {
            key: 'invoice_due_date',
            header: 'Due Date',
            render: (record) => (
                <span className="whitespace-nowrap">
                    {record.invoice_due_date || '—'}
                </span>
            )
        },
        {
            key: 'notes',
            header: 'Notes',
            render: (record) => (
                <span className="text-red-600 dark:text-red-400 whitespace-nowrap">
                    {record.notes || ''}
                </span>
            )
        },
        {
            key: 'actions',
            header: '',
            width: 'w-[100px]',
            sticky: 'right',
            render: (record) => {
                const rowId = `${record.transaction_type}-${record.transaction_date}`;
                const isVisible = visibleRows.has(rowId);
                return (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(record, !isVisible);
                        }}
                        className={cn(
                            "h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2",
                            isVisible
                                ? "bg-emerald-50/80 backdrop-blur-sm text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50"
                                : "bg-zinc-50/80 backdrop-blur-sm text-zinc-700 hover:bg-zinc-100 border border-zinc-200/50"
                        )}
                        leftIcon={isVisible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                    >
                        {isVisible ? 'Visible' : 'Hidden'}
                    </Button>
                );
            }
        }
    ], [downloadingInvoice, handlePreviewInvoice, visibleRows, handleToggleVisibility]);

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
                        className="h-10 w-10 shrink-0 rounded-full border-border/50 shadow-sm hover:shadow-md active:scale-95 bg-background/50 backdrop-blur-sm"
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
                <div className="relative w-full" ref={dropdownRef}>
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted/50 p-1 rounded-full transition-all active:scale-90"
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
                            <InfoRow icon={CreditCardIcon} label="Total Balance" value={formatCurrency(latestBalance)} />
                        </div>

                        {/* Column 3: Billing */}
                        <div className="space-y-4">
                            <InfoRow icon={HashIcon} label="Account Number" value={detail.utilmateDetails?.accountNumber || '-'} />
                            {/* <InfoRow icon={CreditCardIcon} label="Overdue" value="$0.00" valueClassName="text-red-500" /> */}
                        </div>

                        {/* Column 4: Delivery */}
                        <div className="space-y-4">
                            <InfoRow icon={BuildingIcon} label="Site Identifier" value={detail.utilmateDetails?.siteIdentifier || '-'} />
                            {/* <InfoRow icon={CreditCardIcon} label="Current" value="$0.00" /> */}
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
                    <div className="p-2 sm:p-4 bg-background rounded-lg border border-border shadow-sm">
                        {/* Header with Add Receipt Button & Date Range Picker */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Transaction List</h2>
                            
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                {/* Date Range Picker */}
                                <DateRangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                />

                                <Button
                                    size="sm"
                                    leftIcon={<PlusIcon size={16} />}
                                    onClick={() => setIsReceiptModalOpen(true)}
                                    className="rounded-full shadow-sm hover:shadow-md active:scale-95 px-5 shrink-0"
                                >
                                    Add Receipt
                                </Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-4">

                            <div className="relative w-full">
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
                                <div className="hidden md:block">
                                    <DataTable
                                        columns={columns}
                                        data={paginatedRecords}
                                        rowKey={(record) => `${record.transaction_type}-${record.transaction_date}`}
                                        loading={recordsLoading}
                                        emptyMessage="No transactions found"
                                        className="border border-border rounded-lg overflow-hidden"
                                        maxHeightClass="max-h-none"
                                        rowClassName={(record) => {
                                            const rowId = `${record.transaction_type}-${record.transaction_date}`;
                                            const isVisible = visibleRows.has(rowId);
                                            return cn(
                                                "transition-all duration-200",
                                                isVisible ? "" : "bg-amber-50/70 dark:bg-amber-900/10"
                                            );
                                        }}
                                    />
                                </div>

                                {/* Mobile Card Layout */}
                                <div className="md:hidden space-y-3">
                                    {paginatedRecords.map((record, idx) => {
                                        const rowId = `${record.transaction_type}-${record.transaction_date}`;
                                        const isVisible = visibleRows.has(rowId);
                                        return (
                                            <div key={idx} className={cn(
                                                "border rounded-lg p-3 transition-all",
                                                isVisible
                                                    ? "bg-background border-border"
                                                    : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 shadow-sm"
                                            )}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs text-foreground font-medium">
                                                            {record.transaction_type.startsWith('INV') ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handlePreviewInvoice(record)}
                                                                    isLoading={downloadingInvoice === record.transaction_type}
                                                                    title="Preview Invoice PDF"
                                                                    className="h-8 px-3 font-mono text-[11px] text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full border border-primary/10 shadow-sm active:scale-95 gap-2"
                                                                    leftIcon={<EyeIcon size={14} />}
                                                                >
                                                                    {record.transaction_type}
                                                                </Button>
                                                            ) : (
                                                                record.transaction_type
                                                            )}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            // variant="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleVisibility(record, !isVisible);
                                                            }}
                                                            className={cn(
                                                                "h-7 px-3 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-1.5",
                                                                isVisible
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                                                    : "bg-zinc-50 text-zinc-700 border border-zinc-200/50"
                                                            )}
                                                            leftIcon={isVisible ? <EyeIcon size={12} /> : <EyeOffIcon size={12} />}
                                                        >
                                                            {isVisible ? 'Visible' : 'Hidden'}
                                                        </Button>
                                                    </div>
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
                                        );
                                    })}
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
                                                className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                                title="First page"
                                            >
                                                {'|<'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage <= 1}
                                                className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                                title="Previous page"
                                            >
                                                {'<'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage >= totalPages}
                                                className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                                title="Next page"
                                            >
                                                {'>'}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage >= totalPages}
                                                className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
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
                            className="rounded-full px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmittingReceipt}
                            className="rounded-full px-8 shadow-sm hover:shadow-md active:scale-95 transition-all"
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
                        className="rounded-full px-6"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownloadAction}
                        disabled={!previewUrl || isLoadingPreview}
                        className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-8 shadow-sm hover:shadow-md active:scale-95 transition-all"
                    >
                        <DownloadIcon size={16} className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </Modal>
        </div >
    );
}
