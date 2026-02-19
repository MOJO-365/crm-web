import { gql } from '@apollo/client';

export const CREATE_RISK_STATUS = gql`
    mutation CreateRiskStatus($name: String!, $code: String!, $description: String, $color: String, $scoreMin: Int, $scoreMax: Int, $manualOffer: Int, $sortOrder: Int) {
        createRiskStatus(name: $name, code: $code, description: $description, color: $color, scoreMin: $scoreMin, scoreMax: $scoreMax, manualOffer: $manualOffer, sortOrder: $sortOrder) {
            uid
            name
            code
            description
            color
            scoreMin
            scoreMax
            manualOffer
            sortOrder
            isActive
        }
    }
`;

export const UPDATE_RISK_STATUS = gql`
    mutation UpdateRiskStatus($uid: String!, $name: String, $code: String, $description: String, $color: String, $scoreMin: Int, $scoreMax: Int, $manualOffer: Int, $sortOrder: Int, $isActive: Int) {
        updateRiskStatus(uid: $uid, name: $name, code: $code, description: $description, color: $color, scoreMin: $scoreMin, scoreMax: $scoreMax, manualOffer: $manualOffer, sortOrder: $sortOrder, isActive: $isActive) {
            uid
            name
            code
            description
            color
            scoreMin
            scoreMax
            manualOffer
            sortOrder
            isActive
        }
    }
`;

export const DELETE_RISK_STATUS = gql`
    mutation DeleteRiskStatus($uid: String!) {
        deleteRiskStatus(uid: $uid)
    }
`;
