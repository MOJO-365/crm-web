// Customer GraphQL Queries

import { gql } from '@apollo/client';
// import { CUSTOMER_BASIC_FIELDS, CUSTOMER_ADDRESS_FIELDS } from '../fragments';

export const GET_CUSTOMERS = gql`
    query Customers($page: Int, $limit: Int) {
        customers(page: $page, limit: $limit) {
            data {
                id
                uid
                customerId
                tenant
                email
                title
                firstName
                lastName
                businessName
                legalName
                abn
                number
                dob
                phoneVerifiedAt
                propertyType
                tariffCode
                ratePlanUid
                planUid
                status
                utilmateStatus
                utilmateUpdatedAt
                utilmateUploadedManually
                gender
                relationshipStatus
                enquiryAmount
                checkCreditScore
                employerName
                riskStatus
                signDate
                signedPdfPath
                pdfAudit
                emailSent
                discount
                previousCustomerUid
                isActive
                isDeleted
                createdAt
                offerEmailSentAt
                pdrsEmailSent
                pdrsEmailSentAt
                updatedAt
                leadUid
                portalName
                selectedBonuses
                isConsentRead
            medicareIrn
            medicareCardType
                previousBill {
                    id
                    filename
                    path
                    size
                    mimeType
                    createdAt
                    createdBy
                    createdByUser {
                        name
                    }
                }
                identityProof {
                    id
                    filename
                    path
                    size
                    mimeType
                    createdAt
                    createdBy
                    createdByUser {
                        name
                    }
                }
                createdBy
                updatedBy
                deletedBy
                ratePlan {
                    id
                    uid
                    tenant
                    codes
                    planId
                    dnsp
                    state
                    tariff
                    type
                    vpp
                    discountApplies
                    discountPercentage
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                    createdBy
                    updatedBy
                    deletedBy
                    offers {
                        id
                        uid
                        ratePlanUid
                        tenant
                        offerName
                        anytime
                        cl1Supply
                        cl1Usage
                        cl2Supply
                        cl2Usage
                        demand
                        demandOp
                        demandP
                        demandS
                        fit
                        fitPeak
                        fitCritical
                        fitVpp
                        offPeak
                        peak
                        shoulder
                        supplyCharge
                        vppOrcharge
                        dynamicRates
                    priceUnits
                        isActive
                        isDeleted
                        createdAt
                        updatedAt
                        createdBy
                        updatedBy
                        deletedBy
                    }
                }
                enrollmentDetails {
                    id
                    customerUid
                    saletype
                    connectiondate
                    idtype
                    idnumber
                    idstate
                    idcountry
                    idexpiry
                    concession
                    lifesupport
                    billingpreference
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                address {
                    id
                    customerUid
                    unitNumber
                    flatOrUnitType
                    gnafPid
                    houseNumber
                    buildingName
                    floorLevelNumber
                    streetNumber
                    streetName
                    streetType
                    suburb
                    state
                    postcode
                    country
                    nmi
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                solarDetails {
                    id
                    customerUid
                    hassolar
                    solarcapacity
                    invertercapacity
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                batteryDetails {
                    id
                    customerUid
                    isbattery
                    batterybrand
                    snnumber
                    batterycapacity
                    exportlimit
                    batterymodel
                    inverterCapacity
                    checkCode
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                msatDetails {
                    id
                    customerUid
                    msatConnected
                    msatConnectedAt
                    msatUpdatedAt
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                vppDetails {
                    id
                    customerUid
                    vpp
                    vppConnected
                    vppSignupBonus
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                history {
                    id
                    version
                    customerSnapshot
                    createdAt
                }
            }
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
        }
    }
`;

