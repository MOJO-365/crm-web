import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLAN } from '@/graphql';
import { GET_PLAN } from '@/graphql/queries/plans';
import { UPDATE_PLAN } from '@/graphql/mutations/plans';
import { GET_MEASUREMENT_UNITS, GET_RATE_PLANS } from '@/graphql/queries/rates';
import { GET_ACTIVE_BONUSES } from '@/graphql/queries/bonus';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'react-toastify';
import { ChevronRightIcon, CheckIcon } from '@/components/icons';
import Modal from '@/components/common/Modal';
import { STATE_OPTIONS } from '@/lib/constants';

const TARIFF_COMPONENTS = [
    'SUPPLY CHARGE', 'ANYTIME', 'PEAK', 'SHOULDER', 'OFF-PEAK',
    'CL1 SUPPLY', 'CL1 USAGE', 'CL2 SUPPLY', 'CL2 USAGE',
    'DEMAND', 'DEMAND(OP)', 'DEMAND(P)', 'DEMAND(S)'
];

const COMPONENT_OFFER_MAP: Record<string, string> = {
    'ANYTIME': 'anytime',
    'PEAK': 'peak',
    'SHOULDER': 'shoulder',
    'OFF-PEAK': 'offPeak',
    'SUPPLY CHARGE': 'supplyCharge',
    'CL1 SUPPLY': 'cl1Supply',
    'CL1 USAGE': 'cl1Usage',
    'CL2 SUPPLY': 'cl2Supply',
    'CL2 USAGE': 'cl2Usage',
    'DEMAND': 'demand',
    'DEMAND(OP)': 'demandOp',
    'DEMAND(P)': 'demandP',
    'DEMAND(S)': 'demandS',
    'VPP ORCHESTRATION': 'vppOrcharge'
};

const COMPONENT_DYNAMIC_TYPE_MAP: Record<string, string> = {
    'SUPPLY CHARGE': 'supply_charges',
    'ANYTIME': 'energy_rates',
    'PEAK': 'energy_rates',
    'SHOULDER': 'energy_rates',
    'OFF-PEAK': 'energy_rates',
    'CL1 SUPPLY': 'controlled_load',
    'CL1 USAGE': 'controlled_load',
    'CL2 SUPPLY': 'controlled_load',
    'CL2 USAGE': 'controlled_load',
    'DEMAND': 'demand_charges',
    'DEMAND(OP)': 'demand_charges',
    'DEMAND(P)': 'demand_charges',
    'DEMAND(S)': 'demand_charges'
};

