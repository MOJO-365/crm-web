import { gql } from '@apollo/client';

export const CREATE_WEB_API_CREDENTIAL = gql`
    mutation CreateWebApiCredential($name: String!, $token: String!, $allowedOrigins: [String!], $isPDRS: Boolean, $portalName: String) {
        createWebApiCredential(name: $name, token: $token, allowedOrigins: $allowedOrigins, isPDRS: $isPDRS, portalName: $portalName) {
            id
            name
            token
            allowedOrigins
            isActive
            isPDRS
            portalName
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_WEB_API_CREDENTIAL = gql`
    mutation UpdateWebApiCredential($id: ID!, $name: String, $token: String, $allowedOrigins: [String!], $isActive: Boolean, $isPDRS: Boolean, $portalName: String) {
        updateWebApiCredential(id: $id, name: $name, token: $token, allowedOrigins: $allowedOrigins, isActive: $isActive, isPDRS: $isPDRS, portalName: $portalName) {
            id
            name
            token
            allowedOrigins
            isActive
            isPDRS
            portalName
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_WEB_API_CREDENTIAL = gql`
    mutation DeleteWebApiCredential($id: ID!) {
        deleteWebApiCredential(id: $id)
    }
`;
