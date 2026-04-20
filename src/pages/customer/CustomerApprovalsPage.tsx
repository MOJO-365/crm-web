import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DataTable, type Column, Modal } from '@/components/common';
import { GET_WEB_ENROLLMENTS, APPROVE_WEB_ENROLLMENT } from '@/graphql';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { XIcon, EyeIcon, CheckIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

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

export function CustomerApprovalsPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [selectedEnrollment, setSelectedEnrollment] = useState<WebEnrollment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approvingUid, setApprovingUid] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, loading, error, refetch } = useQuery<WebEnrollmentsResponse>(GET_WEB_ENROLLMENTS, {
        variables: {
            page,
            limit,
            search: debouncedSearch || undefined
        },
        fetchPolicy: 'network-only'
    });

    const enrollments = data?.webEnrollments?.data || [];
    const meta = data?.webEnrollments?.meta;

    const [approveMutation, { loading: approving }] = useMutation(APPROVE_WEB_ENROLLMENT, {
        onCompleted: () => {
            toast.success('Customer approved and integrated successfully!');
            refetch();
            setIsModalOpen(false);
            setApprovingUid(null);
        },
        onError: (error) => {
            toast.error(`Approval failed: ${error.message}`);
            setApprovingUid(null);
        }
    });

    const handleView = (enrollment: WebEnrollment) => {
        setSelectedEnrollment(enrollment);
        setIsModalOpen(true);
    };

    const handleApprove = (enrollment: WebEnrollment) => {
        if (approving) return;
        setApprovingUid(enrollment.uid);
        approveMutation({ variables: { uid: enrollment.uid } });
    };

    const columns: Column<WebEnrollment>[] = [
        {
            key: 'name',
            header: (
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</span>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name/email..."
                        className="h-7 text-xs w-[180px]"
                        rightIcon={search && (
                            <button onClick={() => setSearch('')}>
                                <XIcon size={12} />
                            </button>
                        )}
                    />
                </div>
            ),
            render: (row) => {
                const { title, firstname, lastname, email } = row.payload || {};
                const fullName = [title, firstname, lastname].filter(Boolean).join(' ');
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{fullName || '-'}</span>
                        <span className="text-xs text-muted-foreground">{email}</span>
                    </div>
                );
            }
        },
        {
            key: 'mobile',
            header: 'Mobile',
            render: (row) => <span>{row.payload?.number || '-'}</span>
        },
        {
            key: 'address',
            header: 'Address',
            render: (row) => (
                <div className="max-w-[200px] truncate" title={row.payload?.address}>
                    {row.payload?.address || '-'}
                </div>
            )
        },
        {
            key: 'nmi',
            header: 'NMI',
            render: (row) => <span>{row.payload?.nmi || '-'}</span>
        },
        {
            key: 'tariffcode',
            header: 'Tariff',
            render: (row) => <span>{row.payload?.tariffcode || '-'}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    row.processed === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                )}>
                    {row.processed === 1 ? 'Processed' : 'Pending'}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Tooltip content="View Raw Data">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleView(row)}
                        >
                            <EyeIcon size={16} />
                        </Button>
                    </Tooltip>
                    {row.processed === 0 && (
                        <Tooltip content="Approve & Integrate">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary"
                                onClick={() => handleApprove(row)}
                                isLoading={approvingUid === row.uid}
                                disabled={approving && approvingUid !== row.uid}
                            >
                                {approvingUid !== row.uid && <CheckIcon size={16} />}
                            </Button>
                        </Tooltip>
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Approvals</h1>
                    <p className="text-muted-foreground">
                        Review and approve pending web enrollments from the public interface.
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={enrollments}
                loading={loading}
                rowKey={(row) => row.uid}
                pagination={{
                    currentPage: page,
                    pageSize: limit,
                    totalCount: meta?.totalRecords || 0,
                    onPageChange: setPage,
                    onPageSizeChange: setLimit,
                    hasNextPage: page < (meta?.totalPages || 1),
                    hasPreviousPage: page > 1
                }}
                containerHeightClass="h-[calc(100vh-225px)]"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Enrollment Payload Data"
                size="xl"
            >
                <div className="space-y-6">
                    {selectedEnrollment?.payload ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Details */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-sm border-b pb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">Title</span>
                                    <span className="font-medium">{selectedEnrollment.payload.title || '-'}</span>
                                    <span className="text-muted-foreground">First Name</span>
                                    <span className="font-medium">{selectedEnrollment.payload.firstname || '-'}</span>
                                    <span className="text-muted-foreground">Last Name</span>
                                    <span className="font-medium">{selectedEnrollment.payload.lastname || '-'}</span>
                                    <span className="text-muted-foreground">DOB</span>
                                    <span className="font-medium">{selectedEnrollment.payload.dob || '-'}</span>
                                </div>
                            </div>

                            {/* Contact & Property */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border overflow-hidden">
                                <h3 className="font-semibold text-sm border-b pb-2">Contact & Property</h3>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium break-all">{selectedEnrollment.payload.email || '-'}</span>
                                    <span className="text-muted-foreground">Mobile</span>
                                    <span className="font-medium">{selectedEnrollment.payload.number || '-'}</span>
                                    <span className="text-muted-foreground flex items-center">Customer Type</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.customerType ? (
                                            <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{selectedEnrollment.payload.customerType}</span>
                                        ) : '-'}
                                    </span>
                                    <div className="col-span-2 pt-1">
                                        <span className="text-muted-foreground block mb-1">Address</span>
                                        <span className="font-medium block break-words leading-relaxed text-wrap" title={selectedEnrollment.payload.address}>{selectedEnrollment.payload.address || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Connection Details */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-sm border-b pb-2">Utility Connections</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">NMI</span>
                                    <span className="font-medium">{selectedEnrollment.payload.nmi || '-'}</span>
                                    <span className="text-muted-foreground">Tariff Code</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.tariffcode ? (
                                            <span className="inline-flex px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">{selectedEnrollment.payload.tariffcode}</span>
                                        ) : '-'}
                                    </span>
                                    <span className="text-muted-foreground">Ownership Status</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.ownership_status !== undefined
                                            ? selectedEnrollment.payload.ownership_status === 0 ? 'Owner' : 'Renter'
                                            : '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Identification */}
                            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                                <h3 className="font-semibold text-sm border-b pb-2">Identification Identity</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-muted-foreground">ID Type</span>
                                    <span className="font-medium">
                                        {selectedEnrollment.payload.idType === 0 ? 'Driver License' : selectedEnrollment.payload.idType === 1 ? 'Medicare' : selectedEnrollment.payload.idType === 2 ? 'Passport' : 'Unknown'}
                                    </span>
                                    <span className="text-muted-foreground">ID Number</span>
                                    <span className="font-medium">{selectedEnrollment.payload.idnumber || '-'}</span>
                                    <span className="text-muted-foreground">Issue State</span>
                                    <span className="font-medium">{selectedEnrollment.payload.idstate || '-'}</span>
                                    <span className="text-muted-foreground">Expiry Date</span>
                                    <span className="font-medium">{selectedEnrollment.payload.idexpiary || selectedEnrollment.payload.idexpiry || '-'}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 text-muted-foreground">No payload data available for this enrollment.</div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                        {selectedEnrollment?.processed === 0 && (
                            <Button
                                onClick={() => handleApprove(selectedEnrollment!)}
                                isLoading={approving}
                            >
                                Approve Now
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
