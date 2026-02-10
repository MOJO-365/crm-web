import { gql } from '@apollo/client';

export const CREATE_DOCUMENT_TYPE = gql`
    mutation CreateDocumentType($name: String!, $color: String, $category: String) {
        createDocumentType(name: $name, color: $color, category: $category) {
            uid
            name
            color
            category
            isActive
        }
    }
`;

export const UPDATE_DOCUMENT_TYPE = gql`
    mutation UpdateDocumentType($uid: String!, $name: String, $color: String, $category: String, $isActive: Int) {
        updateDocumentType(uid: $uid, name: $name, color: $color, category: $category, isActive: $isActive) {
            uid
            name
            color
            category
            isActive
        }
    }
`;

export const DELETE_DOCUMENT_TYPE = gql`
    mutation DeleteDocumentType($uid: String!) {
        deleteDocumentType(uid: $uid)
    }
`;
