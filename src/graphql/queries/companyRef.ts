import { gql } from '@apollo/client';

export const GET_COMPANY_REFS = gql`
    query GetCompanyRefs($activeOnly: Boolean) {
        companyRefs(activeOnly: $activeOnly) {
            id
            uid
            tenant
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
            links {
                id
                uid
                linkCode
                campaignName
                url
                isActive
                clicksCount
                submissionsCount
                createdAt
            }
        }
    }
`;

export const GET_COMPANY_REF_BY_CODE = gql`
    query GetCompanyRefByCode($code: String!) {
        companyRefByCode(code: $code) {
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
        }
    }
`;

export const GET_COMPANY_REF_LINKS = gql`
    query GetCompanyRefLinks($companyRefUid: String!) {
        companyRefLinks(companyRefUid: $companyRefUid) {
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

export const GET_COMPANY_REF_SUBMISSIONS = gql`
    query GetCompanyRefSubmissions($companyRefUid: String!) {
        companyRefSubmissions(companyRefUid: $companyRefUid) {
            uid
            customerName
            email
            phone
            nmi
            tariff
            address
            processed
            createdAt
            portalName
            linkCode
        }
    }
`;

