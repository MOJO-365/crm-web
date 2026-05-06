import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_BY_CUSTOMER_ID } from '@/graphql/queries/customers';
import { UserIcon, MapPinIcon, MailIcon, PhoneIcon, HashIcon, CalendarIcon, ActivityIcon, BuildingIcon } from '@/components/icons';
import MainLogo from '@/assets/main-logo-dark-1.png';
import { CUSTOMER_STATUS_MAP } from '@/lib/constants';
import { formatDate } from '@/lib/date';

export const CustomerViewPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();

    const { data, loading, error } = useQuery(GET_CUSTOMER_BY_CUSTOMER_ID, {
        variables: { customerId: uid },
        skip: !uid,
    });

    const customer = data?.customerByCustomerId;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ActivityIcon className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Not Found</h2>
                    <p className="text-slate-600 mb-6">We couldn't find the application details you're looking for. Please check the link or contact our support team.</p>
                    <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                        Support: <a href="tel:1300707042" className="text-emerald-600 font-semibold">1300 707 042</a>
                    </div>
                </div>
            </div>
        );
    }

    const status = CUSTOMER_STATUS_MAP[customer.status] || { label: 'Unknown', color: '#6B7280' };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <img src={MainLogo} alt="GEE Energy" className="h-12 mx-auto mb-6" />
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Summary</h1>
                    <p className="mt-2 text-lg text-slate-600">Review the details of your energy application.</p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Status Banner */}
                    <div className="bg-slate-900 px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Application Status</p>
                            <div className="flex items-center gap-3">
                                <span 
                                    className="inline-block w-3 h-3 rounded-full animate-pulse" 
                                    style={{ backgroundColor: status.color }}
                                />
                                <span className="text-white text-xl font-bold">{status.label}</span>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Customer ID</p>
                            <p className="text-white text-xl font-mono">{customer.customerId || 'PENDING'}</p>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-12">
                        {/* Section: Personal Details */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
                                <DetailItem label="Email Address" value={customer.email} icon={<MailIcon size={14} />} />
                                <DetailItem label="Phone Number" value={customer.number} icon={<PhoneIcon size={14} />} />
                                <DetailItem label="Date of Birth" value={customer.dob ? formatDate(customer.dob) : 'N/A'} icon={<CalendarIcon size={14} />} />
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        {/* Section: Business Details (if applicable) */}
                        {(customer.businessName || customer.abn) && (
                            <>
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <BuildingIcon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">Business Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <DetailItem label="Business Name" value={customer.businessName} />
                                        <DetailItem label="Legal Name" value={customer.legalName} />
                                        <DetailItem label="ABN" value={customer.abn} />
                                    </div>
                                </section>
                                <hr className="border-slate-100" />
                            </>
                        )}

                        {/* Section: Service Address */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <MapPinIcon className="w-5 h-5 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Service Address</h2>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                    {customer.address?.fullAddress || 'Address details not fully provided.'}
                                </p>
                                {customer.address?.nmi && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <HashIcon size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-500 font-medium">NMI: </span>
                                        <span className="text-sm text-slate-900 font-bold">{customer.address.nmi}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Footer Info */}
                        <div className="pt-8 text-center border-t border-slate-100">
                            <p className="text-slate-500 text-sm">
                                Application submitted on <span className="font-semibold text-slate-800">{formatDate(customer.createdAt)}</span>
                            </p>
                            <div className="mt-8">
                                <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                                    This is a summary of the information provided during your application. 
                                    If any details are incorrect, please contact our support team immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Footer */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4 font-medium">Need assistance?</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="tel:1300707042" 
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-slate-700 font-semibold"
                        >
                            <PhoneIcon size={18} className="text-emerald-600" />
                            1300 707 042
                        </a>
                        <a 
                            href="mailto:customerservice@gee.com.au" 
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-slate-700 font-semibold"
                        >
                            <MailIcon size={18} className="text-emerald-600" />
                            customerservice@gee.com.au
                        </a>
                    </div>
                    <p className="mt-10 text-slate-400 text-xs">
                        &copy; {new Date().getFullYear()} GEE POWER AND GAS PTY LTD. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value?: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2">
            {icon && <span className="text-slate-300">{icon}</span>}
            <p className="text-slate-900 font-semibold">{value || 'N/A'}</p>
        </div>
    </div>
);

export default CustomerViewPage;
