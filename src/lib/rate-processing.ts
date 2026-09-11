/**
 * Centralized rate processing utility.
 *
 * Rules:
 * 1. Show rates which are NOT 0 (from rate/offer columns).
 * 2. If a plan is attached, rates come from planRatesJson.
 *    – "Fixed" → override value with planRate.rate
 *    – "According to Tariff" → keep the offer column value
 *    – "None" → hide the rate
 * 3. Don't display rates whose offer column is 0 unless plan explicitly
 *    marks them saveAsZero.
 * 4. Discount is applied based on the planRate.applyDiscount toggle.
 * 5. Dynamic/custom columns created in the plan are added if they belong
 *    to the current category and haven't already been processed.
 */

// ── Helpers ──────────────────────────────────────────────────────────

/** Normalize a label for comparison: strip whitespace/hyphens/underscores,
 *  uppercase. "ALL OTHER TIMES" → "ALLOTHERTIMES", "Supply Charge" → "SUPPLYCHARGE" */
function norm(s: string): string {
    return String(s || '').replace(/[\s\-_]+/g, '').toUpperCase();
}

/** Known aliases – groups of names that refer to the same rate column. */
const ALIAS_GROUPS: string[][] = [
    ['ANYTIME', 'ALLOTHERTIMES', 'USAGE', 'SINGLERATE'],
    ['SUPPLYCHARGE', 'SUPPLY'],
    ['FEEDIN', 'FEEDINTARIFF', 'FIT', 'SOLARFIT'],
    ['CL1SUPPLY'],
    ['CL1USAGE'],
    ['CL2SUPPLY'],
    ['CL2USAGE'],
    ['PEAK'],
    ['OFFPEAK'],
    ['SHOULDER'],
    ['DEMAND'],
    ['DEMANDOP', 'DEMAND(OP)'],
    ['DEMANDP', 'DEMAND(P)'],
    ['DEMANDS', 'DEMAND(S)'],
    ['VPPORCHESTRATION'],
];

/** Build a lookup from each normalized name → its alias group (Set). */
const _aliasMap = new Map<string, Set<string>>();
ALIAS_GROUPS.forEach(group => {
    const normGroup = group.map(norm);
    const set = new Set(normGroup);
    normGroup.forEach(n => _aliasMap.set(n, set));
});

/** Check if two labels are aliases of each other. */
function isAlias(a: string, b: string): boolean {
    const na = norm(a);
    const nb = norm(b);
    if (na === nb) return true;
    const group = _aliasMap.get(na);
    return group ? group.has(nb) : false;
}

/** Get all normalized aliases for a given label. */
function getAliases(label: string): string[] {
    const n = norm(label);
    const group = _aliasMap.get(n);
    return group ? Array.from(group) : [n];
}

// ── Category inference ──────────────────────────────────────────────

/** Standard type-category mapping keyed by (partial) name match. */
const TYPE_RULES: Array<{ test: (n: string) => boolean; type: string }> = [
    { test: n => n.includes('SUPPLY'), type: 'supply_charges' },
    { test: n => n.includes('DEMAND'), type: 'demand_charges' },
    { test: n => n.startsWith('CL1') || n.startsWith('CL2') || n.includes('CONTROLLED'), type: 'controlled_load' },
    { test: n => n.includes('FIT') || n.includes('FEEDIN') || n.includes('FEED-IN') || n.includes('FEED IN'), type: 'solar_fit' },
    { test: n => n.includes('VPP'), type: 'vpp_charges' },
];

/** Infer the category for a plan-rate entry.
 *  Name-based rules take priority over pr.dynamicType to avoid
 *  mis-categorisation (e.g. SUPPLY CHARGE stored with dynamicType "energy_rates"). */
export function getInferredType(pr: { name?: string; dynamicType?: string }): string {
    const nameUpper = String(pr.name || '').toUpperCase();
    for (const rule of TYPE_RULES) {
        if (rule.test(nameUpper)) return rule.type;
    }
    if (pr.dynamicType) return String(pr.dynamicType).toLowerCase().replace(/\s+/g, '_');
    return 'energy_rates';
}

// ── Standard label list (rates that come from offer columns) ────────

const STANDARD_LABELS = new Set([
    'SUPPLY CHARGE', 'ANYTIME', 'ALL OTHER TIMES', 'PEAK', 'SHOULDER', 'OFF-PEAK',
    'CL1 SUPPLY', 'CL1 USAGE', 'CL2 SUPPLY', 'CL2 USAGE',
    'DEMAND', 'DEMAND(OP)', 'DEMAND(P)', 'DEMAND(S)', 'DEMAND (OP)', 'DEMAND (P)', 'DEMAND (S)',
    'VPP ORCHESTRATION', 'FEED-IN', 'FEED-IN TARIFF', 'FIT',
    'PREMIUM FIT', 'CRITICAL EVENT FIT', 'BASE FIT',
]);

// ── Main processItems ───────────────────────────────────────────────

