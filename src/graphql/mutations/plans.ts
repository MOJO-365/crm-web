import { gql } from '@apollo/client';

export const CREATE_PLAN = gql`
  mutation CreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      uid
      tenant
      title
      description
      discount
      propertyType
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($uid: String!, $input: UpdatePlanInput!) {
    updatePlan(uid: $uid, input: $input) {
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

export const DELETE_PLAN = gql`
  mutation DeletePlan($uid: String!) {
    deletePlan(uid: $uid)
  }
`;
