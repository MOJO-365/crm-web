export interface MaintenanceRecord {
    id: string;
    uid: string;
    customerUid: string;
    callDate: string;
    category?: string;
    takenCareByUid?: string;
    takenCareByUser?: {
        uid: string;
        name: string;
    };
    method?: number; // 1: Call, 2: Email
    status: number; // 1: Resolved, 2: Cancelled, 3: In-Progress
    priority: number; // 1: Low, 2: Medium, 3: High, 4: Urgent
    notes?: string;
    createdAt?: string;
    createdByName?: string;
}

export interface MaintenanceResponse {
    customerMaintenance: MaintenanceRecord[];
}

export interface SingleMaintenanceResponse {
    maintenanceRecord: MaintenanceRecord;
}
