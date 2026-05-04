// Users GraphQL Queries

import { gql } from '@apollo/client';

export const GET_USERS = gql`
    query GetUsers($page: Int, $limit: Int, $status: String, $search: String, $roleUid: String, $onlyVisibleRoles: Boolean, $topLevelOnly: Boolean, $branchTenant: String) {
        users(page: $page, limit: $limit, status: $status, search: $search, roleUid: $roleUid, onlyVisibleRoles: $onlyVisibleRoles, topLevelOnly: $topLevelOnly, branchTenant: $branchTenant) {
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
            data {
                uid
                email
                name
                number
                tenant
                roleUid
                roleName
                status
                isActive
                isDeleted
                createdAt
                isMaster
                branchTenant
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($uid: String!) {
        user(uid: $uid) {
            uid
            email
            name
            number
            tenant
            roleUid
            roleName
            status
            isActive
            isDeleted
            createdAt
            ipAddress
            isAllowedWithoutIp
            isMaster
        }
    }
`;
