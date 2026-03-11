import { gql } from '@apollo/client';

export const CREATE_NOTIFICATION_ENTITY = gql`
    mutation CreateNotificationEntity($input: CreateNotificationEntityInput!) {
        createNotificationEntity(input: $input) {
            id
            uid
            fromEmail
            isActive
            userUids
        }
    }
`;

export const UPDATE_NOTIFICATION_ENTITY = gql`
    mutation UpdateNotificationEntity($uid: String!, $input: UpdateNotificationEntityInput!) {
        updateNotificationEntity(uid: $uid, input: $input) {
            id
            uid
            fromEmail
            isActive
            userUids
        }
    }
`;

export const DELETE_NOTIFICATION_ENTITY = gql`
    mutation DeleteNotificationEntity($uid: String!) {
        deleteNotificationEntity(uid: $uid)
    }
`;
