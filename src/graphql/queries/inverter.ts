import { gql } from 'graphql-tag';

export const GET_INVERTER_MAKES = gql`
  query GetInverterMakes {
    inverterMakes {
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

export const GET_INVERTER_MODELS = gql`
  query GetInverterModels($makeUid: String!) {
    inverterModels(makeUid: $makeUid) {
      uid
      model
      capacity
      warranty
      isActive
    }
  }
`;
