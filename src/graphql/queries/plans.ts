import { gql } from '@apollo/client';

export const GET_PLANS = gql`
  query GetPlans($limit: Int, $offset: Int, $state: String) {
    plans(limit: $limit, offset: $offset, state: $state) {
      uid
      tenant
      title
      state
      description
      discount
      propertyType
      isSolarRequired
      isBatteryRequired
      attachNominationForm
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

export const GET_ACTIVE_PLANS = gql`
  query GetActivePlans($state: String) {
    activePlans(state: $state) {
      uid
      tenant
      title
      state
      description
      discount
      propertyType
      isSolarRequired
      isBatteryRequired
      attachNominationForm
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

export const GET_PLAN = gql`
  query GetPlan($uid: String!) {
    plan(uid: $uid) {
      uid
      tenant
      title
      state
      description
      discount
      propertyType
      isSolarRequired
      isBatteryRequired
      attachNominationForm
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
