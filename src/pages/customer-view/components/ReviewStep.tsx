import React from 'react';
import { UserIcon, MapPinIcon, ActivityIcon, InfoIcon, CheckIcon, PhoneIcon, MailIcon, ZapIcon, Settings2Icon, PlugIcon } from '@/components/icons';
import { calculateDiscountedRate } from '@/lib/rate-utils';
import { cn, formatDate } from '@/lib/utils';
import { CustomerViewLayout } from './CustomerViewLayout';

interface ReviewStepProps {
    idForm: any;
    payload: any;
    customerIdDisplay: string;
    isNominationConfirmed: boolean;
    setIsNominationConfirmed: (confirmed: boolean) => void;
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
    setIsNominationConfirmed,
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
    const unitMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        measurementUnits?.forEach((u: any) => {
            map[u.uid] = u.name;
        });
        return map;
    }, [measurementUnits]);

    const discount = parseFloat(payload?.discount || customer?.discount || 0);

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

    const energyRatesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return [
            { label: 'Anytime', value: mainOffer.anytime, type: 'anytime' },
            { label: 'Peak', value: mainOffer.peak, type: 'peak' },
            { label: 'Shoulder', value: mainOffer.shoulder, type: 'shoulder' },
            { label: 'Off-Peak', value: mainOffer.offPeak, type: 'offPeak' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'energy_rates').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId }))
        ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates]);

    const supplyChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return [
            { label: 'Supply', value: mainOffer.supplyCharge, type: 'supplyCharge' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'supply_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates]);

    const demandChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return [
            { label: 'Demand', value: mainOffer.demand, type: 'demand' },
            { label: 'Demand (Op)', value: mainOffer.demandOp, type: 'demandOp' },
            { label: 'Demand (P)', value: mainOffer.demandP, type: 'demandP' },
            { label: 'Demand (S)', value: mainOffer.demandS, type: 'demandS' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'demand_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates]);

    const vppChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return [
            { label: 'Orchestration', value: mainOffer.vppOrcharge, type: 'vppOrcharge', applyDiscount: true },
            ...parsedDynamicRates.filter((r: any) => r.type === 'vpp_charges').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ].filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates]);

    const solarFitItems = React.useMemo(() => {
        if (!mainOffer || !hasFiT) return [];
        return [
            { label: 'Feed-in', value: mainOffer.fit, type: 'fit' },
            { label: 'PREMIUM FIT', value: mainOffer.fitPeak, type: 'fitPeak' },
            { label: 'CRITICAL EVENT FIT', value: mainOffer.fitCritical, type: 'fitCritical' },
            { label: 'BASE FIT', value: mainOffer.fitVpp, type: 'fitVpp' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'solar_fit').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ].filter(rate => {
            const numericValue = parseFloat(String(rate.value || 0));
            if (numericValue <= 0) return false;
            const isVppActive = customer?.vppDetails?.vpp === 1 || ratePlan?.vpp === 1;
            if (rate.type === 'fit') return !isVppActive;
            return isVppActive;
        });
    }, [mainOffer, parsedDynamicRates, hasFiT, customer, ratePlan]);

    const handledTypes = React.useMemo(() => ['energy_rates', 'supply_charges', 'demand_charges', 'vpp_charges', 'solar_fit', 'controlled_load'], []);

    const extraFitItems = React.useMemo(() => {
        if (!mainOffer) return [];
        return parsedDynamicRates
            .filter((r: any) => (r.type === 'fit' || r.type === 'extra_fit') && !handledTypes.includes(r.type))
            .filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates, handledTypes]);

    const controlledLoadItems = React.useMemo(() => {
        if (!mainOffer || !hasCL) return [];
        return [
            { label: 'CL1 Usage', value: mainOffer.cl1Usage, type: 'cl1_usage' },
            { label: 'CL2 Usage', value: mainOffer.cl2Usage, type: 'cl2_usage' },
            { label: 'CL1 Supply', value: mainOffer.cl1Supply, type: 'cl1_supply' },
            { label: 'CL2 Supply', value: mainOffer.cl2Supply, type: 'cl2_supply' },
            ...parsedDynamicRates.filter((r: any) => r.type === 'controlled_load').map((r: any) => ({ label: r.name, value: r.value, type: 'dynamic', unitId: r.unitId, applyDiscount: !!r.applyDiscount }))
        ].filter((rate: any) => (parseFloat(String(rate.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates, hasCL]);

    const extraChargesItems = React.useMemo(() => {
        if (!mainOffer) return [];
        const handledAll = [...handledTypes, 'fit', 'extra_fit'];
        return parsedDynamicRates
            .filter((r: any) => !handledAll.includes(r.type) && (!r.type || r.type === 'charges' || r.type === 'extra_charges'))
            .filter((r: any) => (parseFloat(String(r.value || 0)) ?? 0) > 0);
    }, [mainOffer, parsedDynamicRates, handledTypes]);

    const hasColumn1 = energyRatesItems.length > 0;
    const hasColumn2 = supplyChargesItems.length > 0 || demandChargesItems.length > 0 || vppChargesItems.length > 0;
    const hasColumn3 = solarFitItems.length > 0 || extraFitItems.length > 0 || controlledLoadItems.length > 0 || extraChargesItems.length > 0;

    const activeColsCount = [hasColumn1, hasColumn2, hasColumn3].filter(Boolean).length;

    return (
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
                    {/* Existing unconditional Nomination Form checkbox */}
                    <label className="flex items-start gap-3.5 cursor-pointer group">
                        <div className="relative flex items-center shrink-0 mt-0.5">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 shadow-sm hover:border-primary/50"
                                checked={isNominationConfirmed}
                                onChange={(e) => setIsNominationConfirmed(e.target.checked)}
                            />
                            <CheckIcon className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white left-0.5 top-0.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-700 select-none leading-relaxed">
                            I have read and agree to the <a href="/onboarding/BESS2 and Nomination Form.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold" onClick={(e) => e.stopPropagation()}>Nomination Form</a>
                        </span>
                    </label>

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
                                                Plan: {ratePlan?.codes?.[0] || customer?.tariffCode || payload?.tariffCode || payload?.tariffcode || 'Standard'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">Energy rate plan & offers</p>
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "grid gap-8",
                                activeColsCount === 1 ? "grid-cols-1 max-w-md mx-auto" :
                                activeColsCount === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" :
                                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            )}>
                                {/* Column 1: Energy Rates */}
                                {hasColumn1 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-blue-500">
                                            <Settings2Icon size={16} />
                                            <h4 className="text-sm font-bold uppercase tracking-wide">Energy Rates</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {[...energyRatesItems]
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
                                )}

                                {/* Column 2: Supply, Demand, VPP Charges */}
                                {hasColumn2 && (
                                    <div className="space-y-6">
                                        {/* Supply Charges */}
                                        {supplyChargesItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-purple-500">
                                                    <PlugIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Supply Charges</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {supplyChargesItems.map((r: any, i: number) => {
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
                                        )}

                                        {/* Demand Charges */}
                                        {demandChargesItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-rose-500">
                                                    <ActivityIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Demand Charges</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {demandChargesItems.map((r: any, i: number) => {
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
                                        {vppChargesItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-amber-500">
                                                    <ActivityIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">VPP Charges</h4>
                                                    {discount > 0 && (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-amber-500 text-white rounded-md uppercase tracking-tighter">Discount Applied</span>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    {vppChargesItems.map((r: any, i: number) => {
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
                                )}

                                {/* Column 3: Solar FiT / Extra FiT / Controlled Load */}
                                {hasColumn3 && (
                                    <div className="space-y-6">
                                        {/* Solar FiT */}
                                        {solarFitItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-teal-500">
                                                    <ZapIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Solar FiT</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {solarFitItems.map((r: any, i: number) => {
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

                                        {/* Extra FiT */}
                                        {extraFitItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-teal-500">
                                                    <ZapIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Extra FiT</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {extraFitItems.map((r: any, i: number) => {
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
                                        )}

                                        {/* Controlled Load */}
                                        {controlledLoadItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <PlugIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Controlled Load</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {controlledLoadItems.map((rate: any, i: number) => {
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

                                        {/* Extra Charges */}
                                        {extraChargesItems.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-indigo-500">
                                                    <ActivityIcon size={16} />
                                                    <h4 className="text-sm font-bold uppercase tracking-wide">Extra Charges</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {extraChargesItems.map((r: any, i: number) => {
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
                                        )}
                                    </div>
                                )}
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

    );
};
