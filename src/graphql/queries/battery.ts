import { gql } from 'graphql-tag';

export const GET_BATTERY_MAKES = gql`
  query GetBatteryMakes {
    batteryMakes {
      uid
      make
      declaredModelCount
      actualModelRows
      minCapacity
      maxCapacity
      isActive
    }
  }
`;

export const GET_BATTERY_MODELS = gql`
  query GetBatteryModels($makeUid: String!) {
    batteryModels(makeUid: $makeUid) {
      uid
      model
      capacity
      bess2Eligible
      vpp1Eligible
      isActive
    }
  }
`;
