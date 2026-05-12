import React from 'react';
import { UserIcon, MapPinIcon, ActivityIcon, InfoIcon, CheckIcon, PhoneIcon, MailIcon } from '@/components/icons';
import { CustomerViewLayout } from './CustomerViewLayout';

interface ReviewStepProps {
    idForm: any;
    payload: any;
    customerIdDisplay: string;
    isNominationConfirmed: boolean;
    setIsNominationConfirmed: (confirmed: boolean) => void;
    onBack: () => void;
    onFinish: () => void;
    idTypeOptions: any[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    idForm,
    payload,
    customerIdDisplay,
    isNominationConfirmed,
    setIsNominationConfirmed,
    onBack,
    onFinish,
    idTypeOptions
}) => {
    return (
        <CustomerViewLayout
            title="Review Your Details"
            subtitle={`Customer ID: ${customerIdDisplay}`}
            onBack={onBack}
            footerButtonLabel="Finish Enrollment"
            onFooterButtonClick={onFinish}
            isFooterButtonDisabled={!isNominationConfirmed}
            footerContent={
                <div className="py-1">
                    <label className="flex items-center justify-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center shrink-0">
                            <input
                                type="checkbox"
                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 shadow-sm hover:border-primary/50"
                                checked={isNominationConfirmed}
                                onChange={(e) => setIsNominationConfirmed(e.target.checked)}
                            />
                            <CheckIcon className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block text-white left-1" />
                        </div>
                        <span className="text-sm md:text-base font-medium text-slate-700 select-none leading-relaxed">
                            I have read and agree to the <a href="/onboarding/BESS2 and Nomination Form.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Nomination Form</a>
                        </span>
                    </label>
                </div>
            }
        >
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Consolidated Summary Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {/* Personal Info */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <UserIcon size={16} />
                            </div>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">First Name</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.firstname || payload.firstName || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Last Name</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.lastname || payload.lastName || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Date of Birth</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.dob || payload.dob || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.number || payload.phone || payload.mobile || '—'}</div>
                            </div>
                            <div className="sm:col-span-2 md:col-span-4">
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.email || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                <MapPinIcon size={16} />
                            </div>
                            Property Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Address</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.address || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">NMI</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.nmi || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Identity & Connection Details */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                <ActivityIcon size={16} />
                            </div>
                            Identity Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ID Type</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">
                                    {idTypeOptions.find(o => o.value === idForm.idType)?.label || '—'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                    {idForm.idType === '1' ? 'Medicare Number' : 'ID Number'}
                                </div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idnumber || '—'}</div>
                            </div>
                            {idForm.idType === '0' && (
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Card Number</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.licenseCardNumber || '—'}</div>
                                </div>
                            )}
                            {idForm.idType === '1' && (
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">IRN</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.medicareIrn || '—'}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Expiry Date</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idexpiary || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">State/Country</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idstate || idForm.idcountry || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Installer Details */}
                    {payload.createdBy && (
                        <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                            <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <InfoIcon size={16} />
                                </div>
                                Installer Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Company</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.company_name || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Contact</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.first_name} {payload.createdBy.last_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ABN</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.abn || '—'}</div>
                                </div>
                                <div className="sm:col-span-2 md:col-span-4">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.createdBy.email || '—'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PDRS Badge */}
                {payload.isPdrs && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">This enrollment was submitted via the PDRS portal ({payload.portalname || 'Portal'}).</p>
                    </div>
                )}
                {/* Need help Section */}
                <div className="text-center pt-8 pb-4">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Need help?</p>
                    <div className="flex justify-center gap-4">
                        <a href="tel:1300707042" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            <PhoneIcon size={14} className="text-primary" />
                            1300 707 042
                        </a>
                        <a href="mailto:customerservice@gee.com.au" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            <MailIcon size={14} className="text-primary" />
                            EMAIL US
                        </a>
                    </div>
                </div>
            </div>
        </CustomerViewLayout>

    );
};
