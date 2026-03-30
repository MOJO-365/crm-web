import { gql } from '@apollo/client';
import { LEAD_FIELDS } from '../fragments';

export const CREATE_LEAD = gql`
    mutation CreateLead($input: CreateLeadInput!) {
        createLead(input: $input) {
            ...LeadFields
        }
    }
    ${LEAD_FIELDS}
`;

export const UPDATE_LEAD = gql`
    mutation UpdateLead($uid: String!, $input: UpdateLeadInput!) {
        updateLead(uid: $uid, input: $input) {
            ...LeadFields
        }
    }
    ${LEAD_FIELDS}
`;

export const DELETE_LEAD = gql`
    mutation DeleteLead($uid: String!) {
        deleteLead(uid: $uid)
    }
`;

export const CREATE_LEAD_SOURCE = gql`
    mutation CreateLeadSource($name: String!) {
        createLeadSource(name: $name) {
            id
            uid
            name
        }
    }
`;

export const UPDATE_LEAD_SOURCE = gql`
    mutation UpdateLeadSource($uid: String!, $name: String, $isActive: Int) {
        updateLeadSource(uid: $uid, name: $name, isActive: $isActive) {
            id
            uid
            name
            isActive
        }
    }
`;

export const DELETE_LEAD_SOURCE = gql`
    mutation DeleteLeadSource($uid: String!) {
        deleteLeadSource(uid: $uid)
    }
`;
