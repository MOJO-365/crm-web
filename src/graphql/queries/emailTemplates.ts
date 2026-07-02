import { gql } from '@apollo/client';

export const GET_EMAIL_TEMPLATES = gql`
    query GetEmailTemplates($page: Int, $limit: Int, $status: Int, $entityType: Int) {
        emailTemplates(page: $page, limit: $limit, status: $status, entityType: $entityType) {
            data {
                id
                uid
                name
                subject
                entityType
                announcementUid
                status
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

export const GET_EMAIL_TEMPLATE = gql`
    query GetEmailTemplate($uid: String!) {
        emailTemplate(uid: $uid) {
            id
            uid
            name
            entityType
            subject
            body
            announcementUid
            status
            isActive
            isDeleted
            createdAt
            updatedAt
        }
    }
`;

export const PREVIEW_SYSTEM_TEMPLATE = gql`
    query PreviewSystemTemplate($eventType: String!, $isWithoutSignature: Boolean, $isPlanUpdated: Boolean) {
        previewSystemTemplate(eventType: $eventType, isWithoutSignature: $isWithoutSignature, isPlanUpdated: $isPlanUpdated) {
            subject
            body
            isCustom
        }
    }
`;

export const GET_ANNOUNCEMENTS = gql`
    query GetAnnouncements {
        announcements {
            id
            uid
            name
            fileName
            isActive
            createdAt
        }
    }
`;
