import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_BONUSES } from '@/graphql/queries/bonus';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { ZapIcon, InfoIcon, PhoneIcon, MailIcon } from '@/components/icons';
import { CustomerViewLayout } from './CustomerViewLayout';

interface RatesStepProps {
    ratesLoading: boolean;
    mainOffer: any;
    tariffCode: string;
    ratePlan: any;
    payload: any;
    customer?: any;
    measurementUnits?: any[];
    onBack: () => void;
    onNext: () => void;
}

export const RatesStep: React.FC<RatesStepProps> = ({
    ratesLoading,
    mainOffer,
    tariffCode,
    ratePlan,
    payload,
    customer,
    measurementUnits,
    onBack,
    onNext
}) => {
    const [hoveredTooltip, setHoveredTooltip] = React.useState<{ text: React.ReactNode; x: number; y: number; position: 'right' | 'left' | 'top' | 'bottom' } | null>(null);
    const { data: bonusesData } = useQuery(GET_ALL_BONUSES);
    const allBonuses = bonusesData?.bonuses || [];
    const unitMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        measurementUnits?.forEach((u: any) => {
            map[u.uid] = u.name;
        });
        return map;
    }, [measurementUnits]);

    const discount = parseFloat(String(payload?.discount ?? customer?.discount ?? customer?.plan?.discount ?? 0));

    const parsedPriceUnits: Record<string, string> = typeof mainOffer?.priceUnits === 'string'
        ? (() => { try { return JSON.parse(mainOffer.priceUnits); } catch { return {}; } })()
        : (mainOffer?.priceUnits || {});

    const parsedDynamicRates = typeof mainOffer?.dynamicRates === 'string'
        ? (() => { try { return JSON.parse(mainOffer.dynamicRates); } catch { return []; } })()
        : (mainOffer?.dynamicRates || []);

    const planRates = React.useMemo(() => {
        const planRatesJson = customer?.plan?.ratesJson;
        if (!planRatesJson) return [];
        if (typeof planRatesJson === 'object') {
            return Array.isArray(planRatesJson) ? planRatesJson : [];
        }
        try {
            return JSON.parse(planRatesJson);
        } catch {
            return [];
        }
    }, [customer?.plan?.ratesJson]);

    const processItems = React.useCallback((items: any[], type: string) => {
        if (!planRates || planRates.length === 0) {
            return items.filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0);
        }

        const processed = items.map(item => {
            const matchingPlanRate = planRates.find((pr: any) => pr.name.replace(/\s+/g, '').toUpperCase() === item.label.replace(/\s+/g, '').toUpperCase());
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
        const fixedAdditions = planRates.filter((pr: any) => (pr.dynamicType === type || (!pr.dynamicType && type === 'energy_rates')) && pr.rateType === 'Fixed' && !tariffLabels.includes(pr.name.toUpperCase()));

        fixedAdditions.forEach((fa: any) => {
            processed.push({
                label: fa.name,
                value: fa.rate,
                type: 'dynamic',
                unitId: fa.unit,
                applyDiscount: false
            });
        });

        return processed.filter(rate => (parseFloat(String(rate.value || 0)) ?? 0) > 0);
    }, [planRates]);

    const formatUnit = (key: string, fallback: string) => {
        const unitUid = parsedPriceUnits[key];
        const unit = unitUid ? (unitMap[unitUid] || fallback) : fallback;
        return unit ? `/${unit}` : '';
    };

    const hasCL = (mainOffer?.cl1Usage || 0) > 0 ||
        (mainOffer?.cl2Usage || 0) > 0 ||
        (mainOffer?.cl1Supply || 0) > 0 ||
        (mainOffer?.cl2Supply || 0) > 0 ||
        parsedDynamicRates.some((r: any) => r.type === 'controlled_load') ||
        planRates.some((pr: any) => ['CL1 SUPPLY', 'CL2 SUPPLY', 'CL1 USAGE', 'CL2 USAGE'].includes(pr.name.toUpperCase()) && parseFloat(String(pr.rate || 0)) > 0);
    const hasFiTRates = (mainOffer?.fit || 0) > 0 ||
        (mainOffer?.fitPeak || 0) > 0 ||
        (mainOffer?.fitCritical || 0) > 0 ||
        (mainOffer?.fitVpp || 0) > 0 ||
        parsedDynamicRates.some((r: any) => r.type === 'fit' || r.type === 'extra_fit' || r.type === 'solar_fit') ||
        planRates.some((pr: any) => ['FEED-IN', 'PREMIUM FIT', 'CRITICAL EVENT FIT', 'BASE FIT'].includes(pr.name.toUpperCase()) && parseFloat(String(pr.rate || 0)) > 0);
    const hasSolar = customer?.solarDetails?.hassolar === 1;
    const hasFiT = hasFiTRates && hasSolar; const energyRatesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Anytime', value: mainOffer.anytime, type: 'anytime' },
            { label: 'Peak', value: mainOffer.peak, type: 'peak' },
            { label: 'Shoulder', value: mainOffer.shoulder, type: 'shoulder' },
            { label: 'Off-Peak', value: mainOffer.offPeak, type: 'offPeak' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId }))
        ], 'energy_rates');
    }, [mainOffer, parsedDynamicRates, processItems]); const supplyChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Supply', value: mainOffer.supplyCharge, type: 'supplyCharge' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ], 'supply_charges');
    }, [mainOffer, parsedDynamicRates, processItems]); const demandChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Demand', value: mainOffer.demand, type: 'demand' },
            { label: 'Demand(Op)', value: mainOffer.demandOp, type: 'demandOp' },
            { label: 'Demand(P)', value: mainOffer.demandP, type: 'demandP' },
            { label: 'Demand(S)', value: mainOffer.demandS, type: 'demandS' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ], 'demand_charges');
    }, [mainOffer, parsedDynamicRates, processItems]); const vppChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Orchestration', value: mainOffer.vppOrcharge, type: 'vppOrcharge', applyDiscount: true },
            ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ], 'vpp_charges');
    }, [mainOffer, parsedDynamicRates, processItems]); const solarFitItems = React.useMemo(() => {
        if (!mainOffer || !hasFiT) return [];
        return processItems([
            { label: 'Feed-in', value: mainOffer.fit, type: 'fit' },
            { label: 'PREMIUM FIT', value: mainOffer.fitPeak, type: 'fitPeak' },
            { label: 'CRITICAL EVENT FIT', value: mainOffer.fitCritical, type: 'fitCritical' },
            { label: 'BASE FIT', value: mainOffer.fitVpp, type: 'fitVpp' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ], 'solar_fit').filter(rate => {
            const numericValue = parseFloat(String(rate.value || 0));
            if (numericValue <= 0) return false;
            const isVppActive = customer?.vppDetails?.vpp === 1 || ratePlan?.vpp === 1;
            if (rate.type === 'fit') return !isVppActive;
            return isVppActive;
        });
    }, [mainOffer, parsedDynamicRates, hasFiT, customer, ratePlan, processItems]);

    const handledTypes = React.useMemo(() => ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'], []);

    const extraFitItems = React.useMemo(() => {
        if (!mainOffer) return [];
        const items = parsedDynamicRates
            .filter((r: any) => (r.type === 'fit' || r.type === 'extra_fit') && !handledTypes.includes(r.type))
            .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }));
        return processItems(items, 'extra_fit');
    }, [mainOffer, parsedDynamicRates, handledTypes, processItems]); const controlledLoadItems = React.useMemo(() => {
        if (!mainOffer || !hasCL) return [];
        return processItems([
            { label: 'CL1 Usage', value: mainOffer.cl1Usage, type: 'cl1_usage' },
            { label: 'CL2 Usage', value: mainOffer.cl2Usage, type: 'cl2_usage' },
            { label: 'CL1 Supply', value: mainOffer.cl1Supply, type: 'cl1_supply' },
            { label: 'CL2 Supply', value: mainOffer.cl2Supply, type: 'cl2_supply' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ], 'controlled_load');
    }, [mainOffer, parsedDynamicRates, hasCL, processItems]);

    const extraChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        const handledAll = [...handledTypes, 'fit', 'extra_fit'];
        const items = parsedDynamicRates
            .filter((r: any) => !handledAll.includes(r.type) && (!r.type || r.type === 'charges' || r.type === 'extra_charges'))
            .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }));
        return processItems(items, 'extra_charges');
    }, [mainOffer, parsedDynamicRates, handledTypes, processItems]);

    const processedRateItems = React.useMemo(() => {
        const items: Array<{ category: string; item: any; fallbackUnit: string; isUsageOverride?: boolean }> = [];
        energyRatesItems.forEach((item: any) => items.push({ category: 'Energy Rates', item, fallbackUnit: '/kWh' }));
        supplyChargesItems.forEach((item: any) => items.push({ category: 'Supply Charges', item, fallbackUnit: '/day' }));
        demandChargesItems.forEach((item: any) => items.push({ category: 'Demand Charges', item, fallbackUnit: '/kVA/day' }));
        vppChargesItems.forEach((item: any) => items.push({ category: 'VPP Charges', item, fallbackUnit: '/day' }));
        solarFitItems.forEach((item: any) => items.push({ category: 'Solar FIT', item, fallbackUnit: '/kWh' }));
        extraFitItems.forEach((item: any) => items.push({ category: 'Extra FIT', item, fallbackUnit: '/kWh' }));
        controlledLoadItems.forEach((item: any) => items.push({ category: 'Controlled Load', item, fallbackUnit: item.type?.includes('usage') ? '/kWh' : '/day', isUsageOverride: item.type?.includes('usage') }));
        extraChargesItems.forEach((item: any) => items.push({ category: 'Extra Charges', item, fallbackUnit: '' }));

        return items.map(({ category, item, fallbackUnit }) => {
            const numericValue = parseFloat(String(item.value || '0'));

            let applyDiscount = false;
            if (item.applyDiscount !== undefined) {
                applyDiscount = !!item.applyDiscount;
            } else if (category === 'Energy Rates' || category === 'Demand Charges' || category === 'Controlled Load') {
                applyDiscount = true;
            }

            const isDiscounted = applyDiscount && discount > 0;
            const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;

            let unit = '';
            if (item.unitId) {
                const resolvedUnitName = unitMap[item.unitId] || item.unitId;
                unit = resolvedUnitName.startsWith('/') ? resolvedUnitName : `/${resolvedUnitName}`;
            } else if (item.type === 'dynamic') {
                unit = fallbackUnit;
            } else {
                const formatKey = item.type?.startsWith('demand') ? item.type : (item.type === 'vppOrcharge' ? 'vppOrcharge' : item.type);
                unit = formatUnit(formatKey, fallbackUnit.replace('/', ''));
                if (!unit) unit = fallbackUnit;
            }
            if (unit && !unit.startsWith('/')) unit = '/' + unit;

            const tooltipText = (() => {
                const lower = (item.label || item.name || '').toLowerCase();
                if (lower.includes('discounted usage') || lower.includes('discounted rate')) return "First 10 kWh/day";
                if (lower.includes('standard usage') || lower.includes('standard rate')) return "After 10 kWh/day";
                if (lower.includes('premium feed-in tariff') || lower.includes('premium fit')) return "The first 10kWh exported between 5:00pm and 9:00pm";
                if (lower.includes('critical event bonus') || lower.includes('critical event')) return "When electricity cost is more than $1/kwh at AEMO and we trigger the batteries to discharge";
                if (lower.includes('zero evening')) return "If your grid import is effectively zero—defined as less than 0.03 kWh per hour from the grid, during the 5–8 pm evening peak every day.";
                if (lower.includes('base fit')) {
                    return (
                        <div className="space-y-1.5 text-[11px] leading-normal font-sans text-left">
                            <div className="font-bold text-slate-100 border-b border-slate-700 pb-1 mb-1.5 uppercase tracking-wider text-xs">Base FIT</div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-slate-400 font-medium">Standard Hours:</span>
                                    <span className="font-semibold text-slate-200">5:00pm to 9:00pm</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5 border-t border-slate-800/50 pt-1">
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-slate-400 font-medium">Seasonal Bonus Hours:</span>
                                    <span className="font-semibold text-slate-200 font-sans">5:00am to 8:00am</span>
                                </div>
                                <span className="text-[10px] text-slate-400 italic text-right mt-0.5 font-sans">(1 March to 31 August)</span>
                            </div>
                        </div>
                    );
                }
                return null;
            })();

            return {
                category,
                label: item.label || item.name,
                numericValue,
                isDiscounted,
                price,
                unit,
                tooltipText
            };
        });
    }, [energyRatesItems, supplyChargesItems, demandChargesItems, vppChargesItems, solarFitItems, extraFitItems, controlledLoadItems, extraChargesItems, discount, unitMap, parsedPriceUnits]);

    const activeBonusesList = React.useMemo(() => {
        const list: Array<{ name: string; description: string; displayValue: string }> = [];

        // 1. VPP Signup Bonus
        if (customer?.vppDetails?.vppSignupBonus) {
            const signupBonusAmount = parseFloat(String(customer.vppDetails.vppSignupBonus));
            if (signupBonusAmount > 0) {
                const displayVal = signupBonusAmount === 600 ? '$50.00/month' : `$${signupBonusAmount.toFixed(2)}`;
                const desc = signupBonusAmount === 600
                    ? '$50 monthly bill credit for 12 months (total $600)'
                    : `$${signupBonusAmount.toFixed(2)} signup bonus credit`;

                list.push({
                    name: 'VPP Signup Bonus',
                    description: desc,
                    displayValue: displayVal
                });
            }
        }

        // 2. Selected Bonuses
        if (customer?.selectedBonuses && customer.selectedBonuses.length > 0) {
            customer.selectedBonuses.forEach((bonusUid: string) => {
                const b = allBonuses.find((bonus: any) => bonus.uid === bonusUid);
                if (b) {
                    const amount = parseFloat(String(b.amount || 0));
                    const displayVal = amount > 0 ? `$${amount.toFixed(2)}` : 'Free / Bonus';
                    list.push({
                        name: b.name,
                        description: b.description || `${b.name} bonus credit`,
                        displayValue: displayVal
                    });
                }
            });
        }

        return list;
    }, [customer, allBonuses]);

    const handleMouseEnterTooltip = (tooltipText: React.ReactNode, e: React.MouseEvent) => {
        if (!tooltipText) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipWidth = 256; // w-64 is 256px
        const padding = 16;
        const viewportWidth = window.innerWidth;

        let x = rect.right + 8;
        let position: 'right' | 'left' | 'top' | 'bottom' = 'right';

        if (x + tooltipWidth > viewportWidth - padding) {
            const leftX = rect.left - tooltipWidth - 8;
            if (leftX > padding) {
                x = leftX;
                position = 'left';
            } else {
                if (rect.top < 150) {
                    position = 'bottom';
                    x = Math.max(padding, Math.min(viewportWidth - tooltipWidth - padding, rect.left + rect.width / 2 - tooltipWidth / 2));
                } else {
                    position = 'top';
                    x = Math.max(padding, Math.min(viewportWidth - tooltipWidth - padding, rect.left + rect.width / 2 - tooltipWidth / 2));
                }
            }
        }

        const y = position === 'top'
            ? rect.top - 8
            : position === 'bottom'
                ? rect.bottom + 8
                : rect.top + rect.height / 2;

        setHoveredTooltip({
            text: tooltipText,
            x,
            y,
            position
        });
    };

    const handleMouseLeaveTooltip = () => {
        setHoveredTooltip(null);
    };

    return (
        <>
            <CustomerViewLayout
                title="Your Energy Rates"
                onBack={onBack}
                footerButtonLabel={mainOffer ? "Next" : undefined}
                onFooterButtonClick={onNext}
            >
                {ratesLoading ? (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-12 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                        <p className="text-sm text-muted-foreground font-medium">Loading your plan details...</p>
                    </div>
                ) : mainOffer ? (
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="bg-white px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <ZapIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold text-foreground tracking-tight">Rate Plan Details</h3>
                                        <p className="text-xs text-muted-foreground">Energy rate plan & offers</p>
                                    </div>
                                </div>
                                {/* <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-muted text-muted-foreground rounded-lg">DNSP: {DNSP_LABELS[ratePlan?.dnsp as keyof typeof DNSP_LABELS] || 'Unknown'}</span>
                                {customer?.rateVersion && (
                                    <div className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                                        Ver: {customer.rateVersion}
                                    </div>
                                )}
                                {customer?.vppDetails?.vpp === 1 && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg">VPP Active</span>
                                )}
                            </div> */}
                            </div>

                            <div className="p-0">
                                {/* Desktop Table View */}
                                <div className="overflow-x-auto hidden md:block">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <th className="px-4 py-3 font-semibold">DETAILS</th>
                                                <th className="px-4 py-3 font-semibold">CATEGORY</th>
                                                <th className="px-4 py-3 text-right font-semibold">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {processedRateItems.map((rate) => (
                                                <tr key={`${rate.category}-${rate.label}`} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 uppercase">
                                                        <div className="flex items-center gap-1.5 relative group w-max">
                                                            <span>{rate.label}</span>
                                                            {rate.tooltipText && (
                                                                <div
                                                                    className="text-slate-400 cursor-help"
                                                                    onMouseEnter={(e) => handleMouseEnterTooltip(rate.tooltipText, e)}
                                                                    onMouseLeave={handleMouseLeaveTooltip}
                                                                >
                                                                    <InfoIcon size={14} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{rate.category}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-semibold text-slate-900 whitespace-nowrap">
                                                        ${rate.price.toFixed(4)}{rate.unit}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card List View (No scroll) */}
                                <div className="block md:hidden divide-y divide-slate-100 bg-white">
                                    {processedRateItems.map((rate) => (
                                        <div key={`${rate.category}-${rate.label}`} className="p-4 hover:bg-slate-50/50 transition-colors space-y-2">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1 text-left">
                                                    <div className="flex items-center gap-1.5 relative group w-max">
                                                        <span className="text-sm font-bold text-slate-900 uppercase">{rate.label}</span>
                                                        {rate.tooltipText && (
                                                            <div
                                                                className="text-slate-400 cursor-help animate-pulse"
                                                                onMouseEnter={(e) => handleMouseEnterTooltip(rate.tooltipText, e)}
                                                                onMouseLeave={handleMouseLeaveTooltip}
                                                                onClick={(e) => { e.stopPropagation(); handleMouseEnterTooltip(rate.tooltipText, e); }}
                                                            >
                                                                <InfoIcon size={14} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-full">{rate.category}</span>
                                                </div>
                                                <div className="text-right space-y-0.5 shrink-0">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        ${rate.price.toFixed(4)}{rate.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {activeBonusesList.length > 0 && (
                                <div className="border-t border-border bg-slate-100 px-5 py-4 space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Benefits</h4>
                                    <div className="space-y-3">
                                        {activeBonusesList.map((bonus, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                                <div className="space-y-0.5 text-left">
                                                    <span className="font-semibold text-slate-700">{bonus.name}</span>
                                                    <p className="text-xs text-slate-500">{bonus.description}</p>
                                                </div>
                                                <span className="font-bold text-emerald-600 shrink-0 ml-4">-{bonus.displayValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="px-5 py-3 bg-muted/50 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    All rates are inclusive of GST. Controlled load rates apply to separately metered appliances.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                            <InfoIcon className="w-5 h-5 text-blue-500 flex-none" />
                            <p className="text-sm font-medium text-blue-800 leading-relaxed text-left">
                                Please review the <a href="https://gee.com.au/virtual-power-plant-customer-charter-terms-and-conditions-v1.2" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 transition-colors">Virtual Power Plant Customer Charter Terms and Conditions</a> which apply to this plan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
                        <InfoIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <h2 className="text-lg font-bold text-foreground mb-1">No Rates Available</h2>
                        <p className="text-sm text-muted-foreground">No details for tariff: <span className="font-bold text-foreground">{tariffCode}</span></p>
                    </div>
                )}

                <div className="text-center pt-2 pb-4">
                    <p className="text-xs text-muted-foreground mb-3">Need help?</p>
                    <div className="flex justify-center gap-3">
                        <a href="tel:1300707042" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                            <PhoneIcon size={14} className="text-green-500" />
                            1300 707 042
                        </a>
                        <a href="mailto:customerservice@gee.com.au" className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground font-medium hover:shadow-sm transition-all">
                            <MailIcon size={14} className="text-green-500" />
                            Email
                        </a>
                    </div>
                </div>
            </CustomerViewLayout>
            {hoveredTooltip && (
                <div
                    className="fixed w-64 p-2.5 bg-slate-800 text-white text-xs rounded shadow-lg z-[9999] normal-case font-normal leading-relaxed pointer-events-none"
                    style={{
                        left: `${hoveredTooltip.x}px`,
                        top: `${hoveredTooltip.y}px`,
                        transform: hoveredTooltip.position === 'top'
                            ? 'translateY(-100%)'
                            : hoveredTooltip.position === 'bottom'
                                ? 'none'
                                : 'translateY(-50%)'
                    }}
                >
                    {hoveredTooltip.text}
                    {hoveredTooltip.position === 'right' && (
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
                    )}
                    {hoveredTooltip.position === 'left' && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-slate-800"></div>
                    )}
                    {hoveredTooltip.position === 'top' && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                    )}
                    {hoveredTooltip.position === 'bottom' && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
                    )}
                </div>
            )}
        </>
    );
};
