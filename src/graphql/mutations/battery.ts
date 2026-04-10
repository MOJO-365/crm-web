import { gql } from '@apollo/client';

export const CREATE_BATTERY_MAKE = gql`
  mutation CreateBatteryMake($input: CreateBatteryMakeInput!) {
    createBatteryMake(input: $input) {
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

export const UPDATE_BATTERY_MAKE = gql`
  mutation UpdateBatteryMake($uid: String!, $input: UpdateBatteryMakeInput!) {
    updateBatteryMake(uid: $uid, input: $input) {
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

export const DELETE_BATTERY_MAKE = gql`
    mutation DeleteBatteryMake($uid: String!) {
        deleteBatteryMake(uid: $uid)
    }
`;


export const CREATE_BATTERY_MODEL = gql`
    mutation CreateBatteryModel($input: CreateBatteryModelInput!) {
        createBatteryModel(input: $input) {
            id
            uid
            makeUid
            model
            capacity
            vppProgram
            bess2Eligible
            vpp1Eligible
            isActive
        }
    }
`;

export const UPDATE_BATTERY_MODEL = gql`
    mutation UpdateBatteryModel($uid: String!, $input: UpdateBatteryModelInput!) {
        updateBatteryModel(uid: $uid, input: $input) {
            id
            uid
            makeUid
            model
            capacity
            vppProgram
            bess2Eligible
            vpp1Eligible
            isActive
        }
    }
`;

export const DELETE_BATTERY_MODEL = gql`
    mutation DeleteBatteryModel($uid: String!) {
        deleteBatteryModel(uid: $uid)
    }
`;
