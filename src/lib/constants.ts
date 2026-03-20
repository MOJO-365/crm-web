// App constants
export const APP_NAME = 'CRM Web';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    CUSTOMERS: {
        LIST: '/customers',
        DETAIL: (id: string) => `/customers/${id}`,
    },
    RATES: {
        LIST: '/rates',
        DETAIL: (id: string) => `/rates/${id}`,
    },
    USERS: {
        LIST: '/users',
        DETAIL: (id: string) => `/users/${id}`,
    },
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CUSTOMERS: '/customers',
    RATES: '/rates',
    USERS: '/users',
    SETTINGS: '/settings',
} as const;

// --- Domain Constants ---

// Customer Status
export const CUSTOMER_STATUS_MAP: Record<number, { label: string; color: string }> = {
    0: { label: 'Draft', color: '#6B7280' },
    1: { label: 'Initial Offer', color: '#3B82F6' },
    2: { label: 'Signature Pending', color: '#F59E0B' },
    3: { label: 'Signed', color: '#10B981' },
    4: { label: 'Frozen', color: '#6366F1' },
    5: { label: 'Not Interested', color: '#EF4444' },
};

export const CUSTOMER_STATUS_OPTIONS = Object.entries(CUSTOMER_STATUS_MAP).map(([k, v]) => ({
    value: k,
    label: v.label
}));

// Risk Status
export const RISK_STATUS_MAP: Record<number, { label: string; color: string }> = {
    0: { label: 'Not Required', color: '#64748B' },
    1: { label: 'High Risk', color: '#EF4444' },
    2: { label: 'Medium Risk', color: '#F97316' },
    3: { label: 'Moderate Risk', color: '#F59E0B' },
    4: { label: 'Low Risk', color: '#84CC16' },
    5: { label: 'Very Low Risk', color: '#10B981' },
};

export const RISK_STATUS_OPTIONS = Object.entries(RISK_STATUS_MAP).map(([k, v]) => ({
    value: k,
    label: v.label
}));

export const CUSTOMER_LEGACY_STATUS_MAP: Record<string, string> = {
    'ACTIVE': 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',
    'INACTIVE': 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',
    'LEAD': 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
};

// User Status
export const USER_STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

export const USER_FILTER_STATUS_OPTIONS = [
    { value: 'ALL', label: 'All' },
    ...USER_STATUS_OPTIONS,
];

// DNSP (Distributors)
// DNSP (Distributors)
export const DNSP_MAP: Record<string, string> = {
    '0': 'Ausgrid',
    '1': 'Endeavour',
    '2': 'Essential',
    '3': 'Energex',
};

export const DNSP_OPTIONS = [
    { value: '0', label: 'Ausgrid' },
    { value: '1', label: 'Endeavour' },
    { value: '2', label: 'Essential' },
    { value: '3', label: 'Energex' },
];
export const DISCOUNT_OPTIONS = [0, 5, 7, 10, 13, 15].map(i => ({
    value: i.toString(),
    label: `${i}%`
}));

export const VPP_OPTIONS = [
    { value: '1', label: 'With VPP' },
    { value: '0', label: 'Without VPP' },
];

export const VPP_CONNECTED_OPTIONS = [
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Done' },
];

export const ULTIMATE_STATUS_OPTIONS = [
    { value: '1', label: 'Approved' },
    { value: '0', label: 'Pending' },
];

export const MSAT_CONNECTED_OPTIONS = [
    { value: '1', label: 'Connected' },
    { value: '0', label: 'Not Connected' },
];
export const RATE_TYPE_MAP: Record<string, string> = {
    '1': 'Commercial',
    '0': 'Residential',
};

export const RATE_TYPE_OPTIONS = [
    { value: '1', label: 'Commercial' },
    { value: '0', label: 'Residential' },
];

// Australian States
export const AUS_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT', 'TAS', 'NT'];

