import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WEB_ENROLLMENT_BY_UID, GET_CUSTOMER_BY_ID } from '@/graphql/queries/customers';
import { GET_MEASUREMENT_UNITS, GET_RATE_PLAN_BY_CODE } from '@/graphql/queries/rates';
import { UPDATE_WEB_ENROLLMENT_CONSENT, UPDATE_CUSTOMER } from '@/graphql/mutations/customers';
import { ID_TYPE_OPTIONS, STATE_OPTIONS } from '@/lib/constants';
import { getData as getCountries } from 'country-list';

// Components
import { LoadingState, ErrorState } from './components/StatusStates';
import { SuccessStep } from './components/SuccessStep';
import { ConsentStep } from './components/ConsentStep';
import { RatesStep } from './components/RatesStep';
import { IdCheckStep } from './components/IdCheckStep';
import { ReviewStep } from './components/ReviewStep';

const COUNTRY_OPTIONS = getCountries().map(c => ({ value: c.name, label: c.name }));

export const CustomerViewPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [step, setStep] = useState<'consent' | 'rates' | 'review' | 'idcheck'>('consent');
    const [idConfirmed, setIdConfirmed] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isNominationConfirmed, setIsNominationConfirmed] = useState(false);
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
    const tariffCode = payload.tariffCode || payload.tariffcode || "EA025";
    const customerIdDisplay = customerData?.customer?.customerId || customerData?.customer?.id || payload?.customerId || payload?.customer_id || 'Pending';

    const { data: ratesData, loading: ratesLoading } = useQuery(GET_RATE_PLAN_BY_CODE, {
        variables: { code: tariffCode },
        skip: !tariffCode || step !== 'rates',
    });

    const { data: unitsData } = useQuery(GET_MEASUREMENT_UNITS, {
        fetchPolicy: 'cache-first',
    });

    // Mutations
    const [updateConsent] = useMutation(UPDATE_WEB_ENROLLMENT_CONSENT);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    // Side Effects
    useEffect(() => {
        if (customerData?.customer?.isConsentRead !== undefined) {
            setIsChecked(!!customerData.customer.isConsentRead);
        }
    }, [customerData]);

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
        if (!uid || !idConfirmed || !isNominationConfirmed) return;

        try {
            await updateCustomer({
                variables: {
                    uid,
                    input: {
                        enrollmentDetails: {
                            idtype: idForm.idType !== '' ? parseInt(idForm.idType) : null,
                            idnumber: idForm.idnumber,
                            idstate: idForm.idstate,
                            idcountry: idForm.idcountry,
                            idexpiry: idForm.idexpiary,
                            licenseCardNumber: idForm.licenseCardNumber,
                            medicareCardType: idForm.medicareCardType,
                            medicareIrn: idForm.medicareIrn,
                        },
                        dob: idForm.dob,
                        medicareIrn: idForm.medicareIrn,
                        medicareCardType: idForm.medicareCardType,
                        status: 8, // Mark as Consent Signed
                        isEnrollmentFinished: 1,
                        triggerWelcomeEmail: false,
                        triggerUpdateEmail: false,
                    }
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

    const ratePlan = ratesData?.ratePlanByCode;
    const mainOffer = ratePlan?.offers?.[0];

    switch (step) {
        case 'consent':
            return (
                <ConsentStep
                    isChecked={isChecked}
                    onToggleConsent={handleToggleConsent}
                    onNext={() => setStep('rates')}
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
                    onNext={() => setStep('review')}
                    idTypeOptions={ID_TYPE_OPTIONS}
                    stateOptions={STATE_OPTIONS}
                    countryOptions={COUNTRY_OPTIONS}
                />
            );
        case 'review':
            return (
                <ReviewStep
                    idForm={idForm}
                    payload={payload}
                    customerIdDisplay={customerIdDisplay}
                    isNominationConfirmed={isNominationConfirmed}
                    setIsNominationConfirmed={setIsNominationConfirmed}
                    onBack={() => setStep('idcheck')}
                    onFinish={handleFinishEnrollment}
                    idTypeOptions={ID_TYPE_OPTIONS}
                />
            );
        default:
            return <ConsentStep isChecked={isChecked} onToggleConsent={handleToggleConsent} onNext={() => setStep('rates')} />;
    }
};

export default CustomerViewPage;
