import React from 'react';
import { cn } from '@/lib/utils';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { ZapIcon, Settings2Icon, PlugIcon, ActivityIcon, InfoIcon, PhoneIcon, MailIcon } from '@/components/icons';
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
    const unitMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        measurementUnits?.forEach((u: any) => {
            map[u.uid] = u.name;
        });
        return map;
    }, [measurementUnits]);

    const discount = parseFloat(payload.discount || 0);

    const parsedPriceUnits: Record<string, string> = typeof mainOffer?.priceUnits === 'string'
        ? (() => { try { return JSON.parse(mainOffer.priceUnits); } catch { return {}; } })()
        : (mainOffer?.priceUnits || {});

    const parsedDynamicRates = typeof mainOffer?.dynamicRates === 'string'
        ? (() => { try { return JSON.parse(mainOffer.dynamicRates); } catch { return []; } })()
        : (mainOffer?.dynamicRates || []);

    const formatUnit = (key: string, fallback: string) => {
        const unitUid = parsedPriceUnits[key];
        const unit = unitUid ? (unitMap[unitUid] || fallback) : fallback;
        return unit ? `/${unit}` : '';
    };

    const hasCL = (mainOffer?.cl1Usage || 0) > 0 || (mainOffer?.cl2Usage || 0) > 0 || (mainOffer?.cl1Supply || 0) > 0 || (mainOffer?.cl2Supply || 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'controlled_load');
    const hasFiT = ((mainOffer?.fit || 0) > 0 || (mainOffer?.fitPeak || 0) > 0 || (mainOffer?.fitCritical || 0) > 0 || (mainOffer?.fitVpp || 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'fit' || r.type === 'extra_fit' || r.type === 'solar_fit')) && customer?.solarDetails?.hassolar === 1;

    return (
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

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Column 1: Energy Rates */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <Settings2Icon size={16} />
                                        <h4 className="text-sm font-bold uppercase tracking-wide">Energy Rates</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Anytime', value: mainOffer.anytime, type: 'anytime' },
                                            { label: 'Peak', value: mainOffer.peak, type: 'peak' },
                                            { label: 'Shoulder', value: mainOffer.shoulder, type: 'shoulder' },
                                            { label: 'Off-Peak', value: mainOffer.offPeak, type: 'offPeak' },
                                            ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId }))
                                        ]
                                            .filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0)
                                            .sort((a, b) => calculateDiscountedRate(parseFloat(String(a.value || 0)), discount) - calculateDiscountedRate(parseFloat(String(b.value || 0)), discount))
                                            .map((r: any, i: number) => {
                                                const isAnytime = r.type === 'anytime';
                                                const numericValue = parseFloat(String(r.value || 0));
                                                const isDiscounted = discount > 0;
                                                const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                const unit = r.type === 'dynamic' ? (r.unitId ? `/${unitMap[r.unitId]}` : '/kWh') : formatUnit(r.type, 'kWh');
                                                return (
                                                    <div key={i} className={cn(
                                                        "border rounded-lg p-3 text-center transition-all hover:shadow-sm",
                                                        isAnytime ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"
                                                    )}>
                                                        <div className="flex flex-col items-center">
                                                            <div className={cn("font-bold text-base", isAnytime ? "text-orange-600" : "text-blue-600")}>
                                                                ${price.toFixed(4)}{unit}
                                                            </div>
                                                            {isDiscounted && (
                                                                <div className="flex items-center gap-1.5 leading-none mb-0.5">
                                                                    <span className={cn("text-[10px] font-medium line-through opacity-40", isAnytime ? "text-orange-600" : "text-blue-600")}>
                                                                        ${numericValue.toFixed(4)}
                                                                    </span>
                                                                    <span className={cn("px-1 py-0.5 text-[8px] font-black rounded uppercase tracking-tighter", isAnytime ? "bg-orange-500 text-white" : "bg-blue-500 text-white")}>
                                                                        -{discount}%
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={cn("text-[10px] font-bold uppercase tracking-wider opacity-80", isAnytime ? "text-orange-600" : "text-blue-600")}>
                                                            {r.label}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Column 2: Supply, Demand, VPP Charges */}
                                <div className="space-y-6">
                                    {/* Supply Charges */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-purple-500">
                                            <PlugIcon size={16} />
                                            <h4 className="text-sm font-bold uppercase tracking-wide">Supply Charges</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Supply', value: mainOffer.supplyCharge, type: 'supplyCharge' },
                                                ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                            ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0).map((r: any, i: number) => {
                                                const numericValue = parseFloat(String(r.value || '0'));
                                                const isDiscounted = r.applyDiscount && discount > 0;
                                                const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                const unit = r.type === 'dynamic' ? (r.unitId ? `/${unitMap[r.unitId]}` : '/day') : formatUnit(r.type, 'day');
                                                return (
                                                    <div key={i} className="bg-purple-50 border-purple-200 text-purple-600 border rounded-lg p-3 text-center space-y-1">
                                                        <div className="flex flex-col items-center">
                                                            <div className="font-bold text-base">${price.toFixed(4)}{unit}</div>
                                                            {isDiscounted && (
                                                                <div className="flex items-center gap-1.5 leading-none mb-0.5">
                                                                    <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                                    <span className="px-1 py-0.5 text-[8px] font-black bg-purple-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.label}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Demand Charges */}
                                    {((mainOffer.demand ?? 0) > 0 || (mainOffer.demandOp ?? 0) > 0 || (mainOffer.demandP ?? 0) > 0 || (mainOffer.demandS ?? 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'demand_charges')) && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-rose-500">
                                                <ActivityIcon size={16} />
                                                <h4 className="text-sm font-bold uppercase tracking-wide">Demand Charges</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Demand', value: mainOffer.demand, type: 'demand' },
                                                    { label: 'Demand (Op)', value: mainOffer.demandOp, type: 'demandOp' },
                                                    { label: 'Demand (P)', value: mainOffer.demandP, type: 'demandP' },
                                                    { label: 'Demand (S)', value: mainOffer.demandS, type: 'demandS' },
                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                ]
                                                    .filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0)
                                                    .map((r: any, i: number) => {
                                                        const numericValue = parseFloat(String(r.value || '0'));
                                                        const isDiscounted = r.applyDiscount && discount > 0;
                                                        const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                        const unit = r.type === 'dynamic' ? (r.unitId ? `/${unitMap[r.unitId]}` : '/kVA/day') : formatUnit(r.type.startsWith('demand') ? r.type : 'demand', 'kVA/day');
                                                        return (
                                                            <div key={i} className="bg-rose-50 border-rose-200 text-rose-600 border rounded-lg p-3 text-center space-y-1">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="font-bold text-base">${price.toFixed(4)}{unit}</div>
                                                                    {isDiscounted && (
                                                                        <div className="flex items-center gap-1.5 leading-none mb-0.5">
                                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-rose-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.label}</div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* VPP Charges */}
                                    {((mainOffer.vppOrcharge ?? 0) > 0 || parsedDynamicRates.some((r: any) => r.type === 'vpp_charges')) && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-amber-500">
                                                <ActivityIcon size={16} />
                                                <h4 className="text-sm font-bold uppercase tracking-wide">VPP Charges</h4>
                                                {discount > 0 && (
                                                    <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded-md uppercase tracking-tighter">Discount Applied</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Orchestration', value: mainOffer.vppOrcharge, type: 'vppOrcharge', applyDiscount: true },
                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0).map((r: any, i: number) => {
                                                    const numericValue = parseFloat(String(r.value || '0'));
                                                    const isDiscounted = r.applyDiscount && discount > 0;
                                                    const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                    const unit = r.type === 'dynamic' ? (r.unitId ? `/${unitMap[r.unitId]}` : '/day') : formatUnit('vppOrcharge', 'day');
                                                    return (
                                                        <div key={i} className="bg-amber-50 border-amber-200 text-amber-600 border rounded-lg p-3 text-center space-y-1">
                                                            <div className="flex flex-col items-center">
                                                                <div className="font-bold text-base">${price.toFixed(4)}{unit}</div>
                                                                {isDiscounted && (
                                                                    <div className="flex items-center gap-1.5 leading-none mb-0.5">
                                                                        <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                                        <span className="px-1 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.label}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Column 3: Solar FiT / Extra FiT / Controlled Load */}
                                <div className="space-y-6">
                                    {/* Solar FiT */}
                                    {hasFiT && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-teal-500">
                                                <ZapIcon size={16} />
                                                <h4 className="text-sm font-bold uppercase tracking-wide">Solar FiT</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Feed-in', value: mainOffer.fit, type: 'fit' },
                                                    { label: 'PREMIUM FIT', value: mainOffer.fitPeak, type: 'fitPeak' },
                                                    { label: 'CRITICAL EVENT FIT', value: mainOffer.fitCritical, type: 'fitCritical' },
                                                    { label: 'BASE FIT', value: mainOffer.fitVpp, type: 'fitVpp' },
                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                ]
                                                    .filter(rate => {
                                                        const numericValue = parseFloat(String(rate.value || 0));
                                                        if (numericValue <= 0) return false;
                                                        const isVppActive = customer?.vppDetails?.vpp === 1 || ratePlan?.vpp === 1;
                                                        if (rate.type === 'fit') return !isVppActive;
                                                        return isVppActive;
                                                    })
                                                    .map((r, i) => {
                                                        const numericValue = parseFloat(String(r.value || '0'));
                                                        const price = r.applyDiscount ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                        const unit = r.type === 'dynamic' ? (r.unitId ? `/${unitMap[r.unitId]}` : '/kWh') : formatUnit(r.type, 'kWh');
                                                        return (
                                                            <div key={i} className="bg-teal-50 border-teal-200 text-teal-600 border rounded-lg p-3 text-center space-y-0.5">
                                                                <div className="font-bold text-base">${price.toFixed(4)}{unit}</div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.label}</div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Extra FiT (if any handled specifically) */}
                                    {(() => {
                                        const handledTypes = ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'];
                                        const fitRates = parsedDynamicRates.filter((r: any) => (r.type === 'fit' || r.type === 'extra_fit') && !handledTypes.includes(r.type));

                                        if (fitRates.length === 0) return null;

                                        return (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-teal-500">
                                                    <ZapIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Extra FiT</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {fitRates.map((r: any, i: number) => {
                                                        const val = parseFloat(String(r.value || '0'));
                                                        const price = r.applyDiscount ? calculateDiscountedRate(val, discount) : val;
                                                        return (
                                                            <div key={i} className="bg-teal-50 border-teal-200 text-teal-600 border rounded-lg p-3 text-center space-y-0.5">
                                                                <div className="font-bold text-base">${price.toFixed(4)}{r.unitId ? `/${unitMap[r.unitId]}` : ''}</div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.name}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Controlled Load */}
                                    {hasCL && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-green-500">
                                                <PlugIcon size={16} />
                                                <h4 className="text-sm font-bold uppercase tracking-wide">Controlled Load</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'CL1 Usage', value: mainOffer.cl1Usage, type: 'cl1_usage' },
                                                    { label: 'CL2 Usage', value: mainOffer.cl2Usage, type: 'cl2_usage' },
                                                    { label: 'CL1 Supply', value: mainOffer.cl1Supply, type: 'cl1_supply' },
                                                    { label: 'CL2 Supply', value: mainOffer.cl2Supply, type: 'cl2_supply' },
                                                    ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
                                                ]
                                                    .filter((rate: any) => (parseFloat(String(rate.value || 0)) ?? 0) > 0)
                                                    .map((rate: any, i: number) => {
                                                        const numericValue = parseFloat(String(rate.value || 0));
                                                        const isUsage = rate.type?.includes('usage') || (rate.type === 'dynamic' && !(rate.unitId && unitMap[rate.unitId]?.toLowerCase().includes('day')));
                                                        const shouldApplyDiscount = rate.type === 'dynamic' ? !!rate.applyDiscount : isUsage;
                                                        const isDiscounted = shouldApplyDiscount && discount > 0;
                                                        const price = isDiscounted ? calculateDiscountedRate(numericValue, discount) : numericValue;
                                                        const unit = rate.type === 'dynamic' ? (rate.unitId ? `/${unitMap[rate.unitId]}` : (isUsage ? '/kWh' : '/day')) : (isUsage ? '/kWh' : '/day');
                                                        return (
                                                            <div key={i} className="bg-green-50 border-green-200 text-green-600 border rounded-lg p-3 text-center space-y-1">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="font-bold text-base">${price.toFixed(4)}{unit}</div>
                                                                    {isDiscounted && (
                                                                        <div className="flex items-center gap-1.5 leading-none mb-0.5">
                                                                            <span className="text-[10px] font-medium line-through opacity-40">${numericValue.toFixed(4)}</span>
                                                                            <span className="px-1 py-0.5 text-[8px] font-black bg-green-500 text-white rounded uppercase tracking-tighter">-{discount}%</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{rate.label}</div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Remaining Dynamic Charges */}
                                    {(() => {
                                        const handledTypes = ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load', 'fit', 'extra_fit'];
                                        const chargeRates = parsedDynamicRates.filter((r: any) => !handledTypes.includes(r.type) && (!r.type || r.type === 'charges' || r.type === 'extra_charges'));

                                        if (chargeRates.length === 0) return null;

                                        return (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-indigo-500">
                                                    <ActivityIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Extra Charges</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {chargeRates.map((r: any, i: number) => {
                                                        const val = parseFloat(String(r.value || '0'));
                                                        const price = r.applyDiscount ? calculateDiscountedRate(val, discount) : val;
                                                        return (
                                                            <div key={i} className="bg-indigo-50 border-indigo-200 text-indigo-600 border rounded-lg p-3 text-center space-y-0.5">
                                                                <div className="font-bold text-base">${price.toFixed(4)}{r.unitId ? `/${unitMap[r.unitId]}` : ''}</div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{r.name}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-3 bg-muted/50 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                All rates are inclusive of GST. Controlled load rates apply to separately metered appliances.
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                        <InfoIcon className="w-5 h-5 text-blue-500 flex-none" />
                        <p className="text-sm font-medium text-blue-800 leading-relaxed">
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
    );
};