export const GET_CUSTOMERS_LIST = gql`
    query CustomersList($page: Int, $limit: Int) {
        customers(page: $page, limit: $limit) {
            data {
                id
                uid
                customerId
                tenant
                email
                title
                firstName
                lastName
                businessName
                legalName
                abn
                number
                dob
                phoneVerifiedAt
                propertyType
                tariffCode
                status
                utilmateStatus
                utilmateUpdatedAt
                utilmateUploadedManually
                gender
                relationshipStatus
                enquiryAmount
                checkCreditScore
                employerName
                riskStatus
                signDate
                signedPdfPath
                pdfAudit
                emailSent
                discount
                previousCustomerUid
                isActive
                isDeleted
                leadUid
                portalName
                isConsentRead
            medicareIrn
            medicareCardType
                previousBill {
                    id
                    filename
                    path
                    size
                    mimeType
                    createdAt
                    createdBy
                    createdByUser {
                        name
                    }
                }
                identityProof {
                    id
                    filename
                    path
                    size
                    mimeType
                    createdAt
                    createdBy
                    createdByUser {
                        name
                    }
                }
                createdBy
                updatedBy
                deletedBy
                ratePlan {
                    id
                    uid
                    tenant
                    codes
                    planId
                    dnsp
                    state
                    tariff
                    type
                    vpp
                    discountApplies
                    discountPercentage
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                    createdBy
                    updatedBy
                    deletedBy
                }
            
                address {
                    id
                    customerUid
                    unitNumber
                    flatOrUnitType
                    gnafPid
                    houseNumber
                    buildingName
                    floorLevelNumber
                    streetNumber
                    streetName
                    streetType
                    suburb
                    state
                    postcode
                    country
                    nmi
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                solarDetails {
                    id
                    customerUid
                    hassolar
                    solarcapacity
                    invertercapacity
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
                vppDetails {
                    id
                    customerUid
                    vpp
                    vppConnected
                    vppSignupBonus
                    isActive
                    isDeleted
                    createdAt
                    updatedAt
                }
            }
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
        }
    }
`;

// Query to get all customer IDs matching filters (for bulk select all)
export const GET_ALL_FILTERED_CUSTOMER_IDS = gql`
    query GetAllFilteredCustomerIds(
        $searchId: String, 
        $searchName: String, 
        $searchMobile: String, 
        $searchAddress: String, 
        $searchTariff: String, 
        $searchDnsp: String, 
        $searchDiscount: Int, 
        $searchStatus: Int, 
        $searchVpp: Int, 
        $searchVppConnected: Int, 
        $searchUtilmateStatus: Int, 
        $searchMsatConnected: Int,
        $searchRiskStatus: String,
        $searchAssignedTo: String,
        $searchPortal: String,
        $includeDeleted: String
    ) {
        customersCursor(
            first: 10000, 
            searchId: $searchId, 
            searchName: $searchName, 
            searchMobile: $searchMobile, 
            searchAddress: $searchAddress, 
            searchTariff: $searchTariff, 
            searchDnsp: $searchDnsp, 
            searchDiscount: $searchDiscount, 
            searchStatus: $searchStatus, 
            searchRiskStatus: $searchRiskStatus,
            searchVpp: $searchVpp, 
            searchVppConnected: $searchVppConnected, 
            searchUtilmateStatus: $searchUtilmateStatus, 
            searchMsatConnected: $searchMsatConnected,
            searchAssignedTo: $searchAssignedTo,
            searchPortal: $searchPortal,
            includeDeleted: $includeDeleted
        ) {
            data {
                uid
            }
            pageInfo {
                hasNextPage
            }
        }
    }
`;

