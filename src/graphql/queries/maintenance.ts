import { gql } from '@apollo/client';

export const GET_CUSTOMER_MAINTENANCE = gql`
    query GetCustomerMaintenance($customerUid: String!) {
        customerMaintenance(customerUid: $customerUid) {
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

export const GET_MAINTENANCE_RECORD = gql`
    query GetMaintenanceRecord($uid: String!) {
        maintenanceRecord(uid: $uid) {
            id
            uid
            customerUid
            callDate
            category
            takenCareByUid
            method
            status
            priority
            notes
        }
    }
`;

export const GET_MAINTENANCE_CATEGORIES = gql`
    query GetMaintenanceCategories {
        maintenanceCategories {
            id
            uid
            name
            color
        }
    }
`;
