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

export const GET_ITEM_CATEGORIES = gql`
    query GetItemCategories {
        itemCategories {
            id
            uid
            name
            color
        }
    }
`;

export const GET_MAINTENANCES = gql`
    query GetMaintenances($page: Int, $limit: Int, $status: Int, $priority: Int, $category: String, $search: String) {
        maintenances(page: $page, limit: $limit, status: $status, priority: $priority, category: $category, search: $search) {
            data {
                id
                uid
                customerUid
                customer {
                    uid
                    customerId
                    firstName
                    lastName
                    email
                    number
                }
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
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
        }
    }
`;

export const GET_MAINTENANCE_STATS = gql`
    query GetMaintenanceStats {
        maintenanceStats {
            total
            inProgress
            resolved
            cancelled
        }
    }
`;

