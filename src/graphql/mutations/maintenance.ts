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

export const CREATE_ITEM_CATEGORY = gql`
    mutation CreateItemCategory($name: String!, $color: String) {
        createItemCategory(name: $name, color: $color) {
            id
            uid
            name
            color
        }
    }
`;

export const UPDATE_ITEM_CATEGORY = gql`
    mutation UpdateItemCategory($uid: String!, $name: String, $color: String, $isActive: Int) {
        updateItemCategory(uid: $uid, name: $name, color: $color, isActive: $isActive) {
            id
            uid
            name
            color
            isActive
        }
    }
`;

export const DELETE_ITEM_CATEGORY = gql`
    mutation DeleteItemCategory($uid: String!) {
        deleteItemCategory(uid: $uid)
    }
`;
