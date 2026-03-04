import { gql } from '@apollo/client';

export const GET_PDF_TERMS_LIST = gql`
    query GetPdfTermsList($page: Int, $limit: Int) {
        pdfTermsList(page: $page, limit: $limit) {
            data {
                id
                uid
                name
                rateType
                rateUids
                isActive
                isDeleted
                createdAt
                updatedAt
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

export const GET_PDF_TERM = gql`
    query GetPdfTerm($uid: String!) {
        pdfTerm(uid: $uid) {
            id
            uid
            name
            content
            rateType
            rateUids
            isActive
            isDeleted
            createdAt
            updatedAt
        }
    }
`;
