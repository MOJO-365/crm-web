
import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@apollo/client';
import { GET_COLUMN_METADATA } from '@/graphql';
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
    isDnspBased?: boolean;
    selectedDnsp?: string | number;
    showDiscountIndicator?: boolean;
}

export const RateDetailsView = ({ offer, discount, hasSolar, vpp, units = {}, isVppPlan, className, planRatesJson, isDnspBased, selectedDnsp, showDiscountIndicator = false }: RateDetailsViewProps) => {
    const { data: columnMetadataData } = useQuery(GET_COLUMN_METADATA, { fetchPolicy: 'cache-first' });

    const dynamicRateInfoMap = React.useMemo(() => {
        const map = new Map<string, string>();
        if (columnMetadataData?.getColumnMetadata) {
            columnMetadataData.getColumnMetadata.forEach((row: any) => {
                if (row.columnName && row.description) {
                    map.set(row.columnName.toUpperCase(), row.description);
                }
            });
        }
        return map;
    }, [columnMetadataData]);

    const getTooltipText = (label: string) => {
        return dynamicRateInfoMap.get((label || '').toUpperCase()) || "";
    };

    const renderLabelWithTooltip = (label: string, explicitTooltip?: React.ReactNode | string, textClass?: string) => {
        const tooltipContent = explicitTooltip || getTooltipText(label);
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
        let parsed = [];
        if (typeof planRatesJson === 'object') {
            parsed = Array.isArray(planRatesJson) ? planRatesJson : [];
        } else {
            try {
                parsed = JSON.parse(planRatesJson);
            } catch {
                parsed = [];
            }
        }
        
        if (isDnspBased && selectedDnsp !== undefined && selectedDnsp !== null) {
            return parsed.filter((r: any) => String(r.dnsp) === String(selectedDnsp));
        }
        return parsed;
    }, [planRatesJson, isDnspBased, selectedDnsp]);

    const processItems = (items: any[], type: string) => {
        if (!planRates || planRates.length === 0) {
            return items.filter(rate => rate.value !== undefined && rate.value !== null && String(rate.value).trim() !== '');
        }

        const processedLabels = new Set<string>();

        const processed = items.map(item => {
            if (item.type !== 'dynamic') {
                if (item.value === undefined || item.value === null || String(item.value).trim() === '') {
                    return null;
                }
            }

            const matchingPlanRate = planRates.find((pr) => {
                if (pr.name.toUpperCase() !== item.label.toUpperCase()) return false;
                if (item.type === 'dynamic') return true;
                return !pr.isDynamic && !pr.isCustom;
            });
            if (!matchingPlanRate) return null;

            if (matchingPlanRate.rateType === 'Fixed') {
                processedLabels.add(item.label.toUpperCase());
                return { ...item, value: matchingPlanRate.rate, unitId: matchingPlanRate.unit, description: matchingPlanRate.info || matchingPlanRate.description || item.description, applyDiscount: matchingPlanRate.applyDiscount };
            }
            if (matchingPlanRate.rateType === 'According to Tariff') {
                processedLabels.add(item.label.toUpperCase());
                return { ...item, description: matchingPlanRate.info || matchingPlanRate.description || item.description, applyDiscount: matchingPlanRate.applyDiscount };
            }
            return null;
        }).filter(Boolean) as any[];

        const fixedAdditions = planRates.filter(pr => {
            const prDynType = String(pr.dynamicType || '').toLowerCase().replace(/\s+/g, '_');
            const targetType = String(type || '').toLowerCase().replace(/\s+/g, '_');
            const matchesType = (prDynType === targetType || (!prDynType && targetType === 'energy_rates'));
            
            const isStandardLabel = ['SUPPLY CHARGE', 'ANYTIME', 'PEAK', 'SHOULDER', 'OFF-PEAK', 'CL1 SUPPLY', 'CL1 USAGE', 'CL2 SUPPLY', 'CL2 USAGE', 'DEMAND', 'DEMAND(OP)', 'DEMAND(P)', 'DEMAND(S)'].includes(pr.name.toUpperCase());
            const isCustom = pr.isDynamic || pr.isCustom || !isStandardLabel;

            return matchesType && 
                   pr.rateType !== 'None' && 
                   isCustom &&
                   !processedLabels.has(pr.name.toUpperCase());
        });
        
        fixedAdditions.forEach(fa => {
            processed.push({
                label: fa.name,
                name: fa.name,
                value: fa.rate,
                type: 'dynamic',
                unitId: fa.unit,
                applyDiscount: fa.applyDiscount !== false,
                description: fa.info || fa.description
            });
        });

        return processed.filter(rate => rate.value !== undefined && rate.value !== null && String(rate.value).trim() !== '');
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
        ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false, description: r.description || r.info }))
    ], 'energy_rates');

    // Supply Charges Items
    const supplyChargesItems = processItems([
        { label: 'Supply Charge', value: offer.supplyCharge, type: 'supplyCharge' },
        ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount, description: r.description || r.info }))
    ], 'supply_charges');

    // Demand Charges Items
    const demandChargesItems = processItems([
        { label: 'Demand', value: offer.demand, type: 'demand', applyDiscount: true },
        { label: 'Demand(Op)', value: offer.demandOp, type: 'demandOp', applyDiscount: true },
        { label: 'Demand(P)', value: offer.demandP, type: 'demandP', applyDiscount: true },
        { label: 'Demand(S)', value: offer.demandS, type: 'demandS', applyDiscount: true },
        ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false, description: r.description || r.info }))
    ], 'demand_charges');

    // VPP Orchestration Charges Items
    const vppChargesItems = processItems([
        { label: 'VPP Orchestration', value: offer.vppOrcharge, type: 'vppOrcharge', applyDiscount: false },
        ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: false, description: r.description || r.info }))
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
        ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount, description: r.description || r.info }))
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
        ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false, description: r.description || r.info }))
    ], 'controlled_load');

    // Remaining dynamic rates
    const handledTypes = ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'];
    const remainingDynamicRates = parsedDynamicRates.filter((r: any) => !handledTypes.includes(r.type));

    const fitRates = processItems(remainingDynamicRates
        .filter((r: any) => r.type === 'fit' || r.type === 'extra_fit' || (!r.type && (vpp || isVppPlan)))
        .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info })), 'extra_fit');
    const chargeRates = processItems(remainingDynamicRates
        .filter((r: any) => r.type === 'charges' || r.type === 'extra_charges' || (!r.type && !(vpp || isVppPlan)))
        .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info })), 'extra_charges');

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
                        const price = dRate.applyDiscount ? calculateDiscountedRate(val, discount) : val;
                        return (
                            <div key={id} className={cn(
                                colorClass === 'indigo' ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800" : "bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800",
                                "rounded-lg p-3 text-center transition-all duration-200 hover:shadow-sm"
                            )}>
                                <div className={cn(colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400", "font-bold text-sm")}>
                                    <div className="flex flex-col items-center">
                                        <span>${price.toFixed(4)}{unitName ? `/${unitName}` : ''}</span>
                                        {showDiscountIndicator && dRate.applyDiscount && discount > 0 && (
                                            <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                <span className="text-[10px] font-medium line-through opacity-40">${val.toFixed(4)}</span>
                                                <span className={cn("px-1 py-0.5 text-[8px] font-black text-white rounded uppercase tracking-tighter", colorClass === 'indigo' ? "bg-indigo-500" : "bg-teal-500")}>-{discount}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {renderLabelWithTooltip(dRate.name, dRate.description, colorClass === 'indigo' ? "text-indigo-600 dark:text-indigo-400" : "text-teal-600 dark:text-teal-400")}
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
                                const shouldApplyDiscount = !!(rate as any).applyDiscount;
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
                                        )}>
                                            <div className="flex flex-col items-center">
                                                <span>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</span>
                                                {showDiscountIndicator && shouldApplyDiscount && discount > 0 && (
                                                    <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                        <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                        <span className={cn("px-1 py-0.5 text-[8px] font-black text-white rounded uppercase tracking-tighter", isAnytime ? "bg-orange-500" : "bg-blue-500")}>-{discount}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {renderLabelWithTooltip(rate.label, rate.description, isAnytime ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400")}
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
                                            <div className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                                                <div className="flex flex-col items-center">
                                                    <span>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</span>
                                                    {showDiscountIndicator && r.applyDiscount && discount > 0 && (
                                                        <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-purple-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {renderLabelWithTooltip(r.label, r.description, "text-purple-600 dark:text-purple-400")}
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
                                            <div className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                                                <div className="flex flex-col items-center">
                                                    <span>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</span>
                                                    {showDiscountIndicator && d.applyDiscount && discount > 0 && (
                                                        <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-rose-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {renderLabelWithTooltip(d.label, d.description, "text-rose-600 dark:text-rose-400")}
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
                                                    {showDiscountIndicator && r.applyDiscount && discount > 0 && (
                                                        <div className="flex items-center gap-1.5 leading-none mt-0.5">
                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {renderLabelWithTooltip(r.label, r.description, "text-amber-600 dark:text-amber-400")}
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
                                        <div className="text-teal-800 dark:text-teal-300 font-bold text-sm">
                                            <div className="flex flex-col items-center">
                                                <span>${price.toFixed(4)}{unit.startsWith('/') ? unit : `/${unit}`}</span>
                                                {showDiscountIndicator && rate.applyDiscount && discount > 0 && (
                                                    <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                        <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                        <span className="px-1 py-0.5 text-[8px] font-black bg-teal-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {renderLabelWithTooltip(rate.label, rate.description, "text-teal-800 dark:text-teal-300")}
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
                                    <div className="text-green-600 dark:text-green-400 font-bold text-sm">
                                        <div className="flex flex-col items-center">
                                            <span>${price.toFixed(4)}{unitStr.startsWith('/') ? unitStr : `/${unitStr}`}</span>
                                            {showDiscountIndicator && shouldApplyDiscount && discount > 0 && (
                                                <div className="flex items-center justify-center gap-1.5 leading-none mt-0.5">
                                                    <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                    <span className="px-1 py-0.5 text-[8px] font-black bg-green-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {renderLabelWithTooltip(rate.label, rate.description, "text-green-600 dark:text-green-400")}
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
