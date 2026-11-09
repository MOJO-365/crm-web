import { gql } from '@apollo/client';

export const CREATE_COMPANY_REF = gql`
    mutation CreateCompanyRef(
        $name: String!
        $code: String!
        $portalName: String
        $email: String
        $phone: String
        $abn: String
        $contactPerson: String
        $notes: String
        $isActive: Boolean
    ) {
        createCompanyRef(
            name: $name
            code: $code
            portalName: $portalName
            email: $email
            phone: $phone
            abn: $abn
            contactPerson: $contactPerson
            notes: $notes
            isActive: $isActive
        ) {
            id
            uid
            name
            code
            portalName
            email
            phone
            abn
            contactPerson
            notes
            isActive
            createdAt
            updatedAt
            linksCount
            submissionsCount
        }
    }
`;

export const UPDATE_COMPANY_REF = gql`
    mutation UpdateCompanyRef(
        $uid: String!
        $name: String
        $code: String
        $portalName: String
        $email: String
        $phone: String
        $abn: String
        $contactPerson: String
        $notes: String
        $isActive: Boolean
    ) {
        updateCompanyRef(
            uid: $uid
            name: $name
            code: $code
            portalName: $portalName
            email: $email
            phone: $phone
            abn: $abn
            contactPerson: $contactPerson
            notes: $notes
            isActive: $isActive
        ) {
            id
            uid
            name
            code
            portalName
            email
            phone
            abn
            contactPerson
            notes
            isActive
            createdAt
            updatedAt
            linksCount
            submissionsCount
        }
    }
`;

export const DELETE_COMPANY_REF = gql`
    mutation DeleteCompanyRef($uid: String!) {
        deleteCompanyRef(uid: $uid)
    }
`;

export const GENERATE_COMPANY_REF_LINK = gql`
    mutation GenerateCompanyRefLink($companyRefUid: String!, $campaignName: String, $customCode: String) {
        generateCompanyRefLink(companyRefUid: $companyRefUid, campaignName: $campaignName, customCode: $customCode) {
            id
            uid
            companyRefUid
            linkCode
            campaignName
            url
            isActive
            clicksCount
            submissionsCount
            createdAt
        }
    }
`;

export const TOGGLE_COMPANY_REF_LINK_STATUS = gql`
    mutation ToggleCompanyRefLinkStatus($uid: String!, $isActive: Boolean!) {
        toggleCompanyRefLinkStatus(uid: $uid, isActive: $isActive) {
            id
            uid
            isActive
        }
    }
`;

export const DELETE_COMPANY_REF_LINK = gql`
    mutation DeleteCompanyRefLink($uid: String!) {
        deleteCompanyRefLink(uid: $uid)
    }
`;


