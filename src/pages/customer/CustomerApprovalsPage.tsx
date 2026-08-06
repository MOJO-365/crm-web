import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import { GET_WEB_ENROLLMENTS, APPROVE_WEB_ENROLLMENT, REJECT_WEB_ENROLLMENT, SEND_OFFER_EMAIL, SEND_PDRS_CONSENT_EMAIL, GET_PEERLESS_COMPANY_NAMES } from '@/graphql';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { Select } from '@/components/ui/Select';
import { XIcon, EyeIcon, CheckIcon, AlertCircleIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import React from 'react';

interface WebEnrollment {
    id: string;
    uid: string;
    payload: any;
    processed: number;
    createdAt: string;
}

interface WebEnrollmentsResponse {
    webEnrollments: {
        data: WebEnrollment[];
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
    };
}

interface SearchFilters {
    name: string;
    email: string;
    mobile: string;
    nmi: string;
    tariff: string;
    address: string;
    status: string;
    portal: string;
    vpp: string;
    companyName: string;
}

const INITIAL_FILTERS: SearchFilters = {
    name: '',
    email: '',
    mobile: '',
    nmi: '',
    tariff: '',
    address: '',
    status: '0', // Default to show Pending (0)
    portal: '',
    vpp: '',
    companyName: ''
};

export function CustomerApprovalsPage() {
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedEnrollment, setSelectedEnrollment] = useState<WebEnrollment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [approvingUid, setApprovingUid] = useState<string | null>(null);
    const [rejectingUid, setRejectingUid] = useState<string | null>(null);
    const [enrollmentToReject, setEnrollmentToReject] = useState<WebEnrollment | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Debounce filters
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const { data, loading, error, refetch } = useQuery<WebEnrollmentsResponse>(GET_WEB_ENROLLMENTS, {
        variables: {
            page,
            limit,
            searchName: debouncedFilters.name || undefined,
            searchEmail: debouncedFilters.email || undefined,
            searchMobile: debouncedFilters.mobile || undefined,
            searchNmi: debouncedFilters.nmi || undefined,
            searchTariff: debouncedFilters.tariff || undefined,
            searchAddress: debouncedFilters.address || undefined,
            searchPortal: debouncedFilters.portal || undefined,
            searchVpp: debouncedFilters.vpp !== '' ? parseInt(debouncedFilters.vpp) : undefined,
            processed: debouncedFilters.status !== '' ? parseInt(debouncedFilters.status) : undefined,
            searchCompanyName: debouncedFilters.companyName || undefined
        },
        fetchPolicy: 'network-only'
    });

    const { data: companiesData } = useQuery(GET_PEERLESS_COMPANY_NAMES, {
        skip: filters.portal !== 'PEERLESSGROUP',
        fetchPolicy: 'network-only'
    });

    const companyOptions = React.useMemo(() => {
        const list = companiesData?.peerlessCompanyNames || [];
        return [
            { value: '', label: 'All Companies' },
            ...list.map((c: string) => ({ value: c, label: c }))
        ];
    }, [companiesData]);

    const portalOptions = React.useMemo(() => {
        return [
            { value: '', label: 'All Portals' },
            { value: 'Gee Energy', label: 'Gee Energy' },
            { value: 'PEERLESSGROUP', label: 'Peer Less Group' },
            { value: 'BESS2', label: 'BESS2' }
        ];
    }, []);

    const enrollments = data?.webEnrollments?.data || [];
    const meta = data?.webEnrollments?.meta;

    const [sendOfferEmail] = useMutation(SEND_OFFER_EMAIL, {
        onCompleted: () => {
            toast.success('Offer email sent successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to send email: ${error.message}`);
        }
    });

    const [sendPdrsConsentEmail] = useMutation(SEND_PDRS_CONSENT_EMAIL, {
        onCompleted: () => {
            toast.success('PDRS consent email sent successfully!');
        },
        onError: (error) => {
            toast.error(`Failed to send PDRS email: ${error.message}`);
        }
    });

    const [approveMutation, { loading: approving }] = useMutation(APPROVE_WEB_ENROLLMENT, {
        onCompleted: (data) => {
            if (isSendingEmail && data.approveWebEnrollment?.uid) {
                const enrollment = enrollments.find(e => e.uid === approvingUid);
                const isPdrs = enrollment?.payload?.portalname === 'PDRS' || enrollment?.payload?.portalName === 'PDRS';

                if (isPdrs) {
                    sendPdrsConsentEmail({ variables: { customerUid: data.approveWebEnrollment.uid } });
                    toast.success('Customer approved and PDRS consent email triggered!');
                } else {
                    sendOfferEmail({ variables: { customerUid: data.approveWebEnrollment.uid } });
                    toast.success('Customer approved and offer email triggered!');
                }
            } else {
                toast.success('Customer approved and integrated successfully!');
            }
            refetch();
            setIsModalOpen(false);
            setApprovingUid(null);
            setIsSendingEmail(false);
        },
        onError: (error) => {
            toast.error(`Approval failed: ${error.message}`);
            setApprovingUid(null);
            setIsSendingEmail(false);
        }
    });

    const [rejectMutation, { loading: rejecting }] = useMutation(REJECT_WEB_ENROLLMENT, {
        onCompleted: () => {
            toast.success('Enrollment rejected successfully.');
            refetch();
            setIsModalOpen(false);
            setIsRejectDialogOpen(false);
            setRejectingUid(null);
            setEnrollmentToReject(null);
        },
        onError: (error) => {
            toast.error(`Rejection failed: ${error.message}`);
            setRejectingUid(null);
        }
    });

    const handleView = (enrollment: WebEnrollment) => {
        setSelectedEnrollment(enrollment);
        setIsModalOpen(true);
    };

    const handleApprove = (enrollment: WebEnrollment, sendEmail: boolean = false) => {
        if (approving || rejecting) return;
        setApprovingUid(enrollment.uid);
        setIsSendingEmail(sendEmail);
        approveMutation({ variables: { uid: enrollment.uid } });
    };

    const handleReject = (enrollment: WebEnrollment) => {
        if (approving || rejecting) return;
        setEnrollmentToReject(enrollment);
        setIsRejectDialogOpen(true);
    };

    const handleConfirmReject = () => {
        if (!enrollmentToReject) return;
        setRejectingUid(enrollmentToReject.uid);
        rejectMutation({ variables: { uid: enrollmentToReject.uid } });
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => {
            const next = { ...prev, [key]: value };
            if (key === 'portal' && value !== 'PEERLESSGROUP') {
                next.companyName = '';
            }
            return next;
        });
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const renderPayloadField = (field: any) => {
        if (field === null || field === undefined) return '-';
        if (typeof field === 'object') {
            return field.address || field.fullAddress || JSON.stringify(field);
        }
        return String(field);
    };

    const columns: Column<WebEnrollment>[] = [
        {
            key: 'name',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.name ? "text-primary" : "text-muted-foreground"
                        )}>
                            Customer
                        </span>
                        {filters.name && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        placeholder="Search name..."
                        className={cn(
                            "h-7 text-xs w-[150px] transition-all duration-200",
                            filters.name && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={filters.name && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleFilterChange('name', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => {
                const { title, firstname, lastname, email } = row.payload || {};
                const fullName = [title, firstname, lastname].filter(v => v && typeof v !== 'object').join(' ');
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{fullName || '-'}</span>
                        <span className="text-xs text-muted-foreground">{renderPayloadField(email)}</span>
                    </div>
                );
            }
        },
        {
            key: 'mobile',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.mobile ? "text-primary" : "text-muted-foreground"
                        )}>
                            Mobile
                        </span>
                        {filters.mobile && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={filters.mobile}
                        onChange={(e) => handleFilterChange('mobile', e.target.value)}
                        placeholder="Search mobile..."
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            filters.mobile && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={filters.mobile && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleFilterChange('mobile', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => <span className="text-foreground">{renderPayloadField(row.payload?.number || row.payload?.mobile || row.payload?.phone)}</span>
        },
        {
            key: 'address',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.address ? "text-primary" : "text-muted-foreground"
                        )}>
                            Address
                        </span>
                        {filters.address && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={filters.address}
                        onChange={(e) => handleFilterChange('address', e.target.value)}
                        placeholder="Search address..."
                        className={cn(
                            "h-7 text-xs w-[180px] transition-all duration-200",
                            filters.address && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={filters.address && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleFilterChange('address', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => {
                const addr = renderPayloadField(row.payload?.address);
                return (
                    <div className="max-w-[200px] truncate text-foreground" title={addr}>
                        {addr}
                    </div>
                );
            }
        },
        {
            key: 'nmi',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.nmi ? "text-primary" : "text-muted-foreground"
                        )}>
                            NMI
                        </span>
                        {filters.nmi && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={filters.nmi}
                        onChange={(e) => handleFilterChange('nmi', e.target.value)}
                        placeholder="Search NMI..."
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            filters.nmi && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={filters.nmi && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleFilterChange('nmi', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => <span className="text-foreground">{renderPayloadField(row.payload?.nmi)}</span>
        },
        {
            key: 'tariffcode',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.tariff ? "text-primary" : "text-muted-foreground"
                        )}>
                            Tariff
                        </span>
                        {filters.tariff && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Input
                        value={filters.tariff}
                        onChange={(e) => handleFilterChange('tariff', e.target.value)}
                        placeholder="Search Tariff..."
                        className={cn(
                            "h-7 text-xs w-[100px] transition-all duration-200",
                            filters.tariff && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                        rightIcon={filters.tariff && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => handleFilterChange('tariff', '')}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => {
                const tariff = renderPayloadField(row.payload?.tariffcode || row.payload?.tariffCode || row.payload?.tariff_code || row.payload?.tariff);
                return (
                    tariff !== '-' ? (
                        <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded text-xs font-medium border border-purple-100 dark:border-purple-800">
                            {tariff}
                        </span>
                    ) : <span className="text-muted-foreground">-</span>
                );
            }
        },
        {
            key: 'vpp',
            header: (
                <div className="flex flex-col gap-1 items-center">
                    <div className="h-7 flex items-center justify-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.vpp !== '' ? "text-primary" : "text-muted-foreground"
                        )}>
                            VPP
                        </span>
                        {filters.vpp !== '' && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[
                            { value: '', label: 'All' },
                            { value: '1', label: 'Yes' },
                            { value: '0', label: 'No' }
                        ]}
                        value={filters.vpp}
                        onChange={(val) => handleFilterChange('vpp', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[70px] transition-all duration-200",
                            filters.vpp !== '' && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <div className="flex justify-center">
                    {(row.payload?.isVpp === 1 || row.payload?.isVpp === '1' || row.payload?.isVpp === true || row.payload?.isVpp === 'true') ? (
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    ) : (
                        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1">
                            <XIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'portalname',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.portal ? "text-primary" : "text-muted-foreground"
                        )}>
                            Portal
                        </span>
                        {filters.portal && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={portalOptions}
                        value={filters.portal}
                        onChange={(val) => handleFilterChange('portal', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[120px] transition-all duration-200",
                            filters.portal && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => {
                if (row.payload?.acpDetails) {
                    return (
                        <span className="text-foreground font-medium text-xs">
                            BESS2
                        </span>
                    );
                }
                const rawPortal = row.payload?.portalname || row.payload?.portalName;
                let displayPortal = rawPortal ? String(rawPortal) : '-';
                if (displayPortal.toUpperCase() === 'PEERLESSGROUP') {
                    displayPortal = 'Peer Less Group';
                } else if (displayPortal.toUpperCase().includes('GEE')) {
                    displayPortal = 'Gee Energy';
                }
                return (
                    <span className="text-foreground font-medium text-xs">
                        {displayPortal}
                    </span>
                );
            }
        },
        ...(filters.portal === 'BESS2' ? [{
            key: 'acName',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Ac Name
                        </span>
                    </div>
                    <div className="h-7" />
                </div>
            ),
            render: (row: WebEnrollment) => {
                const acpName = row.payload?.acpDetails?.acpDisplayName || '-';
                return (
                    <span className="text-foreground font-medium text-xs">
                        {acpName}
                    </span>
                );
            }
        }] : []),
        ...(filters.portal === 'PEERLESSGROUP' ? [{
            key: 'companyname',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.companyName ? "text-primary" : "text-muted-foreground"
                        )}>
                            Company Name
                        </span>
                        {filters.companyName && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={companyOptions}
                        value={filters.companyName}
                        onChange={(val) => handleFilterChange('companyName', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[140px] transition-all duration-200",
                            filters.companyName && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row: WebEnrollment) => {
                const name = row.payload?.createdBy?.company_name || row.payload?.createdBy?.companyName || row.payload?.companyname || row.payload?.companyName || row.payload?.company_name || row.payload?.businessName || row.payload?.businessname || row.payload?.company;
                return (
                    <span className="text-foreground font-medium text-xs">
                        {name ? String(name) : '-'}
                    </span>
                );
            }
        }] : []),
        {
            key: 'status',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center gap-1.5">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            filters.status !== '' ? "text-primary" : "text-muted-foreground"
                        )}>
                            Status
                        </span>
                        {filters.status !== '' && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                    <Select
                        options={[
                            { value: '', label: 'All' },
                            { value: '0', label: 'Pending' },
                            { value: '2', label: 'Rejected' }
                        ]}
                        value={filters.status}
                        onChange={(val) => handleFilterChange('status', val as string)}
                        placeholder="All"
                        className={cn(
                            "h-7 text-xs w-[100px] transition-all duration-200",
                            filters.status !== '' && "border-primary ring-1 ring-primary/30 bg-primary/5"
                        )}
                    />
                </div>
            ),
            render: (row) => (
                <div className="whitespace-nowrap">
                    <div className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        row.processed === 1
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : row.processed === 2
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                        {row.processed === 1 ? 'Processed' : row.processed === 2 ? 'Rejected' : 'Pending'}
                    </div>
                </div>
            )
        },
        {
            key: 'actions',
            sticky: 'right',
            header: (
                <div className="flex flex-col gap-1">
                    <div className="h-7 flex items-center">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Actions</span>
                    </div>
                </div>
            ),
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Tooltip content="View Details">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => handleView(row)}
                        >
                            <EyeIcon size={16} />
                        </Button>
                    </Tooltip>
                    {row.processed === 0 && (
                        <>
                            <Tooltip content="Approve & Integrate">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                    onClick={() => handleApprove(row)}
                                    isLoading={approvingUid === row.uid}
                                    disabled={(approving || rejecting) && approvingUid !== row.uid}
                                >
                                    {approvingUid !== row.uid && <CheckIcon size={16} />}
                                </Button>
                            </Tooltip>
                            <Tooltip content="Reject Enrollment">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    onClick={() => handleReject(row)}
                                    isLoading={rejectingUid === row.uid}
                                    disabled={(approving || rejecting) && rejectingUid !== row.uid}
                                >
                                    {rejectingUid !== row.uid && <XIcon size={16} />}
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </div>
            )
        }
    ];

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load web enrollments: {error.message}
            </div>
        );
    }

    const isFiltered = Object.keys(filters).some(key => filters[key as keyof SearchFilters] !== INITIAL_FILTERS[key as keyof SearchFilters]);

    const handleResetFilters = () => {
        setFilters(INITIAL_FILTERS);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Approvals</h1>
                    <p className="text-muted-foreground">
                        Review and approve pending customer approvals.
                    </p>
                </div>
            </div>

            <div className='p-5 bg-background rounded-lg border border-border shadow-sm'>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Total Customer Approvals: <span className="text-foreground font-bold">{meta?.totalRecords || 0}</span>
                        </p>
                        {isFiltered && (
                            <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<XIcon size={14} />}
                                onClick={handleResetFilters}
                                className="text-xs font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 h-7 px-3 rounded-full transition-all shadow-sm"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={enrollments}
                    loading={loading}
                    rowKey={(row) => row.uid}
                    enableSelection={true}
                    selectedRowKeys={selectedRowKeys}
                    onSelectionChange={setSelectedRowKeys}
                    pagination={{
                        currentPage: page,
                        pageSize: limit,
                        totalCount: meta?.totalRecords || 0,
                        onPageChange: setPage,
                        onPageSizeChange: setLimit,
                        hasNextPage: page < (meta?.totalPages || 1),
                        hasPreviousPage: page > 1
                    }}
                    containerHeightClass="h-[calc(100vh-280px)]"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Enrollment Payload Data"
                size="3xl"
            >
                <div className="space-y-6">
                    {selectedEnrollment?.payload ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Details */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-sm border-b pb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">Title</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.title)}</span>
                                    <span className="text-muted-foreground">First Name</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.firstname)}</span>
                                    <span className="text-muted-foreground">Last Name</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.lastname)}</span>
                                    <span className="text-muted-foreground">DOB</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.dob)}</span>
                                </div>
                            </div>

                            {/* Contact & Property */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border overflow-hidden">
                                <h3 className="font-semibold text-sm border-b pb-2">Contact & Property</h3>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium break-all">{renderPayloadField(selectedEnrollment.payload.email)}</span>
                                    <span className="text-muted-foreground">Mobile</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.number || selectedEnrollment.payload.mobile || selectedEnrollment.payload.phone)}</span>
                                    <span className="text-muted-foreground flex items-center">Customer Type</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.customerType ? (
                                            <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">{renderPayloadField(selectedEnrollment.payload.customerType)}</span>
                                        ) : '-'}
                                    </span>
                                    <div className="col-span-2 pt-1">
                                        <span className="text-muted-foreground block mb-1">Address</span>
                                        <span className="font-medium block break-words leading-relaxed text-wrap" title={renderPayloadField(selectedEnrollment.payload.address)}>{renderPayloadField(selectedEnrollment.payload.address)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Connection Details */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-sm border-b pb-2">Utility Connections</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">NMI</span>
                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.nmi)}</span>
                                    <span className="text-muted-foreground">Tariff Code</span>
                                    <span className="font-medium">
                                        {(selectedEnrollment.payload.tariffcode || selectedEnrollment.payload.tariffCode || selectedEnrollment.payload.tariff_code || selectedEnrollment.payload.tariff) ? (
                                            <span className="inline-flex px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                                                {renderPayloadField(selectedEnrollment.payload.tariffcode || selectedEnrollment.payload.tariffCode || selectedEnrollment.payload.tariff_code || selectedEnrollment.payload.tariff)}
                                            </span>
                                        ) : '-'}
                                    </span>
                                    <span className="text-muted-foreground">Ownership Status</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.ownership_status !== undefined
                                            ? selectedEnrollment.payload.ownership_status === 0 ? 'Owner' : 'Renter'
                                            : '-'}
                                    </span>
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.discount !== undefined ? `${selectedEnrollment.payload.discount}%` : '-'}
                                    </span>
                                    <span className="text-muted-foreground">Plan Name</span>
                                    <span className="font-medium">
                                        {renderPayloadField(
                                            selectedEnrollment.payload.planDetails?.planName ||
                                            selectedEnrollment.payload.planName ||
                                            selectedEnrollment.payload.plan_name ||
                                            selectedEnrollment.payload.ratePlan?.title ||
                                            selectedEnrollment.payload.ratePlan?.name
                                        )}
                                    </span>
                                    <span className="text-muted-foreground">Is Solar</span>
                                    <span className="font-medium">
                                        {(() => {
                                            const val = selectedEnrollment.payload.planDetails?.isSolarRequired ?? selectedEnrollment.payload.isSolarRequired;
                                            return val === 1 || val === '1' || val === true || val === 'true' ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-600 font-bold uppercase text-[10px]">
                                                    <CheckIcon size={14} /> YES
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-red-500 font-bold uppercase text-[10px]">
                                                    <XIcon size={14} /> NO
                                                </span>
                                            );
                                        })()}
                                    </span>
                                    <span className="text-muted-foreground">Battery Participation</span>
                                    <span className="font-medium">
                                        {(() => {
                                            const val = selectedEnrollment.payload.planDetails?.isBatteryRequired ?? selectedEnrollment.payload.isBattery ?? selectedEnrollment.payload.hasBattery ?? selectedEnrollment.payload.is_battery ?? selectedEnrollment.payload.has_battery ?? selectedEnrollment.payload.batteryDetails?.isbattery;
                                            return val === 1 || val === '1' || val === true || val === 'true' ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-600 font-bold uppercase text-[10px]">
                                                    <CheckIcon size={14} /> YES
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-red-500 font-bold uppercase text-[10px]">
                                                    <XIcon size={14} /> NO
                                                </span>
                                            );
                                        })()}
                                    </span>
                                </div>
                            </div>

                            {/* Identification */}
                            {(selectedEnrollment.payload.idType === 0 ||
                                selectedEnrollment.payload.idType === 1 ||
                                selectedEnrollment.payload.idType === 2 ||
                                (selectedEnrollment.payload.idnumber && selectedEnrollment.payload.idnumber !== '-')) && (
                                    <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                        <h3 className="font-semibold text-sm border-b pb-2">Identification Identity</h3>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            <span className="text-muted-foreground">ID Type</span>
                                            <span className="font-medium">
                                                {selectedEnrollment.payload.idType === 0 ? 'Driver License' : selectedEnrollment.payload.idType === 1 ? 'Medicare' : selectedEnrollment.payload.idType === 2 ? 'Passport' : 'Unknown'}
                                            </span>

                                            {/* Conditional fields based on ID Type */}
                                            {selectedEnrollment.payload.idType === 0 && (
                                                <>
                                                    <span className="text-muted-foreground">ID Number</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idnumber)}</span>
                                                    <span className="text-muted-foreground">Issue State</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idstate)}</span>
                                                    <span className="text-muted-foreground">Card Number</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idcardnumber || selectedEnrollment.payload.licenseCardNumber || selectedEnrollment.payload.license_card_number || selectedEnrollment.payload.cardnumber || selectedEnrollment.payload.cardNumber)}</span>
                                                </>
                                            )}

                                            {selectedEnrollment.payload.idType === 1 && (
                                                <>
                                                    <span className="text-muted-foreground">Card Type</span>
                                                    <span className="font-medium">
                                                        {(selectedEnrollment.payload.medicareCardType === 0 || selectedEnrollment.payload.medicare_card_type === 0) ? 'Standard (Green)' :
                                                            (selectedEnrollment.payload.medicareCardType === 1 || selectedEnrollment.payload.medicare_card_type === 1) ? 'Interim (Blue)' :
                                                                (selectedEnrollment.payload.medicareCardType === 2 || selectedEnrollment.payload.medicare_card_type === 2) ? 'Reciprocal (Yellow)' :
                                                                    renderPayloadField(selectedEnrollment.payload.medicareCardType || selectedEnrollment.payload.medicare_card_type || selectedEnrollment.payload.cardtype)}
                                                    </span>
                                                    <span className="text-muted-foreground">Card Number</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idnumber)}</span>
                                                    <span className="text-muted-foreground">Expiry Date</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idexpiary || selectedEnrollment.payload.idexpiry || selectedEnrollment.payload.expiarydate)}</span>
                                                </>
                                            )}

                                            {selectedEnrollment.payload.idType === 2 && (
                                                <>
                                                    <span className="text-muted-foreground">Passport Number</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idnumber)}</span>
                                                    <span className="text-muted-foreground">Expiry Date</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idexpiary || selectedEnrollment.payload.idexpiry)}</span>
                                                </>
                                            )}

                                            {/* Fallback for other types or missing type */}
                                            {selectedEnrollment.payload.idType !== 0 && selectedEnrollment.payload.idType !== 1 && selectedEnrollment.payload.idType !== 2 && (
                                                <>
                                                    <span className="text-muted-foreground">ID Number</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idnumber)}</span>
                                                    <span className="text-muted-foreground">Expiry Date</span>
                                                    <span className="font-medium">{renderPayloadField(selectedEnrollment.payload.idexpiary || selectedEnrollment.payload.idexpiry)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className="text-center p-8 text-muted-foreground">No payload data available for this enrollment.</div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                        {selectedEnrollment?.processed === 0 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleReject(selectedEnrollment!)}
                                    isLoading={rejectingUid === selectedEnrollment.uid}
                                    loadingText="Rejecting..."
                                    disabled={approvingUid === selectedEnrollment.uid}
                                >
                                    Reject
                                </Button>

                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Rejection Confirmation Modal */}
            <Modal
                isOpen={isRejectDialogOpen}
                onClose={() => !rejecting && setIsRejectDialogOpen(false)}
                title="Reject Enrollment"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3 text-center py-2">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <AlertCircleIcon size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-foreground">Are you sure?</p>
                            <p className="text-sm text-muted-foreground mt-1 px-2">
                                You are about to reject the enrollment for <span className="font-bold text-foreground">
                                    {[enrollmentToReject?.payload?.firstname, enrollmentToReject?.payload?.lastname].filter(v => v && typeof v !== 'object').join(' ') || 'this customer'}
                                </span>. This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            variant="destructive"
                            className="w-full h-11"
                            onClick={handleConfirmReject}
                            isLoading={rejectingUid === enrollmentToReject?.uid}
                            loadingText="Rejecting..."
                        >
                            Yes, Reject Enrollment
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full h-11 text-foreground"
                            onClick={() => setIsRejectDialogOpen(false)}
                            disabled={rejectingUid !== null}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