export const GET_CUSTOMERS_CURSOR = gql`
    query CustomersCursor($first: Int, $after: String, $search: String, $discount: Float, $status: Int, $searchId: String, $searchName: String, $searchMobile: String, $searchAddress: String, $searchTariff: String, $searchDnsp: String, $searchDiscount: Int, $searchStatus: Int, $searchRiskStatus: String, $searchVpp: Int, $searchVppConnected: Int, $searchVppApiPushed: Int, $searchUtilmateStatus: Int, $searchUtilmateApiPushed: Int, $searchMsatConnected: Int, $searchAssignedTo: String, $searchPortal: String, $searchSigned: Int, $includeDeleted: String) {
        customersCursor(first: $first, after: $after, search: $search, discount: $discount, status: $status, searchId: $searchId, searchName: $searchName, searchMobile: $searchMobile, searchAddress: $searchAddress, searchTariff: $searchTariff, searchDnsp: $searchDnsp, searchDiscount: $searchDiscount, searchStatus: $searchStatus, searchRiskStatus: $searchRiskStatus, searchVpp: $searchVpp, searchVppConnected: $searchVppConnected, searchVppApiPushed: $searchVppApiPushed, searchUtilmateStatus: $searchUtilmateStatus, searchUtilmateApiPushed: $searchUtilmateApiPushed, searchMsatConnected: $searchMsatConnected, searchAssignedTo: $searchAssignedTo, searchPortal: $searchPortal, searchSigned: $searchSigned, includeDeleted: $includeDeleted) {
            data {
                id
                uid
                customerId
                tenant
                title
                firstName
                lastName
                legalName
                number
                propertyType
                tariffCode
                status
                utilmateStatus
                utilmateUpdatedAt
                utilmateUploadedManually
                riskStatus
                leadUid
                portalName
                source
                referralName
                msatDetails {
                  msatConnected
                  msatUpdatedAt
                }
                discount
                pdrsEmailSent
                pdrsEmailSentAt
                isWithoutSignature
                ratePlan {
                    id
                    uid
                    dnsp
                }
                vppDetails {
                    vpp
                    vppConnected
                    vppSignupBonus
                    vppApiPushed
                    updatedAt
                }
                batteryDetails {
                    isbattery
                    batterybrand
                    snnumber
                    batterycapacity
                    exportlimit
                    batterymodel
                    inverterCapacity
                }
                utilmateDetails {
                    utilmateConnected
                    siteIdentifier
                    accountNumber
                    utilmateConnectedAt
                    utilmateApiPushed
                }
                address {
                    fullAddress
                    nmi
                }
                assignedToUid
                assignedToUser {
                    uid
                    name
                    email
                }
                isDeleted
                createdBy
                createdByUser {
                    uid
                    name
                }
                referenceId
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                startCursor
                endCursor
                totalCount
            }
        }
    }
`;

export const GET_CUSTOMER_BY_ID = gql`
    query GetCustomerById($uid: String!) {
        customer(uid: $uid) {
            uid
            assignedToUid
            assignedToUser {
                uid
                name
                email
            }
            selectedBonuses
            isConsentRead
            medicareIrn
            medicareCardType
            customerId
            email
            title
            firstName
            lastName
            businessName
            legalName
            abn
            showAsBusinessName
            showName
            number
            phoneVerifiedAt
            dob
            propertyType
            tariffCode
            ratePlanUid
            planUid
            plan {
                uid
                ratesJson
                discount
            }
            status
            discount
            signDate
            signedPdfPath
            emailSent
            utilmateStatus
            rateVersion
            gender
            relationshipStatus
            enquiryAmount
            checkCreditScore
            employerName
            creditScore
            isCreditScoreFetched
            isWithoutSignature
            riskStatus
            emailLogCount
            offerVersion
            viewCode
            isActive
            isDeleted
            createdAt
            offerEmailSentAt
            updatedAt
            portalName
            source
            referralName
            pdrsEmailSent
            pdrsEmailSentAt
            address {
                id
                customerUid
                unitNumber
                flatOrUnitType
                gnafPid
                houseNumber
                buildingName
                floorLevelNumber
                streetNumber
                streetName
                streetType
                suburb
                state
                postcode
                country
                nmi
                fullAddress
            }
            ratePlan {
                uid
                codes
                planId
                dnsp
                tariff
                state
                type
                vpp
                discountApplies
                discountPercentage
                offers {
                    uid
                    offerName
                    anytime
                    cl1Supply
                    cl1Usage
                    cl2Supply
                    cl2Usage
                    demand
                    demandOp
                    demandP
                    demandS
                    fit
                    fitPeak
                    fitCritical
                    fitVpp
                    offPeak
                    peak
                    shoulder
                    supplyCharge
                    vppOrcharge
                    dynamicRates
                    priceUnits
                }
            }
            # Tab visibility and prefill data
            vppDetails {
                vpp
                vppConnected
                vppSignupBonus
            }
            solarDetails {
                hassolar
                solarcapacity
                invertercapacity
            }
            batteryDetails {
                isbattery
                batterybrand
                snnumber
                batterycapacity
                exportlimit
                batterymodel
                inverterCapacity
            }
            enrollmentDetails {
                saletype
                connectiondate
                idtype
                idnumber
                idstate
                idcountry
                idexpiry
                concession
                lifesupport
                billingpreference
                licenseNumber
                licenseState
                licenseExpiry
                licenseCardNumber
                medicareCardType
                medicareIrn
            }
            debitDetails {
                optIn
                accountType
                firstName
                lastName
                bankName
                bankAddress
                bsb
                accountNumber
                paymentFrequency
                firstDebitDate
            }
            utilmateDetails {
                utilmateConnected
            }
            previousBill {
                id
                filename
                path
            }
            identityProof {
                id
                filename
                path
            }
            licenseDocument {
                id
                filename
                path
            }
            msatDetails {
                msatConnected
                msatConnectedAt
                msatUpdatedAt
            }
            vppCertificateDetails {
                id
                certificateNo
                isAllRequiredFilled
                isVppCertificateEmailSent
            }
        }
    }
`;

