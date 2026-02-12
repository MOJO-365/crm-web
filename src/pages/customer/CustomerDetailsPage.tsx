import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Input, DatePicker, Select, Tooltip, Switch as ToggleSwitch, ConfirmationPopover, Popover } from '@/components/ui';
import { Modal, StatusField } from '@/components/common';
import {
    PlusIcon, PencilIcon,
    CheckIcon, XIcon, MailIcon, Settings2Icon, PlugIcon, ZapIcon,
    EyeIcon, TrashIcon, UploadIcon, CalendarIcon, UserIcon, InfoIcon, ActivityIcon,
    IdCardIcon, ArrowLeftIcon, PhoneIcon, MoreHorizontalIcon
} from '@/components/icons';
import {
    GET_CUSTOMER_BY_ID, SEND_REMINDER_EMAIL,
    UPDATE_CUSTOMER, GET_RATES_HISTORY_BY_VERSION, GET_CUSTOMER_NOTES,
    CREATE_CUSTOMER_NOTE, DELETE_CUSTOMER_NOTE, GET_USERS, GET_NOTE_TYPES,
    CREATE_NOTE_TYPE, GET_DOCUMENT_TYPES, CREATE_DOCUMENT_TYPE, CREATE_CUSTOMER
} from '@/graphql';
import { formatSydneyTime } from '@/lib/date';
import { secondaryApiAxios, apiAxios } from '@/lib/apollo';
import { cn } from '@/lib/utils';

