/**
 * GST Configuration & Application Rules Utility
 * Manages which rate types and columns have 10% GST applied vs GST-Free / Excluded.
 */

export interface GSTRule {
    key: string;
    label: string;
    description: string;
    appliesGst: boolean;
    category: 'type' | 'column';
}

export const DEFAULT_GST_RULES: Record<string, GSTRule> = {
    solar_fit: {
        key: 'solar_fit',
        label: 'Solar FIT',
        description: 'Feed-in tariff solar generation credits paid to customer',
        appliesGst: true,
        category: 'type'
    },
    extra_fit: {
        key: 'extra_fit',
        label: 'Extra FIT',
        description: 'Additional feed-in tariff credits and solar incentives',
        appliesGst: true,
        category: 'type'
    },
    energy_rates: {
        key: 'energy_rates',
        label: 'Energy Rates',
        description: 'Usage charges (Peak, Off-Peak, Shoulder, Anytime)',
        appliesGst: false,
        category: 'type'
    },
    supply_charges: {
        key: 'supply_charges',
        label: 'Supply Charges',
        description: 'Daily fixed supply/network service charges',
        appliesGst: false,
        category: 'type'
    },
    demand_charges: {
        key: 'demand_charges',
        label: 'Demand Charges',
        description: 'Peak capacity and demand charges (kVA/kW)',
        appliesGst: false,
        category: 'type'
    },
    controlled_load: {
        key: 'controlled_load',
        label: 'Controlled Load',
        description: 'Dedicated appliance usage & supply rates (CL1, CL2)',
        appliesGst: false,
        category: 'type'
    },
    vpp_charges: {
        key: 'vpp_charges',
        label: 'VPP Charges',
        description: 'Virtual Power Plant orchestration rates & fees',
        appliesGst: false,
        category: 'type'
    },
    extra_charges: {
        key: 'extra_charges',
        label: 'Extra Charges',
        description: 'Custom dynamic fee components and surcharges',
        appliesGst: false,
        category: 'type'
    }
};

const STORAGE_KEY = 'crm_gst_config_rules';

export function getGSTConfig(): Record<string, boolean> {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to parse GST config', e);
    }
    const defaults: Record<string, boolean> = {};
    Object.values(DEFAULT_GST_RULES).forEach(rule => {
        defaults[rule.key] = rule.appliesGst;
    });
    return defaults;
}

export function setGSTRule(key: string, appliesGst: boolean) {
    const config = getGSTConfig();
    config[key] = appliesGst;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        window.dispatchEvent(new Event('gst_config_updated'));
    } catch (e) {
        console.error('Failed to save GST rule', e);
    }
}

export function updateGSTConfigCache(rules: Array<{ key: string; appliesGst: boolean }>) {
    const config = getGSTConfig();
    rules.forEach(r => {
        config[r.key] = r.appliesGst;
    });
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        window.dispatchEvent(new Event('gst_config_updated'));
    } catch (e) {
        console.error('Failed to sync GST rules to local storage', e);
    }
}

export function resetGSTConfig() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('gst_config_updated'));
    } catch (e) {
        console.error('Failed to reset GST config', e);
    }
}

export function isGSTAppliedForType(type: string): boolean {
    const normalized = (type || '').toLowerCase().replace(/[\s\-_]+/g, '_');
    const config = getGSTConfig();
    if (normalized in config) {
        return config[normalized];
    }
    // Also check standard key without underscores
    const clean = (type || '').toLowerCase().replace(/[\s\-_]+/g, '');
    for (const key of Object.keys(config)) {
        if (key.replace(/_/g, '') === clean) {
            return config[key];
        }
    }
    if (normalized.includes('fit') || normalized.includes('feedin')) {
        return true;
    }
    return false;
}

export function isGSTAppliedForColumn(colName: string): boolean {
    const norm = (colName || '').toLowerCase().replace(/[\s\-_]+/g, '');
    const config = getGSTConfig();
    
    if (norm in config) return config[norm];

    if (norm.includes('fit') || norm.includes('feedin')) return isGSTAppliedForType('solar_fit');
    if (norm.includes('vpp')) return isGSTAppliedForType('vpp_charges');
    if (norm.includes('supply')) return isGSTAppliedForType('supply_charges');
    if (norm.includes('demand')) return isGSTAppliedForType('demand_charges');
    if (norm.startsWith('cl1') || norm.startsWith('cl2')) return isGSTAppliedForType('controlled_load');
    
    return isGSTAppliedForType('energy_rates');
}
