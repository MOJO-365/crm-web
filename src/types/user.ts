export interface Menu {
    uid: string;
    name: string;
    code: string;
    parentUid?: string;
}

export interface RolePermission {
    roleUid: string;
    menuUid: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export interface Feature {
    uid: string;
    name: string;
    code: string;
    description?: string;
    menuUid: string;
}

export interface RolePermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: {
        uid: string;
        name: string;
        isIndependentUi?: boolean;
    };
}

