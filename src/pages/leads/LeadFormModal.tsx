import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal, ConfirmModal } from '@/components/common';
import { GET_LEAD, CREATE_LEAD, UPDATE_LEAD, GET_LEADS, GET_LEAD_SOURCES, CREATE_LEAD_SOURCE, CHECK_ADDRESS_EXISTS, CHECK_NMI_EXISTS, GET_USERS, CHECK_LEAD_DUPLICATE } from '@/graphql';
import { TITLE_OPTIONS } from '@/lib/constants';
import LocationAutocomplete from '../LocationAutocomplete';
import { PlusIcon } from '@/components/icons';
import { useAuthStore } from '@/stores/useAuthStore';

// Reuse the Field component pattern from CustomerFormPage
const Field = ({ label, required, hint, children, error, warning, action }: { label: string, required?: boolean, hint?: string, children: React.ReactNode, error?: string, warning?: string, action?: React.ReactNode }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {action}
        </div>
        {children}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {warning && <p className="text-xs text-amber-600 font-medium">{warning}</p>}
    </div>
);

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    uid?: string | null;
}

export default function LeadFormModal({ isOpen, onClose, uid }: LeadFormModalProps) {
    const isEditMode = !!uid;
    const canManageLeadSources = useAuthStore((state) => state.hasFeatureAccess('feature_manage_lead_sources'));
    const canViewAllCustomers = useAuthStore((state) => state.hasFeatureAccess('feature_view_all_customers'));
    const currentUserUid = useAuthStore((state) => state.user?.uid);
    const canCreateDuplicates = useAuthStore((state) => state.hasFeatureAccess('feature_allow_duplicate_leads'));

    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        number: '',
        source: '',
        notes: '',
        unitnumber: '',
        housenumber: '',
        buildingname: '',
        floorlevelnumber: '',
        streetnumber: '',
        streetname: '',
        streettype: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
        nmi: '',
        referralName: '',
        assignedToUid: '',
    });

    const [addressSearch, setAddressSearch] = useState('');
    const [isAddingNewSourceInline, setIsAddingNewSourceInline] = useState(false);
    const [newSourceName, setNewSourceName] = useState('');
    const [duplicateErrors, setDuplicateErrors] = useState<{
        address?: string;
        nmi?: string;
        leadAddress?: string;
        leadNumber?: string;
    }>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);

    const [checkAddressExists] = useLazyQuery(CHECK_ADDRESS_EXISTS, { fetchPolicy: 'no-cache' });
    const [checkNmiExists] = useLazyQuery(CHECK_NMI_EXISTS, { fetchPolicy: 'no-cache' });
    const [checkAddressLeadDuplicate] = useLazyQuery(CHECK_LEAD_DUPLICATE, { fetchPolicy: 'no-cache' });
    const [checkNumberLeadDuplicate] = useLazyQuery(CHECK_LEAD_DUPLICATE, { fetchPolicy: 'no-cache' });

    const { data, loading } = useQuery(GET_LEAD, {
        variables: { uid },
        skip: !isEditMode || !isOpen,
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (data?.lead && isOpen) {
            const lead = data.lead;
            const newFormData = {
                title: lead.title || '',
                firstname: lead.firstname || '',
                lastname: lead.lastname || '',
                email: lead.email || '',
                number: (lead.number || '').replace(/\D/g, '').replace(/^0/, '').substring(0, 9),
                source: lead.source || '',
                notes: lead.notes || '',
                unitnumber: (lead.unitnumber || '').toString().trim().replace(/^(unit|unit\s+)/i, ''),
                housenumber: (() => {
                    const hn = (lead.housenumber || '').toString().trim();
                    const sn = (lead.streetnumber || '').toString().trim();
                    const unit = (lead.unitnumber || '').toString().trim().replace(/^(unit|unit\s+)/i, '');
                    return (hn === sn || hn === unit) ? '' : hn;
                })(),
                buildingname: lead.buildingname || '',
                floorlevelnumber: lead.floorlevelnumber || '',
                streetnumber: lead.streetnumber || '',
                streetname: lead.streetname || '',
                streettype: lead.streettype || '',
                suburb: lead.suburb || '',
                state: lead.state || '',
                postcode: lead.postcode || '',
                country: lead.country || 'Australia',
                nmi: lead.nmi || '',
                referralName: lead.referralName || '',
                assignedToUid: lead.assignedTo || '',
            };
            setFormData(newFormData);

            // Set address search string
            const fullAddr = [
                lead.unitnumber ? `Unit ${lead.unitnumber}` : '',
                lead.buildingname,
                lead.floorlevelnumber ? `Level ${lead.floorlevelnumber}` : '',
                lead.housenumber,
                lead.streetnumber,
                lead.streetname,
                lead.streettype,
                lead.suburb,
                lead.state,
                lead.postcode
            ].filter(Boolean).join(' ');
            setAddressSearch(fullAddr);

        } else if (!isEditMode && isOpen) {
            setFormData({
                title: '',
                firstname: '',
                lastname: '',
                email: '',
                number: '',
                source: '',
                notes: '',
                unitnumber: '',
                housenumber: '',
                buildingname: '',
                floorlevelnumber: '',
                streetnumber: '',
                streetname: '',
                streettype: '',
                suburb: '',
                state: '',
                postcode: '',
                country: 'Australia',
                nmi: '',
                referralName: '',
                assignedToUid: currentUserUid || '',
            });
            setAddressSearch('');
        }
    }, [data, isOpen, isEditMode]);

    const [createLead, { loading: creating }] = useMutation(CREATE_LEAD, {
        refetchQueries: [{ query: GET_LEADS }]
    });
    const [updateLead, { loading: updating }] = useMutation(UPDATE_LEAD, {
        refetchQueries: [{ query: GET_LEADS }]
    });

    const { data: sourcesData, loading: sourcesLoading } = useQuery(GET_LEAD_SOURCES, {
        skip: !isOpen,
    });

    const [createLeadSource, { loading: addingSource }] = useMutation(CREATE_LEAD_SOURCE, {
        refetchQueries: [{ query: GET_LEAD_SOURCES }],
        onCompleted: (data) => {
            setFormData(prev => ({ ...prev, source: data.createLeadSource.name }));
            setIsAddingNewSourceInline(false);
            setNewSourceName('');
            toast.success('Lead source added successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Error adding lead source');
        }
    });

    const handleCreateLeadSource = async () => {
        if (!newSourceName.trim()) return;
        await createLeadSource({
            variables: { name: newSourceName.trim() }
        });
    };

    const sourceOptions = sourcesData?.leadSources?.map((s: any) => ({
        label: s.name,
        value: s.name
    })) || [];

    const currentUserName = useAuthStore((state) => state.user?.name);

    const { data: userData } = useQuery(GET_USERS, {
        variables: { limit: 1000, status: 'ACTIVE', onlyVisibleRoles: true },
        skip: !isOpen
    });

    const userOptions = React.useMemo(() => {
        const options = (userData?.users?.data || []).map((u: any) => ({
            value: u.uid,
            label: u.name || u.email
        }));

        // Ensure current user is always in the list to prevent UID showing as pre-filled
        if (currentUserUid && !options.find((o: any) => o.value === currentUserUid)) {
            options.unshift({
                value: currentUserUid,
                label: currentUserName || 'Me'
            });
        }

        // Also ensure the lead's assigned user is in the options list
        if (data?.lead?.assignedToUser) {
            const assigned = data.lead.assignedToUser;
            if (assigned.uid && !options.find((o: any) => o.value === assigned.uid)) {
                options.push({
                    value: assigned.uid,
                    label: assigned.name || assigned.uid
                });
            }
        }

        return options;
    }, [userData, currentUserUid, currentUserName, data?.lead]);

    const checkAddressDuplicate = async (addressData: {
        unitNumber?: string;
        houseNumber?: string;
        buildingName?: string;
        floorLevelNumber?: string;
        streetNumber: string;
        streetName: string;
        streetType: string;
        suburb: string;
        postcode: string;
        state?: string;
        country?: string;
    }) => {
        if (!addressData.streetNumber || !addressData.streetName || !addressData.suburb || !addressData.postcode) {
            setDuplicateErrors(prev => ({ ...prev, address: undefined }));
            return;
        }

        try {
            const { data } = await checkAddressExists({
                variables: {
                    address: {
                        unitNumber: addressData.unitNumber || undefined,
                        houseNumber: addressData.houseNumber || undefined,
                        buildingName: addressData.buildingName || undefined,
                        floorLevelNumber: addressData.floorLevelNumber || undefined,
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

            // Check for Lead duplicates
            const { data: leadData } = await checkAddressLeadDuplicate({
                variables: {
                    address: {
                        unitNumber: addressData.unitNumber || undefined,
                        houseNumber: addressData.houseNumber || undefined,
                        buildingName: addressData.buildingName || undefined,
                        floorLevelNumber: addressData.floorLevelNumber || undefined,
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

            if (leadData?.checkLeadDuplicate) {
                const existing = leadData.checkLeadDuplicate;
                if (isEditMode && existing.uid === uid) {
                    setDuplicateErrors(prev => ({ ...prev, leadAddress: undefined }));
                } else {
                    setDuplicateErrors(prev => ({
                        ...prev,
                        leadAddress: `Lead with this address already exists: ${existing.firstname} ${existing.lastname}`
                    }));
                }
            } else {
                setDuplicateErrors(prev => ({ ...prev, leadAddress: undefined }));
            }
        } catch (err) {
            console.error('Address check failed:', err);
        }
    };

    const checkNumberDuplicate = async (number: string) => {
        if (!number || number.length < 9) {
            setDuplicateErrors(prev => ({ ...prev, leadNumber: undefined }));
            return;
        }

        try {
            const { data } = await checkNumberLeadDuplicate({
                variables: { number }
            });
            if (data?.checkLeadDuplicate) {
                const existing = data.checkLeadDuplicate;
                if (isEditMode && existing.uid === uid) {
                    setDuplicateErrors(prev => ({ ...prev, leadNumber: undefined }));
                } else {
                    setDuplicateErrors(prev => ({
                        ...prev,
                        leadNumber: `Lead with this number already exists: ${existing.firstname} ${existing.lastname}`
                    }));
                }
            } else {
                setDuplicateErrors(prev => ({ ...prev, leadNumber: undefined }));
            }
        } catch (err) {
            console.error('Number check failed:', err);
        }
    };

    const checkNmiDuplicate = async (nmi: string) => {
        if (!nmi || nmi.length < 10) {
            setDuplicateErrors(prev => ({ ...prev, nmi: undefined }));
            return;
        }

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

    const executeSubmit = async (isDuplicate = 0) => {
        try {
            let submissionData = { ...formData };
            if (!canCreateDuplicates) {
                if (duplicateErrors.address || duplicateErrors.leadAddress) {
                    submissionData.unitnumber = '';
                    submissionData.housenumber = '';
                    submissionData.buildingname = '';
                    submissionData.floorlevelnumber = '';
                    submissionData.streetnumber = '';
                    submissionData.streetname = '';
                    submissionData.streettype = '';
                    submissionData.suburb = '';
                    submissionData.state = '';
                    submissionData.postcode = '';
                    submissionData.country = '';
                    submissionData.nmi = '';
                }
                if (duplicateErrors.leadNumber) {
                    submissionData.number = '';
                }
                if (duplicateErrors.nmi) {
                    submissionData.nmi = '';
                }
            }
            if (isEditMode) {
                await updateLead({
                    variables: { uid, input: { ...submissionData, isDuplicate } }
                });
                toast.success('Lead updated successfully');
            } else {
                await createLead({
                    variables: { input: { ...submissionData, isDuplicate } }
                });
                toast.success('Lead created successfully');
            }
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Error saving lead');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Custom validation
        const newErrors: Record<string, string> = {};
        if (!formData.firstname?.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname?.trim()) newErrors.lastname = 'Last name is required';
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const isNumberDuplicate = !!duplicateErrors.leadNumber;
        if (!canCreateDuplicates && isNumberDuplicate) {
            // Phone number is duplicate and we can't create duplicates, so it will be saved as empty.
        } else {
            if (!formData.number?.trim()) {
                newErrors.number = 'Phone number is required';
            } else if (formData.number.length !== 9) {
                newErrors.number = 'Phone number must be exactly 9 digits';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        setValidationErrors({});

        if (duplicateErrors.address || duplicateErrors.nmi || duplicateErrors.leadAddress || duplicateErrors.leadNumber) {
            if (!canCreateDuplicates) {
                // Still let add/edit lead but clear duplicated fields
                await executeSubmit(0);
                return;
            }
            setShowDuplicateConfirm(true);
            return;
        }

        await executeSubmit(0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name === 'number') {
            // Remove any non-numeric characters
            let val = value.replace(/\D/g, '');

            // Should not start with 0
            if (val.startsWith('0')) {
                val = val.substring(1);
            }

            // Should not exceed 9 digits
            if (val.length > 9) {
                val = val.substring(0, 9);
            }

            setFormData(prev => ({ ...prev, [name]: val }));

            if (val.length === 9) {
                checkNumberDuplicate(val);
            } else {
                if (duplicateErrors.leadNumber) setDuplicateErrors(prev => ({ ...prev, leadNumber: undefined }));
            }
            return;
        }

        if (name === 'nmi') {
            if (duplicateErrors.nmi) {
                setDuplicateErrors(prev => ({ ...prev, nmi: undefined }));
            }
        }

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }

        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isEditMode ? 'Edit Lead' : 'Create New Lead'}
                size="3xl"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={creating || updating} className="text-muted-foreground hover:text-foreground">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="lead-form"
                            className="px-8 bg-[#5c8a1d] hover:bg-[#4a6f17] text-white rounded-md h-10 font-medium"
                            isLoading={creating || updating}
                            disabled={creating || updating}
                        >
                            {isEditMode ? 'Update Lead' : 'Create Lead'}
                        </Button>
                    </div>
                }
            >
                <form id="lead-form" onSubmit={handleSubmit} noValidate className="space-y-6 pt-2">
                    {loading && isEditMode ? (
                        <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span>Loading lead details...</span>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                                {/* Row 1: Title, First Name, Last Name, Assigned To */}
                                <div className="md:col-span-2">
                                    <Field label="Title">
                                        <Select
                                            options={TITLE_OPTIONS}
                                            value={formData.title}
                                            onChange={(val) => handleSelectChange('title', val as string)}
                                        />
                                    </Field>
                                </div>
                                <div className="md:col-span-3">
                                    <Field label="First Name" required error={validationErrors.firstname}>
                                        <Input name="firstname" value={formData.firstname} onChange={handleChange} required placeholder="First name" />
                                    </Field>
                                </div>
                                <div className="md:col-span-3">
                                    <Field label="Last Name" required error={validationErrors.lastname}>
                                        <Input name="lastname" value={formData.lastname} onChange={handleChange} required placeholder="Last name" />
                                    </Field>
                                </div>
                                <div className="md:col-span-4">
                                    <Field label="Assigned To">
                                        <Select
                                            options={[{ value: '', label: 'Unassigned' }, ...userOptions]}
                                            value={formData.assignedToUid}
                                            onChange={(val) => handleSelectChange('assignedToUid', val as string)}
                                            placeholder="Unassigned"
                                            disabled={!canViewAllCustomers}
                                        />
                                    </Field>
                                </div>

                                {/* Row 2: Email, Phone, Source */}
                                <div className="md:col-span-4">
                                    <Field label="Email" required error={validationErrors.email}>
                                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email address" />
                                    </Field>
                                </div>
                                <div className="md:col-span-4">
                                    <Field label="Phone Number" required error={validationErrors.number}>
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center h-10 px-3 bg-muted border border-r-0 border-border rounded-l-md text-sm font-medium text-muted-foreground whitespace-nowrap">
                                                +61
                                            </div>
                                            <Input
                                                name="number"
                                                value={formData.number}
                                                onChange={handleChange}
                                                onBlur={() => checkNumberDuplicate(formData.number)}
                                                required
                                                maxLength={9}
                                                className="rounded-l-none rounded-r-md"
                                                placeholder="400 000 000"
                                            />
                                        </div>
                                    </Field>
                                </div>
                                <div className="md:col-span-4">
                                    <Field
                                        label="Lead Source"
                                        action={
                                            canManageLeadSources && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddingNewSourceInline(!isAddingNewSourceInline);
                                                        setNewSourceName('');
                                                    }}
                                                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                                                >
                                                    {isAddingNewSourceInline ? 'Cancel' : (
                                                        <><PlusIcon size={10} /> Add New Source</>
                                                    )}
                                                </button>
                                            )
                                        }
                                    >
                                        {isAddingNewSourceInline && canManageLeadSources ? (
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Source name..."
                                                    value={newSourceName}
                                                    onChange={(e) => setNewSourceName(e.target.value)}
                                                    className="h-9"
                                                    autoFocus
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    className="h-9 px-3 bg-neutral-900 text-white hover:bg-neutral-800"
                                                    onClick={handleCreateLeadSource}
                                                    disabled={!newSourceName.trim() || addingSource}
                                                    isLoading={addingSource}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        ) : (
                                            <Select
                                                options={sourceOptions}
                                                value={formData.source}
                                                onChange={(val) => handleSelectChange('source', val as string)}
                                                placeholder={sourcesLoading ? "Loading sources..." : "Select source"}
                                                disabled={sourcesLoading}
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Row 3: Address Search & NMI */}
                                <div className="md:col-span-8">
                                    <Field
                                        label="Search Address"
                                        hint="Start typing to verify address"
                                        error={!canCreateDuplicates ? (duplicateErrors.address || duplicateErrors.leadAddress) : undefined}
                                        warning={canCreateDuplicates ? (duplicateErrors.address || duplicateErrors.leadAddress) : undefined}
                                    >
                                        <LocationAutocomplete
                                            value={addressSearch}
                                            onChange={(val) => {
                                                setAddressSearch(val);
                                                if (duplicateErrors.address || duplicateErrors.leadAddress) {
                                                    setDuplicateErrors(prev => ({ ...prev, address: undefined, leadAddress: undefined }));
                                                }
                                            }}
                                            zIndexClass="z-[10001]"
                                            onSelect={(place) => {
                                                setAddressSearch(place.address);
                                                const unitnumber = place.unitNumber || '';
                                                const streetnumber = place.streetNumber || '';
                                                const housenumber = place.houseNumber || '';

                                                const newAddressData = {
                                                    unitnumber,
                                                    housenumber: (housenumber === streetnumber || housenumber === unitnumber) ? '' : housenumber,
                                                    buildingname: place.buildingName || '',
                                                    floorlevelnumber: place.floorLevelNumber || '',
                                                    streetnumber,
                                                    streetname: place.streetName || '',
                                                    streettype: place.streetType || '',
                                                    suburb: place.suburb || '',
                                                    state: place.state || '',
                                                    postcode: place.postcode || '',
                                                    country: place.country || 'Australia',
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ...newAddressData
                                                }));

                                                // Check for duplicate address
                                                checkAddressDuplicate({
                                                    unitNumber: place.unitNumber || '',
                                                    houseNumber: place.houseNumber || '',
                                                    buildingName: place.buildingName || '',
                                                    floorLevelNumber: place.floorLevelNumber || '',
                                                    streetNumber: place.streetNumber || '',
                                                    streetName: place.streetName || '',
                                                    streetType: place.streetType || '',
                                                    suburb: place.suburb || '',
                                                    state: place.state || '',
                                                    postcode: place.postcode || '',
                                                    country: place.country || 'Australia',
                                                });
                                            }}
                                            placeholder="Start typing address..."
                                        />
                                    </Field>
                                </div>
                                <div className="md:col-span-4">
                                    <Field
                                        label="NMI"
                                        error={!canCreateDuplicates ? duplicateErrors.nmi : undefined}
                                        warning={canCreateDuplicates ? duplicateErrors.nmi : undefined}
                                    >
                                        <Input
                                            name="nmi"
                                            value={formData.nmi}
                                            onChange={handleChange}
                                            onBlur={() => checkNmiDuplicate(formData.nmi)}
                                            maxLength={11}
                                            placeholder="NMI number"
                                        />
                                    </Field>
                                </div>

                                {/* Row 4: Referral Name & Is Customer Now */}
                                {formData.source === 'Referral' && (
                                    <div className="md:col-span-12">
                                        <Field label="Referral Name">
                                            <Input name="referralName" value={formData.referralName} onChange={handleChange} placeholder="Who referred this lead?" />
                                        </Field>
                                    </div>
                                )}


                                {/* Row 4: Detailed Breakdown Grid */}
                                <div className="md:col-span-12">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t border-border mt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Unit No.</label>
                                            <Input disabled value={formData.unitnumber || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">House No.</label>
                                            <Input disabled value={formData.housenumber || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Building</label>
                                            <Input disabled value={formData.buildingname || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Floor/Level</label>
                                            <Input disabled value={formData.floorlevelnumber || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">St. No.</label>
                                            <Input disabled value={formData.streetnumber || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">St. Name</label>
                                            <Input disabled value={formData.streetname || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">St. Type</label>
                                            <Input disabled value={formData.streettype || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Suburb</label>
                                            <Input disabled value={formData.suburb || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">State</label>
                                            <Input disabled value={formData.state || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Postcode</label>
                                            <Input disabled value={formData.postcode || '-'} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Country</label>
                                            <Input disabled value={formData.country || '-'} />
                                        </div>

                                        {/* <div className="md:col-span-4 mt-2 pt-3 border-t border-border/50">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1.5 leading-none">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Formatted Address Preview
                                        </div>
                                        <div className="text-sm font-medium text-foreground bg-primary/5 py-3 px-4 rounded-lg border border-primary/10 shadow-sm transition-all duration-200 hover:bg-primary/10">
                                            {[
                                                formData.buildingname,
                                                formData.unitnumber ? (formData.unitnumber.toLowerCase().includes('level') || formData.unitnumber.toLowerCase().includes('floor') ? formData.unitnumber : `Unit ${formData.unitnumber}`) : '',
                                                formData.floorlevelnumber && formData.floorlevelnumber !== formData.unitnumber ? (formData.floorlevelnumber.toLowerCase().includes('level') || formData.floorlevelnumber.toLowerCase().includes('floor') ? formData.floorlevelnumber : `Level ${formData.floorlevelnumber}`) : '',
                                                formData.housenumber && formData.housenumber !== formData.streetnumber ? formData.housenumber : '',
                                                [formData.streetnumber, formData.streetname, formData.streettype].filter(Boolean).join(' '),
                                                `${formData.suburb} ${formData.state} ${formData.postcode}`.trim(),
                                                formData.country
                                            ].filter(Boolean).join(', ')}
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full min-h-[60px] rounded-md border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all"
                                    placeholder="Add any additional details or notes here..."
                                />
                            </div>

                        </>
                    )}
                </form>
            </Modal>
            <ConfirmModal
                isOpen={showDuplicateConfirm}
                onClose={() => setShowDuplicateConfirm(false)}
                onConfirm={() => {
                    setShowDuplicateConfirm(false);
                    executeSubmit(1);
                }}
                title="Duplicate Entry Detected"
                message={isEditMode ? "Are you sure you want to save a duplicate entry?" : "Are you sure you want to create a duplicate entry?"}
                confirmText={isEditMode ? "Save Duplicate" : "Create Duplicate"}
                cancelText="Cancel"
                variant="warning"
                confirmButtonClassName="bg-[#5c8a1d] hover:bg-[#4a6f17] text-white border-0"
            />
        </>
    );
}
