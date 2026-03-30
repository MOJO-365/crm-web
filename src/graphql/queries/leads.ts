import { gql } from '@apollo/client';
import { LEAD_FIELDS } from '../fragments';

export const GET_LEADS = gql`
    query GetLeads($page: Int, $limit: Int, $search: String, $source: String, $isCustomerNow: Boolean) {
        leads(page: $page, limit: $limit, search: $search, source: $source, isCustomerNow: $isCustomerNow) {
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
