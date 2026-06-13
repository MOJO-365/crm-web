import { gql } from '@apollo/client';
import { LEAD_FIELDS } from '../fragments';

export const GET_LEADS = gql`
    query GetLeads($page: Int, $limit: Int, $search: String, $source: String, $isCustomerNow: Boolean, $customerStatus: Int, $searchAssignedTo: String, $searchCreatedBy: String, $branchTenant: String) {
        leads(page: $page, limit: $limit, search: $search, source: $source, isCustomerNow: $isCustomerNow, customerStatus: $customerStatus, searchAssignedTo: $searchAssignedTo, searchCreatedBy: $searchCreatedBy, branchTenant: $branchTenant) {
            data {
                ...LeadFields
            }
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
        }
    }
    ${LEAD_FIELDS}
`;

export const GET_LEAD = gql`
    query GetLead($uid: String!) {
        lead(uid: $uid) {
            ...LeadFields
        }
    }
    ${LEAD_FIELDS}
`;

export const GET_LEAD_SOURCES = gql`
    query GetLeadSources {
        leadSources {
            id
            uid
            name
            isActive
        }
    }
`;

export const CHECK_LEAD_DUPLICATE = gql`
    query CheckLeadDuplicate($number: String, $address: CustomerAddressInput) {
        checkLeadDuplicate(number: $number, address: $address) {
            uid
            firstname
            lastname
            isDuplicate
        }
    }
`;
