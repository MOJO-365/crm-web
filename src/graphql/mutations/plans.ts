import { gql } from '@apollo/client';

export const CREATE_PLAN = gql`
  mutation CreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      uid
      tenant
      title
      state
      description
      discount
      isDnspBased
      propertyType
      isSolarRequired
      isBatteryRequired
      attachNominationForm
      planTcPath
      contractTerm
      exitFee
      isActive
      createdAt
      updatedAt
      bonusUids
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($uid: String!, $input: UpdatePlanInput!) {
    updatePlan(uid: $uid, input: $input) {
      uid
      tenant
      title
      state
      description
      discount
      isDnspBased
      propertyType
      isSolarRequired
      isBatteryRequired
      attachNominationForm
      planTcPath
      contractTerm
      exitFee
      ratesJson
      isActive
      createdAt
      updatedAt
      bonusUids
    }
  }
`;

export const DELETE_PLAN = gql`
  mutation DeletePlan($uid: String!) {
    deletePlan(uid: $uid)
  }
`;
