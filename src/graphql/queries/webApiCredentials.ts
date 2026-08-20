import { gql } from '@apollo/client';

export const GET_WEB_API_CREDENTIALS = gql`
    query GetWebApiCredentials {
        webApiCredentials {
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
