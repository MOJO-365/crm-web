import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/common';
import { GET_LEAD, CREATE_LEAD, UPDATE_LEAD, GET_LEADS } from '@/graphql';
import { TITLE_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/lib/constants';
import LocationAutocomplete from '../LocationAutocomplete';

// Reuse the Field component pattern from CustomerFormPage
const Field = ({ label, required, hint, children, error }: { label: string, required?: boolean, hint?: string, children: React.ReactNode, error?: string }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
);

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    uid?: string | null;
}

export default function LeadFormModal({ isOpen, onClose, uid }: LeadFormModalProps) {
    const isEditMode = !!uid;

    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        number: '',
        source: '',
        notes: '',
        unitnumber: '',
        streetnumber: '',
        streetname: '',
        streettype: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
        nmi: '',
        referralName: '',
    });

    const [addressSearch, setAddressSearch] = useState('');

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
                number: lead.number || '',
                source: lead.source || '',
                notes: lead.notes || '',
                unitnumber: lead.unitnumber || '',
                streetnumber: lead.streetnumber || '',
                streetname: lead.streetname || '',
                streettype: lead.streettype || '',
                suburb: lead.suburb || '',
                state: lead.state || '',
                postcode: lead.postcode || '',
                country: lead.country || 'Australia',
                nmi: lead.nmi || '',
                referralName: lead.referralName || '',
            };
            setFormData(newFormData);

            // Set address search string
            const fullAddr = [
                lead.unitnumber ? `Unit ${lead.unitnumber}` : '',
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
                streetnumber: '',
                streetname: '',
                streettype: '',
                suburb: '',
                state: '',
                postcode: '',
                country: 'Australia',
                nmi: '',
                referralName: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateLead({
                    variables: { uid, input: formData }
                });
                toast.success('Lead updated successfully');
            } else {
                await createLead({
                    variables: { input: formData }
                });
                toast.success('Lead created successfully');
            }
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Error saving lead');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Lead' : 'Create New Lead'}
            size="3xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                {loading && isEditMode ? (
                    <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span>Loading lead details...</span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            {/* Row 1: Title, First Name, Last Name */}
                            <div className="md:col-span-1">
                                <Field label="Title">
                                    <Select
                                        options={TITLE_OPTIONS}
                                        value={formData.title}
                                        onChange={(val) => handleSelectChange('title', val as string)}
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field label="First Name" required>
                                    <Input name="firstname" value={formData.firstname} onChange={handleChange} required placeholder="First name" />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field label="Last Name" required>
                                    <Input name="lastname" value={formData.lastname} onChange={handleChange} required placeholder="Last name" />
                                </Field>
                            </div>

                            {/* Row 2: Email, Phone, Source */}
                            <div className="md:col-span-1">
                                <Field label="Email" required>
                                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email address" />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field label="Phone Number" required>
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center h-10 px-3 bg-muted border border-r-0 border-border rounded-l-md text-sm font-medium text-muted-foreground whitespace-nowrap">
                                            +61
                                        </div>
                                        <Input
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            required
                                            className="rounded-l-none rounded-r-md"
                                            placeholder="400 000 000"
                                        />
                                    </div>
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field label="Lead Source">
                                    <Select
                                        options={LEAD_SOURCE_OPTIONS}
                                        value={formData.source}
                                        onChange={(val) => handleSelectChange('source', val as string)}
                                        placeholder="Select source"
                                    />
                                </Field>
                            </div>

                            {/* Row 3: Address Search & NMI */}
                            <div className="md:col-span-2">
                                <Field label="Search Address" hint="Start typing to verify address">
                                    <LocationAutocomplete
                                        value={addressSearch}
                                        onChange={setAddressSearch}
                                        zIndexClass="z-[10001]"
                                        onSelect={(place) => {
                                            setAddressSearch(place.address);
                                            setFormData(prev => ({
                                                ...prev,
                                                unitnumber: place.unitNumber || '',
                                                streetnumber: place.streetNumber || '',
                                                streetname: place.streetName || '',
                                                streettype: place.streetType || '',
                                                suburb: place.suburb || '',
                                                state: place.state || '',
                                                postcode: place.postcode || '',
                                                country: place.country || 'Australia',
                                            }));
                                        }}
                                        placeholder="Start typing address..."
                                    />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field label="NMI">
                                    <Input name="nmi" value={formData.nmi} onChange={handleChange} maxLength={11} placeholder="NMI number" />
                                </Field>
                            </div>

                            {/* Row 4: Referral Name & Is Customer Now */}
                            {formData.source === 'Referral' && (
                                <div className="md:col-span-2">
                                    <Field label="Referral Name">
                                        <Input name="referralName" value={formData.referralName} onChange={handleChange} placeholder="Who referred this lead?" />
                                    </Field>
                                </div>
                            )}


                            {/* Row 4: Detailed Breakdown Grid */}
                            <div className="md:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t border-border mt-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Unit No.</label>
                                        <Input disabled value={formData.unitnumber || '-'} />
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

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={creating || updating} className="text-muted-foreground hover:text-foreground">Cancel</Button>
                            <Button type="submit" className="px-8 bg-[#5c8a1d] hover:bg-[#4a6f17] text-white rounded-md h-10 font-medium" isLoading={creating || updating} disabled={creating || updating}>
                                {isEditMode ? 'Update Lead' : 'Create Lead'}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
}
