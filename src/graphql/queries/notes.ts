import { gql } from '@apollo/client';

export const GET_CUSTOMER_NOTES = gql`
    query GetCustomerNotes($customerUid: String!, $maintenanceUid: String) {
        customerNotes(customerUid: $customerUid, maintenanceUid: $maintenanceUid) {
            id
            uid
            customerUid
            maintenanceUid
            userUid
            message
            followUp
            assignedTo
            assignedToUser {
                uid
                name
            }
            type
            noteTypeDetails {
                uid
                name
                color
            }
            createdAt
            createdByName
        }
    }
`;

export const GET_NOTE_TYPES = gql`
    query GetNoteTypes {
        noteTypes {
            uid
            name
            color
            isActive
            createdAt
            createdBy
        }
    }
`;

