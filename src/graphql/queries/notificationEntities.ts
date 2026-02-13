import { gql } from '@apollo/client';

export const GET_NOTIFICATION_ENTITIES = gql`
    query GetNotificationEntities {
        notificationEntities {
            id
            uid
            tenant
            fromEmail
            bccEmail
            preference
            entityType
            isActive
            userUid
            createdAt
            updatedAt
        }
    }
`;

export const GET_NOTIFICATION_ENTITY = gql`
    query GetNotificationEntity($uid: String!) {
        notificationEntity(uid: $uid) {
            id
            uid
            tenant
            fromEmail
            bccEmail
            preference
            entityType
            isActive
            userUid
            createdAt
            updatedAt
        }
    }
`;
