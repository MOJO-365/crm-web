import { gql } from '@apollo/client';

export const GET_CUSTOMER_DASHBOARD = gql`
  query GetCustomerDashboard {
    customerDashboard {
      utilmateStatusSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          utilmateStatus
          vppConnected
          vpp
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
      signedStatusSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
      vppPendingSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          vppConnected
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
      signaturePendingSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
      draftSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
      movedOnSummary {
        count
        customers {
          uid
          customerId
          firstName
          lastName
          email
          status
          createdAt
          statusUpdatedAt
          statusTimeline
        }
      }
    }
  }
`;

export const GET_MONTHLY_ENROLLMENTS = gql`
  query GetMonthlyEnrollments($months: Int, $interval: String) {
    monthlyEnrollments(months: $months, interval: $interval) {
      month
      year
      count
    }
  }
`;

export const GET_LEAD_SOURCE_DISTRIBUTION = gql`
  query GetLeadSourceDistribution {
    leadSourceDistribution {
      source
      count
      percentage
    }
  }
`;
