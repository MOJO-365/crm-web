import { gql } from '@apollo/client';

export const CREATE_CUSTOMER_MAINTENANCE = gql`
    mutation CreateCustomerMaintenance(
        $customerUid: String!, 
        $callDate: Date!, 
        $category: String, 
        $takenCareByUid: String, 
        $method: Int, 
        $status: Int, 
        $priority: Int, 
        $notes: String
    ) {
        createCustomerMaintenance(
            customerUid: $customerUid, 
            callDate: $callDate, 
            category: $category, 
            takenCareByUid: $takenCareByUid, 
            method: $method, 
            status: $status, 
            priority: $priority, 
            notes: $notes
        ) {
            id
            uid
            customerUid
            callDate
            category
            takenCareByUid
            takenCareByUser {
                uid
                name
            }
            method
            status
            priority
            notes
            createdAt
            createdByName
        }
    }
`;

export const UPDATE_CUSTOMER_MAINTENANCE = gql`
    mutation UpdateCustomerMaintenance(
        $uid: String!, 
        $category: String, 
        $takenCareByUid: String, 
        $method: Int, 
        $status: Int, 
        $priority: Int, 
        $notes: String
    ) {
        updateCustomerMaintenance(
            uid: $uid, 
            category: $category, 
            takenCareByUid: $takenCareByUid, 
            method: $method, 
            status: $status, 
            priority: $priority, 
            notes: $notes
        ) {
            id
            uid
            category
            takenCareByUid
            method
            status
            priority
            notes
            updatedAt
        }
    }
`;

export const DELETE_CUSTOMER_MAINTENANCE = gql`
    mutation DeleteCustomerMaintenance($uid: String!) {
        deleteCustomerMaintenance(uid: $uid)
    }
`;