export const GET_CUSTOMER_GENERAL_DETAILS = gql`
    query GetCustomerGeneralDetails($uid: String!) {
        customer(uid: $uid) {
            uid
            isConsentRead
            medicareIrn
            medicareCardType
            customerId
            email
            title
            firstName
            lastName
            businessName
            legalName
            abn
            showAsBusinessName
            showName
            number
            phoneVerifiedAt
            dob
            propertyType
            tariffCode
            ratePlanUid
            planUid
            plan {
                uid
                ratesJson
                discount
            }
            status
            discount
            signDate
            signedPdfPath
            emailSent
            utilmateStatus
            rateVersion
            gender
            relationshipStatus
            enquiryAmount
            checkCreditScore
            employerName
            creditScore
            isCreditScoreFetched
            isWithoutSignature
            riskStatus
            emailLogCount
            offerVersion
            viewCode
            isActive
            isDeleted
            createdAt
            offerEmailSentAt
            pdrsEmailSent
            pdrsEmailSentAt
            updatedAt
            portalName
            source
            referralName
            address {
                id
                customerUid
                unitNumber
                flatOrUnitType
                gnafPid
                houseNumber
                buildingName
                floorLevelNumber
                streetNumber
                streetName
                streetType
                suburb
                state
                postcode
                country
                nmi
                fullAddress
            }
            ratePlan {
                uid
                codes
                planId
                dnsp
                tariff
                state
                type
                vpp
                discountApplies
                discountPercentage
                offers {
                    uid
                    offerName
                    anytime
                    cl1Supply
                    cl1Usage
                    cl2Supply
                    cl2Usage
                    demand
                    demandOp
                    demandP
                    demandS
                    fit
                    fitPeak
                    fitCritical
                    fitVpp
                    offPeak
                    peak
                    shoulder
                    supplyCharge
                    vppOrcharge
                    dynamicRates
                    priceUnits
                }
            }
            vppDetails {
                vpp
                vppConnected
                vppSignupBonus
            }
            solarDetails {
                hassolar
                solarcapacity
                invertercapacity
            }
            batteryDetails {
                batterybrand
                snnumber
                batterycapacity
                exportlimit
                batterymodel
                inverterCapacity
            }
            enrollmentDetails {
                saletype
                connectiondate
                idtype
                idnumber
                idstate
                idcountry
                idexpiry
                concession
                lifesupport
                billingpreference
                licenseNumber
                licenseState
                licenseExpiry
                licenseCardNumber
                medicareCardType
                medicareIrn
            }
            debitDetails {
                optIn
                accountType
                firstName
                lastName
                bankName
                bankAddress
                bsb
                accountNumber
                paymentFrequency
                firstDebitDate
            }
            utilmateDetails {
                utilmateConnected
            }
            previousBill {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            identityProof {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            licenseDocument {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            documents {
                id
                uid
                customerUid
                type
                name
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                startDate
                endDate
                createdAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            vppCertificateDetails {
                isAllRequiredFilled
                isVppCertificateEmailSent
                isVppCertificateEmailSentAt
                batteryManufacturer
                batterySerialNumber
                batteryUsableCapacity
                inverterManufacturer
                inverterSnNumbers
                inverterCapacity
            }
            msatDetails {
                msatConnected
                msatConnectedAt
                msatUpdatedAt
            }
            vppCertificateDetails {
                id
                certificateNo
                isAllRequiredFilled
                isVppCertificateEmailSent
            }
        }
    }
`;