export const STATE_OPTIONS = AUS_STATES.map(s => ({ value: s, label: s }));

// ID Types
export const ID_TYPE_MAP: Record<number, string> = {
    0: 'Licence',
    1: 'Medicare',
    2: 'Passport',
};

// Gender
export const GENDER_LABELS: Record<number, string> = {
    0: 'Male',
    1: 'Female',
    2: 'Other',
};

// Relationship Status
export const RELATIONSHIP_STATUS_LABELS: Record<number, string> = {
    0: 'Married',
    1: 'Unmarried',
};

export const ID_TYPE_OPTIONS = [
    { value: '0', label: 'Licence' },
    { value: '1', label: 'Medicare' },
    { value: '2', label: 'Passport' },
];

// Sale Types
export const SALE_TYPE_LABELS: Record<number, string> = {
    0: 'Transfer',
    1: 'Move-in',
    2: 'Recontract',
};

// Billing Preferences
export const BILLING_PREF_LABELS: Record<number, string> = {
    0: 'eBill (Email)',
    1: 'SMS',
    2: 'Post',
};

// DNSP (Distributors) - Merged with existing if needed, but for now specific to the user request
export const DNSP_LABELS: Record<number, string> = {
    0: 'Ausgrid',
    1: 'Endeavour',
    2: 'Essential',
    3: 'Energex',
};

// --- Options Helpers (derived from labels) ---

export const SALE_TYPE_OPTIONS = Object.entries(SALE_TYPE_LABELS).map(([value, label]) => ({
    value: value,
    label,
}));

export const BILLING_PREF_OPTIONS = Object.entries(BILLING_PREF_LABELS).map(([value, label]) => ({
    value: value,
    label,
}));

// --- Email Constants ---

