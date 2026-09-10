import React from 'react';
import { UserIcon, MapPinIcon, ActivityIcon, InfoIcon, CheckIcon, PhoneIcon, MailIcon, ZapIcon } from '@/components/icons';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { processItems as sharedProcessItems } from '@/lib/rate-processing';
import { formatDate } from '@/lib/utils';
import { CustomerViewLayout } from './CustomerViewLayout';
import { useQuery } from '@apollo/client';
import { GET_COLUMN_METADATA } from '@/graphql/queries/rates';

interface ReviewStepProps {
    idForm: any;
    payload: any;
    customerIdDisplay: string;
    isNominationConfirmed: boolean;
    consents?: any;
    setConsents?: (consents: any) => void;
    onBack: () => void;
    onFinish: () => void;
    idTypeOptions: any[];
    mainOffer?: any;
    ratePlan?: any;
    measurementUnits?: any[];
    customer?: any;
    isSaving?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
    idForm,
    payload,
    customerIdDisplay,
    isNominationConfirmed,
    consents,
    setConsents,
    onBack,
    onFinish,
    idTypeOptions,
    mainOffer,
    ratePlan,
    measurementUnits,
    customer,
    isSaving
}) => {
    const [hoveredTooltip, setHoveredTooltip] = React.useState<{ text: React.ReactNode; x: number; y: number; position: 'right' | 'left' | 'top' | 'bottom' } | null>(null);
    
    const { data: colData } = useQuery(GET_COLUMN_METADATA, { fetchPolicy: 'cache-first' });
    const dynamicRateInfoMap = React.useMemo(() => {
        const map = new Map<string, string>();
        if (colData?.getColumnMetadata) {
            colData.getColumnMetadata.forEach((col: any) => {
                if (col.columnName && col.description) {
                    map.set(col.columnName.toUpperCase(), col.description);
                }
            });
        }
        return map;
    }, [colData]);

    const unitMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        measurementUnits?.forEach((u: any) => {
            map[u.uid] = u.name;
        });
        return map;
    }, [measurementUnits]);

    const discount = parseFloat(String(payload?.discount || customer?.discount || customer?.plan?.discount || 0));

    const parsedPriceUnits: Record<string, string> = typeof mainOffer?.priceUnits === 'string'
        ? (() => { try { return JSON.parse(mainOffer.priceUnits); } catch { return {}; } })()
        : (mainOffer?.priceUnits || {});

    const parsedDynamicRates = typeof mainOffer?.dynamicRates === 'string'
        ? (() => { try { return JSON.parse(mainOffer.dynamicRates); } catch { return []; } })()
        : (mainOffer?.dynamicRates || []);

    const planRates = React.useMemo(() => {
        const planRatesJson = customer?.plan?.ratesJson;
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
        
        if (customer?.plan?.isDnspBased && ratePlan?.dnsp !== undefined && ratePlan?.dnsp !== null) {
            return parsed.filter((r: any) => String(r.dnsp) === String(ratePlan.dnsp));
        }
        return parsed;
    }, [customer?.plan?.ratesJson, customer?.plan?.isDnspBased, ratePlan?.dnsp]);

    const processItems = React.useCallback((items: any[], type: string) => {
        return sharedProcessItems(items, type, planRates);
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
                  planRates.some((pr: any) => ['CL1 SUPPLY', 'CL2 SUPPLY', 'CL1 USAGE', 'CL2 USAGE'].includes(pr.name.toUpperCase()) && (parseFloat(String(pr.rate || 0)) > 0 || pr.rate === 0 || pr.rate === '0'));

    const hasFiTRates = (mainOffer?.fit || 0) > 0 || 
                         (mainOffer?.fitPeak || 0) > 0 || 
                         (mainOffer?.fitCritical || 0) > 0 || 
                         (mainOffer?.fitVpp || 0) > 0 || 
                         parsedDynamicRates.some((r: any) => r.type === 'fit' || r.type === 'extra_fit' || r.type === 'solar_fit' || r.name?.toUpperCase().includes('FIT') || r.name?.toUpperCase().includes('FEED-IN')) ||
                         planRates.some((pr: any) => ['FEED-IN', 'FEED-IN TARIFF', 'PREMIUM FIT', 'CRITICAL EVENT FIT', 'BASE FIT', 'SOLAR FIT'].includes(pr.name.toUpperCase()) || pr.name.toUpperCase().includes('FIT') || pr.name.toUpperCase().includes('FEED-IN'));

    const hasSolar = Boolean(customer?.solarDetails?.hassolar === 1 || customer?.solarDetails?.hassolar === true || payload?.hasSolar === true || payload?.solarDetails?.hassolar === 1 || (mainOffer?.fit && mainOffer.fit > 0) || planRates.some((pr: any) => pr.name.toUpperCase().includes('FIT') || pr.name.toUpperCase().includes('FEED-IN')));
    const hasFiT = hasFiTRates && hasSolar;

    const energyRatesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Peak', value: mainOffer.peak, type: 'peak', applyDiscount: true },
            { label: 'Off-Peak', value: mainOffer.offPeak, type: 'offPeak', applyDiscount: true },
            { label: 'Shoulder', value: mainOffer.shoulder, type: 'shoulder', applyDiscount: true },
            { label: 'Anytime', value: mainOffer.anytime, type: 'anytime', applyDiscount: true },
            ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false, description: r.description || r.info }))
        ], 'energy_rates');
    }, [mainOffer, parsedDynamicRates, processItems]);

    const supplyChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Supply Charge', value: mainOffer.supplyCharge, type: 'supplyCharge' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info }))
        ], 'supply_charges');
    }, [mainOffer, parsedDynamicRates, processItems]);

    const demandChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'Demand', value: mainOffer.demand, type: 'demand', applyDiscount: true },
            { label: 'Demand(Op)', value: mainOffer.demandOp, type: 'demandOp', applyDiscount: true },
            { label: 'Demand(P)', value: mainOffer.demandP, type: 'demandP', applyDiscount: true },
            { label: 'Demand(S)', value: mainOffer.demandS, type: 'demandS', applyDiscount: true },
            ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info }))
        ], 'demand_charges');
    }, [mainOffer, parsedDynamicRates, processItems]);

    const vppChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return processItems([
            { label: 'VPP Orchestration', value: mainOffer.vppOrcharge, type: 'vppOrcharge', applyDiscount: false },
            ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: false, description: r.description || r.info }))
        ], 'vpp_charges');
    }, [mainOffer, parsedDynamicRates, processItems]);

    const solarFitItems = React.useMemo(() => {
        if (!mainOffer || !hasFiT) return [];
        return processItems([
            { label: 'Feed-in', value: mainOffer.fit, type: 'fit' },
            { label: 'Feed-in Tariff', value: mainOffer.fit, type: 'fit' },
            { label: 'PREMIUM FIT', value: mainOffer.fitPeak, type: 'fitPeak' },
            { label: 'CRITICAL EVENT FIT', value: mainOffer.fitCritical, type: 'fitCritical' },
            { label: 'BASE FIT', value: mainOffer.fitVpp, type: 'fitVpp' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit' || r.type === 'fit' || r.type === 'extra_fit' || r.name?.toUpperCase().includes('FIT') || r.name?.toUpperCase().includes('FEED-IN')).map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info }))
        ], 'solar_fit').filter(rate => {
            const numericValue = parseFloat(String(rate.value || 0));
            if (numericValue <= 0 && !rate.isExplicitZero) return false;
            return true;
        });
    }, [mainOffer, parsedDynamicRates, hasFiT, customer, ratePlan, processItems]);

    const handledTypes = React.useMemo(() => ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'], []);

    const extraFitItems = React.useMemo(() => {
        if (!mainOffer) return [];
        const items = parsedDynamicRates
            .filter((r: any) => (r.type === 'fit' || r.type === 'extra_fit') && !handledTypes.includes(r.type))
            .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info }));
        return processItems(items, 'extra_fit');
    }, [mainOffer, parsedDynamicRates, handledTypes, processItems]);

    const controlledLoadItems = React.useMemo(() => {
        if (!mainOffer || !hasCL) return [];
        return processItems([
            { label: 'CL1 Usage', value: mainOffer.cl1Usage, type: 'cl1_usage', applyDiscount: true },
            { label: 'CL2 Usage', value: mainOffer.cl2Usage, type: 'cl2_usage', applyDiscount: true },
            { label: 'CL1 Supply', value: mainOffer.cl1Supply, type: 'cl1_supply', applyDiscount: true },
            { label: 'CL2 Supply', value: mainOffer.cl2Supply, type: 'cl2_supply', applyDiscount: true },
            ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: r.applyDiscount !== false, description: r.description || r.info }))
        ], 'controlled_load');
    }, [mainOffer, parsedDynamicRates, hasCL, processItems]);

    const extraChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        const handledAll = [...handledTypes, 'fit', 'extra_fit'];
        const items = parsedDynamicRates
            .filter((r: any) => !handledAll.includes(r.type) && (!r.type || r.type === 'charges' || r.type === 'extra_charges'))
            .map((r: any) => ({ label: r.name, name: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount, description: r.description || r.info }));
        return processItems(items, 'extra_charges');
    }, [mainOffer, parsedDynamicRates, handledTypes, processItems]);

    const processedRateItems = React.useMemo(() => {
        const items: Array<{ category: string; item: any; fallbackUnit: string; isUsageOverride?: boolean }> = [];
        energyRatesItems.forEach((item: any) => items.push({ category: 'Energy Rates', item, fallbackUnit: '/kWh' }));
        supplyChargesItems.forEach((item: any) => items.push({ category: 'Supply Charges', item, fallbackUnit: '/day' }));
        demandChargesItems.forEach((item: any) => items.push({ category: 'Demand Charges', item, fallbackUnit: '/kVA/day' }));
        vppChargesItems.forEach((item: any) => items.push({ category: 'VPP Charges', item, fallbackUnit: '/day' }));
        solarFitItems.forEach((item: any) => items.push({ category: 'Solar FiT', item, fallbackUnit: '/kWh' }));
        extraFitItems.forEach((item: any) => items.push({ category: 'Extra FiT', item, fallbackUnit: '/kWh' }));
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
                if (item.description || item.info) return item.description || item.info;
                const fromDb = dynamicRateInfoMap.get((item.label || item.name || '').toUpperCase());
                if (fromDb) return fromDb;
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
    }, [energyRatesItems, supplyChargesItems, demandChargesItems, vppChargesItems, solarFitItems, extraFitItems, controlledLoadItems, extraChargesItems, discount, unitMap, parsedPriceUnits, dynamicRateInfoMap]);

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
            title="Review Your Details"
            subtitle={`Customer ID: ${customerIdDisplay}`}
            onBack={onBack}
            footerButtonLabel="Finish Enrollment"
            onFooterButtonClick={onFinish}
            isFooterButtonDisabled={!isNominationConfirmed || !consents?.infoConfirm || !consents?.creditCheck}
            isFooterButtonLoading={isSaving}
            footerContent={
                <div className="space-y-2.5 text-left max-w-2xl mx-auto px-1">
                    {/* Checkbox 1: infoConfirm */}
                    <label className="flex items-start gap-3.5 cursor-pointer group">
                        <div className="relative flex items-center shrink-0 mt-0.5">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 shadow-sm hover:border-primary/50"
                                checked={consents?.infoConfirm || false}
                                onChange={(e) => setConsents?.({ ...consents, infoConfirm: e.target.checked })}
                            />
                            <CheckIcon className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white left-0.5 top-0.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700 select-none leading-relaxed">
                            I confirm the above information is correct and have read the{' '}
                            <a href="/onboarding/GEE-TERMS-AND-CONDITIONS.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Terms &amp; Conditions</a>
                            {', '}
                            <a href="/onboarding/GEE-PDS.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Disclosure Statement</a>
                            {customer?.vppDetails?.vpp === 1 && (
                                <>
                                    {', '}
                                    <a href="/onboarding/Virtual Power Plant Program Terms and Conditions.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Virtual Power Plant Program Terms and Conditions</a>
                                </>
                            )}
                            {' and '}
                            <a href="/onboarding/GEE-Privacy-Policy.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>.
                        </span>
                    </label>

                    {/* Checkbox 2: creditCheck */}
                    <label className="flex items-start gap-3.5 cursor-pointer group">
                        <div className="relative flex items-center shrink-0 mt-0.5">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 shadow-sm hover:border-primary/50"
                                checked={consents?.creditCheck || false}
                                onChange={(e) => setConsents?.({ ...consents, creditCheck: e.target.checked })}
                            />
                            <CheckIcon className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white left-0.5 top-0.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700 select-none leading-relaxed">
                            I consent to a credit check to assess my application.
                        </span>
                    </label>
                </div>
            }
        >
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Consolidated Summary Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {/* Personal Info */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <UserIcon size={16} />
                            </div>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">First Name</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.firstname || payload.firstName || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Last Name</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.lastname || payload.lastName || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Date of Birth</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{formatDate(idForm.dob || payload.dob, { includeTime: false })}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Phone</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.number || payload.phone || payload.mobile || '—'}</div>
                            </div>
                            <div className="sm:col-span-2 md:col-span-4">
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.email || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                <MapPinIcon size={16} />
                            </div>
                            Property Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Address</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.address || '—'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">NMI</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{payload.nmi || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Energy Plan & Pricing */}
                    {mainOffer && (
                        <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                                        <ZapIcon size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-md font-semibold text-slate-900 tracking-tight">Rate Plan Details</h3>
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-lg">
                                                Plan: {customer?.plan?.title || customer?.plan?.planName || ratePlan?.codes?.[0] || customer?.tariffCode || payload?.tariffCode || payload?.tariffcode || 'Standard'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">Energy rate plan & offers</p>
                                    </div>
                                </div>
                            </div>
                            {/* Desktop Table View */}
                            <div className="overflow-x-auto mt-4 rounded-xl border border-slate-200 hidden md:block">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                            <th className="px-4 py-3 font-semibold">DETAILS</th>
                                            <th className="px-4 py-3 font-semibold">CATEGORY</th>
                                            <th className="px-4 py-3 text-right font-semibold">Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
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
                            <div className="block md:hidden divide-y divide-slate-100 bg-white mt-4 border border-slate-200 rounded-xl overflow-hidden">
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
                    )}

                    {/* Identity & Connection Details */}
                    <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                <ActivityIcon size={16} />
                            </div>
                            Identity Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ID Type</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">
                                    {idTypeOptions.find(o => o.value === idForm.idType)?.label || '—'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                    {idForm.idType === '1' ? 'Medicare Number' : 'ID Number'}
                                </div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idnumber || '—'}</div>
                            </div>
                            {idForm.idType === '0' && (
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Card Number</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.licenseCardNumber || '—'}</div>
                                </div>
                            )}
                            {idForm.idType === '1' && (
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">IRN</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.medicareIrn || '—'}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Expiry Date</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{formatDate(idForm.idexpiary, { includeTime: false })}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">State/Country</div>
                                <div className="text-sm font-semibold text-slate-900 mt-1">{idForm.idstate || idForm.idcountry || '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Installer Details */}
                    {payload.createdBy && (
                        <div className="p-5 sm:p-8 hover:bg-slate-50/50 transition-colors">
                            <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <InfoIcon size={16} />
                                </div>
                                Installer Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Company</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.company_name || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Contact</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.first_name} {payload.createdBy.last_name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">ABN</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1">{payload.createdBy.abn || '—'}</div>
                                </div>
                                <div className="sm:col-span-2 md:col-span-4">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email</div>
                                    <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{payload.createdBy.email || '—'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PDRS Badge */}
                {payload.isPdrs && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                        <CheckIcon className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">This enrollment was submitted via the PDRS portal ({payload.portalname || 'Portal'}).</p>
                    </div>
                )}
                {/* Need help Section */}
                <div className="text-center pt-8 pb-4">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Need help?</p>
                    <div className="flex justify-center gap-4">
                        <a href="tel:1300707042" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            <PhoneIcon size={14} className="text-primary" />
                            1300 707 042
                        </a>
                        <a href="mailto:customerservice@gee.com.au" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            <MailIcon size={14} className="text-primary" />
                            EMAIL US
                        </a>
                    </div>
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