export const GET_CUSTOMER_SOLAR_VPP_DETAILS = gql`
    query GetCustomerSolarVppDetails($uid: String!) {
        customer(uid: $uid) {
            uid
            vppDetails {
                id
                customerUid
                vpp
                vppConnected
                vppSignupBonus
            }
            solarDetails {
                id
                customerUid
                hassolar
                solarcapacity
                invertercapacity
            }
            batteryDetails {
                id
                customerUid
                isbattery
                batterybrand
                snnumber
                batterycapacity
                exportlimit
                batterymodel
                inverterCapacity
                checkCode
                isActive
                isDeleted
                createdAt
                updatedAt
            }
            vppCertificateDetails {
                batteryManufacturer
                batterySerialNumber
                batteryUsableCapacity
                inverterManufacturer
                inverterSnNumbers
                inverterCapacity
            }
        }
    }
`;

export const GET_CUSTOMER_VPP_CERTIFICATE_DETAILS = gql`
    query GetCustomerVppCertificateDetails($uid: String!) {
        customer(uid: $uid) {
            uid
            vppCertificateDetails {
                id
                certificateNo
                issueDate
                batteryManufacturer
                batteryModel
                batterySerialNumber
                batteryInstalledDate
                batteryUsableCapacity
                batteryPortConnected
                inverterManufacturer
                inverterModel
                inverterSnNumbers
                inverterCapacity
                isLifeSupportEquipment
                ifYesDetails
                internetConnectionType
                internetOtherText
                modemRouterLocation
                apiIntegration
                remoteChargesCommandTest
                remoteChargesCommandTestAt
                remoteDischargesCommandTest
                remoteDischargesCommandTestAt
                stateOfChangeMonitoring
                stateOfChangeMonitoringAt
                gridExportVerification
                gridExportVerificationAt
                gridImportVerification
                gridImportVerificationAt
                communicationFailSafeTest
                communicationFailSafeTestAt
                testResult
                additionalNotes
                isAllRequiredFilled
                isVppCertificateEmailSent
                isVppCertificateEmailSentAt
            }
            batteryDetails {
                batterybrand
                snnumber
                batterycapacity
                batterymodel
                inverterCapacity
            }
        }
    }
`;

export const GET_CUSTOMER_DEBIT_DETAILS = gql`
    query GetCustomerDebitDetails($uid: String!) {
        customer(uid: $uid) {
            uid
            debitDetails {
                id
                customerUid
                accountType
                companyName
                abn
                firstName
                lastName
                bankName
                bankAddress
                bsb
                accountNumber
                paymentFrequency
                firstDebitDate
                optIn
            }
        }
    }
`;

export const GET_CUSTOMER_UTILMATE_DETAILS = gql`
    query GetCustomerUtilmateDetails($uid: String!) {
        customer(uid: $uid) {
            uid
            utilmateDetails {
                id
                customerUid
                siteIdentifier
                accountNumber
                utilmateConnected
                utilmateConnectedAt
                utilmateApiPushed
            }
            msatDetails {
                id
                customerUid
                msatConnected
                msatConnectedAt
                msatUpdatedAt
            }
        }
    }
`;