import { SALE_TYPE_LABELS, BILLING_PREF_LABELS, DNSP_LABELS, BATTERY_BRAND_OPTIONS } from '@/lib/constants';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/useAuthStore';
import { calculateDiscountedRate } from '@/lib/rate-utils';

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
    discount?: number;
    tariffCode?: string;
    signDate?: string;
    signedPdfPath?: string;
    emailSent?: number;
    phoneVerifiedAt?: string;
    address?: CustomerAddress;
    enrollmentDetails?: {
        saletype?: number;
        connectiondate?: string;
        idtype?: number;
        idnumber?: string;
        idstate?: string;
        idexpiry?: string;
        concession?: number;
        lifesupport?: number;
        billingpreference?: number;
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

export function CustomerDetailsPage() {
    const { uid } = useParams();
    const navigate = useNavigate();
    // const canView = useAuthStore((state) => state.canViewMenu('customers'));
    // const canCreate = useAuthStore((state) => state.canCreateInMenu('customers'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('customers'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('customers'));
    const canManageNoteTypes = useAuthStore((state) => state.hasFeatureAccess('feature_manage_note_types'));
    const canManageDocumentTypes = useAuthStore((state) => state.hasFeatureAccess('feature_manage_document_types'));

    // State
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<CustomerDetails | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // Detail Section State
    const [selectedDetailSection, setSelectedDetailSection] = useState<'location' | 'account' | 'rates' | 'solar_vpp' | 'debit' | 'utilmate' | 'notes' | 'documents' | 'electricity_bills'>('location');

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
    const newDocumentInputRef = useRef<HTMLInputElement>(null);

    // Action states
    const [sendingReminder, setSendingReminder] = useState(false);
    const [reminderSent, setReminderSent] = useState(false);
    const [freezingCustomer, setFreezingCustomer] = useState(false);
    const [freezeModalOpen, setFreezeModalOpen] = useState(false);
    // const [customerToFreeze, setCustomerToFreeze] = useState<CustomerDetails | null>(null); // Not needed since we use selectedCustomerDetails
    const [markingNotInterested, setMarkingNotInterested] = useState(false);
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
    const [vppConnectModalOpen, setVppConnectModalOpen] = useState(false);
    const [utilmateConnectModalOpen, setUtilmateConnectModalOpen] = useState(false);

    // Utilmate Form State
    const [isEditingUtilmate, setIsEditingUtilmate] = useState(false);
    const [utilmateForm, setUtilmateForm] = useState({
        siteIdentifier: '',
        accountNumber: '',
        utilmateConnected: 0,
        utilmateConnectedAt: ''
    });

    // Queries
    const { loading: isLoadingDetails, refetch: refetchCustomer } = useQuery(GET_CUSTOMER_BY_ID, {
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
        skip: !uid,
        fetchPolicy: 'network-only',
    });

    const { data: noteTypesData, refetch: refetchNoteTypes } = useQuery(GET_NOTE_TYPES, {
        fetchPolicy: 'network-only'
    });

    // Fetch users for note assignment
    const { data: userData } = useQuery(GET_USERS, {
        variables: { limit: 100 },
    });

    const userOptions = userData?.users?.data?.map((u: any) => ({
        label: u.name || 'Unknown User',
        value: u.uid
    })) || [];

    const { data: documentTypesData, refetch: refetchDocumentTypes } = useQuery(GET_DOCUMENT_TYPES, {
        fetchPolicy: 'cache-and-network'
    });

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
    const [createNoteType] = useMutation(CREATE_NOTE_TYPE);
    const [createDocumentTypeMutation] = useMutation(CREATE_DOCUMENT_TYPE);
    const [sendReminderEmail] = useMutation(SEND_REMINDER_EMAIL);
    const [createCustomer] = useMutation(CREATE_CUSTOMER);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

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

        if (selectedCustomerDetails?.signedPdfPath) {
            const url = `${baseUrl}/api/documents/${encodeURIComponent(selectedCustomerDetails.signedPdfPath).replace(/%2F/g, '/')}`;
            setPreviewUrl(url);
        } else {
            const url = `${baseUrl}/api/agreement/preview/${uid}`;
            setPreviewUrl(url);
        }

        setPreviewModalOpen(true);
    };

    const handleDeleteDocument = async (docPath: string) => {
        if (!selectedCustomerDetails?.customerId) return;

        setIsDeletingDocument(docPath);
        try {
            await apiAxios.delete(`/api/documents/${encodeURIComponent(docPath).replace(/%2F/g, '/')}`);

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
            } else {
                docName = documentType;
            }

            formData.append('documentType', apiDocType);
            formData.append('name', docName);
            if (startDate) formData.append('startDate', startDate);
            if (endDate) formData.append('endDate', endDate);
            formData.append('file', file);

            await apiAxios.post('/api/documents/upload', formData, {
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
                } : undefined
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
                }
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

    const handleFreezeClick = () => {
        setFreezeModalOpen(true);
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
        }

    };

    const handleVppToggle = async (customerUid: string, newValue: boolean) => {
        if (!selectedCustomerDetails) return;

        if (newValue) {
            setVppForm({
                vppSignupBonus: selectedCustomerDetails?.vppDetails?.vppSignupBonus?.toString() || '',
                batteryBrand: selectedCustomerDetails?.batteryDetails?.batterybrand || '',
                snNumber: selectedCustomerDetails?.batteryDetails?.snnumber || '',
                batteryCapacity: selectedCustomerDetails?.batteryDetails?.batterycapacity?.toString() || '',
                exportLimit: selectedCustomerDetails?.batteryDetails?.exportlimit?.toString() || '',
                inverterCapacity: selectedCustomerDetails?.batteryDetails?.inverterCapacity?.toString() || '',
                checkCode: selectedCustomerDetails?.batteryDetails?.checkCode || ''
            });
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
            // Priority: Sync with secondary API first
            try {
                await secondaryApiAxios.post('/api/v1/utilmate/user/add-user-battery', {
                    user_id: selectedCustomerDetails.customerId,
                    battery_brand: selectedCustomerDetails.batteryDetails?.batterybrand || '',
                    sn_number: selectedCustomerDetails.batteryDetails?.snnumber || '',
                    check_code: selectedCustomerDetails.batteryDetails?.checkCode || '',
                    battery_usable_capacity: 0,
                    inverter_capacity: 0
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API during disconnection', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. VPP status not updated.');
            }

            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        vppDetails: {
                            vppConnected: newValue ? 1 : 0
                        }
                    }
                }
            });
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
                    sn_number: vppForm.snNumber,
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
                } : undefined
            };

            await updateCustomer({
                variables: {
                    uid: selectedCustomerDetails.uid,
                    input
                }
            });

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
                        }
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

        if (newValue && selectedCustomerDetails.msatDetails?.msatConnected !== 1) {
            toast.error("Please connect to MSAT first before connecting to Utilmate.");
            return;
        }

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
            // Priority: Sync with secondary API first
            try {
                await secondaryApiAxios.post('/api/v1/utilmate/user/add-user', {
                    account_number: selectedCustomerDetails.utilmateDetails?.accountNumber || '',
                    site_identifier: selectedCustomerDetails.utilmateDetails?.siteIdentifier || '',
                    gee_id: selectedCustomerDetails.customerId || selectedCustomerDetails.uid,
                    dnsp: (selectedCustomerDetails.ratePlan?.dnsp !== undefined && selectedCustomerDetails.ratePlan?.dnsp !== null) ? (DNSP_LABELS[selectedCustomerDetails.ratePlan.dnsp as keyof typeof DNSP_LABELS] || '') : '',
                    nmi_number: selectedCustomerDetails.address?.nmi || ''
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API during Utilmate disconnection', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. Utilmate status not updated.');
            }

            await updateCustomer({
                variables: {
                    uid: customerUid,
                    input: {
                        utilmateDetails: {
                            utilmateConnected: newValue ? 1 : 0,
                            utilmateConnectedAt: newValue ? now : undefined,
                        }
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
            try {
                await secondaryApiAxios.post('/api/v1/utilmate/user/add-user', {
                    account_number: utilmateForm.accountNumber,
                    site_identifier: utilmateForm.siteIdentifier,
                    gee_id: selectedCustomerDetails.customerId || selectedCustomerDetails.uid,
                    dnsp: (selectedCustomerDetails.ratePlan?.dnsp !== undefined && selectedCustomerDetails.ratePlan?.dnsp !== null) ? (DNSP_LABELS[selectedCustomerDetails.ratePlan.dnsp as keyof typeof DNSP_LABELS] || '') : '',
                    nmi_number: selectedCustomerDetails.address?.nmi || ''
                });
            } catch (secErr: any) {
                console.error('Failed to sync with secondary API', secErr);
                throw new Error(secErr.response?.data?.message || 'Failed to sync with secondary system. Utilmate not connected.');
            }

            const now = new Date().toISOString();
            const input: any = {
                utilmateDetails: {
                    siteIdentifier: utilmateForm.siteIdentifier || undefined,
                    accountNumber: utilmateForm.accountNumber || undefined,
                    utilmateConnected: 1,
                    utilmateConnectedAt: now,
                }
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



    const handleSendReminder = async (customerUid: string) => {
        setSendingReminder(true);
        try {
            const { data } = await sendReminderEmail({
                variables: { customerUid }
            });

            if (data?.sendReminderEmail?.success) {
                toast.success(data.sendReminderEmail.message || 'Reminder sent successfully');
                setReminderSent(true);
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

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm animate-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                            <UserIcon size={36} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        {selectedCustomerDetails ? `${selectedCustomerDetails.firstName} ${selectedCustomerDetails.lastName}` : 'Customer Details'}
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
                                </div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <span className="bg-muted px-2 py-0.5 rounded text-xs">Customer ID: </span>
                                    {selectedCustomerDetails?.customerId ? `${selectedCustomerDetails.customerId}` : "View and manage customer details"}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                                        <MailIcon size={14} />
                                    </div>
                                    <span className="font-medium">{selectedCustomerDetails?.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                                        <PhoneIcon size={14} />
                                    </div>
                                    <span className="font-medium">{selectedCustomerDetails?.number || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                                        <CalendarIcon size={14} />
                                    </div>
                                    <span className="font-medium"><span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mr-1.5">Birth Date</span>{selectedCustomerDetails?.dob ? formatSydneyTime(selectedCustomerDetails.dob) : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                        <Button variant="outline" onClick={() => navigate('/customers')} className="h-9 px-3 text-sm">
                            <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                            Back
                        </Button>
                        {canEdit && (
                            <Button onClick={() => navigate(`/customers/${uid}/edit`)} variant="outline" className="h-9 px-3 text-sm">
                                <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                            </Button>
                        )}
                        {selectedCustomerDetails && (
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
                                                    {isLoadingPreview ? 'Loading...' : (selectedCustomerDetails.signedPdfPath ? 'View Signed Agreement' : 'Preview Offer')}
                                                </button>
                                                {hasNotInterested && (
                                                    <button
                                                        onClick={() => {
                                                            handleMarkNotInterested();
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
                                                            <ZapIcon size={15} className="text-amber-500" />
                                                            {freezingCustomer ? 'Freezing...' : 'Freeze'}
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

            {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">Loading customer details...</p>
                </div>
            ) : selectedCustomerDetails ? (
                <div className="space-y-6">
                    {/* Progress Timeline */}
                    {/* Progress Timeline */}
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-8 space-y-6">
                        <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-medium text-foreground">Progress timeline</h3>
                                    <p className="text-xs text-muted-foreground">Track each milestone and when it happened.</p>
                                </div>

                            </div>
                            <div className="relative flex justify-between items-start">
                                {[
                                    { label: 'Offer sent', date: selectedCustomerDetails.createdAt, completed: true, step: 1 },
                                    { label: 'Signed by customer', date: selectedCustomerDetails.signDate, completed: !!selectedCustomerDetails.signDate, showReminder: selectedCustomerDetails.status < 2, step: 2 },
                                    ...(selectedCustomerDetails.vppDetails?.vpp === 1 ? [
                                        { label: 'VPP connect', date: null, completed: selectedCustomerDetails.vppDetails?.vppConnected === 1, showToggle: true, disabled: selectedCustomerDetails.status < 2, step: 3 },
                                    ] : []),
                                    { label: 'Connected to MSAT', date: null, completed: selectedCustomerDetails.msatDetails?.msatConnected === 1, showToggle: true, disabled: selectedCustomerDetails.vppDetails?.vpp === 1 && selectedCustomerDetails.vppDetails?.vppConnected !== 1, step: 4 },
                                    { label: 'Utilmate Connect', date: null, completed: selectedCustomerDetails.utilmateDetails?.utilmateConnected === 1, showToggle: true, disabled: selectedCustomerDetails.vppDetails?.vpp === 1 && selectedCustomerDetails.msatDetails?.msatConnected !== 1, step: 5 },
                                ].map((item, index, arr) => (
                                    <div key={index} className="relative flex flex-col items-center" style={{ width: `${100 / arr.length}%` }}>
                                        {index > 0 && (
                                            <div className={`absolute top-[18px] h-0.5 ${item.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} style={{ right: '50%', left: '-50%' }} />
                                        )}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-background border-2 z-10 ${item.completed ? 'border-green-500 text-green-500' : 'border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                                            {item.completed ? <CheckIcon size={16} strokeWidth={3} /> : index + 1}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 justify-center z-30 relative">
                                            <span className={`text-xs font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                                            {item.step === 4 && (
                                                <Tooltip
                                                    position="bottom"
                                                    className="whitespace-normal min-w-[220px] p-0 overflow-hidden bg-white dark:bg-neutral-900 border border-border shadow-xl text-foreground"
                                                    content={
                                                        <div className="flex flex-col text-xs">
                                                            <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                                </div>
                                                                <span className="font-semibold">MSAT Details</span>
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
                                                    <div className="cursor-help text-muted-foreground hover:text-foreground transition-colors p-1">
                                                        <InfoIcon size={14} />
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </div>
                                        {item.date && <span className="text-[10px] text-muted-foreground">{formatSydneyTime(item.date)}</span>}
                                        {item.showReminder && (
                                            <button
                                                onClick={() => handleSendReminder(selectedCustomerDetails.uid)}
                                                disabled={sendingReminder || reminderSent}
                                                className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg mt-1 relative z-30 ${reminderSent ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${sendingReminder ? 'opacity-70' : ''}`}
                                            >
                                                {sendingReminder ? (
                                                    <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                ) : reminderSent ? (
                                                    <><CheckIcon size={10} />Sent</>
                                                ) : (
                                                    <><MailIcon size={10} />Send reminder</>
                                                )}
                                            </button>
                                        )}


                                        {item.showToggle && (
                                            <div className="mt-1 relative z-30">
                                                <ConfirmationPopover
                                                    title="Disconnect?"
                                                    description="Are you sure you want to disconnect this service?"
                                                    enabled={item.completed}
                                                    onConfirm={() => {
                                                        if (item.step === 3) {
                                                            handleVppToggle(selectedCustomerDetails.uid, false);
                                                        } else if (item.step === 4) {
                                                            handleMsatToggle(selectedCustomerDetails.uid, false);
                                                        } else if (item.step === 5) {
                                                            handleUtilmateToggle(selectedCustomerDetails.uid, false);
                                                        }
                                                    }}
                                                >
                                                    <ToggleSwitch
                                                        checked={item.completed}
                                                        disabled={item.disabled}
                                                        onChange={(val) => {
                                                            // Only handle turning ON here. Turning OFF is handled by onConfirm.
                                                            if (val) {
                                                                if (item.step === 3) {
                                                                    handleVppToggle(selectedCustomerDetails.uid, true);
                                                                } else if (item.step === 4) {
                                                                    handleMsatToggle(selectedCustomerDetails.uid, true);
                                                                } else if (item.step === 5) {
                                                                    handleUtilmateToggle(selectedCustomerDetails.uid, true);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </ConfirmationPopover>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Horizontal Tabs Layout */}
                    <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-[600px]">
                        {/* Tab Navigation */}
                        <div className="border-b border-border bg-muted/30 flex overflow-x-auto no-scrollbar">
                            {[
                                { id: 'location', label: 'Location', icon: UserIcon },
                                { id: 'account', label: 'Account', icon: Settings2Icon },
                                { id: 'rates', label: 'Rates', icon: ZapIcon },
                                { id: 'solar_vpp', label: 'Solar & VPP', icon: ZapIcon },
                                { id: 'debit', label: 'Debit', icon: IdCardIcon },
                                { id: 'utilmate', label: 'Utilmate', icon: ZapIcon },
                                { id: 'notes', label: 'Notes', icon: Settings2Icon, badge: notesData?.customerNotes?.length },
                                { id: 'documents', label: 'Documents', icon: UploadIcon, badge: selectedCustomerDetails.documents?.filter(d => d.documentType?.category === '0' || d.documentType?.category === '1' || (!d.documentType?.category && d.type !== '2')).length },
                                { id: 'electricity_bills', label: 'Electricity Bills', icon: ZapIcon, badge: selectedCustomerDetails.documents?.filter(d => d.documentType?.category === '2' || d.type === '2').length }
                            ].filter(item => {
                                if (item.id === 'solar_vpp') {
                                    return selectedCustomerDetails.solarDetails?.hassolar === 1 ||
                                        selectedCustomerDetails.vppDetails?.vpp === 1 ||
                                        selectedCustomerDetails.ratePlan?.vpp === 1;
                                }
                                if (item.id === 'debit') {
                                    return !!selectedCustomerDetails.debitDetails && selectedCustomerDetails.debitDetails.optIn === 1;
                                }
                                if (item.id === 'utilmate') {
                                    return !!selectedCustomerDetails.utilmateDetails && selectedCustomerDetails.utilmateDetails.utilmateConnected === 1;
                                }
                                return true;
                            }).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedDetailSection(item.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 whitespace-nowrap outline-none",
                                        selectedDetailSection === item.id
                                            ? "border-primary bg-background text-primary"
                                            : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </div>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-bold",
                                            selectedDetailSection === item.id
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto">


                            {selectedDetailSection === 'location' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Location Details</h3>
                                                <p className="text-xs text-muted-foreground">Address & property details</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Full Address</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.fullAddress || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Unit Number</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.unitNumber || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Street Number</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.streetNumber || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Street Name</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.streetName || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Street Type</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.streetType || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Suburb</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.suburb || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">State</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.state || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Postcode</label>
                                            <p className="font-medium">{selectedCustomerDetails.address?.postcode || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedDetailSection === 'account' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                <Settings2Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Account Details</h3>
                                                <p className="text-xs text-muted-foreground">NMI, connection & enrollment</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">NMI</label>
                                            <p className="font-medium text-primary">{selectedCustomerDetails.address?.nmi || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground uppercase font-semibold">Connection Date</label>
                                            <p className="font-medium">
                                                {selectedCustomerDetails.enrollmentDetails?.connectiondate
                                                    ? formatSydneyTime(selectedCustomerDetails.enrollmentDetails.connectiondate)
                                                    : '-'}
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
                                            <p className={cn("font-medium", selectedCustomerDetails.enrollmentDetails?.lifesupport ? "text-red-600" : "text-green-600")}>
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
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Rate Plan Details</h3>
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
                                            {selectedCustomerDetails.ratePlan.offers.map((offer, idx) => {
                                                const discount = selectedCustomerDetails.discount ?? 0;
                                                const hasCL = (offer.cl1Usage || 0) > 0 || (offer.cl2Usage || 0) > 0 || (offer.cl1Supply || 0) > 0 || (offer.cl2Supply || 0) > 0;
                                                const hasFiT = (offer.fit || 0) > 0 || (offer.fitPeak || 0) > 0 || (offer.fitCritical || 0) > 0 || (offer.fitVpp || 0) > 0;

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
                                                                        { label: 'Anytime', value: offer.anytime, type: 'anytime' }
                                                                    ]
                                                                        .filter(rate => (rate.value ?? 0) > 0)
                                                                        .sort((a, b) => calculateDiscountedRate(a.value ?? 0, discount) - calculateDiscountedRate(b.value ?? 0, discount))
                                                                        .map((rate, idx) => {
                                                                            const isAnytime = rate.type === 'anytime';
                                                                            const price = calculateDiscountedRate(rate.value ?? 0, discount);

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
                                                                                        ${price.toFixed(4)}/kWh
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
                                                                    <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center space-y-0.5">
                                                                        <div className="text-purple-600 dark:text-purple-400 font-bold text-base tracking-tight">${(offer.supplyCharge ?? 0).toFixed(4)}/day</div>
                                                                        <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider opacity-80">Supply</div>
                                                                    </div>
                                                                    {(offer.vppOrcharge ?? 0) > 0 && (
                                                                        <>
                                                                            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mt-4">
                                                                                <ActivityIcon size={16} />
                                                                                <h4 className="text-sm font-bold uppercase tracking-wide">VPP Charges</h4>
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
                                                                        {[
                                                                            { label: 'Feed-in', value: offer.fit, type: 'fit' },
                                                                            { label: 'PREMIUM FIT', value: offer.fitPeak, type: 'fitPeak' },
                                                                            { label: 'CRITICAL EVENT FIT', value: offer.fitCritical, type: 'fitCritical' },
                                                                            { label: 'BASE FIT', value: offer.fitVpp, type: 'fitVpp' }
                                                                        ]
                                                                            .filter(rate => {
                                                                                if ((rate.value ?? 0) <= 0) return false;
                                                                                const isVppActive = selectedCustomerDetails.vppDetails?.vpp === 1;
                                                                                const hasSolar = selectedCustomerDetails.solarDetails?.hassolar === 1;

                                                                                if (rate.type === 'fit') return !isVppActive;
                                                                                return isVppActive || !hasSolar;
                                                                            })
                                                                            .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
                                                                            .map((rate, idx) => (
                                                                                <div
                                                                                    key={idx}
                                                                                    className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm"
                                                                                >
                                                                                    <div className="text-teal-800 dark:text-teal-300 font-bold text-base tracking-tight">
                                                                                        ${(rate.value ?? 0).toFixed(4)}/kWh
                                                                                    </div>
                                                                                    <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider opacity-80">
                                                                                        {rate.label}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
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
                                                                            { label: 'CL2 Supply', value: offer.cl2Supply, type: 'cl2_supply' }
                                                                        ]
                                                                            .filter(rate => (rate.value ?? 0) > 0)
                                                                            .map((rate, idx) => {
                                                                                const isUsage = rate.type.endsWith('_usage');
                                                                                const price = isUsage ? calculateDiscountedRate(rate.value ?? 0, discount) : (rate.value ?? 0);
                                                                                const unit = isUsage ? 'kWh' : 'day';
                                                                                return (
                                                                                    <div key={idx} className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center space-y-0.5 transition-all duration-200 hover:shadow-sm">
                                                                                        <div className="text-green-600 dark:text-green-400 font-bold text-base tracking-tight">${price.toFixed(4)}/{unit}</div>
                                                                                        <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider opacity-80">{rate.label}</div>
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
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">No rate offers available.</p>
                                    )}
                                </div>
                            )}

                            {selectedDetailSection === 'solar_vpp' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Solar Header */}
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                                                <ZapIcon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Solar & VPP</h3>
                                                <p className="text-xs text-muted-foreground">Solar & VPP configuration</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Solar Section */}
                                    {selectedCustomerDetails.solarDetails?.hassolar === 1 && (
                                        <div className="space-y-6">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Solar Configuration</h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-muted-foreground uppercase font-semibold">Solar Capacity</label>
                                                    <p className="font-medium">{selectedCustomerDetails.solarDetails.solarcapacity} kW</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-muted-foreground uppercase font-semibold">Inverter Capacity</label>
                                                    <p className="font-medium">{selectedCustomerDetails.solarDetails.invertercapacity} kW</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* VPP Section */}
                                    {(selectedCustomerDetails.vppDetails?.vpp === 1 || selectedCustomerDetails.ratePlan?.vpp === 1) && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between border-b pb-2">
                                                <h3 className="text-lg font-semibold">VPP Configuration</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">VPP Connected</span>
                                                    <ToggleSwitch
                                                        checked={selectedCustomerDetails.vppDetails?.vppConnected === 1}
                                                        onChange={(checked) => handleVppToggle(selectedCustomerDetails.uid, checked)}
                                                        disabled={false}
                                                    />
                                                </div>
                                            </div>

                                            {selectedCustomerDetails.vppDetails?.vppConnected === 1 && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Signup Bonus ($)</label>
                                                            <Input
                                                                type="number"
                                                                value={vppForm.vppSignupBonus}
                                                                onChange={(e) => setVppForm({ ...vppForm, vppSignupBonus: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Battery Brand</label>
                                                            <Select
                                                                value={vppForm.batteryBrand}
                                                                onChange={(val: any) => setVppForm({ ...vppForm, batteryBrand: val })}
                                                                disabled={!isEditingVpp}
                                                                options={BATTERY_BRAND_OPTIONS}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Serial Number</label>
                                                            <Input
                                                                value={vppForm.snNumber}
                                                                onChange={(e) => setVppForm({ ...vppForm, snNumber: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Battery Capacity (kWh)</label>
                                                            <Input
                                                                type="number"
                                                                value={vppForm.batteryCapacity}
                                                                onChange={(e) => setVppForm({ ...vppForm, batteryCapacity: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Export Limit (kW)</label>
                                                            <Input
                                                                type="number"
                                                                value={vppForm.exportLimit}
                                                                onChange={(e) => setVppForm({ ...vppForm, exportLimit: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Inverter Capacity (kW)</label>
                                                            <Input
                                                                type="number"
                                                                value={vppForm.inverterCapacity}
                                                                onChange={(e) => setVppForm({ ...vppForm, inverterCapacity: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Check Code</label>
                                                            <Input
                                                                value={vppForm.checkCode}
                                                                onChange={(e) => setVppForm({ ...vppForm, checkCode: e.target.value })}
                                                                disabled={!isEditingVpp}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-2 pt-4">
                                                        {isEditingVpp ? (
                                                            <>
                                                                <Button variant="outline" onClick={() => setIsEditingVpp(false)}>Cancel</Button>
                                                                <Button onClick={handleSaveVppDetails}>Save VPP Details</Button>
                                                            </>
                                                        ) : (
                                                            <Button variant="outline" onClick={() => setIsEditingVpp(true)}>
                                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                                Edit Details
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedCustomerDetails.solarDetails?.hassolar !== 1 &&
                                        selectedCustomerDetails.vppDetails?.vpp !== 1 &&
                                        selectedCustomerDetails.ratePlan?.vpp !== 1 && (
                                            <div className="text-center py-12 text-muted-foreground bg-white dark:bg-neutral-950 rounded-lg border border-dashed border-border">
                                                <ZapIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No Solar or VPP configuration found for this customer.</p>
                                            </div>
                                        )}
                                </div>
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
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Direct Debit</h3>
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
                                                { label: 'Account Number', value: selectedCustomerDetails.debitDetails.accountNumber },
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
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Utilmate Integration</h3>
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
                                    <div className="grid grid-cols-2 gap-4">
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
                                    </div>

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
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Documents</h3>
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
                                                <tr className="bg-muted/30 border-b border-border animate-in fade-in slide-in-from-top-1">
                                                    <td className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
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
                                                                <Select
                                                                    options={docTypeOptions.filter(o => o.value !== '2')}
                                                                    value={newDocumentType}
                                                                    onChange={(val) => setNewDocumentType(val as string)}
                                                                    placeholder="Select Type..."
                                                                    className="w-full bg-background h-9"
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center text-muted-foreground italic">—</td>
                                                    <td className="px-4 py-4 text-center text-muted-foreground italic">—</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex flex-col gap-2 items-end">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setNewDocumentType('');
                                                                    }}
                                                                    className="h-8 px-3 text-xs border-input hover:bg-accent hover:text-accent-foreground"
                                                                >
                                                                    Clear
                                                                </Button>
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
                                                {selectedCustomerDetails && [
                                                    {
                                                        doc: selectedCustomerDetails.previousBill,
                                                        label: selectedCustomerDetails.previousBill?.documentType?.name || 'Previous Bill',
                                                        type: 'previousBill',
                                                        category: '0'
                                                    },
                                                    {
                                                        doc: selectedCustomerDetails.identityProof,
                                                        label: selectedCustomerDetails.identityProof?.documentType?.name || 'Identity Proof',
                                                        type: 'identityProof',
                                                        category: '0'
                                                    },
                                                    ...(selectedCustomerDetails?.documents?.filter(d =>
                                                        d.uid !== selectedCustomerDetails?.previousBill?.uid &&
                                                        d.uid !== selectedCustomerDetails?.identityProof?.uid &&
                                                        (d.documentType?.category === '0' || d.documentType?.category === '1' || (!d.documentType?.category && d.type !== '2'))
                                                    ).map(d => ({
                                                        doc: d,
                                                        label: d.documentType?.name || d.name || 'Document',
                                                        type: d.type || 'other',
                                                        category: d.documentType?.category || '0'
                                                    })) || [])
                                                ].map((item, idx) => (
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
                                                                            onClick={() => item.doc?.path && window.open(`${apiAxios.defaults.baseURL}/api/documents/${encodeURIComponent(item.doc.path).replace(/%2F/g, '/')}`, '_blank')}
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
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Electricity Bills</h3>
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
                                                <tr className="bg-muted/30 border-b border-border animate-in fade-in slide-in-from-top-1">
                                                    <td className="px-4 py-4">
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
                                                    <td className="px-4 py-4 text-center text-muted-foreground italic">—</td>
                                                    <td className="px-4 py-4 text-center text-muted-foreground italic">—</td>
                                                    <td className="px-4 py-4 text-right">
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
                                                                            onClick={() => doc.path && window.open(`${apiAxios.defaults.baseURL}/api/documents/${encodeURIComponent(doc.path).replace(/%2F/g, '/')}`, '_blank')}
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

                            {selectedDetailSection === 'notes' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Settings2Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-foreground tracking-tight">Notes</h3>
                                                <p className="text-xs text-muted-foreground">Activity log & follow-ups</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-neutral-900 text-white hover:bg-neutral-800"
                                            onClick={() => setNoteModalOpen(true)}
                                            leftIcon={<PlusIcon size={14} />}
                                        >
                                            Add Note
                                        </Button>
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

            {/* MODALS */}



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
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Check Code</label>
                            <Input
                                placeholder="Verification Code"
                                value={vppForm.checkCode}
                                onChange={(e) => setVppForm({ ...vppForm, checkCode: e.target.value })}
                            />
                        </div>
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
                onClose={() => setPreviewModalOpen(false)}
                title="Offer Preview"
                size="full"
            >
                <div className="flex-1 h-[70vh] w-full bg-muted/20 rounded-md border overflow-hidden mb-4">
                    {previewUrl ? (
                        <iframe src={previewUrl} className="w-full h-full" title="Offer Preview" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Loading preview...
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>Close</Button>
                </div>
            </Modal>
            {/* Add Note Modal */}
            <Modal
                isOpen={noteModalOpen}
                onClose={() => { setNoteModalOpen(false); setNoteText(''); }}
                title="Add Note"
                size="sm"
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
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Note Message</label>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Write a note..."
                            className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            autoFocus
                        />
                    </div>

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
                            <DatePicker
                                label="Follow-up Date"
                                value={noteFollowUp ? new Date(noteFollowUp) : null}
                                onChange={(date) => setNoteFollowUp(date)}
                                placeholder="Select follow-up date..."
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
