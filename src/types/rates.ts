export interface RateOffer {
    id: string;
    uid: string;
    ratePlanUid: string;
    offerName: string;
    anytime: number;
    cl1Supply: number;
    cl1Usage: number;
    cl2Supply: number;
    cl2Usage: number;
    demand: number;
    demandOp: number;
    demandP: number;
    demandS: number;
    fit: number;
    fitPeak: number;
    fitCritical: number;
    fitVpp: number;
    offPeak: number;
    peak: number;
    shoulder: number;
    supplyCharge: number;
    vppOrcharge: number;
    priceUnits?: Record<string, string>;
    dynamicRates?: DynamicRate[];
}

export interface DynamicRate {
    id: string;
    name: string;
    value: string;
    unitId: string;
    type: 'charges' | 'fit' | 'extra_charges' | 'extra_fit' | 'energy_rates' | 'vpp_charges' | 'supply_charges' | 'solar_fit' | 'controlled_load' | 'demand_charges';
}

export interface RatePlan {
    id: string;
    uid: string;
    codes: string;
    planId: string;
    dnsp: number;
    state: string;
    tariff: string;
    type: number;
    vpp: number;
    discountApplies: number;
    discountPercentage: number;
    offers?: RateOffer[];
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface Bonus {
    uid: string;
    name: string;
    description: string;
    amount?: number;
    contractTerm?: string;
    exitFee?: number;
}
