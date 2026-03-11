import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Tooltip } from '@/components/ui/Tooltip';
import { HtmlEditor } from '@/components/ui/HtmlEditor';
import { DataTable, type Column, Modal, StatusField } from '@/components/common';
import { PlusIcon, PencilIcon, TrashIcon, RefreshCwIcon } from '@/components/icons';
import {
    GET_PDF_TERMS_LIST,
    GET_PDF_TERM,
    CREATE_PDF_TERM,
    UPDATE_PDF_TERM,
    SOFT_DELETE_PDF_TERM,
    RESTORE_PDF_TERM,
    GET_RATE_PLANS,
} from '@/graphql';
import { formatDateTime, getUserTimezone } from '@/lib/date';
import { useAuthStore } from '@/stores/useAuthStore';

// Types
interface RatePlan {
    id: string;
    uid: string;
    tariff: string;
    codes: string;
    vpp: number;
    isActive: boolean;
    isDeleted: boolean;
    planId?: string;
    state?: string;
}

interface PdfTerm {
    id: string;
    uid: string;
    name: string;
    content?: string;
    rateType?: string;
    rateUids?: string[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PdfTermsResponse {
    pdfTermsList: {
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
        data: PdfTerm[];
    };
}

// Predefined section titles that can be inserted into the editor
const SECTION_TITLES = [
    { label: 'Commencement Date', description: 'When the agreement starts' },
    { label: 'Billing', description: 'Billing frequency and method details' },
    { label: 'Important Notice to the Consumer', description: 'Credit card fees, paper bill fees, etc.' },
    { label: 'Changes to Charges', description: 'How and when charges may change' },
];

const VPP_FIT_OPTIONS = [
    { label: 'Base FIT', description: 'Insert Base FIT description', html: '<p><strong style="color: #68c645">Base FIT:</strong> Applies to solar generation and battery discharge exported to the grid at all times.</p><p><br></p>' },
    { label: 'Premium FIT', description: 'Insert Premium FIT description', html: '<p><strong style="color: #68c645">Premium FIT:</strong> Applies to battery dispatch from 5:00 pm to 9:00 pm during the summer period (1 October to 31 March) and from 4:00 pm to 8:00 pm during the winter period (1 April to 30 September).</p><p><br></p>' },
    { label: 'Critical Event FIT', description: 'Insert Critical Event FIT description', html: '<p><strong style="color: #68c645">Critical Event FIT:</strong> Applies to battery dispatch during periods when the AEMO wholesale electricity price in NSW exceeds $600/MWh.</p><p><br></p>' },
];

const CONTRACT_TERM_OPTION = {
    label: 'Contract Term',
    description: 'Insert conditional contract term block',
    html: `
<h3 style="color: #68c645">Contract Term</h3>
<div data-condition="bonus" style="border: 1px dashed #68c645; padding: 10px; margin-bottom: 10px; position: relative;">
    <span style="background: #68c645; color: white; font-size: 10px; padding: 2px 5px; position: absolute; top: -10px; left: 10px; border-radius: 3px;">[IF 12-MONTH BONUS]</span>
    <p>This plan has a 12-month contract starting from {{contractStart}}.</p>
</div>
<div data-condition="no-bonus" style="border: 1px dashed #999; padding: 10px; margin-bottom: 10px; position: relative;">
    <span style="background: #999; color: white; font-size: 10px; padding: 2px 5px; position: absolute; top: -10px; left: 10px; border-radius: 3px;">[IF NO BONUS]</span>
    <p>No lock-in contract.</p>
</div>
<p><br></p>
`
};

// Available variables that can be inserted into PDF terms content
const PDF_VARIABLES = [
    { label: 'Solar Eligibility', value: '{{solarEligibility}}', description: 'Solar eligibility text (shown when customer has solar)' },
    { label: 'Contract Start', value: '{{contractStart}}', description: 'Contract start date' },
    { label: 'Offer Acceptance', value: '{{offerAcceptance}}', description: 'Date the offer was accepted' },
    { label: 'Site Address', value: '{{siteAddress}}', description: 'Property supply address' },
    { label: 'Customer Name', value: '{{name}}', description: 'Full name of the customer' },
];

// Helper function for name matching (case-insensitive, exact match)
const isNameMatch = (input: string, actual: string): boolean => {
    if (!input || !actual) return false;
    return input.toLowerCase() === actual.toLowerCase();
};

/**
 * Strip the wrapping <!DOCTYPE html><html><body>...</body></html> to get raw inner content
 * for preview purposes.
 */
function unwrapHtmlContent(html: string): string {
    if (!html) return '';
    if (html.match(/<body/i)) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.innerHTML;
    }
    return html;
}

export function PdfTermsPage() {
    // Permissions
    const canCreate = useAuthStore((state) => state.canCreateInMenu('pdf_terms'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('pdf_terms'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('pdf_terms'));

    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [allTerms, setAllTerms] = useState<PdfTerm[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Modal States
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingTerm, setEditingTerm] = useState<PdfTerm | null>(null);

    const initialFormState = {
        name: '',
        content: '',
        isActive: true,
        rateType: '' as string,
        rateUids: [] as string[],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [termToDelete, setTermToDelete] = useState<PdfTerm | null>(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Restore Modal State
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [termToRestore, setTermToRestore] = useState<PdfTerm | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const limit = 20;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== searchQuery) {
                setAllTerms([]);
                setPage(1);
                setDebouncedSearch(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, debouncedSearch]);

    // Query
    const { data, loading, error, refetch } = useQuery<PdfTermsResponse>(GET_PDF_TERMS_LIST, {
        variables: { page, limit },
        fetchPolicy: 'network-only',
    });

    // Fetch all rate plans for rate selection
    const { data: ratePlansData } = useQuery(GET_RATE_PLANS, {
        variables: { page: 1, limit: 10000 },
        fetchPolicy: 'cache-first',
    });

    const allRatePlans: RatePlan[] = ratePlansData?.ratePlans?.data || [];

    // Filter rate plans based on selected rate type and availability
    const filteredRatePlans = useMemo(() => {
        if (!formData.rateType) return [];

        // Collect all currently assigned rate UIDs from other terms
        const assignedRateUids = new Set<string>();
        allTerms.forEach(term => {
            // Ignore the term currently being edited, also ignore deleted/inactive terms if they shouldn't lock the rate
            if (term.uid === editingTerm?.uid) return;
            if (term.isDeleted || !term.isActive) return;

            if (term.rateUids && Array.isArray(term.rateUids)) {
                term.rateUids.forEach(uid => assignedRateUids.add(uid));
            }
        });

        return allRatePlans.filter((rp) => {
            if (rp.isDeleted) return false;
            // Exclude if already assigned to another active term
            if (assignedRateUids.has(rp.uid)) return false;

            if (formData.rateType === 'vpp') return rp.vpp === 1;
            if (formData.rateType === 'charges') return rp.vpp === 0;
            return false;
        });
    }, [allRatePlans, formData.rateType, allTerms, editingTerm]);

    // Mutations
    const [createTerm] = useMutation(CREATE_PDF_TERM);
    const [updateTerm] = useMutation(UPDATE_PDF_TERM);
    const [softDeleteTerm] = useMutation(SOFT_DELETE_PDF_TERM);
    const [restoreTerm] = useMutation(RESTORE_PDF_TERM);
    const [fetchTerm] = useLazyQuery(GET_PDF_TERM);

    const meta = data?.pdfTermsList?.meta;
    const hasMore = meta ? page < meta.totalPages : false;

    // Update allTerms
    useEffect(() => {
        if (data?.pdfTermsList?.data) {
            let fetchedTerms = data.pdfTermsList.data;

            if (page === 1) {
                setAllTerms(fetchedTerms);
            } else {
                setAllTerms(prev => {
                    const existingUids = new Set(prev.map(t => t.uid));
                    const newTerms = fetchedTerms.filter(t => !existingUids.has(t.uid));
                    return [...prev, ...newTerms];
                });
            }
            setIsLoadingMore(false);
        }
    }, [data, page]);

    // Handle Client-Side Search & Filtering
    const displayedTerms = allTerms.filter(term => {
        const matchesSearch = !debouncedSearch ||
            term.name.toLowerCase().includes(debouncedSearch.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === 'ACTIVE') {
            matchesStatus = !term.isDeleted && term.isActive;
        } else if (statusFilter === 'INACTIVE') {
            matchesStatus = !term.isDeleted && !term.isActive;
        }

        return matchesSearch && matchesStatus;
    });

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
    };

    // Form Handling
    const handleAdd = () => {
        setModalMode('create');
        setEditingTerm(null);
        setFormData(initialFormState);
        setErrors({});
        setShowPreview(false);
        setModalOpen(true);
    };

    const handleEdit = async (term: PdfTerm) => {
        setModalMode('edit');
        setEditingTerm(term);
        setFormData({
            name: term.name,
            content: term.content || '',
            isActive: term.isActive,
            rateType: term.rateType || '',
            rateUids: term.rateUids || [],
        });
        setErrors({});
        setShowPreview(false);
        setModalOpen(true);
        setIsLoadingContent(true);

        // Fetch full details (specifically content)
        try {
            const { data } = await fetchTerm({ variables: { uid: term.uid } });
            if (data?.pdfTerm) {
                setFormData(prev => ({
                    ...prev,
                    content: data.pdfTerm.content || '',
                    rateType: data.pdfTerm.rateType || prev.rateType,
                    rateUids: data.pdfTerm.rateUids || prev.rateUids,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch term details:', error);
            toast.error('Failed to load term content');
        } finally {
            setIsLoadingContent(false);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const input: any = {
                name: formData.name,
                content: formData.content,
                isActive: formData.isActive,
                rateType: formData.rateType || null,
                rateUids: formData.rateUids.length > 0 ? formData.rateUids : null,
            };

            if (modalMode === 'create') {
                const { data } = await createTerm({ variables: { input } });
                if (data?.createPdfTerm) {
                    toast.success(data.createPdfTerm.message || 'Term created successfully');
                }
            } else {
                if (!editingTerm) return;
                const { data } = await updateTerm({
                    variables: { uid: editingTerm.uid, input }
                });
                if (data?.updatePdfTerm) {
                    toast.success(data.updatePdfTerm.message || 'Term updated successfully');
                }
            }
            setModalOpen(false);
            await refetch();
        } catch (err: any) {
            console.error('Failed to save term:', err);
            toast.error(err.message || 'Failed to save term');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInsertCustomHtml = (htmlToInsert: string) => {
        // Append to existing content
        setFormData(prev => {
            let existing = prev.content;

            // Unwrap if it has the full HTML wrapper
            if (existing.match(/<body/i)) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(existing, 'text/html');
                existing = doc.body.innerHTML;
            }

            // Remove trailing empty paragraph / whitespace
            existing = existing.replace(/(<p>\s*(<br\s*\/?>)?\s*<\/p>\s*)*$/i, '');

            const newContent = existing + htmlToInsert;

            // Wrap it back
            const wrapped = `<!DOCTYPE html>\n<html>\n<body>\n${newContent}\n</body>\n</html>`;
            return { ...prev, content: wrapped };
        });

        if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
    };

    /**
     * Insert a styled section title into the HtmlEditor content.
     * This appends an <h3> with the GEE green color followed by an empty <p> for writing.
     */
    const handleInsertTitle = (title: string) => {
        const titleHtml = `<h3 style="color: #68c645">${title}</h3><p><br></p>`;
        handleInsertCustomHtml(titleHtml);
    };

    // Preview HTML — show the content as it would appear in the PDF
    const previewHtml = useMemo(() => {
        const raw = unwrapHtmlContent(formData.content);
        if (!raw || raw === '<p><br></p>') return '';
        return raw;
    }, [formData.content]);

    // Status Toggle
    const handleStatusToggle = async (term: PdfTerm, isActive: boolean) => {
        try {
            const { data } = await updateTerm({
                variables: {
                    uid: term.uid,
                    input: { isActive }
                }
            });

            if (data?.updatePdfTerm) {
                toast.success(data.updatePdfTerm.message || 'Status updated successfully');
                setAllTerms(prev => prev.map(t => t.uid === term.uid ? { ...t, isActive } : t));
            }
        } catch (err: any) {
            console.error('Failed to update status:', err);
            toast.error(err.message || 'Failed to update status');
        }
    };

    // Delete Handling
    const handleDeleteClick = (term: PdfTerm) => {
        setTermToDelete(term);
        setDeleteConfirmName('');
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!termToDelete || !isNameMatch(deleteConfirmName, termToDelete.name)) return;

        setIsDeleting(true);
        try {
            await softDeleteTerm({ variables: { uid: termToDelete.uid } });
            toast.success('Term deleted successfully');
            setDeleteModalOpen(false);
            setTermToDelete(null);
            setAllTerms(prev => prev.map(t => t.uid === termToDelete.uid ? { ...t, isDeleted: true } : t));
        } catch (err: any) {
            console.error('Failed to delete term:', err);
            toast.error(err.message || 'Failed to delete term');
        } finally {
            setIsDeleting(false);
        }
    };

    // Restore Handling
    const handleRestoreClick = (term: PdfTerm) => {
        setTermToRestore(term);
        setRestoreModalOpen(true);
    };

    const handleConfirmRestore = async () => {
        if (!termToRestore) return;
        setIsRestoring(true);
        try {
            await restoreTerm({ variables: { uid: termToRestore.uid } });
            toast.success('Term restored successfully');
            setRestoreModalOpen(false);
            setTermToRestore(null);
            setAllTerms(prev => prev.map(t => t.uid === termToRestore.uid ? { ...t, isDeleted: false } : t));
        } catch (err: any) {
            console.error('Failed to restore term:', err);
            toast.error(err.message || 'Failed to restore term');
        } finally {
            setIsRestoring(false);
        }
    };

    const columns: Column<PdfTerm>[] = [
        ...((canEdit || canDelete) ? [{
            key: 'actions',
            header: 'Actions',
            width: 'w-[100px]',
            render: (term: PdfTerm) => (
                <div className="flex items-center gap-2">
                    {term.isDeleted ? (
                        canEdit && (
                            <Tooltip content="Restore Term">
                                <button
                                    className="p-2 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    onClick={() => handleRestoreClick(term)}
                                >
                                    <RefreshCwIcon size={16} />
                                </button>
                            </Tooltip>
                        )
                    ) : (
                        <>
                            {canEdit && (
                                <Tooltip content="Edit Term">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleEdit(term)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && (
                                <Tooltip content="Delete Term">
                                    <button
                                        className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        onClick={() => handleDeleteClick(term)}
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                        </>
                    )}
                </div>
            )
        }] : []),
        {
            key: 'name',
            header: 'Name',
            width: 'w-[300px]',
            render: (t) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{t.name}</span>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            width: 'w-[100px]',
            render: (t) => (
                t.isDeleted ? (
                    <StatusField
                        type="user_status"
                        value='INACTIVE'
                        mode="text"
                        className="text-red-500"
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={t.isActive}
                            onChange={(checked) => canEdit && handleStatusToggle(t, checked)}
                            disabled={!canEdit}
                            className={t.isActive ? "bg-[#5c8a14]" : "bg-muted"}
                        />
                        <span className={`text-sm ${t.isActive ? 'text-[#5c8a14]' : 'text-gray-500'}`}>
                            {t.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                )
            )
        },
        {
            key: 'rateType',
            header: 'Rate Type',
            width: 'w-[160px]',
            render: (t) => {
                if (!t.rateType) return <span className="text-muted-foreground text-xs">All Rates</span>;
                const count = t.rateUids?.length || 0;
                return (
                    <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.rateType === 'vpp'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {t.rateType === 'vpp' ? 'VPP' : 'Charges'}
                        </span>
                        {count > 0 && (
                            <span className="text-xs text-muted-foreground">({count})</span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'createdAt',
            header: 'Created On',
            width: 'w-[150px]',
            render: (t) => (
                <span
                    className="text-muted-foreground cursor-help"
                    title={`Raw: ${t.createdAt}\nTZ: ${getUserTimezone()}`}
                >
                    {formatDateTime(t.createdAt)}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        PDF Terms & Conditions
                    </h1>
                    <p className="text-muted-foreground">Manage agreement PDF terms and conditions content</p>
                </div>
                {canCreate && (
                    <Button
                        leftIcon={<PlusIcon size={16} />}
                        onClick={handleAdd}
                    >
                        Add Term
                    </Button>
                )}
            </div>

            <div className="p-5 bg-background rounded-lg border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <StatusField
                        type="user_status"
                        mode="select"
                        showAllOption
                        value={statusFilter === 'ALL' ? '' : statusFilter}
                        onChange={(val) => setStatusFilter(val ? (val as 'ACTIVE' | 'INACTIVE') : 'ALL')}
                        placeholder="All"
                        className="w-[120px]"
                    />
                    <Input
                        type="search"
                        placeholder="Search terms..."
                        containerClassName="w-[30%]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={displayedTerms}
                    rowKey={(t) => t.uid}
                    loading={loading}
                    error={error?.message}
                    emptyMessage="No PDF terms found."
                    loadingMessage="Loading terms..."
                    infiniteScroll
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Create PDF Term' : 'Edit PDF Term'}
                size="full"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} isLoading={isSubmitting}>
                            {modalMode === 'create' ? 'Create' : 'Save Changes'}
                        </Button>
                    </>
                }
            >
                {/* Loading Overlay */}
                {isLoadingContent && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">Loading content...</span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Term Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Term Name (e.g. Default Terms, VPP Terms)"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, name: e.target.value }));
                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            error={errors.name}
                        />
                    </div>

                    {/* Rate Type + Rate Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Applicable Tariff Rates</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${formData.rateType === 'vpp'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-card text-muted-foreground border-border hover:bg-accent'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, rateType: prev.rateType === 'vpp' ? '' : 'vpp', rateUids: [] }))}
                            >
                                VPP
                            </button>
                            <button
                                type="button"
                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${formData.rateType === 'charges'
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-card text-muted-foreground border-border hover:bg-accent'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, rateType: prev.rateType === 'charges' ? '' : 'charges', rateUids: [] }))}
                            >
                                Charges
                            </button>
                            {formData.rateType && (
                                <button
                                    type="button"
                                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors ml-1"
                                    onClick={() => setFormData(prev => ({ ...prev, rateType: '', rateUids: [] }))}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Rate Plans Multi-Select */}
                        {formData.rateType && (
                            <Select
                                multiple
                                placeholder="Select rate plans..."
                                options={filteredRatePlans.map(rp => ({
                                    value: rp.uid,
                                    label: `${rp.codes}${rp.tariff ? ` - ${rp.tariff}` : ''}${rp.state ? ` (${rp.state})` : ''}`,
                                }))}
                                value={formData.rateUids}
                                onChange={(val) => setFormData(prev => ({ ...prev, rateUids: val as string[] }))}
                            />
                        )}
                    </div>

                    {/* Insert Title Buttons */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Insert Section Content</label>
                            <div className="flex flex-wrap gap-2">
                                {SECTION_TITLES.map((t) => (
                                    <Tooltip key={t.label} content={t.description}>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#68c645]/30 bg-[#68c645]/5 text-[#5c8a14] hover:bg-[#68c645]/15 hover:border-[#68c645]/50 transition-all duration-200 cursor-pointer"
                                            onClick={() => handleInsertTitle(t.label)}
                                        >
                                            <PlusIcon size={12} />
                                            {t.label}
                                        </button>
                                    </Tooltip>
                                ))}
                                <Tooltip content={CONTRACT_TERM_OPTION.description}>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 cursor-pointer"
                                        onClick={() => handleInsertCustomHtml(CONTRACT_TERM_OPTION.html)}
                                    >
                                        <PlusIcon size={12} />
                                        {CONTRACT_TERM_OPTION.label}
                                    </button>
                                </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground">Click a button to insert styled headers or contract logic into the editor.</p>
                        </div>

                        {formData.rateType === 'vpp' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Insert VPP FIT Terms</label>
                                <div className="flex flex-wrap gap-2">
                                    {VPP_FIT_OPTIONS.map((opt) => (
                                        <Tooltip key={opt.label} content={opt.description}>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 cursor-pointer"
                                                onClick={() => handleInsertCustomHtml(opt.html)}
                                            >
                                                <PlusIcon size={12} />
                                                {opt.label}
                                            </button>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.rateType === 'charges' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Insert Charges Terms</label>
                                <div className="flex flex-wrap gap-2">
                                    <Tooltip content="Insert description for standard solar FIT">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 cursor-pointer"
                                            onClick={() => handleInsertCustomHtml('<p><strong style="color: #68c645">Feed-in Tariff (FIT):</strong> A credit you receive for exporting excess solar energy from your system back to the electricity grid</p><p><br></p>')}
                                        >
                                            <PlusIcon size={12} />
                                            Feed-in Tariff (FIT)
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* HTML Editor + Preview side by side */}
                    <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {/* Editor */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Content (HTML) <span className="text-red-500">*</span></label>
                            </div>
                            <HtmlEditor
                                value={formData.content}
                                onChange={(newContent) => {
                                    setFormData(prev => ({ ...prev, content: newContent }));
                                    if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
                                }}
                                placeholder="Write your PDF terms and conditions here..."
                                placeholders={PDF_VARIABLES}
                                helperText="Use 'Insert Variable' to add dynamic placeholders like {{contractTermText}}"
                                minHeight="350px"
                                error={errors.content}
                                showOfferPageButton={false}
                            />
                        </div>

                        {/* Preview Panel */}
                        {showPreview && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">PDF Preview</label>
                                <div
                                    className="rounded-lg border border-border bg-white dark:bg-gray-950 shadow-inner overflow-y-auto"
                                    style={{ minHeight: '350px', maxHeight: '550px' }}
                                >
                                    {previewHtml ? (
                                        <div
                                            className="p-5"
                                            style={{
                                                fontFamily: 'Arial, Helvetica, sans-serif',
                                                fontSize: '13px',
                                                lineHeight: '1.6',
                                                color: '#333',
                                            }}
                                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[350px] text-muted-foreground text-sm">
                                            Start writing to see the preview
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {modalMode === 'edit' && (
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm deletion"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={!isNameMatch(deleteConfirmName, termToDelete?.name || '') || isDeleting}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Type the name <span className="font-semibold text-foreground">{termToDelete?.name}</span> to delete this term.
                    </p>
                    <Input
                        placeholder="Enter term name"
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleConfirmDelete();
                            }
                        }}
                    />
                </div>
            </Modal>

            {/* Restore Modal */}
            <Modal
                isOpen={restoreModalOpen}
                onClose={() => setRestoreModalOpen(false)}
                title="Confirm restoration"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setRestoreModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmRestore} isLoading={isRestoring}>Restore</Button>
                    </>
                }
            >
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to restore <span className="font-semibold text-foreground">{termToRestore?.name}</span>?
                </p>
            </Modal>
        </div>
    );
}