// Email Status
export const EMAIL_STATUS_MAP: Record<number, { label: string; color: string }> = {
    0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
    1: { label: 'Sent', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
    2: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
    3: { label: 'Verified', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
};

export const EMAIL_STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Sent' },
    { value: '2', label: 'Failed' },
    { value: '3', label: 'Verified' },
];

// Email Types
export const EMAIL_TYPE_LABELS: Record<string, string> = {
    CUSTOMER_CREATED: 'Customer Created',
    SIGNATURE_REQUEST: 'Signature Request',
    PASSWORD_RESET: 'Password Reset',
    ACCOUNT_VERIFICATION: 'Account Verification',
    REMINDER: 'Reminder',
    BULK_EMAIL: 'Bulk Email',
    AGREEMENT_SIGNED: 'Agreement Signed',
};

export const EMAIL_TYPE_OPTIONS = [
    { value: '', label: 'All Types' },
    { value: 'CUSTOMER_CREATED', label: 'Customer Created' },
    { value: 'REMINDER', label: 'Reminder' },
    { value: 'BULK_EMAIL', label: 'Bulk Email' },
    { value: 'AGREEMENT_SIGNED', label: 'Agreement Signed' },
    { value: 'SIGNATURE_REQUEST', label: 'Signature Request' },
    { value: 'PASSWORD_RESET', label: 'Password Reset' },
    { value: 'ACCOUNT_VERIFICATION', label: 'Account Verification' },
];

export const BATTERY_BRAND_OPTIONS = [
    { value: 'Fox ESS', label: 'Fox ESS' },
    { value: 'NeoVolt', label: 'NeoVolt' },
    { value: 'Solis-Pylontech', label: 'Solis-Pylontech' },
    { value: 'Growatt', label: 'Growatt' },
    { value: 'Tesla', label: 'Tesla' },
    { value: 'LG Energy Solution', label: 'LG Energy Solution' },
    { value: 'BYD', label: 'BYD' },
    { value: 'Sonnen', label: 'Sonnen' },
    { value: 'AlphaESS', label: 'AlphaESS' },
    { value: 'Sungrow', label: 'Sungrow' },
    { value: 'Huawei', label: 'Huawei' },
    { value: 'Enphase', label: 'Enphase' },
    { value: 'Senec', label: 'Senec' },
    { value: 'Fronius', label: 'Fronius' },
    { value: 'GoodWe', label: 'GoodWe' },
    { value: 'Delta', label: 'Delta' },
    { value: 'Redflow', label: 'Redflow' },
    { value: 'SolaX', label: 'SolaX' },
    { value: 'Victorn Energy', label: 'Victron Energy' },
    { value: 'Acetech', label: 'Acetech' },
    { value: 'Aerl', label: 'Aerl' },
    { value: 'Aeson', label: 'Aeson' },
    { value: 'Afore', label: 'Afore' },
    { value: 'Akai Energy', label: 'Akai Energy' },
    { value: 'Altius', label: 'Altius' },
    { value: 'Amasstore', label: 'Amasstore' },
    { value: 'Ambrion', label: 'Ambrion' },
    { value: 'Ampaura', label: 'Ampaura' },
    { value: 'Anker', label: 'Anker' },
    { value: 'Avol', label: 'Avol' },
    { value: 'Bluetti', label: 'Bluetti' },
    { value: 'Bslbatt', label: 'Bslbatt' },
    { value: 'Business Battery Solutions', label: 'Business Battery Solutions' },
    { value: 'CALB', label: 'CALB' },
    { value: 'CD Power', label: 'CD Power' },
    { value: 'CEEG', label: 'CEEG' },
    { value: 'Cesc', label: 'Cesc' },
    { value: 'Chelion', label: 'Chelion' },
    { value: 'Chint Power', label: 'Chint Power' },
    { value: 'CSE', label: 'CSE' },
    { value: 'Deye', label: 'Deye' },
    { value: 'Discover', label: 'Discover' },
    { value: 'Discover Energy Systems', label: 'Discover Energy Systems' },
    { value: 'Dmegc', label: 'Dmegc' },
    { value: 'Duracell', label: 'Duracell' },
    { value: 'Dyness', label: 'Dyness' },
    { value: 'Each Energy', label: 'Each Energy' },
    { value: 'Ecactus', label: 'Ecactus' },
    { value: 'Ecoflow', label: 'Ecoflow' },
    { value: 'Elai', label: 'Elai' },
    { value: 'Empower', label: 'Empower' },
    { value: 'Energizer', label: 'Energizer' },
    { value: 'ESY', label: 'ESY' },
    { value: 'Esysunhome', label: 'Esysunhome' },
    { value: 'Evantra', label: 'Evantra' },
    { value: 'Eveready', label: 'Eveready' },
    { value: 'Evolve', label: 'Evolve' },
    { value: 'Exide', label: 'Exide' },
    { value: 'Felicity ESS', label: 'Felicity ESS' },
    { value: 'Franklinwh', label: 'Franklinwh' },
    { value: 'Freedom Won Lite Home', label: 'Freedom Won Lite Home' },
    { value: 'Fusion ESS Energy Storage', label: 'Fusion ESS Energy Storage' },
    { value: 'GCL', label: 'GCL' },
    { value: 'Givenergy', label: 'Givenergy' },
    { value: 'Green ESS', label: 'Green ESS' },
    { value: 'Green Solutions', label: 'Green Solutions' },
    { value: 'Greenbank', label: 'Greenbank' },
    { value: 'Greengaroo', label: 'Greengaroo' },
    { value: 'Greenhse Technologies', label: 'Greenhse Technologies' },
    { value: 'Greentek', label: 'Greentek' },
    { value: 'GSL Energy', label: 'GSL Energy' },
    { value: 'Haier', label: 'Haier' },
    { value: 'Hengtong ESS', label: 'Hengtong ESS' },
    { value: 'Hgness', label: 'Hgness' },
    { value: 'Hiconics', label: 'Hiconics' },
    { value: 'Hinen', label: 'Hinen' },
    { value: 'Hoymiles', label: 'Hoymiles' },
    { value: 'Hyxi Power', label: 'Hyxi Power' },
    { value: 'Inno Energy', label: 'Inno Energy' },
    { value: 'Ipotisedge', label: 'Ipotisedge' },
    { value: 'Istore', label: 'Istore' },
    { value: 'Jinko', label: 'Jinko' },
    { value: 'Jinko Solar', label: 'Jinko Solar' },
    { value: 'Kehua Tech', label: 'Kehua Tech' },
    { value: 'Kijo', label: 'Kijo' },
    { value: 'Koyoe', label: 'Koyoe' },
    { value: 'Kstar', label: 'Kstar' },
    { value: 'Lavo', label: 'Lavo' },
    { value: 'LG', label: 'LG' },
    { value: 'LG Resu', label: 'LG Resu' },
    { value: 'LIB', label: 'LIB' },
    { value: 'Mango Power', label: 'Mango Power' },
    { value: 'Maxeon', label: 'Maxeon' },
    { value: 'MG Energy', label: 'MG Energy' },
    { value: 'Midea', label: 'Midea' },
    { value: 'Nahui', label: 'Nahui' },
    { value: 'Olipower', label: 'Olipower' },
    { value: 'Potisedge', label: 'Potisedge' },
    { value: 'Powerbox Pro', label: 'Powerbox Pro' },
    { value: 'Powerplus', label: 'Powerplus' },
    { value: 'Pylon', label: 'Pylon' },
    { value: 'Pylontech', label: 'Pylontech' },
    { value: 'Pytes', label: 'Pytes' },
    { value: 'RCT Power', label: 'RCT Power' },
    { value: 'Redback Technologies', label: 'Redback Technologies' },
    { value: 'Redearth Energy Storage', label: 'Redearth Energy Storage' },
    { value: 'Redx', label: 'Redx' },
    { value: 'Renon', label: 'Renon' },
    { value: 'Renoz Energy', label: 'Renoz Energy' },
    { value: 'Risen', label: 'Risen' },
    { value: 'Roypow', label: 'Roypow' },
    { value: 'Ruixu', label: 'Ruixu' },
    { value: 'SAJ', label: 'SAJ' },
    { value: 'Sigenergy', label: 'Sigenergy' },
    { value: 'SMA', label: 'SMA' },
    { value: 'Smart Lifestyle', label: 'Smart Lifestyle' },
    { value: 'Sofar', label: 'Sofar' },
    { value: 'Sofar Solar', label: 'Sofar Solar' },
    { value: 'Solarbatt', label: 'Solarbatt' },
    { value: 'Solaredge', label: 'Solaredge' },
    { value: 'Solplanet', label: 'Solplanet' },
    { value: 'Soltaro', label: 'Soltaro' },
    { value: 'Sphere', label: 'Sphere' },
    { value: 'Srne', label: 'Srne' },
    { value: 'Star Charge', label: 'Star Charge' },
    { value: 'Stealth Energy', label: 'Stealth Energy' },
    { value: 'Sunsynk', label: 'Sunsynk' },
    { value: 'Sunvolt', label: 'Sunvolt' },
    { value: 'Swatten', label: 'Swatten' },
    { value: 'Tcsn', label: 'Tcsn' },
    { value: 'Tecloman', label: 'Tecloman' },
    { value: 'TNK', label: 'TNK' },
    { value: 'UZ Energy', label: 'UZ Energy' },
    { value: 'Weco', label: 'Weco' },
    { value: 'Xess', label: 'Xess' },
    { value: 'Yoshopo', label: 'Yoshopo' },
    { value: 'Zenaji', label: 'Zenaji' },
    { value: 'Zrgp', label: 'Zrgp' },
    { value: 'ZYC Energy', label: 'ZYC Energy' },
    { value: 'Other', label: 'Other' },
];
