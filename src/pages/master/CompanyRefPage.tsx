import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_COMPANY_REFS,
    CREATE_COMPANY_REF,
    UPDATE_COMPANY_REF,
    DELETE_COMPANY_REF,
    GENERATE_COMPANY_REF_LINK,
    TOGGLE_COMPANY_REF_LINK_STATUS,
    GET_COMPANY_REF_SUBMISSIONS
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CopyIcon,
    LinkIcon,
    ExternalLinkIcon,
    BuildingIcon,
    RefreshCwIcon,
    CheckCircleIcon
} from '@/components/icons';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date';
import { sanitizePhoneInput, formatAustralianPhone, validatePhoneNumber } from '@/lib/phone';
import type { CompanyRef, CompanyRefLink, CompanyEnrollmentSubmission } from '@/types/companyRef';

export const CompanyRefPage = () => {
    // Permission checks (fallback to true for master user or if permissions not yet seeded)
    const authUser = useAuthStore((state) => state.user);
    const hasCreatePerm = useAuthStore((state) => state.canCreateInMenu('company_ref') || state.canCreateInMenu('document_types'));
    const hasEditPerm = useAuthStore((state) => state.canEditInMenu('company_ref') || state.canEditInMenu('document_types'));
    const hasDeletePerm = useAuthStore((state) => state.canDeleteInMenu('company_ref') || state.canDeleteInMenu('document_types'));

    const canCreate = authUser?.isMaster || hasCreatePerm;
    const canEdit = authUser?.isMaster || hasEditPerm;
    const canDelete = authUser?.isMaster || hasDeletePerm;

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    // Create / Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<CompanyRef | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form State & Validation
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        portalName: '',
        contactPerson: '',
        email: '',
        phone: '',
        abn: '',
        notes: '',
        isActive: true
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyRef | null>(null);

    // Links & History Modal State
    const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
    const [activeCompanyForLinks, setActiveCompanyForLinks] = useState<CompanyRef | null>(null);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [newCustomCode, setNewCustomCode] = useState('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // GraphQL Queries & Mutations
    const { data, loading, error, refetch } = useQuery(GET_COMPANY_REFS, {
        fetchPolicy: 'network-only'
    });

    const {
        data: submissionsData,
        loading: loadingSubmissions,
        refetch: refetchSubmissions
    } = useQuery(GET_COMPANY_REF_SUBMISSIONS, {
        variables: { companyRefUid: activeCompanyForLinks?.uid || '' },
        skip: !activeCompanyForLinks?.uid,
        fetchPolicy: 'network-only'
    });

    const [createCompany, { loading: creating }] = useMutation(CREATE_COMPANY_REF);
    const [updateCompany, { loading: updating }] = useMutation(UPDATE_COMPANY_REF);
    const [deleteCompany, { loading: deleting }] = useMutation(DELETE_COMPANY_REF);
    const [generateLink, { loading: generatingLink }] = useMutation(GENERATE_COMPANY_REF_LINK);
    const [toggleLinkStatus] = useMutation(TOGGLE_COMPANY_REF_LINK_STATUS);

    const companies: CompanyRef[] = useMemo(() => {
        return data?.companyRefs || [];
    }, [data]);

    // Keep activeCompanyForLinks updated when data refetches
    useEffect(() => {
        if (activeCompanyForLinks && companies.length > 0) {
            const updated = companies.find(c => c.uid === activeCompanyForLinks.uid);
            if (updated) {
                setActiveCompanyForLinks(updated);
            }
        }
    }, [companies]);

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = [...companies];

        if (statusFilter === 'ACTIVE') {
            result = result.filter(c => Boolean(c.isActive));
        } else if (statusFilter === 'INACTIVE') {
            result = result.filter(c => !c.isActive);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(c =>
                c.name?.toLowerCase().includes(q) ||
                c.code?.toLowerCase().includes(q) ||
                c.portalName?.toLowerCase().includes(q) ||
                (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
                (c.email && c.email.toLowerCase().includes(q))
            );
        }

        return result;
    }, [companies, statusFilter, searchQuery]);

    const handleCreate = () => {
        setIsCreating(true);
        setEditingCompany(null);
        setFormData({
            name: '',
            code: '',
            portalName: '',
            contactPerson: '',
            email: '',
            phone: '',
            abn: '',
            notes: '',
            isActive: true
        });
        setFormErrors({});
        setTouched({});
        setIsEditModalOpen(true);
    };

    const handleEdit = (comp: CompanyRef) => {
        setIsCreating(false);
        setEditingCompany(comp);
        setFormData({
            name: comp.name,
            code: comp.code,
            portalName: comp.portalName,
            contactPerson: comp.contactPerson || '',
            email: comp.email || '',
            phone: comp.phone || '',
            abn: comp.abn || '',
            notes: comp.notes || '',
            isActive: comp.isActive
        });
        setFormErrors({});
        setTouched({});
        setIsEditModalOpen(true);
    };

    // Validation logic for required fields and wrong number restrictions
    const validateForm = (data = formData): boolean => {
        const errors: Record<string, string> = {};

        // 1. Company Name (Required)
        if (!data.name.trim()) {
            errors.name = 'Company Name is required';
        } else if (data.name.trim().length < 2) {
            errors.name = 'Company Name must be at least 2 characters';
        }

        // 2. Company Code / Slug (Required & Unique)
        if (!data.code.trim()) {
            errors.code = 'Company Code is required';
        } else if (!/^[A-Z0-9_-]+$/i.test(data.code.trim())) {
            errors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        } else {
            const clean = data.code.trim().toUpperCase();
            const duplicate = companies.find(
                c => c.code.toUpperCase() === clean && c.uid !== editingCompany?.uid
            );
            if (duplicate) {
                errors.code = `Company Code "${clean}" is already used by "${duplicate.name}". Please enter a unique code.`;
            }
        }

        // 3. Portal Filter Name (Required)
        if (!data.portalName.trim()) {
            errors.portalName = 'Portal Filter Name is required';
        }

        // 4. Phone Number (Restriction for wrong number)
        if (data.phone.trim()) {
            const phoneErr = validatePhoneNumber(data.phone, false);
            if (phoneErr) {
                errors.phone = phoneErr;
            }
        }

        // 5. Email (Optional, validated if entered)
        if (data.email.trim()) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
                errors.email = 'Please enter a valid email address';
            }
        }

        // 6. ABN (Optional, 11 digits if entered)
        if (data.abn.trim()) {
            const cleanAbn = data.abn.replace(/\D/g, '');
            if (cleanAbn.length !== 11) {
                errors.abn = `ABN must be exactly 11 digits (currently ${cleanAbn.length} digits)`;
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Auto-generate unique code and portalName when name changes (only during create)
    const handleNameChange = (nameVal: string) => {
        if (isCreating) {
            const rawCode = nameVal
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '_')
                .replace(/__+/g, '_')
                .substring(0, 30);

            // Avoid collision with existing companies
            let generatedCode = rawCode;
            let counter = 2;
            while (companies.some(c => c.code.toUpperCase() === generatedCode && c.uid !== editingCompany?.uid)) {
                generatedCode = `${rawCode}_${counter}`;
                counter++;
            }

            const updated = {
                ...formData,
                name: nameVal,
                code: formData.code ? formData.code : generatedCode,
                portalName: formData.portalName ? formData.portalName : generatedCode
            };
            setFormData(updated);
            if (touched.name) validateForm(updated);
        } else {
            const updated = { ...formData, name: nameVal };
            setFormData(updated);
            if (touched.name) validateForm(updated);
        }
    };

    const handlePhoneChange = (raw: string) => {
        const sanitized = sanitizePhoneInput(raw);
        const formatted = formatAustralianPhone(sanitized);
        const updated = { ...formData, phone: formatted };
        setFormData(updated);

        // Immediate real-time validation if touched or at least 8 digits typed
        if (touched.phone || sanitized.length >= 8) {
            const err = validatePhoneNumber(formatted, false);
            setFormErrors(prev => ({ ...prev, phone: err || '' }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            name: true,
            code: true,
            portalName: true,
            phone: true,
            email: true,
            abn: true
        });

        if (!validateForm()) {
            toast.error('Please fix the required fields and validation errors before saving');
            return;
        }

        try {
            if (isCreating) {
                await createCompany({
                    variables: {
                        name: formData.name.trim(),
                        code: formData.code.trim().toUpperCase(),
                        portalName: formData.portalName.trim() || formData.name.trim(),
                        contactPerson: formData.contactPerson.trim() || null,
                        email: formData.email.trim() || null,
                        phone: formData.phone.trim() || null,
                        abn: formData.abn.trim() || null,
                        notes: formData.notes.trim() || null,
                        isActive: formData.isActive
                    }
                });
                toast.success('Company created successfully with default referral link');
            } else if (editingCompany) {
                await updateCompany({
                    variables: {
                        uid: editingCompany.uid,
                        name: formData.name.trim(),
                        code: formData.code.trim().toUpperCase(),
                        portalName: formData.portalName.trim() || formData.name.trim(),
                        contactPerson: formData.contactPerson.trim() || null,
                        email: formData.email.trim() || null,
                        phone: formData.phone.trim() || null,
                        abn: formData.abn.trim() || null,
                        notes: formData.notes.trim() || null,
                        isActive: formData.isActive
                    }
                });
                toast.success('Company updated successfully');
            }
            setIsEditModalOpen(false);
            setStatusFilter('ALL');
            setSearchQuery('');
            await refetch();
        } catch (err: any) {
            const rawMsg = err.message || '';
            if (rawMsg.includes('already exists') || rawMsg.includes('duplicate key') || rawMsg.includes('company_ref_master_code_key')) {
                setFormErrors(prev => ({
                    ...prev,
                    code: 'This Company Code is already in use. Please choose a different code.'
                }));
                toast.error('A company with this Code already exists. Please choose a unique code.');
            } else {
                toast.error(rawMsg || 'Operation failed');
            }
        }
    };

    const handleDeleteClick = (comp: CompanyRef) => {
        setCompanyToDelete(comp);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!companyToDelete) return;
        try {
            await deleteCompany({
                variables: { uid: companyToDelete.uid }
            });
            toast.success('Company deleted successfully');
            setDeleteModalOpen(false);
            setCompanyToDelete(null);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete company');
        }
    };

    const handleOpenLinksModal = (comp: CompanyRef) => {
        setActiveCompanyForLinks(comp);
        setNewCampaignName('');
        setNewCustomCode('');
        setIsLinksModalOpen(true);
    };

    const handleGenerateLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCompanyForLinks) return;

        try {
            await generateLink({
                variables: {
                    companyRefUid: activeCompanyForLinks.uid,
                    campaignName: newCampaignName.trim() || 'Referral Campaign',
                    customCode: newCustomCode.trim() ? newCustomCode.trim().toUpperCase() : undefined
                }
            });
            toast.success('New referral link generated successfully!');
            setNewCampaignName('');
            setNewCustomCode('');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to generate referral link');
        }
    };

    const handleToggleLink = async (link: CompanyRefLink) => {
        try {
            await toggleLinkStatus({
                variables: {
                    uid: link.uid,
                    isActive: !link.isActive
                }
            });
            toast.success(`Link ${link.isActive ? 'deactivated' : 'activated'} successfully`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update link status');
        }
    };

    const handleToggleCompanyStatus = async (comp: CompanyRef, nextStatus: boolean) => {
        try {
            await updateCompany({
                variables: {
                    uid: comp.uid,
                    isActive: nextStatus
                }
            });
            toast.success(`Company "${comp.name}" is now ${nextStatus ? 'Active' : 'Inactive'}`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update company status');
        }
    };

    const getFullEnrollmentUrl = (linkCodeOrUrl: string) => {
        const origin = window.location.origin;
        if (linkCodeOrUrl.startsWith('http')) return linkCodeOrUrl;
        if (linkCodeOrUrl.startsWith('/')) return `${origin}${linkCodeOrUrl}`;
        return `${origin}/enroll/${linkCodeOrUrl}`;
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopiedKey(null), 2500);
    };

    // Table Columns
    const columns: Column<CompanyRef>[] = [
        {
            header: 'Company Details',
            key: 'name',
            render: (comp) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{comp.name}</span>
                        <span className="px-1.5 py-0.5 text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 rounded font-medium">
                            {comp.code}
                        </span>
                    </div>
                    {comp.abn && (
                        <span className="text-[11px] text-muted-foreground">ABN: {comp.abn}</span>
                    )}
                </div>
            )
        },
        {
            header: 'Portal Filter Name',
            key: 'portalName',
            render: (comp) => (
                <div className="flex flex-col">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-foreground bg-accent px-2 py-1 rounded w-fit border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {comp.portalName}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Used in Customer Approvals filter</span>
                </div>
            )
        },
        {
            header: 'Contact Info',
            key: 'contactPerson',
            render: (comp) => (
                <div className="flex flex-col text-xs text-muted-foreground">
                    {comp.contactPerson ? (
                        <span className="font-medium text-foreground">{comp.contactPerson}</span>
                    ) : (
                        <span className="italic">No contact person</span>
                    )}
                    {comp.email && <span>{comp.email}</span>}
                    {comp.phone && <span>{comp.phone}</span>}
                </div>
            )
        },
        {
            header: 'Generated Links',
            key: 'linksCount',
            render: (comp) => {
                const count = comp.linksCount ?? (comp.links?.length || 0);
                return (
                    <button
                        onClick={() => handleOpenLinksModal(comp)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                        title="Click to view & generate links"
                    >
                        <LinkIcon size={13} />
                        <span>{count} {count === 1 ? 'Link' : 'Links'}</span>
                    </button>
                );
            }
        },
        {
            header: 'Submissions',
            key: 'submissionsCount',
            render: (comp) => {
                const subs = comp.submissionsCount || 0;
                return (
                    <div className="flex items-center gap-1 text-xs">
                        <span className={cn(
                            "px-2 py-0.5 rounded-full font-semibold",
                            subs > 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                        )}>
                            {subs} {subs === 1 ? 'Lead' : 'Leads'}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (comp) => (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={Boolean(comp.isActive)}
                        onChange={(checked) => canEdit && handleToggleCompanyStatus(comp, checked)}
                        disabled={!canEdit}
                        className={comp.isActive ? "bg-[#3d6b08]" : "bg-gray-300 dark:bg-gray-600"}
                    />
                    <span className={cn(
                        "text-xs font-medium",
                        comp.isActive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                    )}>
                        {comp.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        },
        {
            header: 'Created At',
            key: 'createdAt',
            render: (comp) => (
                <span className="text-xs text-muted-foreground">
                    {comp.createdAt ? formatDateTime(comp.createdAt) : '-'}
                </span>
            )
        },
        {
            header: 'Actions',
            key: 'actions',
            render: (comp) => (
                <div className="flex items-center gap-2">
                    <Tooltip content="Generate & View Referral Links">
                        <button
                            className="p-2 border border-border rounded-lg bg-card hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                            onClick={() => handleOpenLinksModal(comp)}
                        >
                            <LinkIcon size={16} />
                        </button>
                    </Tooltip>

                    {canEdit && (
                        <Tooltip content="Edit Company">
                            <button
                                className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => handleEdit(comp)}
                            >
                                <PencilIcon size={16} />
                            </button>
                        </Tooltip>
                    )}

                    {canDelete && (
                        <Tooltip content="Delete Company">
                            <button
                                className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                onClick={() => handleDeleteClick(comp)}
                            >
                                <TrashIcon size={16} />
                            </button>
                        </Tooltip>
                    )}
                </div>
            )
        }
    ];

    if (loading && companies.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
                <RefreshCwIcon size={18} className="animate-spin" />
                <span>Loading company references...</span>
            </div>
        );
    }

    if (error && companies.length === 0) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-semibold">Error loading company references</p>
                <p className="text-xs mt-1 text-muted-foreground">{error.message}</p>
                <Button onClick={() => refetch()} className="mt-4" size="sm">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <BuildingIcon className="text-primary" size={24} />
                        Company References
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage partner companies, generate referral customer links, and track onboarding history for customer approvals.
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={handleCreate} className="shadow-sm">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New Company
                    </Button>
                )}
            </div>

            {/* Main Content Box with Filters and Table */}
            <div className="p-5 bg-background dark:bg-card rounded-lg border border-border dark:border-border shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <StatusField
                        type="user_status"
                        mode="select"
                        showAllOption
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                        placeholder="All Status"
                        className="w-full sm:w-[160px]"
                    />
                    <Input
                        type="search"
                        placeholder="Search company, code, portal, contact..."
                        containerClassName="w-full sm:w-[350px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground ml-auto hidden sm:block">
                        Showing <span className="font-semibold text-foreground">{filteredData.length}</span> of {companies.length} companies
                    </div>
                </div>

                <DataTable
                    data={filteredData}
                    columns={columns}
                    rowKey={(row) => row.uid}
                    emptyMessage="No company references found"
                />
            </div>

            {/* Create / Edit Company Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreating ? 'Add New Company Reference' : 'Edit Company Reference'}
                size="3xl"
                className="w-[90vw] max-w-3xl"
            >
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <Input
                        label="Company Name"
                        required
                        placeholder="e.g. Acme Solar Solutions"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={touched.name ? formErrors.name : undefined}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Company Code / Slug"
                            required
                            placeholder="e.g. ACME_SOLAR"
                            value={formData.code}
                            onChange={(e) => {
                                const codeVal = e.target.value.toUpperCase().replace(/\s+/g, '_');
                                const updated = { ...formData, code: codeVal };
                                setFormData(updated);
                                if (touched.code) validateForm(updated);
                            }}
                            onBlur={() => handleBlur('code')}
                            error={touched.code ? formErrors.code : undefined}
                            helperText="Used in unique referral URLs"
                        />

                        <Input
                            label="Portal Filter Name"
                            required
                            placeholder="e.g. ACME_SOLAR"
                            value={formData.portalName}
                            onChange={(e) => {
                                const val = e.target.value;
                                const updated = { ...formData, portalName: val };
                                setFormData(updated);
                                if (touched.portalName) validateForm(updated);
                            }}
                            onBlur={() => handleBlur('portalName')}
                            error={touched.portalName ? formErrors.portalName : undefined}
                            helperText="Appears in Customer Approvals portal filter"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Contact Person"
                            placeholder="e.g. John Doe"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        />
                        <Input
                            label="ABN / Business Number"
                            placeholder="e.g. 51 824 753 556"
                            value={formData.abn}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                                let formatted = digits;
                                if (digits.length > 8) {
                                    formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
                                } else if (digits.length > 5) {
                                    formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
                                } else if (digits.length > 2) {
                                    formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`;
                                }
                                const updated = { ...formData, abn: formatted };
                                setFormData(updated);
                                if (touched.abn) validateForm(updated);
                            }}
                            onBlur={() => handleBlur('abn')}
                            error={touched.abn ? formErrors.abn : undefined}
                            helperText="11-digit Australian Business Number"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="partner@example.com"
                            value={formData.email}
                            onChange={(e) => {
                                const updated = { ...formData, email: e.target.value };
                                setFormData(updated);
                                if (touched.email) validateForm(updated);
                            }}
                            onBlur={() => handleBlur('email')}
                            error={touched.email ? formErrors.email : undefined}
                        />
                        <Input
                            label="Phone Number"
                            placeholder="0412 345 678 or 02 9876 5432"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            error={touched.phone ? formErrors.phone : undefined}
                            helperText="Australian mobile (04xx) or landline (02, 03, 07, 08)"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Internal Notes / Instructions</label>
                        <textarea
                            rows={3}
                            placeholder="Optional notes regarding this company or partnership agreement..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Switch
                            checked={formData.isActive}
                            onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            className={formData.isActive ? "bg-[#3d6b08]" : "bg-gray-300 dark:bg-gray-600"}
                        />
                        <div>
                            <label
                                className="text-xs font-semibold text-foreground cursor-pointer select-none"
                                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            >
                                Status: {formData.isActive ? 'Active' : 'Inactive'}
                            </label>
                            <p className="text-[11px] text-muted-foreground">
                                Active companies appear in customer portal filters and allow referral enrollment
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={creating || updating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={creating || updating}>
                            {creating || updating ? 'Saving...' : (isCreating ? 'Create Company' : 'Save Changes')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Company Reference"
            >
                <div className="space-y-4">
                    <p className="text-sm text-foreground">
                        Are you sure you want to delete company <span className="font-semibold text-red-500">{companyToDelete?.name}</span>?
                    </p>
                    <p className="text-xs text-muted-foreground">
                        This will deactivate any referral links associated with this company. Existing submitted customer approvals will remain safe in the CRM.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Links Generation & History Modal */}
            <Modal
                isOpen={isLinksModalOpen}
                onClose={() => setIsLinksModalOpen(false)}
                title={`Referral Links & History - ${activeCompanyForLinks?.name || ''}`}
                size="5xl"
                className="w-[95vw] max-w-5xl"
            >
                <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
                    {/* Link Generation Box */}
                    <div className="p-4 bg-muted/40 rounded-lg border border-border space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                    <LinkIcon size={16} className="text-primary" />
                                    Generate New Referral Link
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Customers submitting through this link are tagged with portal name <strong className="text-foreground">{activeCompanyForLinks?.portalName}</strong> and added directly to Customer Approvals.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleGenerateLink} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            <div className="sm:col-span-6 space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                                    Campaign / Channel Name
                                </label>
                                <Input
                                    placeholder="e.g. Website Banner, Partner Promotion, Q1 Direct"
                                    value={newCampaignName}
                                    onChange={(e) => setNewCampaignName(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                                    Custom Code (Optional)
                                </label>
                                <Input
                                    placeholder="Auto-generated if empty"
                                    value={newCustomCode}
                                    onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <Button
                                    type="submit"
                                    className="w-full h-9 text-xs"
                                    disabled={generatingLink}
                                >
                                    {generatingLink ? 'Generating...' : 'Create Link'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Section 1: Generated Links Table */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <span>Active & Historical Links ({activeCompanyForLinks?.links?.length || 0})</span>
                            </h4>
                        </div>

                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                                        <th className="py-2.5 px-3">Campaign / Code</th>
                                        <th className="py-2.5 px-3">Enrollment Link</th>
                                        <th className="py-2.5 px-3 text-center">Clicks</th>
                                        <th className="py-2.5 px-3 text-center">Submissions</th>
                                        <th className="py-2.5 px-3 text-center">Status</th>
                                        <th className="py-2.5 px-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(!activeCompanyForLinks?.links || activeCompanyForLinks.links.length === 0) ? (
                                        <tr>
                                            <td colSpan={6} className="py-6 text-center text-muted-foreground italic">
                                                No referral links found for this company. Generate one above.
                                            </td>
                                        </tr>
                                    ) : (
                                        activeCompanyForLinks.links.map((link) => {
                                            const fullUrl = getFullEnrollmentUrl(link.url || link.linkCode);
                                            const isCopied = copiedKey === link.uid;

                                            return (
                                                <tr key={link.uid} className="hover:bg-accent/40 transition-colors">
                                                    <td className="py-2.5 px-3">
                                                        <div className="font-semibold text-foreground">{link.campaignName || 'Referral Link'}</div>
                                                        <div className="text-[11px] font-mono text-muted-foreground">{link.linkCode}</div>
                                                    </td>
                                                    <td className="py-2.5 px-3 max-w-[280px]">
                                                        <div className="flex items-center gap-1.5 bg-muted/50 border border-border px-2 py-1 rounded">
                                                            <span className="font-mono text-[11px] truncate flex-1 text-foreground" title={fullUrl}>
                                                                {fullUrl}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(fullUrl, link.uid)}
                                                                className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                                                title="Copy URL"
                                                            >
                                                                {isCopied ? <CheckCircleIcon size={14} className="text-emerald-500" /> : <CopyIcon size={14} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center font-mono">
                                                        {link.clicksCount || 0}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <span className="px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                            {link.submissionsCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <div className="inline-flex items-center gap-2">
                                                            <Switch
                                                                checked={Boolean(link.isActive)}
                                                                onChange={() => handleToggleLink(link)}
                                                                className={link.isActive ? "bg-[#3d6b08]" : "bg-gray-300 dark:bg-gray-600"}
                                                            />
                                                            <span className={cn(
                                                                "text-xs font-medium",
                                                                link.isActive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                                                            )}>
                                                                {link.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(fullUrl, link.uid)}
                                                                className="p-1.5 border border-border rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                                                                title="Copy link"
                                                            >
                                                                <CopyIcon size={13} />
                                                            </button>
                                                            <a
                                                                href={fullUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 border border-border rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                                                                title="Open enrollment page in new tab"
                                                            >
                                                                <ExternalLinkIcon size={13} />
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 2: Submissions History Table */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <span>Recent Customer Submissions (Added to Customer Approvals)</span>
                            </h4>
                            <button
                                onClick={() => refetchSubmissions()}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <RefreshCwIcon size={12} className={loadingSubmissions ? "animate-spin" : ""} />
                                Refresh History
                            </button>
                        </div>

                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                                        <th className="py-2.5 px-3">Customer</th>
                                        <th className="py-2.5 px-3">Contact</th>
                                        <th className="py-2.5 px-3">NMI / Address</th>
                                        <th className="py-2.5 px-3">Submitted At</th>
                                        <th className="py-2.5 px-3 text-center">Approval Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loadingSubmissions ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                                Loading submissions history...
                                            </td>
                                        </tr>
                                    ) : (!submissionsData?.companyRefSubmissions || submissionsData.companyRefSubmissions.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-muted-foreground italic">
                                                No customers enrolled through this company reference yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        submissionsData.companyRefSubmissions.map((sub: CompanyEnrollmentSubmission) => (
                                            <tr key={sub.uid} className="hover:bg-accent/40 transition-colors">
                                                <td className="py-2 px-3 font-semibold text-foreground">
                                                    {sub.customerName}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="text-foreground">{sub.email || '-'}</div>
                                                    <div className="text-[11px] text-muted-foreground">{sub.phone || '-'}</div>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="font-mono text-[11px] font-semibold text-foreground">
                                                        {sub.nmi ? `NMI: ${sub.nmi}` : '-'}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground truncate max-w-[220px]" title={sub.address || ''}>
                                                        {sub.address || '-'}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                                                    {sub.createdAt ? formatDateTime(sub.createdAt) : '-'}
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    {sub.processed === 1 ? (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                                                            Approved
                                                        </span>
                                                    ) : sub.processed === 2 ? (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200">
                                                            Rejected
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200">
                                                            Pending Approval
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => setIsLinksModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

