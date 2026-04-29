// Users GraphQL Queries

import { gql } from '@apollo/client';

export const GET_USERS = gql`
    query GetUsers($page: Int, $limit: Int, $status: String, $search: String, $roleUid: String, $onlyVisibleRoles: Boolean, $topLevelOnly: Boolean) {
        users(page: $page, limit: $limit, status: $status, search: $search, roleUid: $roleUid, onlyVisibleRoles: $onlyVisibleRoles, topLevelOnly: $topLevelOnly) {
            meta {
                totalRecords
                currentPage
                totalPages
                recordsPerPage
            }
            data {
                uid
                email
                password
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
                branchTenant
                branchStaff {
                    uid
                    name
                    email
                    roleName
                    status
                }
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
