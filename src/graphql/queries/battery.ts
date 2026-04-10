import { gql } from 'graphql-tag';

export const GET_BATTERY_MAKES = gql`
  query GetBatteryMakes {
    batteryMakes {
      uid
      make
      shortName
      description
      batteryUsableCapacity
      maxBackupLoad
      batteryProdWarranty
      productStatus
      cecStatus
      pdrsStatus
      cegCapacity
      batteryCapacityKwh
      cegExpiryDate
      declaredModelCount
      actualModelRows
      minCapacity
      maxCapacity
      isActive
      datasheetPath
      datasheetUrl
      datasheetName
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
