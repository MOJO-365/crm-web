import { gql } from '@apollo/client';

export const CREATE_PDF_TERM = gql`
    mutation CreatePdfTerm($input: CreatePdfTermInput!) {
        createPdfTerm(input: $input) {
            id
            uid
            name
            rateType
            rateUids
            planUids
            message
        }
    }
`;

export const UPDATE_PDF_TERM = gql`
    mutation UpdatePdfTerm($uid: String!, $input: UpdatePdfTermInput!) {
        updatePdfTerm(uid: $uid, input: $input) {
            id
            uid
            name
            rateType
            rateUids
            planUids
            message
        }
    }
`;

export const SOFT_DELETE_PDF_TERM = gql`
    mutation SoftDeletePdfTerm($uid: String!) {
        softDeletePdfTerm(uid: $uid)
    }
`;

export const RESTORE_PDF_TERM = gql`
    mutation RestorePdfTerm($uid: String!) {
        restorePdfTerm(uid: $uid)
    }
`;
