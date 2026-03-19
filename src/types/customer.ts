export interface CustomerFormData {
    // Basic Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: number;
    relationshipStatus: number;
    enquiryAmount: string;
    checkCreditScore: boolean;
    employerName: string;
    dob: string;
    propertyType: number; // 0 = residential, 1 = commercial
    businessName: string;
    abn: string;
    showAsBusinessName: boolean;
    showName?: boolean;

    // Address
    unitNumber: string;
    streetNumber: string;
    streetName: string;
    streetType: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    nmi: string;

    // Solar Details
    hasSolar: boolean;
    solarCapacity: string;
    inverterCapacity: string;

    // VPP Details
    vpp: boolean;
    vppConnected: boolean;
    vppSignupBonus: string | null;

    // Battery Details
    batteryBrand: string;
    batteryCapacity: string;
    snNumber: string;
    exportLimit: string;

    // Enrollment Details
    saleType: number;
    connectionDate: string;
    idType: number;
    idNumber: string;
    idState: string;
    idCountry: string;
    idExpiry: string;

    // Driver's License Details
    licenseNumber: string;
    licenseState: string;
    licenseExpiry: string;

    concession: boolean;
    lifeSupport: boolean;
    billingPreference: number;

    // Direct Debit Details
    directDebit: boolean;
    accountType: number;
    debitFirstName: string;
    debitLastName: string;
    bankName: string;
    bankAddress: string;
    bsb: string;
    accountNumber: string;
    paymentFrequency: number;
    firstDebitDate: string;

    // Pricing
    tariffCode: string;
    creditScore?: number;
    riskStatus?: number;
    discount: number;

    // Documents
    previousBill?: CustomerDocument | null;
    identityProof?: CustomerDocument | null;
    licenseDocument?: CustomerDocument | null;
    additionalDocument?: CustomerDocument | null;
    selectedBonuses: string[]; // Array of bonus UIDs
}

export interface CustomerDocument {
    id: number | string;
    uid?: string;
    path: string;
    filename?: string;
    url?: string;
    size?: number;
    contentType?: string;
}
