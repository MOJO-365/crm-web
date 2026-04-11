import { gql } from '@apollo/client';

export const CREATE_INVERTER_MAKE = gql`
  mutation CreateInverterMake($input: CreateInverterMakeInput!) {
    createInverterMake(input: $input) {
      uid
      make
      shortName
      description
      minCapacity
      maxCapacity
      totalCapacity
      usableCapacity
      warrantyDetails
      productStatus
      cecCapacity
      cecExpiryDate
      isActive
      datasheetPath
      datasheetUrl
      datasheetName
    }
  }
`;

export const UPDATE_INVERTER_MAKE = gql`
  mutation UpdateInverterMake($uid: String!, $input: UpdateInverterMakeInput!) {
    updateInverterMake(uid: $uid, input: $input) {
      uid
      make
      shortName
      description
      minCapacity
      maxCapacity
      totalCapacity
      usableCapacity
      warrantyDetails
      productStatus
      cecCapacity
      cecExpiryDate
      isActive
      datasheetPath
      datasheetUrl
      datasheetName
    }
  }
`;

export const DELETE_INVERTER_MAKE = gql`
    mutation DeleteInverterMake($uid: String!) {
        deleteInverterMake(uid: $uid)
    }
`;

export const CREATE_INVERTER_MODEL = gql`
    mutation CreateInverterModel($input: CreateInverterModelInput!) {
        createInverterModel(input: $input) {
            uid
            makeUid
            model
            capacity
            warranty
            isActive
        }
    }
`;

export const UPDATE_INVERTER_MODEL = gql`
    mutation UpdateInverterModel($uid: String!, $input: UpdateInverterModelInput!) {
        updateInverterModel(uid: $uid, input: $input) {
            uid
            makeUid
            model
            capacity
            warranty
            isActive
        }
    }
`;

export const DELETE_INVERTER_MODEL = gql`
    mutation DeleteInverterModel($uid: String!) {
        deleteInverterModel(uid: $uid)
    }
`;
