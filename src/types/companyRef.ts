export interface CompanyRef {
    id: string;
    uid: string;
    tenant?: string;
    name: string;
    code: string;
    portalName: string;
    email?: string | null;
    phone?: string | null;
    abn?: string | null;
    contactPerson?: string | null;
    notes?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    linksCount?: number;
    submissionsCount?: number;
    links?: CompanyRefLink[];
}

export interface CompanyRefLink {
    id: string;
    uid: string;
    companyRefUid: string;
    linkCode: string;
    campaignName?: string | null;
    url: string;
    isActive: boolean;
    clicksCount: number;
    submissionsCount: number;
    createdAt: string;
}

export interface CompanyEnrollmentSubmission {
    uid: string;
    customerName: string;
    email?: string | null;
    phone?: string | null;
    nmi?: string | null;
    tariff?: string | null;
    address?: string | null;
    processed: number;
    createdAt: string;
    portalName?: string | null;
    linkCode?: string | null;
}

