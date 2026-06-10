
import React from 'react';
import { cn } from '@/lib/utils';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import {
    ZapIcon,
    PlugIcon,
    Settings2Icon,
    ActivityIcon,
    InfoIcon,
} from '@/components/icons';
import { Tooltip } from '@/components/ui/Tooltip';

export interface RateDetailsViewProps {
    offer: any;
    discount: number;
    hasSolar: boolean;
    vpp: boolean;
    units?: Record<string, string>;
    isVppPlan: boolean;
    className?: string;
    planRatesJson?: string | null;
}

export const RateDetailsView = ({ offer, discount, hasSolar, vpp, units = {}, isVppPlan, className, planRatesJson }: RateDetailsViewProps) => {
    const getTooltipText = (label: string) => {
        const lower = (label || '').toLowerCase();
        if (lower.includes('discounted usage') || lower.includes('discounted rate')) return "First 10 kWh/day";
        if (lower.includes('standard usage') || lower.includes('standard rate')) return "After 10 kWh/day";
        if (lower.includes('premium feed-in tariff') || lower.includes('premium fit')) return "The first 10kWh exported between 5:00pm and 9:00pm";
        if (lower.includes('critical event bonus') || lower.includes('critical event')) return "When electricity cost is more than $1/kwh at AEMO and we trigger the batteries to discharge";
        if (lower.includes('zero evening')) return "If your grid import is effectively zero—defined as less than 0.03 kWh per hour from the grid, during the 5–8 pm evening peak every day.";
        if (lower.includes('base fit')) {
            return (
                <div className="space-y-1.5 text-[11px] leading-normal font-sans text-left text-white p-1">
                    <div className="font-bold border-b border-gray-700 pb-1 mb-1.5 uppercase tracking-wider text-xs">Base FIT</div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-400 font-medium">Standard Hours:</span>
                            <span className="font-semibold">5:00pm to 9:00pm</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-gray-700/50 pt-1">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-400 font-medium">Seasonal Bonus Hours:</span>
                            <span className="font-semibold">5:00am to 8:00am</span>
                        </div>
                        <span className="text-[10px] text-gray-400 italic text-right mt-0.5">(1 March to 31 August)</span>
                    </div>
                </div>
            );
        }
        if (lower === 'anytime') return "Flat usage rate charged at all times.";
        if (lower === 'peak') return "Usage rate charged during peak periods of high demand.";
        if (lower === 'shoulder') return "Usage rate charged during shoulder transition periods.";
        if (lower === 'off-peak') return "Usage rate charged during off-peak periods (typically overnight).";
        if (lower === 'supply' || lower === 'supply charge') return "Daily service charge for connection to the grid.";
        return null;
    };

    const renderLabelWithTooltip = (label: string, textClass?: string) => {
        const tooltipContent = getTooltipText(label);
        return (
            <div className={cn("text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center justify-center gap-1", textClass)}>
                <span>{label}</span>
                {tooltipContent && (
                    <Tooltip content={tooltipContent} position="top">
                        <span className="cursor-help opacity-70 hover:opacity-100 transition-opacity">
                            <InfoIcon size={10} />
                        </span>
                    </Tooltip>
                )}
            </div>
        );
    };

    const planRates: any[] = React.useMemo(() => {
        if (!planRatesJson) return [];
        if (typeof planRatesJson === 'object') {
            return Array.isArray(planRatesJson) ? planRatesJson : [];
        }
        try {
            return JSON.parse(planRatesJson);
        } catch {
            return [];
        }
    }, [planRatesJson]);

    const processItems = (items: any[], type: string) => {
        if (!planRates || planRates.length === 0) {
            return items.filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0);
        }

        const processed = items.map(item => {
            const matchingPlanRate = planRates.find((pr) => pr.name.toUpperCase() === item.label.toUpperCase());
            if (!matchingPlanRate) return null;
            if (matchingPlanRate.rateType === 'Fixed') {
                return { ...item, value: matchingPlanRate.rate, unitId: matchingPlanRate.unit };
            }
            if (matchingPlanRate.rateType === 'According to Tariff') {
                return item;
            }
            return null;
        }).filter(Boolean) as any[];

        const tariffLabels = items.map(i => i.label.toUpperCase());
        const fixedAdditions = planRates.filter(pr => (pr.dynamicType === type || (!pr.dynamicType && type === 'energy_rates')) && pr.rateType === 'Fixed' && !tariffLabels.includes(pr.name.toUpperCase()));
        
        fixedAdditions.forEach(fa => {
            processed.push({
                label: fa.name,
                name: fa.name,
                value: fa.rate,
                type: 'dynamic',
                unitId: fa.unit,
                applyDiscount: fa.applyDiscount !== false
            });
        });

        return processed.filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0);
    };
    const parsedDynamicRates = typeof offer.dynamicRates === 'string'
        ? (() => { try { return JSON.parse(offer.dynamicRates); } catch { return []; } })()
        : (offer.dynamicRates || []);

    const parsedPriceUnits: Record<string, string> = typeof offer.priceUnits === 'string'
        ? (() => { try { return JSON.parse(offer.priceUnits); } catch { return {}; } })()
        : (offer.priceUnits || {});

    const formatUnit = (key: string, fallback: string) => {
        const unitUid = parsedPriceUnits[key];
        const unit = unitUid ? (units[unitUid] || fallback) : fallback;
        return unit ? `/${unit}` : '';
    };

    const resolveUnit = (rateItem: any, typeKey: string, fallback: string) => {
        if (rateItem.unitId) {
            const name = units[rateItem.unitId] || rateItem.unitId;
            return name.startsWith('/') ? name : `/${name}`;
        }
        return formatUnit(typeKey, fallback);
    };

    // Column 1: Energy Rates Items
    const energyRatesItems = processItems([
        { label: 'Peak', value: offer.peak, type: 'peak', applyDiscount: true },
        { label: 'Off-Peak', value: offer.offPeak, type: 'offPeak', applyDiscount: true },
        { label: 'Shoulder', value: offer.shoulder, type: 'shoulder', applyDiscount: true },
        { label: 'Anytime', value: offer.anytime, type: 'anytime', applyDiscount: true },
        ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false }))
    ], 'energy_rates');

    // Supply Charges Items
    const supplyChargesItems = processItems([
        { label: 'Supply Charge', value: offer.supplyCharge, type: 'supplyCharge' },
        ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount }))
    ], 'supply_charges');

    // Demand Charges Items
    const demandChargesItems = processItems([
        { label: 'Demand', value: offer.demand, type: 'demand', applyDiscount: true },
        { label: 'Demand(Op)', value: offer.demandOp, type: 'demandOp', applyDiscount: true },
        { label: 'Demand(P)', value: offer.demandP, type: 'demandP', applyDiscount: true },
        { label: 'Demand(S)', value: offer.demandS, type: 'demandS', applyDiscount: true },
        ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false }))
    ], 'demand_charges');

    // VPP Orchestration Charges Items
    const vppChargesItems = processItems([
        { label: 'VPP Orchestration', value: offer.vppOrcharge, type: 'vppOrcharge', applyDiscount: false },
        ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: false }))
    ], 'vpp_charges');

    const hasColumn2 = supplyChargesItems.length > 0 || demandChargesItems.length > 0 || vppChargesItems.length > 0;

    // Solar FiT Items
    const hasFiTFlag = (offer.fit || 0) > 0 || 
                       (offer.fitPeak || 0) > 0 || 
                       (offer.fitCritical || 0) > 0 || 
                       (offer.fitVpp || 0) > 0 || 
                       parsedDynamicRates.some((r: any) => r.type === 'fit' || r.type === 'extra_fit' || r.type === 'solar_fit') ||
                       planRates.some((pr: any) => ['FEED-IN', 'PREMIUM FIT', 'CRITICAL EVENT FIT', 'BASE FIT'].includes(pr.name.toUpperCase()) && parseFloat(String(pr.rate || 0)) > 0);
    const rawSolarFitItems = !hasFiTFlag || !hasSolar ? [] : [
        { label: 'Feed-in', value: offer.fit, type: 'fit' },
        { label: 'PREMIUM FIT', value: offer.fitPeak, type: 'fitPeak' },
        { label: 'CRITICAL EVENT FIT', value: offer.fitCritical, type: 'fitCritical' },
        { label: 'BASE FIT', value: offer.fitVpp, type: 'fitVpp' },
        ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount }))
    ];
    const solarFitItems = processItems(rawSolarFitItems, 'solar_fit').filter(rate => {
        if (rate.type === 'fit') return !vpp;
        if (rate.type === 'dynamic') return true;
        return vpp;
    });

    // Controlled Load Items
    const hasCLFlag = (offer.cl1Usage || 0) > 0 || 
                      (offer.cl2Usage || 0) > 0 || 
                      (offer.cl1Supply || 0) > 0 || 
                      (offer.cl2Supply || 0) > 0 || 
                      parsedDynamicRates.some((r: any) => r.type === 'controlled_load') ||
                      planRates.some((pr: any) => ['CL1 SUPPLY', 'CL2 SUPPLY', 'CL1 USAGE', 'CL2 USAGE'].includes(pr.name.toUpperCase()) && parseFloat(String(pr.rate || 0)) > 0);
    const controlledLoadItems = processItems(!hasCLFlag ? [] : [
        { label: 'CL1 Usage', value: offer.cl1Usage, type: 'cl1_usage', applyDiscount: true },
        { label: 'CL2 Usage', value: offer.cl2Usage, type: 'cl2_usage', applyDiscount: true },
        { label: 'CL1 Supply', value: offer.cl1Supply, type: 'cl1_supply', applyDiscount: true },
        { label: 'CL2 Supply', value: offer.cl2Supply, type: 'cl2_supply', applyDiscount: true },
        ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false }))
    ], 'controlled_load');

    // Remaining dynamic rates
    const handledTypes = ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'];
    const remainingDynamicRates = parsedDynamicRates.filter((r: any) => !handledTypes.includes(r.type));

    const fitRates = processItems(remainingDynamicRates
        .filter((r: any) => r.type === 'fit' || r.type === 'extra_fit' || (!r.type && (vpp || isVppPlan)))
        .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount })), 'extra_fit');
    const chargeRates = processItems(remainingDynamicRates
        .filter((r: any) => r.type === 'charges' || r.type === 'extra_charges' || (!r.type && !(vpp || isVppPlan)))
        .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount })), 'extra_charges');

    const renderRatesColumn = (rates: any[], label: string, colorClass: string, icon: any = ActivityIcon) => {
        if (rates.length === 0) return null;
        const Icon = icon;
        return (
            <div className="space-y-2 min-w-[180px] flex-1">
                <div className={cn("flex items-center gap-2 mb-2",
                    colorClass === 'indigo' ? "text-indigo-500 dark:text-indigo-400" : "text-teal-500 dark:text-teal-400"
                )}>
                    <Icon size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                </div>
                <div className="space-y-2">
                    {rates.map((dRate: any, id: number) => {
                        const unitName = dRate.unitId ? units[dRate.unitId] : '';
                        const val = parseFloat(String(dRate.value || '0'));
                        return (
                            <div key={id} className={cn(
                                colorClass === 'indigo' ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800" : "bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800",
                                "rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm"
                            )}>
                                <div className={cn(colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400", "font-bold text-sm")}>
                                    ${val.toFixed(4)}{unitName ? `/${unitName}` : ''}
                                </div>
                                {renderLabelWithTooltip(dRate.name, colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={cn("p-5 bg-card border border-border rounded-xl", className)}>
            <h4 className="text-sm font-bold text-foreground mb-5">{offer.offerName || 'DEFAULT MARKET OFFER'}</h4>
            <div className="flex flex-wrap gap-5">
                {/* Column 1: Energy Rates */}
                {energyRatesItems.length > 0 && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-2">
                            <Settings2Icon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Energy Rates</span>
                        </div>
                        {[...energyRatesItems]
                            .sort((a, b) => calculateDiscountedRate(parseFloat(String(a.value || 0)), discount) - calculateDiscountedRate(parseFloat(String(b.value || 0)), discount))
                            .map((rate, idx) => {
                                const isAnytime = rate.type === 'anytime';
                                const numericValue = parseFloat(String(rate.value || 0));
                                const shouldApplyDiscount = rate.type === 'dynamic' ? !!(rate as any).applyDiscount : true;
                                const price = shouldApplyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                const unit = resolveUnit(rate, rate.type, 'kWh');
                                return (
                                    <div key={idx} className={cn(
                                        "border rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm",
                                        isAnytime ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                    )}>
                                        <div className={cn(
                                            "font-bold text-sm",
                                            isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                                        )}>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</div>
                                        {renderLabelWithTooltip(rate.label, isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400")}
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Column 2: Supply, Demand, VPP Charges */}
                {hasColumn2 && (
                    <div className="space-y-4 min-w-[180px] flex-1">
                        {/* Supply Charges Sub-block */}
                        {supplyChargesItems.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400 mb-2">
                                    <PlugIcon size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Supply Charges</span>
                                </div>
                                {supplyChargesItems.map((r: any, id: number) => {
                                    const unit = resolveUnit(r, 'supplyCharge', 'day');
                                    const numericValue = parseFloat(String(r.value || '0'));
                                    const price = r.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                    return (
                                        <div key={id} className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                            <div className="text-purple-600 dark:text-purple-400 font-bold text-sm">${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</div>
                                            {renderLabelWithTooltip(r.label, "text-purple-600 dark:text-purple-400")}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Demand Charges Sub-block */}
                        {demandChargesItems.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mb-2">
                                    <ActivityIcon size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Demand Charges</span>
                                </div>
                                {demandChargesItems.map((d: any, id: number) => {
                                    const typeKey = d.type === 'demand' ? 'demand' : d.type === 'demandOp' ? 'demandOp' : d.type === 'demandP' ? 'demandP' : d.type === 'demandS' ? 'demandS' : '';
                                    const unit = resolveUnit(d, typeKey, 'kVA/day');
                                    const numericValue = parseFloat(String(d.value || 0));
                                    const price = d.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                    return (
                                        <div key={id} className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                            <div className="text-rose-600 dark:text-rose-400 font-bold text-sm">${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</div>
                                            {renderLabelWithTooltip(d.label, "text-rose-600 dark:text-rose-400")}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* VPP Charges Sub-block */}
                        {vppChargesItems.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 mb-2">
                                    <ActivityIcon size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wide">VPP Orchestration Charges</span>
                                    {discount > 0 && vppChargesItems.some(r => r.applyDiscount) && (
                                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded-md uppercase tracking-tighter">Discount Applied</span>
                                    )}
                                </div>
                                {vppChargesItems.map((r: any, id: number) => {
                                    const unit = resolveUnit(r, 'vppOrcharge', 'day');
                                    const numericValue = parseFloat(String(r.value || '0'));
                                    const price = r.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                    return (
                                        <div key={id} className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                            <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                                                <div className="flex flex-col items-center">
                                                    <span>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</span>
                                                    {r.applyDiscount && discount > 0 && (
                                                        <div className="flex items-center gap-1.5 leading-none mt-0.5">
                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {renderLabelWithTooltip(r.label, "text-amber-600 dark:text-amber-400")}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Column 3: Solar FiT */}
                {solarFitItems.length > 0 && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-teal-500 dark:text-teal-400 mb-2">
                            <ZapIcon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Solar FiT</span>
                        </div>
                        {[...solarFitItems]
                            .sort((a, b) => (parseFloat(String(a.value || 0)) ?? 0) - (parseFloat(String(b.value || 0)) ?? 0))
                            .map((rate, idx) => {
                                const unit = resolveUnit(rate, rate.type, 'kWh');
                                const numericValue = parseFloat(String(rate.value || '0'));
                                const price = rate.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                return (
                                    <div key={idx} className="bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                        <div className="text-teal-800 dark:text-teal-300 font-bold text-sm">${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</div>
                                        {renderLabelWithTooltip(rate.label, "text-teal-800 dark:text-teal-300")}
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Column 4: Controlled Load */}
                {controlledLoadItems.length > 0 && (
                    <div className="space-y-2 min-w-[180px] flex-1">
                        <div className="flex items-center gap-2 text-green-500 dark:text-green-400 mb-2">
                            <PlugIcon size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">Controlled Load</span>
                        </div>
                        {controlledLoadItems.map((rate, idx) => {
                            const numericValue = parseFloat(String(rate.value || 0));
                            const isUsage = rate.type.endsWith('_usage') || (rate.type === 'dynamic' && !rate.label.toLowerCase().includes('supply'));
                            const shouldApplyDiscount = !!(rate as any).applyDiscount;
                            const price = shouldApplyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                            const unitStr = resolveUnit(rate, rate.type === 'cl1_usage' ? 'cl1Usage' : rate.type === 'cl2_usage' ? 'cl2Usage' : rate.type === 'cl1_supply' ? 'cl1Supply' : 'cl2Supply', isUsage ? 'kWh' : 'day');
                            return (
                                <div key={idx} className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm">
                                    <div className="text-green-600 dark:text-green-400 font-bold text-sm">${price.toFixed(4)}{unitStr.startsWith('/') ? unitStr : `/${unitStr}`}</div>
                                    {renderLabelWithTooltip(rate.label, "text-green-600 dark:text-green-400")}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Extra Charges / Extra FiT */}
                {renderRatesColumn(chargeRates, "Extra Charges", "indigo")}
                {renderRatesColumn(fitRates, "Extra FiT", "teal", ZapIcon)}
            </div>
        </div>
    );
};

export default RateDetailsView;
