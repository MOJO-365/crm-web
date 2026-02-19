import { gql } from '@apollo/client';

export const GET_ALL_EMAIL_LOGS = gql`
    query GetAllEmailLogs($page: Int, $limit: Int, $search: String, $status: Int, $emailType: String) {
        allEmailLogs(page: $page, limit: $limit, search: $search, status: $status, emailType: $emailType) {
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
            data {
                id
                customerUid
                customerId
                emailTo
                emailType
                subject
                body
                status
                errorMessage
                sentAt
                verifiedAt
                createdAt
                createdBy
                tenant
                verificationCode
            }
        }
    }
`;

export const GET_CUSTOMER_EMAIL_LOGS = gql`
    query GetCustomerEmailLogs($customerUid: String!, $page: Int, $limit: Int) {
        customerEmailLogs(customerUid: $customerUid, page: $page, limit: $limit) {
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
            data {
                id
                customerUid
                customerId
                emailTo
                emailType
                subject
                body
                status
                errorMessage
                sentAt
                verifiedAt
                createdAt
                createdBy
                tenant
                verificationCode
            }
        }
    }
`;
