import { gql } from '@apollo/client';

export const GET_ACTIVE_BONUSES = gql`
  query GetActiveBonuses {
    activeBonuses {
      uid
      name
      description
      amount
      contractTerm
      exitFee
    }
  }
`;

export const GET_ALL_BONUSES = gql`
  query GetAllBonuses {
    bonuses {
      uid
      name
      description
      amount
      isActive
      contractTerm
      exitFee
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BONUS = gql`
  mutation CreateBonus($input: CreateBonusInput!) {
    createBonus(input: $input) {
      uid
      name
      contractTerm
      exitFee
    }
  }
`;

export const UPDATE_BONUS = gql`
  mutation UpdateBonus($uid: String!, $input: UpdateBonusInput!) {
    updateBonus(uid: $uid, input: $input) {
      uid
      name
      contractTerm
      exitFee
    }
  }
`;

export const DELETE_BONUS = gql`
  mutation DeleteBonus($uid: String!) {
    deleteBonus(uid: $uid)
  }
`;
