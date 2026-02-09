import { gql } from '@apollo/client';

export const GET_CUSTOMER_NOTES = gql`
    query GetCustomerNotes($customerUid: String!) {
        customerNotes(customerUid: $customerUid) {
            id
            uid
            customerUid
            userUid
            message
            followUp
            assignedTo
            assignedToUser {
                uid
                name
            }
            type
            createdAt
            createdByName
        }
    }
`;

export const CREATE_CUSTOMER_NOTE = gql`
    mutation CreateCustomerNote($customerUid: String!, $message: String!, $followUp: Date, $assignedTo: String, $type: String) {
        createCustomerNote(customerUid: $customerUid, message: $message, followUp: $followUp, assignedTo: $assignedTo, type: $type) {
            id
            uid
            customerUid
            userUid
            message
            followUp
            assignedTo
            assignedToUser {
                uid
                name
            }
            type
            createdAt
            createdByName
        }
    }
`;

export const UPDATE_CUSTOMER_NOTE = gql`
    mutation UpdateCustomerNote($uid: String!, $message: String, $followUp: Date, $assignedTo: String, $type: String) {
        updateCustomerNote(uid: $uid, message: $message, followUp: $followUp, assignedTo: $assignedTo, type: $type) {
            id
            uid
            message
            followUp
            assignedTo
            type
            updatedAt
        }
    }
`;

export const DELETE_CUSTOMER_NOTE = gql`
    mutation DeleteCustomerNote($uid: String!) {
        deleteCustomerNote(uid: $uid)
    }
`;