export const AddPlanPage: React.FC = () => {
    const navigate = useNavigate();
    const { uid } = useParams();
    const isEditMode = !!uid;
    const [createPlan, { loading: creating }] = useMutation(CREATE_PLAN);
    const [updatePlan, { loading: updating }] = useMutation(UPDATE_PLAN);
    const { data: unitsData, loading: unitsLoading } = useQuery(GET_MEASUREMENT_UNITS);
    const { data: ratePlansData } = useQuery(GET_RATE_PLANS, {
        variables: { limit: 1000 }
    });
    const { data: planData, loading: planLoading } = useQuery(GET_PLAN, {
        variables: { uid },
        skip: !uid
    });
    const { data: bonusesData } = useQuery(GET_ACTIVE_BONUSES);
    const activeBonuses = bonusesData?.activeBonuses || [];

    const unitOptions = React.useMemo(() => {
        if (!unitsData?.measurementUnits) return [];
        return unitsData.measurementUnits.map((u: any) => ({
            label: u.name,
            value: u.uid
        }));
    }, [unitsData]);

    const [formData, setFormData] = useState({
        title: '',
        state: '',
        description: '',
        discount: 0,
        propertyType: 0,
        isSolarRequired: false,
        isBatteryRequired: false,
        attachNominationForm: false,
        contractTerm: '',
        exitFee: '' as number | string,
        bonusUids: [] as string[],
        components: TARIFF_COMPONENTS.map(name => ({ name, rate: '', unit: '', planType: 'fixed', tariffUid: '', isDynamic: false, dynamicType: COMPONENT_DYNAMIC_TYPE_MAP[name] || '', isCustom: false as boolean | undefined, rateType: 'None' }))
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [isCustomDiscountMode, setIsCustomDiscountMode] = useState(false);

    React.useEffect(() => {
        if (planData?.plan) {
            const plan = planData.plan;
            let existingRates: any[] = [];
            if (plan.ratesJson) {
                try {
                    existingRates = JSON.parse(plan.ratesJson);
                } catch (e) {
                    console.error("Failed to parse ratesJson", e);
                }
            }

            setFormData((prev) => {
                const baseComponents = [...TARIFF_COMPONENTS.map(name => ({ name, rate: '', unit: '', planType: 'fixed', tariffUid: '', isDynamic: false, dynamicType: COMPONENT_DYNAMIC_TYPE_MAP[name] || '', isCustom: false as boolean | undefined, rateType: 'None' }))];
                
                // Preserve dynamically loaded rates from ratePlansData that might have already populated
                prev.components.forEach(c => {
                    if (c.isDynamic && !baseComponents.some(bc => bc.name.toUpperCase() === c.name.toUpperCase())) {
                        baseComponents.push({ ...c, rate: '', unit: '', rateType: 'None' });
                    }
                });

                existingRates.forEach(rateComp => {
                    const existingIndex = baseComponents.findIndex(c => c.name.toUpperCase() === rateComp.name.toUpperCase());
                    const defaultRateType = (rateComp.rate || rateComp.unit) ? 'Fixed' : 'According to Tariff';
                    const rateType = rateComp.rateType || defaultRateType;

                    if (existingIndex >= 0) {
                        baseComponents[existingIndex] = { 
                            ...baseComponents[existingIndex], 
                            ...rateComp, 
                            rateType,
                            dynamicType: rateComp.dynamicType || baseComponents[existingIndex].dynamicType || COMPONENT_DYNAMIC_TYPE_MAP[rateComp.name.toUpperCase()] || ''
                        };
                    } else {
                        // If it's not a known default or dynamic, it's a custom or dynamic rate
                        baseComponents.push({ 
                            ...rateComp, 
                            isCustom: !rateComp.isDynamic, 
                            rateType,
                            dynamicType: rateComp.dynamicType || COMPONENT_DYNAMIC_TYPE_MAP[rateComp.name.toUpperCase()] || ''
                        });
                    }
                });

                return {
                    title: plan.title || '',
                    state: plan.state || '',
                    description: plan.description || '',
                    discount: plan.discount || 0,
                    propertyType: plan.propertyType ?? 0,
                    isSolarRequired: plan.isSolarRequired ?? false,
                    isBatteryRequired: plan.isBatteryRequired ?? false,
                    attachNominationForm: plan.attachNominationForm ?? false,
                    contractTerm: plan.contractTerm || '',
                    exitFee: plan.exitFee ?? '',
                    bonusUids: plan.bonusUids || [],
                    components: baseComponents
                };
            });
        }
    }, [planData]);

    const [customRateDraft, setCustomRateDraft] = useState({
        name: '',
        description: '',
        rate: '',
        unit: '',
        planType: 'fixed',
        tariffUid: '',
        dynamicType: '',
        rateType: 'Fixed'
    });

    React.useEffect(() => {
        if (ratePlansData?.ratePlans?.data) {
            const dynamicNames = new Map<string, string>();
            ratePlansData.ratePlans.data.forEach((rp: any) => {
                if (rp.offers && rp.offers.length > 0) {
                    const offer = rp.offers[0];
                    let parsed: any[] = [];
                    if (typeof offer.dynamicRates === 'string') {
                        try { parsed = JSON.parse(offer.dynamicRates); } catch { }
                    } else if (offer.dynamicRates) {
                        parsed = offer.dynamicRates;
                    }
                    parsed.forEach((dr: any) => {
                        if (dr.name) dynamicNames.set(String(dr.name).toUpperCase(), dr.type || '');
                    });
                }
            });

            if (dynamicNames.size > 0) {
                setFormData(prev => {
                    const existingNames = new Set(prev.components.map(c => c.name.toUpperCase()));
                    const newComps = [...prev.components];
                    let changed = false;

                    dynamicNames.forEach((type, name) => {
                        if (!existingNames.has(name)) {
                            newComps.push({
                                name,
                                rate: '',
                                unit: '',
                                planType: 'fixed',
                                tariffUid: '',
                                isDynamic: true,
                                dynamicType: type,
                                isCustom: false,
                                rateType: 'None'
                            });
                            changed = true;
                        }
                    });

                    if (changed) {
                        return { ...prev, components: newComps };
                    }
                    return prev;
                });
            }
        }
    }, [ratePlansData]);

    const handleComponentChange = (index: number, field: 'rate' | 'unit' | 'planType' | 'tariffUid' | 'rateType', value: string) => {
        const newComps = [...formData.components];
        (newComps[index] as any)[field] = value;

        // Auto-extract rate and unit from the selected tariff
        if (field === 'tariffUid' && value && ratePlansData?.ratePlans?.data) {
            const selectedPlan = ratePlansData.ratePlans.data.find((rp: any) => rp.uid === value);
            if (selectedPlan && selectedPlan.offers && selectedPlan.offers.length > 0) {
                const offer = selectedPlan.offers[0];
                const compName = newComps[index].name;
                const offerField = COMPONENT_OFFER_MAP[compName];

                if (offerField && offer[offerField] !== undefined && offer[offerField] !== null) {
                    newComps[index].rate = String(offer[offerField]);

                    // Extract Unit
                    let parsedPriceUnits: Record<string, string> = {};
                    if (typeof offer.priceUnits === 'string') {
                        try { parsedPriceUnits = JSON.parse(offer.priceUnits); } catch { }
                    } else if (offer.priceUnits) {
                        parsedPriceUnits = offer.priceUnits;
                    }

                    const unitUid = parsedPriceUnits[offerField];
                    if (unitUid && unitsData?.measurementUnits) {
                        const matchedUnit = unitsData.measurementUnits.find((u: any) => u.uid === unitUid || u.id === unitUid);
                        if (matchedUnit) {
                            newComps[index].unit = matchedUnit.name;
                        }
                    }
                } else if (newComps[index].isDynamic) {
                    // Extract dynamically added column rate
                    let parsedDynamic: any[] = [];
                    if (typeof offer.dynamicRates === 'string') {
                        try { parsedDynamic = JSON.parse(offer.dynamicRates); } catch { }
                    } else if (offer.dynamicRates) {
                        parsedDynamic = offer.dynamicRates;
                    }

                    const dynRate = parsedDynamic.find((dr: any) => String(dr.name).toUpperCase() === compName);
                    if (dynRate) {
                        // Use rate or value depending on the DB schema
                        const rateVal = dynRate.rate !== undefined ? dynRate.rate : dynRate.value;
                        if (rateVal !== undefined && rateVal !== null) {
                            newComps[index].rate = String(rateVal);
                        }
                        if (dynRate.unitId && unitsData?.measurementUnits) {
                            const matchedUnit = unitsData.measurementUnits.find((u: any) => u.uid === dynRate.unitId || u.id === dynRate.unitId);
                            if (matchedUnit) {
                                newComps[index].unit = matchedUnit.name;
                            }
                        }
                    }
                }
            }
        }

        setFormData({ ...formData, components: newComps });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Plan title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        let hasComponentError = false;
        let validComponents: any[] = [];

        formData.components.forEach((comp: any, index: number) => {
            if (comp.rateType === 'None' || !comp.rateType) return;
            
            // Remove UI-specific and legacy fields so they don't pollute the JSON
            const { planType, tariffUid, isCustom, isDynamic, ...cleanComp } = comp;
            
            if (cleanComp.rateType === 'Fixed') {
                const hasRate = cleanComp.rate && String(cleanComp.rate).trim() !== '' && Number(cleanComp.rate) !== 0;
                if (hasRate && (!cleanComp.unit || cleanComp.unit.trim() === '')) {
                    newErrors[`comp-${index}-unit`] = `Unit is required for ${cleanComp.name}`;
                    hasComponentError = true;
                }
                if (hasRate) {
                   validComponents.push(cleanComp);
                }
            } else if (cleanComp.rateType === 'According to Tariff') {
                const { rate, unit, ...rest } = cleanComp;
                validComponents.push(rest);
            }
        });

        if (validComponents.length === 0) {
            newErrors.components = 'Please add at least one valid rate component';
        } else if (hasComponentError) {
            newErrors.components = 'Please fix the errors in the rate components table';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            if (isEditMode && uid) {
                await updatePlan({
                    variables: {
                        uid,
                        input: {
                            title: formData.title,
                            state: formData.state,
                            description: formData.description,
                            discount: Number(formData.discount) || 0,
                            propertyType: formData.propertyType,
                            isSolarRequired: formData.isSolarRequired,
                            isBatteryRequired: formData.isBatteryRequired,
                            attachNominationForm: formData.attachNominationForm,
                            contractTerm: formData.contractTerm,
                            exitFee: formData.exitFee === '' ? null : Number(formData.exitFee),
                            ratesJson: JSON.stringify(validComponents),
                            isActive: true,
                            bonusUids: formData.bonusUids
                        }
                    }
                });
                toast.success('Plan updated successfully');
            } else {
                await createPlan({
                    variables: {
                        input: {
                            title: formData.title,
                            state: formData.state,
                            description: formData.description,
                            discount: Number(formData.discount) || 0,
                            propertyType: formData.propertyType,
                            isSolarRequired: formData.isSolarRequired,
                            isBatteryRequired: formData.isBatteryRequired,
                            attachNominationForm: formData.attachNominationForm,
                            contractTerm: formData.contractTerm,
                            exitFee: formData.exitFee === '' ? null : Number(formData.exitFee),
                            ratesJson: JSON.stringify(validComponents),
                            isActive: true,
                            bonusUids: formData.bonusUids
                        }
                    }
                });
                toast.success('Plan created successfully');
            }
            navigate('/plans-master');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create plan');
        }
    };

    if (isEditMode && planLoading) {
        return <div className="p-8 flex justify-center text-muted-foreground">Loading plan details...</div>;
    }

    return (
        <div className="space-y-4 pb-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className=" cursor-pointer hover:underline" onClick={() => navigate('/plans-master')}>Plans</span>
                <ChevronRightIcon size={14} />
                <span className="text-foreground font-medium">{isEditMode ? 'Edit Plan' : 'Add New Plan'}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[calc(100vh-120px)] min-h-[500px]">
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        <div className="space-y-6">
                            {/* Section 1: General Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 bg-neutral-50/40 dark:bg-neutral-900/10 border border-border/70 rounded-xl">
                                <div className="space-y-2 flex flex-col justify-start">
                                    <label className="text-sm font-medium text-foreground">
                                        Plan Title <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({ ...formData, title: e.target.value });
                                            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                                        }}
                                        placeholder="e.g. Standard VPP Plan"
                                        className={`w-full ${errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    />
                                    {errors.title && <span className="text-xs text-destructive mt-1">{errors.title}</span>}
                                </div>

                                <div className="space-y-2 flex flex-col justify-start">
                                    <label className="text-sm font-medium text-foreground">
                                        Property Type <span className="text-destructive">*</span>
                                    </label>
                                    <Select
                                        value={formData.propertyType !== undefined ? String(formData.propertyType) : '0'}
                                        onChange={(val) => {
                                            setFormData(prev => ({ ...prev, propertyType: parseInt(Array.isArray(val) ? val[0] : val) }));
                                        }}
                                        options={[
                                            { label: 'Residential', value: '0' },
                                            { label: 'Commercial', value: '1' }
                                        ]}
                                        className="w-full h-[38px]"
                                    />
                                </div>

                                <div className="space-y-2 flex flex-col justify-start">
                                    <label className="text-sm font-medium text-foreground">
                                        State
                                    </label>
                                    <Select
                                        multiple
                                        value={formData.state ? formData.state.split(',').map(s => s.trim()).filter(Boolean) : []}
                                        onChange={(val) => {
                                            setFormData(prev => ({ ...prev, state: Array.isArray(val) ? val.join(', ') : val }));
                                        }}
                                        options={STATE_OPTIONS}
                                        placeholder="Select states..."
                                        className="w-full h-[38px]"
                                    />
                                </div>

                                <div className="space-y-2 flex flex-col justify-start col-span-1 md:col-span-3">
                                    <label className="text-sm font-medium text-foreground">
                                        Description <span className="text-destructive">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => {
                                            setFormData({ ...formData, description: e.target.value });
                                            if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                                        }}
                                        placeholder="Enter plan description..."
                                        className={`w-full min-h-[80px] rounded-md border ${errors.description ? 'border-destructive focus-visible:outline-destructive' : 'border-input focus-visible:outline-primary'} bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
                                    />
                                    {errors.description && <span className="text-xs text-destructive mt-1">{errors.description}</span>}
                                </div>

                                <div className="space-y-2 flex flex-col justify-start col-span-1">
                                    <label className="text-sm font-medium text-foreground">
                                        Discount
                                    </label>
                                    <div className="flex flex-wrap items-center gap-2 min-h-[40px] pt-1">
                                        {/* Standard Options */}
                                        {['0', '5', '7', '10', '13', '15'].map((opt) => {
                                            const isActive = !isCustomDiscountMode && formData.discount?.toString() === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => {
                                                        setIsCustomDiscountMode(false);
                                                        setFormData(prev => ({ ...prev, discount: parseFloat(opt) }));
                                                    }}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all h-8 ${
                                                        isActive
                                                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                            : "bg-white text-neutral-600 border-border hover:border-neutral-400 hover:text-neutral-900"
                                                    }`}
                                                >
                                                    {opt}%
                                                </button>
                                            );
                                        })}

                                        {/* Custom Option */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCustomDiscountMode(true);
                                            }}
                                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all h-8 ${
                                                (isCustomDiscountMode || (formData.discount !== undefined && !['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '')))
                                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                    : "bg-white text-neutral-600 border-border hover:border-neutral-400 hover:text-neutral-900"
                                            }`}
                                        >
                                            Custom
                                        </button>

                                        {/* Custom Input - Inline */}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center gap-2 ${
                                            (isCustomDiscountMode || (formData.discount !== undefined && !['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '')))
                                                ? "w-[120px] opacity-100"
                                                : "w-0 opacity-0"
                                        }`}>
                                            <div className="relative w-full">
                                                <Input
                                                    type="number"
                                                    value={!['0', '5', '7', '10', '13', '15'].includes(formData.discount?.toString() || '') ? (formData.discount ?? '') : ''}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                                    placeholder="0"
                                                    className="h-8 text-xs pr-6"
                                                    min={0}
                                                    max={100}
                                                    step={0.01}
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 flex flex-col justify-start col-span-1">
                                    <label className="text-sm font-medium text-foreground">
                                        Requirements
                                    </label>
                                    <div className="flex flex-row items-center gap-6 min-h-[40px] pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-4 h-4 border border-input rounded shadow-sm group-hover:border-primary transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    checked={formData.isSolarRequired}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isSolarRequired: e.target.checked }))}
                                                />
                                                {formData.isSolarRequired && <CheckIcon size={12} className="text-primary pointer-events-none" />}
                                            </div>
                                            <span className="text-sm text-foreground select-none">Solar Required</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-4 h-4 border border-input rounded shadow-sm group-hover:border-primary transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    checked={formData.isBatteryRequired}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isBatteryRequired: e.target.checked }))}
                                                />
                                                {formData.isBatteryRequired && <CheckIcon size={12} className="text-primary pointer-events-none" />}
                                            </div>
                                            <span className="text-sm text-foreground select-none">Battery Required</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2 flex flex-col justify-start col-span-1">
                                    <label className="text-sm font-medium text-foreground">
                                        Attach
                                    </label>
                                    <div className="flex flex-row items-center gap-6 min-h-[40px] pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-4 h-4 border border-input rounded shadow-sm group-hover:border-primary transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    className="absolute opacity-0 w-full h-full cursor-pointer"
                                                    checked={formData.attachNominationForm}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, attachNominationForm: e.target.checked }))}
                                                />
                                                {formData.attachNominationForm && <CheckIcon size={12} className="text-primary pointer-events-none" />}
                                            </div>
                                            <span className="text-sm text-foreground select-none">Nomination Form</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Associated Bonuses Card */}
                            <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2 uppercase tracking-wider">
                                    <span className="w-1.5 h-3.5 rounded-full bg-primary" />
                                    Associated Bonuses
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-neutral-50/40 dark:bg-neutral-900/10 border border-border/70 rounded-xl mb-4">
                                    <div className="space-y-2 flex flex-col justify-start">
                                        <label className="text-sm font-medium text-foreground">
                                            Contract Term
                                        </label>
                                        <Input
                                            value={formData.contractTerm}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contractTerm: e.target.value }))}
                                            placeholder="e.g. 12 Months"
                                            className="w-full bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col justify-start">
                                        <label className="text-sm font-medium text-foreground">
                                            Exit Fee
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                value={formData.exitFee}
                                                onChange={(e) => setFormData(prev => ({ ...prev, exitFee: e.target.value }))}
                                                placeholder="0.00"
                                                className="w-full pl-7 bg-background"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                    {activeBonuses.map((bonus: any) => {
                                        const isChecked = formData.bonusUids.includes(bonus.uid);
                                        return (
                                            <div 
                                                key={bonus.uid} 
                                                onClick={() => {
                                                    const newUids = isChecked
                                                        ? formData.bonusUids.filter(uid => uid !== bonus.uid)
                                                        : [...formData.bonusUids, bonus.uid];
                                                    setFormData(prev => ({ ...prev, bonusUids: newUids }));
                                                }}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                                                    isChecked 
                                                        ? 'border-primary bg-primary/5 shadow-sm' 
                                                        : 'border-border bg-background hover:border-neutral-400 hover:bg-neutral-50/50'
                                                }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                                                        {bonus.name}
                                                    </span>
                                                    {bonus.description && (
                                                        <span className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                                            {bonus.description}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                    isChecked 
                                                        ? 'border-primary bg-primary text-white' 
                                                        : 'border-input bg-card group-hover:border-neutral-400'
                                                }`}>
                                                    {isChecked && <CheckIcon size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {activeBonuses.length === 0 && (
                                        <span className="text-xs text-muted-foreground italic">No active bonuses available</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-border my-6"></div>

                        <div className="flex flex-col h-full gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-semibold text-foreground">Rate Components</h2>
                                    <p className="text-sm text-muted-foreground">Define rates and components for this plan. Enter rates without tax. At least one rate must be added.</p>
                                    {errors.components && <span className="text-xs text-destructive mt-1 font-medium bg-destructive/10 px-2 py-1 rounded w-fit">{errors.components}</span>}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setCustomRateDraft({ name: '', description: '', rate: '', unit: '', planType: 'fixed', tariffUid: '', dynamicType: '', rateType: 'Fixed' });
                                        setIsCustomModalOpen(true);
                                    }}
                                    className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
                                >
                                    <span className="text-lg leading-none">+</span> Add Custom Rate
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                                {/* Left Side: Default Components */}
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-3 h-5">
                                        <h3 className="text-sm font-medium text-foreground leading-none">Default Rates</h3>
                                    </div>
                                    <div className="overflow-x-auto rounded-md border border-border">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                                <tr>
                                                    <th className="px-3 py-2 font-medium w-[35%]">Component</th>
                                                    <th className="px-3 py-2 font-medium w-[160px]">Type</th>
                                                    <th className="px-3 py-2 font-medium">Rate</th>
                                                    <th className="px-3 py-2 font-medium">Unit</th>
                                                    <th className="px-3 py-2 font-medium w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {formData.components.map((comp: any, index) => (!comp.isDynamic && !comp.isCustom) ? (
                                                    <tr key={`${comp.name}-${index}`} className="hover:bg-muted/30 bg-card">
                                                        <td className="px-3 py-1.5 align-middle">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-foreground text-xs tracking-wide">{comp.name}</span>
                                                                <span className="text-[9px] uppercase font-bold text-muted-foreground/70 tracking-wider">
                                                                    {(() => {
                                                                        const name = comp.name.toUpperCase();
                                                                        if (name.includes('CL1') || name.includes('CL2')) return 'CONTROLLED LOAD';
                                                                        if (name.includes('DEMAND')) return 'DEMAND CHARGES';
                                                                        if (name.includes('SUPPLY')) return 'SUPPLY CHARGES';
                                                                        if (name.includes('VPP')) return 'VPP CHARGES';
                                                                        if (name.includes('FIT')) return 'SOLAR FIT';
                                                                        return 'ENERGY RATES';
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-1.5 align-middle">
                                                            <Select
                                                                value={comp.rateType || 'None'}
                                                                onChange={(val) => handleComponentChange(index, 'rateType', Array.isArray(val) ? val[0] : val)}
                                                                options={[
                                                                    { label: 'None', value: 'None' },
                                                                    { label: 'Fixed', value: 'Fixed' },
                                                                    { label: 'According to Tariff', value: 'According to Tariff' }
                                                                ]}
                                                                className="h-7 text-xs w-[140px]"
                                                            />
                                                        </td>
                                                        {comp.rateType === 'Fixed' ? (
                                                            <>
                                                                <td className="px-3 py-1.5 align-middle">
                                                                    <Input
                                                                        type="number"
                                                                        step="any"
                                                                        min="0"
                                                                        value={comp.rate}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                                                handleComponentChange(index, 'rate', val);
                                                                            }
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                                                        }}
                                                                        placeholder="0.00"
                                                                        className="h-7 text-xs font-medium min-w-[80px]"
                                                                    />
                                                                </td>
                                                                <td className="px-3 py-1.5 align-middle">
                                                                    <div className="flex items-center gap-2 relative min-w-[100px]">
                                                                        <Select
                                                                            value={comp.unit}
                                                                            onChange={(val) => {
                                                                                handleComponentChange(index, 'unit', Array.isArray(val) ? val[0] : val);
                                                                                if (errors[`comp-${index}-unit`]) setErrors(prev => ({ ...prev, [`comp-${index}-unit`]: '' }));
                                                                            }}
                                                                            placeholder="Unit"
                                                                            options={unitOptions}
                                                                            isLoading={unitsLoading}
                                                                            className={`h-7 text-xs flex-1 ${errors[`comp-${index}-unit`] ? 'border-destructive focus-within:ring-destructive' : ''}`}
                                                                        />
                                                                        {errors[`comp-${index}-unit`] && (
                                                                            <div title={errors[`comp-${index}-unit`]} className="text-destructive cursor-help shrink-0">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <td colSpan={2} className="px-3 py-1.5 align-middle text-center">
                                                                <span className="text-xs text-muted-foreground italic">
                                                                    {comp.rateType === 'None' ? '- Not Included -' : '- From Tariff -'}
                                                                </span>
                                                            </td>
                                                        )}
                                                        <td className="px-3 py-1.5 align-middle text-right">
                                                        </td>
                                                    </tr>
                                                ) : null)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Right Side: Custom / Dynamic Components */}
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-3 h-5">
                                        <h3 className="text-sm font-medium text-foreground leading-none">Custom / Dynamic Rates</h3>
                                    </div>

                                    {formData.components.some((comp: any) => comp.isDynamic || comp.isCustom) ? (
                                        <div className="overflow-x-auto rounded-md border border-blue-200">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-blue-500/10 text-xs uppercase text-blue-700">
                                                    <tr>
                                                        <th className="px-3 py-2 font-medium w-[35%]">Component</th>
                                                        <th className="px-3 py-2 font-medium w-[160px]">Type</th>
                                                        <th className="px-3 py-2 font-medium">Rate</th>
                                                        <th className="px-3 py-2 font-medium">Unit</th>
                                                        <th className="px-3 py-2 font-medium w-10"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-blue-100">
                                                    {formData.components.map((comp: any, index) => (comp.isDynamic || comp.isCustom) ? (
                                                        <tr key={`${comp.name}-${index}`} className="hover:bg-blue-500/10 bg-blue-500/5">
                                                            <td className="px-3 py-1.5 align-middle">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-foreground text-xs tracking-wide">{comp.name}</span>
                                                                    {comp.description && (
                                                                        <span className="text-[10px] text-muted-foreground leading-tight my-0.5">{comp.description}</span>
                                                                    )}
                                                                    <span className="text-[9px] uppercase font-bold text-blue-600/80 tracking-wider">
                                                                        {comp.dynamicType ? String(comp.dynamicType).replace(/_/g, ' ') : 'DYNAMIC RATE'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-1.5 align-middle">
                                                                <Select
                                                                    value={comp.rateType || 'None'}
                                                                    onChange={(val) => handleComponentChange(index, 'rateType', Array.isArray(val) ? val[0] : val)}
                                                                    options={[
                                                                        { label: 'None', value: 'None' },
                                                                        { label: 'Fixed', value: 'Fixed' },
                                                                        { label: 'According to Tariff', value: 'According to Tariff' }
                                                                    ]}
                                                                    className="h-7 text-xs w-[140px]"
                                                                />
                                                            </td>
                                                            {comp.rateType === 'Fixed' ? (
                                                                <>
                                                                    <td className="px-3 py-1.5 align-middle">
                                                                        <Input
                                                                            type="number"
                                                                            step="any"
                                                                            min="0"
                                                                            value={comp.rate}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                                                    handleComponentChange(index, 'rate', val);
                                                                                }
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                                                            }}
                                                                            placeholder="0.00"
                                                                            className="h-7 text-xs font-medium border-blue-200 focus:border-blue-500 min-w-[80px]"
                                                                        />
                                                                    </td>
                                                                    <td className="px-3 py-1.5 align-middle">
                                                                        <div className="flex items-center gap-2 relative min-w-[100px]">
                                                                            <Select
                                                                                value={comp.unit}
                                                                                onChange={(val) => {
                                                                                    handleComponentChange(index, 'unit', Array.isArray(val) ? val[0] : val);
                                                                                    if (errors[`comp-${index}-unit`]) setErrors(prev => ({ ...prev, [`comp-${index}-unit`]: '' }));
                                                                                }}
                                                                                placeholder="Unit"
                                                                                options={unitOptions}
                                                                                isLoading={unitsLoading}
                                                                                className={`h-7 text-xs flex-1 ${errors[`comp-${index}-unit`] ? 'border-destructive focus-within:ring-destructive' : ''}`}
                                                                            />
                                                                            {errors[`comp-${index}-unit`] && (
                                                                                <div title={errors[`comp-${index}-unit`]} className="text-destructive cursor-help shrink-0">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <td colSpan={2} className="px-3 py-1.5 align-middle text-center">
                                                                    <span className="text-xs text-blue-600/60 italic">
                                                                        {comp.rateType === 'None' ? '- Not Included -' : '- From Tariff -'}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            <td className="px-3 py-1.5 align-middle text-right">
                                                                {comp.isCustom && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newComps = formData.components.filter((_, i) => i !== index);
                                                                            setFormData({ ...formData, components: newComps });
                                                                        }}
                                                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                                        title="Remove Rate"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ) : null)}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex-1 rounded-md border border-dashed border-border flex items-center justify-center p-8 bg-muted/20 min-h-[150px]">
                                            <p className="text-sm text-muted-foreground text-center">
                                                No custom rates added yet.<br />
                                                <span className="text-xs opacity-70">Click "+ Add Custom Rate" to create one.</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 bg-card z-20 flex justify-end gap-3 py-4 px-5 border-t border-border rounded-b-xl shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
                        <Button type="button" variant="outline" onClick={() => navigate('/plans-master')} disabled={creating || updating}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={creating || updating}>
                            {isEditMode ? 'Save Changes' : 'Create Plan'}
                        </Button>
                    </div>
                </div>
            </form>

            <Modal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                title="Add Custom Dynamic Rate"
                size="md"
            >
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rate Name <span className="text-destructive">*</span></label>
                        <Input
                            value={customRateDraft.name}
                            onChange={(e) => setCustomRateDraft({ ...customRateDraft, name: e.target.value })}
                            placeholder="e.g. Special Discount Rate"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={customRateDraft.description}
                            onChange={(e) => setCustomRateDraft({ ...customRateDraft, description: e.target.value })}
                            placeholder="Optional description"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select
                            value={customRateDraft.dynamicType}
                            onChange={(val) => setCustomRateDraft({ ...customRateDraft, dynamicType: Array.isArray(val) ? val[0] : val })}
                            options={[
                                { label: 'Extra Charges', value: 'Extra Charges' },
                                { label: 'Extra FIT', value: 'Extra FIT' },
                                { label: 'Energy Rates', value: 'Energy Rates' },
                                { label: 'VPP Charges', value: 'VPP Charges' },
                                { label: 'Supply Charges', value: 'Supply Charges' },
                                { label: 'Solar FIT', value: 'Solar FIT' },
                                { label: 'Controlled Load', value: 'Controlled Load' },
                                { label: 'Demand Charges', value: 'Demand Charges' },
                            ]}
                            placeholder="Select type"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rate <span className="text-destructive">*</span></label>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                value={customRateDraft.rate}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setCustomRateDraft({ ...customRateDraft, rate: val });
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                }}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Unit <span className="text-destructive">*</span></label>
                            <Select
                                value={customRateDraft.unit}
                                onChange={(val) => setCustomRateDraft({ ...customRateDraft, unit: Array.isArray(val) ? val[0] : val })}
                                options={unitOptions}
                                placeholder="Select Unit"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCustomModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (!customRateDraft.name) return toast.error('Rate Name is required');
                                if (!customRateDraft.rate) return toast.error('Rate is required');
                                if (!customRateDraft.unit) return toast.error('Unit is required');

                                setFormData(prev => ({
                                    ...prev,
                                    components: [
                                        ...prev.components,
                                        {
                                            ...customRateDraft,
                                            isDynamic: true,
                                            isCustom: true
                                        }
                                    ]
                                }));
                                setIsCustomModalOpen(false);
                            }}
                        >
                            Add Rate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