export const GET_CUSTOMER_DOCUMENTS = gql`
    query GetCustomerDocuments($uid: String!) {
        customer(uid: $uid) {
            uid
            previousBill {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            identityProof {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            licenseDocument {
                id
                uid
                customerUid
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                createdAt
                updatedAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            documents {
                id
                uid
                customerUid
                type
                name
                filename
                path
                size
                mimeType
                documentType {
                    uid
                    name
                    color
                    category
                }
                startDate
                endDate
                createdAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            vppCertificateDetails {
                id
                certificateNo
                isAllRequiredFilled
                isVppCertificateEmailSent
            }
        }
    }
`;

export const CHECK_ADDRESS_EXISTS = gql`
    query CheckAddressExists($address: CustomerAddressInput!) {
        checkAddressExists(address: $address) {
            uid
            customerId
            firstName
            lastName
                businessName
                abn
        }
    }
`;

export const CHECK_NMI_EXISTS = gql`
    query CheckNmiExists($nmi: String!) {
        checkNmiExists(nmi: $nmi) {
            uid
            customerId
            firstName
            lastName
                businessName
                abn
        }
    }
`;

export const VALIDATE_CUSTOMER_ACCESS_CODE = gql`
    query ValidateCustomerAccessCode($customerId: String!, $code: String!) {
        validateCustomerAccessCode(customerId: $customerId, code: $code)
    }
`;

export const GET_CUSTOMER_BY_CUSTOMER_ID = gql`
    query GetCustomerByCustomerId($customerId: String!) {
        customerByCustomerId(customerId: $customerId) {
            uid
            assignedToUid
            assignedToUser {
                uid
                name
                email
            }
            selectedBonuses
            customerId
            portalName
            email
            firstName
            lastName
            businessName
            abn
            showAsBusinessName
            showName
            number
            dob
            propertyType
            tariffCode
            ratePlanUid
            ratePlan {
                uid
                codes
                planId
                dnsp
                state
                tariff
                type
                vpp
                offers {
                    uid
                    offerName
                    anytime
                    cl1Supply
                    cl1Usage
                    cl2Supply
                    cl2Usage
                    demand
                    demandOp
                    demandP
                    demandS
                    fit
                    fitPeak
                    fitCritical
                    fitVpp
                    offPeak
                    peak
                    shoulder
                    supplyCharge
                    vppOrcharge
                    dynamicRates
                    priceUnits
                }
            }
            planUid
            plan {
                uid
                ratesJson
                discount
                title
                bonusUids
            }
            status
            discount
            signDate
            emailSent
            offerEmailSentAt
            utilmateStatus
            creditScore
            isCreditScoreFetched
            isWithoutSignature
            utilmateDetails {
                utilmateConnected
            }
            viewCode
            source
            isActive
            isDeleted
            createdAt
            phoneVerifiedAt
            updatedAt
            address {
                id
                customerUid
                unitNumber
                flatOrUnitType
                gnafPid
                houseNumber
                buildingName
                floorLevelNumber
                streetNumber
                streetName
                streetType
                suburb
                state
                postcode
                country
                nmi
                fullAddress
            }
            msatDetails {
                id
                customerUid
                msatConnected
                msatConnectedAt
                msatUpdatedAt
            }
            vppDetails {
                id
                customerUid
                vpp
                vppConnected
                vppApiPushed
                vppSignupBonus
                updatedAt
            }
            solarDetails {
                id
                customerUid
                hassolar
                solarcapacity
                invertercapacity
            }
            batteryDetails {
                id
                customerUid
                isbattery
                batterybrand
                snnumber
                batterycapacity
                exportlimit
                batterymodel
                inverterCapacity
                checkCode
                isActive
                isDeleted
                createdAt
                updatedAt
            }
            debitDetails {
                id
                customerUid
                accountType
                companyName
                abn
                firstName
                lastName
                bankName
                bankAddress
                bsb
                accountNumber
                paymentFrequency
                firstDebitDate
                optIn
            }
            rateVersion
            offerVersion
            ratePlan {
                uid
                codes
                planId
                dnsp
                tariff
                vpp
                offers {
                    uid
                    offerName
                    anytime
                    cl1Supply
                    cl1Usage
                    cl2Supply
                    cl2Usage
                    demand
                    demandOp
                    demandP
                    demandS
                    fit
                    fitPeak
                    fitCritical
                    fitVpp
                    offPeak
                    peak
                    shoulder
                    supplyCharge
                    vppOrcharge
                    dynamicRates
                    priceUnits
                }
            }
            enrollmentDetails {
                id
                customerUid
                saletype
                connectiondate
                idtype
                idnumber
                idstate
                idcountry
                idexpiry
                concession
                lifesupport
                billingpreference
            }
            documents {
                id
                uid
                customerUid
                type
                name
                filename
                path
                size
                mimeType
                createdAt
                createdBy
                createdByUser {
                    uid
                    name
                }
            }
            vppCertificateDetails {
                id
                certificateNo
                isAllRequiredFilled
                isVppCertificateEmailSent
            }
        }
    }
`;

