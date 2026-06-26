import { gql } from '@apollo/client';

export const GET_ALL_APP_VERSIONS = gql`
  query GetAllAppVersions {
    appVersions {
      uid
      platform
      versionNumber
      title
      description
      releaseDate
      isCurrent
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENT_APP_VERSION = gql`
  query GetCurrentAppVersion {
    currentAppVersion {
      uid
      platform
      versionNumber
      title
      description
      releaseDate
      isCurrent
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_APP_VERSION = gql`
  mutation CreateAppVersion($input: CreateAppVersionInput!) {
    createAppVersion(input: $input) {
      uid
      versionNumber
      title
    }
  }
`;

export const UPDATE_APP_VERSION = gql`
  mutation UpdateAppVersion($uid: String!, $input: UpdateAppVersionInput!) {
    updateAppVersion(uid: $uid, input: $input) {
      uid
      versionNumber
      title
    }
  }
`;

export const DELETE_APP_VERSION = gql`
  mutation DeleteAppVersion($uid: String!) {
    deleteAppVersion(uid: $uid)
  }
`;

export const SET_CURRENT_APP_VERSION = gql`
  mutation SetCurrentAppVersion($uid: String!) {
    setCurrentAppVersion(uid: $uid) {
      uid
      versionNumber
      title
      isCurrent
    }
  }
`;
