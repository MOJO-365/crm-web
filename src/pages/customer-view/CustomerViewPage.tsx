import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WEB_ENROLLMENT_BY_UID, GET_CUSTOMER_BY_ID } from '@/graphql/queries/customers';
import { GET_MEASUREMENT_UNITS, GET_RATE_PLAN_BY_CODE } from '@/graphql/queries/rates';
import { UPDATE_WEB_ENROLLMENT_CONSENT, COMPLETE_WEB_ENROLLMENT, MARK_CONSENT_ACKNOWLEDGED, MARK_CONSENT_NOT_INTERESTED } from '@/graphql/mutations/customers';
import { ID_TYPE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { getData as getCountries } from 'country-list';

// Components
import { LoadingState, ErrorState } from './components/StatusStates';
import { SuccessStep } from './components/SuccessStep';
import { ConsentStep } from './components/ConsentStep';
import { RatesStep } from './components/RatesStep';
import { IdCheckStep } from './components/IdCheckStep';
import { ReviewStep } from './components/ReviewStep';
import { NominationStep } from './components/NominationStep';

const COUNTRY_OPTIONS = getCountries().map(c => ({ value: c.name, label: c.name }));

export const CustomerViewPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [step, setStep] = useState<'consent' | 'rates' | 'nomination' | 'review' | 'idcheck'>('consent');
    const [idConfirmed, setIdConfirmed] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isNominationConfirmed, setIsNominationConfirmed] = useState(false);
    const [consents, setConsents] = useState({
        infoConfirm: false,
        creditCheck: false,
        offerAgree: false,
    });
    const [idForm, setIdForm] = useState({
        idType: '',
        idnumber: '',
        licenseCardNumber: '',
        idexpiary: '',
        idstate: '',
        idcountry: '',
        medicareCardType: '0',
        medicareIrn: '',
        address: '',
        nmi: '',
        state: '',
        postcode: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        title: '',
        dob: '',
    });
    const [idFormInit, setIdFormInit] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [consentSignatureBase64, setConsentSignatureBase64] = useState<string | null>(null);
    const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);

    // Data Fetching
    const { data: enrollmentData, loading: enrollmentLoading, error: enrollmentError } = useQuery(GET_WEB_ENROLLMENT_BY_UID, {
        variables: { uid },
        skip: !uid,
    });

    const { data: customerData } = useQuery(GET_CUSTOMER_BY_ID, {
        variables: { uid },
        skip: !uid,
    });

    const enrollment = enrollmentData?.webEnrollmentByUid;
    const payload = enrollment?.payload || {};
    const companyName = payload?.createdBy?.company_name || '';
    const tariffCode = customerData?.customer?.tariffCode || payload.tariffCode || payload.tariffcode || "EA025";
    const customerIdDisplay = customerData?.customer?.customerId || customerData?.customer?.id || payload?.customerId || payload?.customer_id || 'Pending';

    const { data: ratesData, loading: ratesLoading } = useQuery(GET_RATE_PLAN_BY_CODE, {
        variables: { code: tariffCode },
        skip: !!customerData?.customer?.ratePlan || !tariffCode || step !== 'rates',
    });

    const { data: unitsData } = useQuery(GET_MEASUREMENT_UNITS, {
        fetchPolicy: 'cache-first',
    });

    // Mutations
    const [updateConsent] = useMutation(UPDATE_WEB_ENROLLMENT_CONSENT);
    const [completeEnrollment, { loading: completingEnrollment }] = useMutation(COMPLETE_WEB_ENROLLMENT);
    const [markAcknowledged] = useMutation(MARK_CONSENT_ACKNOWLEDGED);
    const [markNotInterested] = useMutation(MARK_CONSENT_NOT_INTERESTED);

    // Side Effects
    useEffect(() => {
        // Read consent state from enrollment (web_enrollments) since customer isn't created until approval
        const consentRead = enrollment?.isConsentRead ?? customerData?.customer?.isConsentRead;
        if (consentRead !== undefined && consentRead !== null) {
            setIsChecked(!!consentRead);
        }
    }, [enrollment, customerData]);

    useEffect(() => {
        if (!idFormInit && payload && Object.keys(payload).length > 0) {
            setIdForm({
                idType: String(payload.idType ?? payload.idtype ?? '0'),
                idnumber: payload.idnumber || payload.idNumber || payload.license_number || payload.licenseNumber || payload.licence_number || payload.licenceNumber || '',
                licenseCardNumber: payload.licenseCardNumber || payload.license_card_number || payload.idcardnumber || payload.cardnumber || payload.cardNumber || '',
                idexpiary: payload.idexpiary || payload.idexpiry || payload.id_expiry || payload.license_expiry || payload.licenseExpiry || payload.expiry_date || '',
                idstate: payload.idstate || payload.idState || payload.license_state || payload.licenseState || payload.state || 'NSW',
                idcountry: payload.idcountry || payload.idCountry || payload.country || 'Australia',
                medicareCardType: String(payload.medicareCardType ?? payload.medicare_card_type ?? '0'),
                medicareIrn: payload.medicareIrn || payload.medicare_irn || '',
                address: payload.address || '',
                nmi: payload.nmi || '',
                state: payload.stateOrTerritory || payload.jurisdictionCode || payload.state || 'NSW',
                postcode: payload.postcode || '',
                firstName: payload.firstname || payload.firstName || '',
                lastName: payload.lastname || payload.lastName || '',
                email: payload.email || '',
                phone: payload.number || payload.phone || payload.mobile || '',
                title: payload.title || '',
                dob: payload.dob || '',
            });
            setIdFormInit(true);
        }
    }, [payload, idFormInit]);

    // Handlers
    const handleToggleConsent = async (checked: boolean) => {
        setIsChecked(checked);
        if (uid) {
            try {
                await updateConsent({
                    variables: { uid, isRead: checked }
                });
            } catch (err) {
                console.error('Failed to update consent state', err);
            }
        }
    };

    const handleFinishEnrollment = async () => {
        if (!uid || !idConfirmed || !isNominationConfirmed || !consents.infoConfirm || !consents.creditCheck) return;

        try {
            const enrollmentData = {
                idType: idForm.idType !== '' ? parseInt(idForm.idType) : null,
                idnumber: idForm.idnumber,
                idstate: idForm.idstate,
                idcountry: idForm.idcountry,
                idexpiry: idForm.idexpiary,
                licenseCardNumber: idForm.licenseCardNumber,
                medicareCardType: idForm.medicareCardType,
                medicareIrn: idForm.medicareIrn,
                dob: idForm.dob,
                consentSignatureBase64: consentSignatureBase64 || undefined,
            };

            await completeEnrollment({
                variables: {
                    uid,
                    enrollmentData: JSON.stringify(enrollmentData),
                }
            });
            setIsFinished(true);
            toast.success('Application submitted successfully!');
        } catch (err) {
            console.error('Failed to finish enrollment', err);
            toast.error('Failed to submit application. Please try again.');
        }
    };

    // Conditional Rendering
    if (enrollmentLoading) return <LoadingState />;
    if (enrollmentError || !enrollment) return <ErrorState />;
    if (isFinished || enrollment.isEnrollmentFinished === 1 || customerData?.customer?.status === 8) {
        return <SuccessStep customerIdDisplay={customerIdDisplay} />;
    }
    if (payload.NotIntrestedConsent === 1 || payload.NotIntrestedConsent === '1' || customerData?.customer?.status === 5) {
        return (
            <div className="h-screen flex flex-col bg-slate-50/50 items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-800">Consent Not Available</h2>
                    <p className="text-slate-600">You have previously indicated that you are not interested. This enrollment form is no longer available.</p>
                </div>
            </div>
        );
    }

    const ratePlan = customerData?.customer?.ratePlan || ratesData?.ratePlanByCode;
    const mainOffer = ratePlan?.offers?.[0];

    switch (step) {
        case 'consent':
            return (
                <ConsentStep
                    isChecked={isChecked}
                    onToggleConsent={handleToggleConsent}
                    onAcknowledge={async () => {
                        if (!uid) return;
                        setIsSubmittingConsent(true);
                        try {
                            await markAcknowledged({ variables: { uid } });
                            setStep('rates');
                        } catch (e) {
                            toast.error('Failed to save consent');
                        } finally {
                            setIsSubmittingConsent(false);
                        }
                    }}
                    onNotInterested={async () => {
                        if (!uid) return;
                        setIsSubmittingConsent(true);
                        try {
                            await markNotInterested({ variables: { uid } });
                            window.location.reload();
                        } catch (e) {
                            toast.error('Failed to save choice');
                        } finally {
                            setIsSubmittingConsent(false);
                        }
                    }}
                    companyName={companyName}
                    isSubmitting={isSubmittingConsent}
                />
            );
        case 'rates':
            return (
                <RatesStep
                    ratesLoading={ratesLoading}
                    mainOffer={mainOffer}
                    tariffCode={tariffCode}
                    ratePlan={ratePlan}
                    payload={payload}
                    customer={customerData?.customer}
                    measurementUnits={unitsData?.measurementUnits}
                    onBack={() => setStep('consent')}
                    onNext={() => setStep('idcheck')}
                />
            );
        case 'idcheck':
            return (
                <IdCheckStep
                    idForm={idForm}
                    setIdForm={setIdForm}
                    idConfirmed={idConfirmed}
                    setIdConfirmed={setIdConfirmed}
                    onBack={() => setStep('rates')}
                    onNext={() => setStep('nomination')}
                    idTypeOptions={ID_TYPE_OPTIONS}
                    stateOptions={STATE_OPTIONS}
                    countryOptions={COUNTRY_OPTIONS}
                />
            );
        case 'nomination':
            return (
                <NominationStep
                    isNominationConfirmed={isNominationConfirmed}
                    setIsNominationConfirmed={setIsNominationConfirmed}
                    onBack={() => setStep('idcheck')}
                    onNext={(signatureBase64: string) => {
                        setConsentSignatureBase64(signatureBase64);
                        setStep('review');
                    }}
                    signatoryName={`${idForm.firstName || payload.firstname || ''} ${idForm.lastName || payload.lastname || ''}`.trim()}
                    uid={uid}
                />
            );
        case 'review':
            return (
                <ReviewStep
                    idForm={idForm}
                    payload={payload}
                    customerIdDisplay={customerIdDisplay}
                    isNominationConfirmed={isNominationConfirmed}
                    consents={consents}
                    setConsents={setConsents}
                    onBack={() => setStep('nomination')}
                    onFinish={handleFinishEnrollment}
                    idTypeOptions={ID_TYPE_OPTIONS}
                    mainOffer={mainOffer}
                    ratePlan={ratePlan}
                    measurementUnits={unitsData?.measurementUnits}
                    customer={customerData?.customer}
                    isSaving={completingEnrollment}
                />
            );
        default:
            return <ConsentStep isChecked={isChecked} onToggleConsent={handleToggleConsent} onAcknowledge={() => {}} onNotInterested={() => {}} companyName={companyName} />;
    }
};

export default CustomerViewPage;