export const GET_DOCUMENT_TYPES = gql`
    query GetDocumentTypes {
        documentTypes {
            uid
            name
            color
            category
            isActive
        }
    }
`;

export const GET_RISK_STATUSES = gql`
    query GetRiskStatuses {
        riskStatuses {
            id
            uid
            name
            code
            description
            color
            scoreMin
            scoreMax
            manualOffer
            sortOrder
            isActive
        }
    }
`;

// Lightweight query for customer search (name, id, address only)
export const SEARCH_CUSTOMERS_BASIC = gql`
    query SearchCustomersBasic($first: Int, $searchName: String) {
        customersCursor(first: $first, searchName: $searchName) {
            data {
                uid
                customerId
                firstName
                lastName
                address {
                    fullAddress
                }
            }
        }
    }
`;

// Lightweight query for billing page - only fields needed for the billing info card
export const GET_CUSTOMER_BILLING_INFO = gql`
    query GetCustomerBillingInfo($uid: String!) {
        customer(uid: $uid) {
            uid
            customerId
            firstName
            lastName
            email
            number
            creditScore
            riskStatus
            address {
                fullAddress
            }
            enrollmentDetails {
                billingpreference
            }
            debitDetails {
                optIn
            }
            utilmateDetails {
                accountNumber
                siteIdentifier
            }
        }
    }
`;

export const GET_NEXT_CUSTOMER_ID = gql`
    query GetNextCustomerId {
        getNextCustomerId
    }
`;

export const GET_WEB_ENROLLMENTS = gql`
    query GetWebEnrollments($page: Int, $limit: Int, $search: String, $processed: Int, $searchName: String, $searchEmail: String, $searchMobile: String, $searchNmi: String, $searchTariff: String, $searchAddress: String, $searchPortal: String, $searchVpp: Int, $branchTenant: String, $searchCompanyName: String) {
        webEnrollments(page: $page, limit: $limit, search: $search, processed: $processed, searchName: $searchName, searchEmail: $searchEmail, searchMobile: $searchMobile, searchNmi: $searchNmi, searchTariff: $searchTariff, searchAddress: $searchAddress, searchPortal: $searchPortal, searchVpp: $searchVpp, branchTenant: $branchTenant, searchCompanyName: $searchCompanyName) {
            data {
                id
                uid
                payload
                processed
                isConsentRead
            medicareIrn
            medicareCardType
            isEnrollmentFinished
                createdAt
            }
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
        }
    }
`;

export const GET_PEERLESS_COMPANY_NAMES = gql`
    query GetPeerlessCompanyNames {
        peerlessCompanyNames
    }
`;

export const GET_WEB_ENROLLMENT_BY_UID = gql`
    query GetWebEnrollmentByUid($uid: String!) {
        webEnrollmentByUid(uid: $uid) {
            uid
            payload
            isConsentRead
            medicareIrn
            medicareCardType
            isEnrollmentFinished
            createdAt
        }
    }
`;

