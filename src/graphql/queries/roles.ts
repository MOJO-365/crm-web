// Roles GraphQL Queries

import { gql } from '@apollo/client';

export const GET_ROLES = gql`
    query GetRoles($page: Int, $limit: Int, $isVisibleInLists: Boolean) {
        roles(page: $page, limit: $limit, isVisibleInLists: $isVisibleInLists) {
            data {
                uid
                name
                description
                isActive
                isDeleted
                createdAt
                isIndependentUi
                isVisibleInLists
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
