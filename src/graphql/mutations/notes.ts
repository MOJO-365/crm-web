
import { gql } from '@apollo/client';

export const CREATE_CUSTOMER_NOTE = gql`
    mutation CreateCustomerNote($customerUid: String!, $message: String!, $followUp: Date, $assignedTo: String, $type: String, $maintenanceUid: String) {
        createCustomerNote(customerUid: $customerUid, message: $message, followUp: $followUp, assignedTo: $assignedTo, type: $type, maintenanceUid: $maintenanceUid) {
            id
            uid
            customerUid
            maintenanceUid
            message
            followUp
            assignedTo
            assignedToUser {
                uid
                name
            }
            noteTypeDetails {
                uid
                name
                color
            }
            type
            createdAt
            createdBy
            createdByName
        }
    }
`;

export const DELETE_CUSTOMER_NOTE = gql`
    mutation DeleteCustomerNote($uid: String!) {
        deleteCustomerNote(uid: $uid)
    }
`;

export const CREATE_NOTE_TYPE = gql`
    mutation CreateNoteType($name: String!, $color: String) {
        createNoteType(name: $name, color: $color) {
            uid
            name
            color
            isActive
            createdAt
            createdBy
        }
    }
`;

export const DELETE_NOTE_TYPE = gql`
    mutation DeleteNoteType($uid: String!) {
        deleteNoteType(uid: $uid)
    }
`;

export const UPDATE_NOTE_TYPE = gql`
    mutation UpdateNoteType($uid: String!, $name: String, $color: String, $isActive: Int) {
        updateNoteType(uid: $uid, name: $name, color: $color, isActive: $isActive) {
            uid
            name
            color
            isActive
            updatedAt
        }
    }
`;
