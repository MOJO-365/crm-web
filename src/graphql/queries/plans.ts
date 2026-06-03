import { gql } from '@apollo/client';

export const GET_PLANS = gql`
  query GetPlans($limit: Int, $offset: Int) {
    plans(limit: $limit, offset: $offset) {
      uid
      tenant
      title
      description
      discount
      propertyType
      ratesJson
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_PLANS = gql`
  query GetActivePlans {
    activePlans {
      uid
      tenant
      title
      description
      discount
      propertyType
      ratesJson
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_PLAN = gql`
  query GetPlan($uid: String!) {
    plan(uid: $uid) {
      uid
      tenant
      title
      description
      discount
      propertyType
      ratesJson
      isActive
      createdAt
      updatedAt
    }
  }
`;