export interface RateItem {
    label: string;
    value?: any;
    type?: string;
    unitId?: string;
    applyDiscount?: boolean;
    description?: string;
    info?: string;
    isExplicitZero?: boolean;
    name?: string;
    [key: string]: any;
}

/**
 * Process rate items for a given category type.
 *
 * @param items      - Standard items derived from offer columns + dynamicRates.
 * @param type       - The category: 'energy_rates', 'supply_charges', etc.
 * @param planRates  - Parsed planRatesJson (filtered by DNSP if applicable).
 * @returns Processed rate items to render.
 */
export function processItems(
    items: RateItem[],
    type: string,
    planRates: any[]
): RateItem[] {
    // ── No plan attached → filter out zero/empty values and duplicate aliases ──
    if (!planRates || planRates.length === 0) {
        const seenNorms = new Set<string>();
        return items.filter(rate => {
            if (rate.value === undefined || rate.value === null || String(rate.value).trim() === '') return false;
            if (Number(rate.value) === 0) return false;
            const aliases = getAliases(rate.label);
            if (aliases.some(a => seenNorms.has(a))) return false;
            aliases.forEach(a => seenNorms.add(a));
            return true;
        });
    }

    // ── Track which plan-rate names we've already consumed ──
    const processedNorms = new Set<string>();

    /** Mark a label (and all its aliases) as processed. */
    const markProcessed = (label: string, planName?: string) => {
        for (const alias of getAliases(label)) processedNorms.add(alias);
        if (planName) {
            processedNorms.add(norm(planName));
            for (const alias of getAliases(planName)) processedNorms.add(alias);
        }
    };

    // ── Phase 1: Match each offer-column item to a plan-rate entry ──
    const processed: RateItem[] = [];

    for (const item of items) {
        // Skip if this label (or its alias) has already been processed
        if (processedNorms.has(norm(item.label))) continue;

        // Skip items with no value (unless dynamic)
        if (item.type !== 'dynamic') {
            if (item.value === undefined || item.value === null ||
                String(item.value).trim() === '' || Number(item.value) === 0) {
                continue;
            }
        }

        // Find matching plan-rate by alias comparison (skip already processed plan rates)
        const matchingPlanRate = planRates.find((pr: any) =>
            !processedNorms.has(norm(pr.name)) && isAlias(item.label, pr.name)
        );

        if (!matchingPlanRate) continue;

        markProcessed(item.label, matchingPlanRate.name);

        if (matchingPlanRate.rateType === 'Fixed') {
            processed.push({
                ...item,
                label: matchingPlanRate.name || item.label,
                value: matchingPlanRate.rate,
                unitId: matchingPlanRate.unit || item.unitId,
                applyDiscount: matchingPlanRate.applyDiscount,
                description: matchingPlanRate.info || matchingPlanRate.description || item.description || item.info,
                isExplicitZero: matchingPlanRate.saveAsZero === true &&
                    (matchingPlanRate.rate === 0 || matchingPlanRate.rate === '0'),
            });
        } else if (matchingPlanRate.rateType === 'According to Tariff') {
            processed.push({
                ...item,
                label: matchingPlanRate.name || item.label,
                applyDiscount: matchingPlanRate.applyDiscount,
                description: matchingPlanRate.info || matchingPlanRate.description || item.description || item.info,
            });
        }
        // rateType === 'None' → skip entirely
    }

    // ── Phase 2: Add custom/dynamic plan-rates not already consumed ──
    const targetType = String(type || '').toLowerCase().replace(/\s+/g, '_');

    for (const pr of planRates) {
        const inferredType = getInferredType(pr);
        const matchesType = inferredType === targetType ||
            (targetType === 'solar_fit' && (inferredType === 'fit' || inferredType === 'extra_fit'));

        if (!matchesType) continue;
        if (pr.rateType === 'None') continue;

        const normName = norm(pr.name);
        if (processedNorms.has(normName)) continue;

        // Check if this is a custom/dynamic rate or a standard rate not already
        // matched in Phase 1
        const isStandard = STANDARD_LABELS.has(pr.name.toUpperCase());
        const isCustom = pr.isDynamic || pr.isCustom || !isStandard;

        if (!isCustom) continue;

        markProcessed(pr.name);

        processed.push({
            label: pr.name,
            name: pr.name,
            value: pr.rate,
            type: 'dynamic',
            unitId: pr.unit,
            applyDiscount: pr.applyDiscount !== false,
            description: pr.info || pr.description,
            isExplicitZero: pr.saveAsZero === true && (pr.rate === 0 || pr.rate === '0'),
        });
    }

    // ── Phase 3: Final deduplication and zero-value filter ──
    const finalSeen = new Set<string>();
    return processed.filter(rate => {
        if (rate.value === undefined || rate.value === null || String(rate.value).trim() === '') return false;
        if (Number(rate.value) === 0 && !rate.isExplicitZero) return false;

        const key = norm(rate.label || rate.name || '');
        const aliases = getAliases(key);
        if (aliases.some(a => finalSeen.has(a))) return false;
        aliases.forEach(a => finalSeen.add(a));
        return true;
    });
}
