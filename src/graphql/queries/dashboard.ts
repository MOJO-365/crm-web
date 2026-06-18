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
