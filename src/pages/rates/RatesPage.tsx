import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable, type Column, Modal } from '@/components/common';
import { PlusIcon, RefreshCwIcon, TrashIcon, PencilIcon, SaveIcon, ClockIcon, AlertCircleIcon } from '@/components/icons';
import { GET_RATE_PLANS, HAS_RATES_CHANGES, GET_MEASUREMENT_UNITS } from '@/graphql/queries/rates';
import {
    CREATE_RATE_PLAN,
    // UPDATE_RATE_PLAN, 
    UPDATE_RATE_PLANS,
    SOFT_DELETE_RATE_PLAN, RESTORE_RATE_PLAN, CREATE_RATES_SNAPSHOT,
    CREATE_MEASUREMENT_UNIT, DELETE_MEASUREMENT_UNIT
} from '@/graphql/mutations/rates';
import { formatSydneyTime } from '@/lib/date';
import { useAuthStore } from '@/stores/useAuthStore';
import { StatusField } from '@/components/common';
import { STATE_OPTIONS, DNSP_OPTIONS, DNSP_MAP, RATE_TYPE_MAP } from '@/lib/constants';
import { Tooltip } from '@/components/ui/Tooltip';
import { RatesHistoryModal } from './components/RatesHistoryModal';


// Interfaces based on the query
interface DynamicRate {
    id: string;
    name: string;
    value: string;
    unitId: string;
    type: 'charges' | 'fit';
}

interface RateOffer {
    id: string;
    uid: string;
    offerName: string;
    type: string;
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
    fitPeak?: number;
    fitCritical?: number;
    fitVpp?: number;
    offPeak: number;
    peak: number;
    shoulder: number;
    supplyCharge: number;
    vppOrcharge: number;
    priceUnits?: Record<string, string>;
    dynamicRates?: DynamicRate[];
    isActive: boolean;
    isDeleted: boolean;
}

interface RatePlan {
    id: string;
    uid: string;
    codes: string[];
    planId: string;
    dnsp: string;
    state: string;
    type: string; // Residential/Business
    vpp: number;
    discountApplies: boolean;
    discountPercentage: number;
    tariff: string;
    isActive: boolean;
    isDeleted: number; // 0 = active, 1 = deleted
    offers: RateOffer[];
    updatedAt: string;
}

export interface MeasurementUnit {
    id: string;
    uid: string;
    name: string;
}

interface RatePlansResponse {
    ratePlans: {
        data: RatePlan[];
        meta: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            recordsPerPage: number;
        };
    };
}

export function RatesPage() {
    const [searchCode, setSearchCode] = useState('');
    const [debouncedSearchCode, setDebouncedSearchCode] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [dnspFilter, setDnspFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [allRatePlans, setAllRatePlans] = useState<RatePlan[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const limit = 20;

    // Permissions
    const canCreate = useAuthStore((state) => state.canCreateInMenu('rates'));
    const canEdit = useAuthStore((state) => state.canEditInMenu('rates'));
    const canDelete = useAuthStore((state) => state.canDeleteInMenu('rates'));
    // Add Rate Modal State
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false); // Ref-based guard for preventing multiple calls

    const initialFormState = {
        codes: '',
        planId: '',
        tariff: '',
        state: 'NSW',
        dnsp: 0,
        type: 0,
        vpp: 0,
        discountApplies: 0,
        discountPercentage: 0,
        isActive: 1, // 1 = active, 0 = hidden
        // Offer fields
        offerName: '',
        anytime: '',
        supplyCharge: '',
        vppOrcharge: '',
        peak: '',
        shoulder: '',
        offPeak: '',
        cl1Supply: '',
        cl1Usage: '',
        cl2Supply: '',
        cl2Usage: '',
        demand: '',
        demandOp: '',
        demandP: '',
        demandS: '',
        fit: '',
        fitPeak: '',
        fitCritical: '',
        fitVpp: '',
        priceUnits: {} as Record<string, string>,
        dynamicRates: [] as DynamicRate[],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Edit mode state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingRatePlan, setEditingRatePlan] = useState<RatePlan | null>(null);

    // Manage Units state
    const [unitsModalOpen, setUnitsModalOpen] = useState(false);
    const [newUnitName, setNewUnitName] = useState('');
    const [isCreatingUnit, setIsCreatingUnit] = useState(false);
    const [deletingUnitUid, setDeletingUnitUid] = useState<string | null>(null);

    // Local Edit State
    const [localOriginals, setLocalOriginals] = useState<Map<string, RatePlan>>(new Map());
    const [localModifiedUids, setLocalModifiedUids] = useState<Set<string>>(new Set());
    const [localCreatedUids, setLocalCreatedUids] = useState<Set<string>>(new Set());
    const [localDeletedUids, setLocalDeletedUids] = useState<Set<string>>(new Set());
    const [localRestoredUids, setLocalRestoredUids] = useState<Set<string>>(new Set());

    // Delete/Restore state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ratePlanToDelete, setRatePlanToDelete] = useState<RatePlan | null>(null);
    const [deleteConfirmCode, setDeleteConfirmCode] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [ratePlanToRestore, setRatePlanToRestore] = useState<RatePlan | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    // Mutations
    // Mutations
    const [createRatePlan] = useMutation(CREATE_RATE_PLAN);
    // const [updateRatePlan] = useMutation(UPDATE_RATE_PLAN);
    const [updateRatePlans, { loading: isUpdating }] = useMutation(UPDATE_RATE_PLANS);
    const [softDeleteRatePlan] = useMutation(SOFT_DELETE_RATE_PLAN);
    const [restoreRatePlanMutation] = useMutation(RESTORE_RATE_PLAN);
    const [createRatesSnapshot, { loading: isSnapshotting }] = useMutation(CREATE_RATES_SNAPSHOT);

    const [createMeasurementUnitMutation] = useMutation(CREATE_MEASUREMENT_UNIT, {
        refetchQueries: [{ query: GET_MEASUREMENT_UNITS }]
    });

    const [deleteMeasurementUnitMutation] = useMutation(DELETE_MEASUREMENT_UNIT, {
        refetchQueries: [{ query: GET_MEASUREMENT_UNITS }]
    });

    const handleCreateUnit = async () => {
        if (!newUnitName.trim()) {
            toast.error("Unit name cannot be empty");
            return;
        }
        setIsCreatingUnit(true);
        try {
            await createMeasurementUnitMutation({
                variables: { name: newUnitName.trim() }
            });
            toast.success(`Unit "${newUnitName.trim()}" created successfully`);
            setNewUnitName('');
        } catch (e: any) {
            toast.error(e.message || "Failed to create unit");
        } finally {
            setIsCreatingUnit(false);
        }
    };

    const handleDeleteUnit = async (uid: string) => {
        setDeletingUnitUid(uid);
        try {
            await deleteMeasurementUnitMutation({ variables: { uid } });
            toast.success("Unit deleted successfully");
        } catch (e: any) {
            toast.error(e.message || "Failed to delete unit");
        } finally {
            setDeletingUnitUid(null);
        }
    };

    const handleResetLocalChanges = () => {
        if (!hasLocalChanges) return;

        // Revert allRatePlans to exclude local creations and restore local deletions/modifications
        setAllRatePlans(prev => {
            // Remove local creations
            const filtered = prev.filter(p => !localCreatedUids.has(p.uid));

            // Restore originals for modifications/deletions
            return filtered.map(plan => {
                const original = localOriginals.get(plan.uid);
                return original ? JSON.parse(JSON.stringify(original)) : plan;
            });
        });

        // Clear tracking
        setLocalModifiedUids(new Set());
        setLocalCreatedUids(new Set());
        setLocalDeletedUids(new Set());
        setLocalRestoredUids(new Set());
        setLocalOriginals(new Map());

        toast.info('Changes discarded');
    };

    const handleCreateSnapshot = async () => {
        // Collect all local changes
        if (!hasLocalChanges && !hasUnsavedChanges) {
            toast.info('No changes to save');
            return;
        }

        try {
            // 1. Creations
            const createdPlans = Array.from(localCreatedUids)
                .map(uid => allRatePlans.find(p => p.uid === uid))
                .filter((p): p is RatePlan => !!p);

            const creationPromises = createdPlans.map(plan => {
                const input = {
                    codes: Array.isArray(plan.codes) ? plan.codes.join(', ') : plan.codes,
                    planId: plan.planId || undefined,
                    tariff: plan.tariff || undefined,
                    state: plan.state,
                    dnsp: parseInt(String(plan.dnsp), 10),
                    type: parseInt(String(plan.type || 0), 10),
                    vpp: plan.vpp ? 1 : 0,
                    discountApplies: plan.discountApplies ? 1 : 0,
                    discountPercentage: plan.discountPercentage || 0,
                    offers: plan.offers.map(o => ({
                        offerName: o.offerName,
                        anytime: parseFloat(String(o.anytime || 0)),
                        supplyCharge: parseFloat(String(o.supplyCharge || 0)),
                        vppOrcharge: parseFloat(String(o.vppOrcharge || 0)),
                        peak: parseFloat(String(o.peak || 0)),
                        shoulder: parseFloat(String(o.shoulder || 0)),
                        offPeak: parseFloat(String(o.offPeak || 0)),
                        cl1Supply: parseFloat(String(o.cl1Supply || 0)),
                        cl1Usage: parseFloat(String(o.cl1Usage || 0)),
                        cl2Supply: parseFloat(String(o.cl2Supply || 0)),
                        cl2Usage: parseFloat(String(o.cl2Usage || 0)),
                        demand: parseFloat(String(o.demand || 0)),
                        demandOp: parseFloat(String(o.demandOp || 0)),
                        demandP: parseFloat(String(o.demandP || 0)),
                        demandS: parseFloat(String(o.demandS || 0)),
                        fit: parseFloat(String(o.fit || 0)),
                        fitPeak: parseFloat(String(o.fitPeak || 0)),
                        fitCritical: parseFloat(String(o.fitCritical || 0)),
                        fitVpp: parseFloat(String(o.fitVpp || 0)),
                        priceUnits: o.priceUnits,
                        dynamicRates: o.dynamicRates,
                    }))
                };
                return createRatePlan({ variables: { input } });
            });

            // 2. Modifications - Filter out any plans that were locally created (temp UIDs)
            const updateInputs = Array.from(localModifiedUids)
                .filter(uid => !localCreatedUids.has(uid)) // CRITICAL: Skip temp UIDs
                .map(uid => {
                    const plan = allRatePlans.find(p => p.uid === uid);
                    if (!plan) return null;

                    const inputData = {
                        codes: Array.isArray(plan.codes) ? plan.codes.join(',') : plan.codes,
                        planId: plan.planId,
                        tariff: plan.tariff,
                        dnsp: typeof plan.dnsp === 'string' ? parseInt(plan.dnsp) : plan.dnsp,
                        state: plan.state,
                        type: parseInt(String(plan.type || 0), 10),
                        vpp: plan.vpp,
                        discountApplies: plan.discountApplies ? 1 : 0,
                        discountPercentage: plan.discountPercentage,
                        isActive: plan.isActive,
                        offers: plan.offers.map(o => ({
                            uid: o.uid.startsWith('temp-') ? undefined : o.uid,
                            offerName: o.offerName,
                            anytime: parseFloat(String(o.anytime || 0)),
                            supplyCharge: parseFloat(String(o.supplyCharge || 0)),
                            vppOrcharge: parseFloat(String(o.vppOrcharge || 0)),
                            peak: parseFloat(String(o.peak || 0)),
                            shoulder: parseFloat(String(o.shoulder || 0)),
                            offPeak: parseFloat(String(o.offPeak || 0)),
                            cl1Supply: parseFloat(String(o.cl1Supply || 0)),
                            cl1Usage: parseFloat(String(o.cl1Usage || 0)),
                            cl2Supply: parseFloat(String(o.cl2Supply || 0)),
                            cl2Usage: parseFloat(String(o.cl2Usage || 0)),
                            demand: parseFloat(String(o.demand || 0)),
                            demandOp: parseFloat(String(o.demandOp || 0)),
                            demandP: parseFloat(String(o.demandP || 0)),
                            demandS: parseFloat(String(o.demandS || 0)),
                            fit: parseFloat(String(o.fit || 0)),
                            fitPeak: parseFloat(String(o.fitPeak || 0)),
                            fitCritical: parseFloat(String(o.fitCritical || 0)),
                            fitVpp: parseFloat(String(o.fitVpp || 0)),
                            priceUnits: o.priceUnits,
                            dynamicRates: o.dynamicRates,
                        }))
                    };

                    return {
                        uid: plan.uid,
                        data: inputData
                    };
                })
                .filter((i): i is { uid: string; data: any } => !!i);

            const updatePromise = updateInputs.length > 0 ? updateRatePlans({ variables: { inputs: updateInputs } }) : Promise.resolve();

            // 3. Deletions
            const deletionPromises = Array.from(localDeletedUids).map(uid => softDeleteRatePlan({ variables: { uid } }));

            // 4. Restorations
            const restorationPromises = Array.from(localRestoredUids).map(uid => restoreRatePlanMutation({ variables: { uid } }));

            // Execute all save operations
            await Promise.all([...creationPromises, updatePromise, ...deletionPromises, ...restorationPromises]);

            toast.success('All changes saved successfully');

            // Clear local tracking
            setLocalModifiedUids(new Set());
            setLocalCreatedUids(new Set());
            setLocalDeletedUids(new Set());
            setLocalRestoredUids(new Set());
            setLocalOriginals(new Map());

            // Create a global snapshot for version history
            await createRatesSnapshot({
                variables: {
                    ratePlanUid: 'MANUAL_SAVE_ALL',
                    action: 'VERSION'
                }
            });

            // Refetch to get real UIDs and update state
            setTimeout(() => {
                refetchChanges?.();
                setAllRatePlans([]); // Reset to force a clean re-fetch if needed, or just let refetch handle it
                setPage(1);
                refetch();
            }, 500);

        } catch (error: any) {
            console.error('Failed to save changes:', error);
            toast.error(error.message || 'Failed to save changes');
        }
    };

    // Helper to compare if plan has changes
    const hasPlanChanged = (current: any, snapshot: any) => {
        // Compare basic fields
        if (current.planId !== snapshot.planId) return true;
        if (current.tariff !== snapshot.tariff) return true;
        if (current.state !== snapshot.state) return true;

        // Loose comparison for DNSP numbers vs strings
        if (String(current.dnsp || '') != String(snapshot.dnsp || '')) return true;
        if (String(current.type || '') != String(snapshot.type || '')) return true;
        if (current.vpp != snapshot.vpp) return true;

        const currentDiscount = current.discountApplies ? 1 : 0;
        const snapshotDiscount = snapshot.discountApplies ? 1 : 0;
        if (currentDiscount != snapshotDiscount) return true;

        if (current.discountPercentage != snapshot.discountPercentage) return true;

        // Compare codes - Normalize spacing
        const normalizeCodes = (c: any) => {
            if (!c) return '';
            const arr = Array.isArray(c) ? c : String(c).split(',');
            return arr.map((s: string) => s.trim()).sort().join(',');
        };
        if (normalizeCodes(current.codes) !== normalizeCodes(snapshot.codes)) return true;

        // Compare Offers
        const cOffers = current.offers || [];
        const sOffers = snapshot.offers || [];

        if (cOffers.length !== sOffers.length) return true;

        for (let i = 0; i < cOffers.length; i++) {
            const cOffer = cOffers[i];
            const sOffer = sOffers.find((o: any) => o.offerName === cOffer.offerName) || sOffers[i];

            if (!sOffer) return true;

            const fields = [
                'anytime', 'supplyCharge', 'vppOrcharge',
                'peak', 'shoulder', 'offPeak',
                'cl1Supply', 'cl1Usage', 'cl2Supply', 'cl2Usage',
                'demand', 'demandOp', 'demandP', 'demandS',
                'fit', 'fitPeak', 'fitCritical', 'fitVpp'
            ];

            for (const field of fields) {
                // Parse float to handle string "0.00" vs number 0
                const v1 = parseFloat(String(cOffer[field] || 0));
                const v2 = parseFloat(String(sOffer[field] || 0));
                if (Math.abs(v1 - v2) > 0.0001) return true; // Float comparison
            }

            // Compare dynamic rates
            const cDyn = JSON.stringify(cOffer.dynamicRates || []);
            const sDyn = JSON.stringify(sOffer.dynamicRates || []);
            if (cDyn !== sDyn) return true;
        }

        return false;
    };

    // Handler for improved local restore flow
    const handleApplyLocalSnapshot = (snapshotData: any[]) => {
        const newLocalOriginals = new Map(localOriginals);
        const newLocalModifiedUids = new Set(localModifiedUids);
        const newAllRatePlans = [...allRatePlans]; // Clone array
        let changedCount = 0;

        snapshotData.forEach((snapshotPlan: any) => {
            // Find corresponding plan in current list
            const currentPlanIndex = newAllRatePlans.findIndex(p => p.uid === snapshotPlan.uid);

            if (currentPlanIndex !== -1) {
                const currentPlan = newAllRatePlans[currentPlanIndex];

                // Only update if there are actual changes
                if (hasPlanChanged(currentPlan, snapshotPlan)) {
                    // If not already modified, save current state as original
                    if (!newLocalOriginals.has(currentPlan.uid)) {
                        newLocalOriginals.set(currentPlan.uid, JSON.parse(JSON.stringify(currentPlan)));
                    }

                    // Update the plan in the list with snapshot data
                    newAllRatePlans[currentPlanIndex] = {
                        ...currentPlan,
                        ...snapshotPlan,
                        offers: snapshotPlan.offers || []
                    };

                    // Mark as locally modified
                    newLocalModifiedUids.add(currentPlan.uid);
                    changedCount++;
                }
            }
        });

        if (changedCount === 0) {
            toast.info('No differences found in this version');
            return;
        }

        // Update state
        setLocalOriginals(newLocalOriginals);
        setLocalModifiedUids(newLocalModifiedUids);
        setAllRatePlans(newAllRatePlans);
        toast.info(`Loaded ${changedCount} changed plans.`);
    };

    // History state
    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    const handleOpenHistory = () => {
        setHistoryModalOpen(true);
    };

    // Debounce search code
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearchCode !== searchCode) {
                setAllRatePlans([]);
                setPage(1);
                setDebouncedSearchCode(searchCode);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchCode, debouncedSearchCode]);

    const { data, loading, error, refetch } = useQuery<RatePlansResponse>(GET_RATE_PLANS, {
        variables: {
            page,
            limit,
            search: debouncedSearchCode || undefined,
            state: stateFilter || undefined,
            dnsp: dnspFilter ? parseInt(dnspFilter, 10) : undefined,
            type: typeFilter ? parseInt(typeFilter, 10) : undefined,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    const meta = data?.ratePlans?.meta;
    const hasMore = meta ? page < meta.totalPages : false;

    // Fetch measurement units
    const { data: unitsData } = useQuery(GET_MEASUREMENT_UNITS, {
        fetchPolicy: 'cache-first',
    });
    const measurementUnits: MeasurementUnit[] = unitsData?.measurementUnits || [];

    // Check if current rates have changes compared to active version (backend comparison)
    const { data: changesData, refetch: refetchChanges } = useQuery(HAS_RATES_CHANGES, {
        fetchPolicy: 'network-only',
    });

    const hasUnsavedChanges = changesData?.hasRatesChanges?.hasChanges ?? true;
    const hasLocalChanges = localModifiedUids.size > 0 || localCreatedUids.size > 0 || localDeletedUids.size > 0 || localRestoredUids.size > 0;

    // Navigation Blocking
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasLocalChanges && currentLocation.pathname !== nextLocation.pathname
    );

    // Browser Refresh/Close Warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasLocalChanges) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasLocalChanges]);


    const changedRatePlanUids = useMemo(() => new Set(changesData?.hasRatesChanges?.changedRatePlanUids || []), [changesData]);

    const unitMap = useMemo(() => {
        const map = new Map<string, string>();
        measurementUnits.forEach(u => map.set(u.uid, u.name));
        return map;
    }, [measurementUnits]);

    const dynamicFieldNames = useMemo(() => {
        const names = new Set<string>();
        allRatePlans.forEach(plan => {
            plan.offers?.[0]?.dynamicRates?.forEach(rate => {
                if (rate.name) names.add(rate.name.toLowerCase());
            });
        });
        return Array.from(names).sort();
    }, [allRatePlans]);

    // Map of old records for comparison: uid -> oldRecord object
    const oldRecordsMap = useMemo(() => {
        const map = new Map<string, any>();
        if (changesData?.hasRatesChanges?.changes) {
            changesData.hasRatesChanges.changes.forEach((change: any) => {
                try {
                    if (change.oldRecord) {
                        map.set(change.uid, JSON.parse(change.oldRecord));
                    }
                } catch (e) {
                    console.error('Error parsing old record', e);
                }
            });
        }
        return map;
    }, [changesData]);

    const isFieldChanged = useCallback((row: RatePlan, fieldKey: string) => {
        // Local creations: everything is new
        if (localCreatedUids.has(row.uid)) return true;

        // Local deletions: status is changed
        if (fieldKey === 'isDeleted' && localDeletedUids.has(row.uid)) return true;

        // Check local originals first, then backend changes
        const oldRecord: any = localOriginals.get(row.uid) || oldRecordsMap.get(row.uid);

        if (!oldRecord) return false; // New record or no change

        // Helper for offers comparison
        const getOfferValue = (offer: any, key: string) => offer?.[key];

        switch (fieldKey) {
            case 'state':
            case 'dnsp':
            case 'type':
            case 'tariff':
            case 'planId':
            case 'discountApplies':
            case 'discountPercentage':
            case 'vpp':
                // loose comparison for numbers/strings safe here
                return row[fieldKey as keyof RatePlan] != oldRecord[fieldKey];

            case 'codes':
                // Normalize both to string for comparison (oldRecord might be string, row.codes might be array)
                const currentCodes = Array.isArray(row.codes) ? row.codes.join(', ') : String(row.codes || '');
                const oldCodes = Array.isArray(oldRecord.codes) ? oldRecord.codes.join(', ') : String(oldRecord.codes || '');
                return currentCodes !== oldCodes;

            default:
                // Offer fields like 'offer_anytime'
                if (fieldKey.startsWith('offer_')) {
                    const offerKey = fieldKey.replace('offer_', '');
                    const newOffer = row.offers?.[0];
                    const oldOffer = oldRecord.offers?.[0]; // Assuming single offer structure
                    return getOfferValue(newOffer, offerKey) != getOfferValue(oldOffer, offerKey);
                }

                if (fieldKey.startsWith('dynamic_')) {
                    const dynamicName = fieldKey.replace('dynamic_', '');
                    const newRate = row.offers?.[0]?.dynamicRates?.find(r => r.name === dynamicName);
                    const oldRate = oldRecord.offers?.[0]?.dynamicRates?.find((r: any) => r.name === dynamicName);
                    return newRate?.value != oldRate?.value || newRate?.unitId != oldRate?.unitId;
                }
                return false;
        }
    }, [oldRecordsMap, localOriginals]);

    const getOldValue = useCallback((row: RatePlan, fieldKey: string) => {
        // Local creations: no old value
        if (localCreatedUids.has(row.uid)) return undefined;

        // Check local originals first, then backend changes
        const oldRecord: any = localOriginals.get(row.uid) || oldRecordsMap.get(row.uid);

        if (!oldRecord) return undefined;

        if (fieldKey.startsWith('offer_')) {
            const offerKey = fieldKey.replace('offer_', '');
            return oldRecord.offers?.[0]?.[offerKey];
        }

        if (fieldKey.startsWith('unit_')) {
            const unitKey = fieldKey.replace('unit_', '');
            return oldRecord.offers?.[0]?.priceUnits?.[unitKey];
        }

        if (fieldKey.startsWith('dynamic_')) {
            const dynamicName = fieldKey.replace('dynamic_', '');
            const oldRate = oldRecord.offers?.[0]?.dynamicRates?.find((r: any) => r.name === dynamicName);
            if (!oldRate) return undefined;
            return `${oldRate.value} ${unitMap.get(oldRate.unitId) || ''}`;
        }

        return oldRecord[fieldKey];
    }, [oldRecordsMap, localOriginals]);
    useEffect(() => {
        if (data?.ratePlans?.data) {
            const newData = data.ratePlans.data;
            const currentPage = data.ratePlans.meta?.currentPage || 1;

            if (currentPage === 1) {
                // Fresh load or filter change - replace all data
                setAllRatePlans(newData);
            } else {
                // Pagination - append new data avoiding duplicates
                setAllRatePlans(prev => {
                    const existingIds = new Set(prev.map(r => r.uid));
                    const newRatePlans = newData.filter(r => !existingIds.has(r.uid));
                    if (newRatePlans.length > 0) {
                        return [...prev, ...newRatePlans];
                    }
                    return prev;
                });
            }
            setIsLoadingMore(false);
        }
    }, [data]);

    // Handle load more
    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setPage(prev => prev + 1);
    };



    // const handleClearAll = () => {
    //     setSearchCode('');
    //     setDebouncedSearchCode('');
    //     setStateFilter('');
    //     setDnspFilter('');
    //     setTypeFilter('');
    //     setAllRatePlans([]);
    //     setPage(1);
    // };

    // Open Add Rate Modal
    const handleAddRate = () => {
        // Default to the first measurement unit if available
        // Units are assigned on-the-fly when values are edited

        setFormData({
            ...initialFormState,
            priceUnits: {}
        });
        setFormErrors({});
        setAddModalOpen(true);
    };

    // Validate form

    const handlePriceChange = (field: string, value: string) => {
        setFormData(prev => {
            const defaultUnitId = measurementUnits.length > 0 ? measurementUnits[0].uid : '';
            const existingUnit = prev.priceUnits?.[field];

            // If a value is entered and no unit is currently selected, set the default unit
            const newPriceUnits = { ...prev.priceUnits };
            if (value && !existingUnit && defaultUnitId) {
                newPriceUnits[field] = defaultUnitId;
            }

            return {
                ...prev,
                [field]: value,
                priceUnits: newPriceUnits
            };
        });
    };

    const handleDynamicRateChange = (index: number, field: keyof DynamicRate, value: string) => {
        setFormData(prev => {
            const newDynamicRates = [...prev.dynamicRates];
            const processedValue = field === 'name' ? value.toLowerCase() : value;
            newDynamicRates[index] = { ...newDynamicRates[index], [field]: processedValue };
            return { ...prev, dynamicRates: newDynamicRates };
        });
    };

    const addDynamicRate = () => {
        setFormData(prev => ({
            ...prev,
            dynamicRates: [
                ...prev.dynamicRates,
                { id: crypto.randomUUID(), name: '', value: '', unitId: measurementUnits[0]?.uid || '', type: 'charges' }
            ]
        }));
    };

    const removeDynamicRate = (index: number) => {
        setFormData(prev => ({
            ...prev,
            dynamicRates: prev.dynamicRates.filter((_, i) => i !== index)
        }));
    };
    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.codes?.trim()) {
            errors.codes = 'Code is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit Create Rate (LOCALLY ONLY)
    const handleCreateRate = async () => {
        if (isSubmitting) return; // Prevent multiple calls
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const tempUid = crypto.randomUUID();

            const newPlan: RatePlan = {
                id: tempUid,
                uid: tempUid,
                codes: formData.codes.split(',').map(c => c.trim()),
                planId: formData.planId,
                tariff: formData.tariff,
                state: formData.state,
                dnsp: String(formData.dnsp) as any,
                type: String(formData.type) as any,
                vpp: formData.vpp,
                discountApplies: formData.discountApplies === 1,
                discountPercentage: formData.discountPercentage || 0,
                isActive: true,
                isDeleted: 0,
                updatedAt: new Date().toISOString(),
                offers: [{
                    id: crypto.randomUUID(),
                    uid: crypto.randomUUID(),
                    offerName: formData.offerName || 'Default Offer',
                    anytime: parseFloat(formData.anytime) || 0,
                    supplyCharge: parseFloat(formData.supplyCharge) || 0,
                    vppOrcharge: parseFloat(formData.vppOrcharge) || 0,
                    peak: parseFloat(formData.peak) || 0,
                    shoulder: parseFloat(formData.shoulder) || 0,
                    offPeak: parseFloat(formData.offPeak) || 0,
                    cl1Supply: parseFloat(formData.cl1Supply) || 0,
                    cl1Usage: parseFloat(formData.cl1Usage) || 0,
                    cl2Supply: parseFloat(formData.cl2Supply) || 0,
                    cl2Usage: parseFloat(formData.cl2Usage) || 0,
                    demand: parseFloat(formData.demand) || 0,
                    demandOp: parseFloat(formData.demandOp) || 0,
                    demandP: parseFloat(formData.demandP) || 0,
                    demandS: parseFloat(formData.demandS) || 0,
                    fit: parseFloat(formData.fit) || 0,
                    fitPeak: parseFloat(formData.fitPeak) || 0,
                    fitCritical: parseFloat(formData.fitCritical) || 0,
                    fitVpp: parseFloat(formData.fitVpp) || 0,
                    priceUnits: formData.priceUnits,
                    dynamicRates: formData.dynamicRates,
                    type: '', // placeholder
                    isActive: true,
                    isDeleted: false
                }]
            };

            // Add locally
            setAllRatePlans(prev => [newPlan, ...prev]);
            setLocalCreatedUids(prev => new Set(prev).add(tempUid));

            setAddModalOpen(false);
            setFormData(initialFormState);
            toast.success('Rate plan added locally (unsaved)');
        } catch (err: any) {
            console.error('Failed to create rate plan locally:', err);
            toast.error('Failed to add rate plan locally');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Edit Rate Modal
    const handleEditRate = useCallback((ratePlan: RatePlan) => {
        setEditingRatePlan(ratePlan);
        const offer = ratePlan.offers?.[0];

        // Ensure price units default to the first available unit if undefined in the offer
        const defaultUnitId = measurementUnits.length > 0 ? measurementUnits[0].uid : '';
        const existingUnits = typeof offer?.priceUnits === 'string' ? JSON.parse(offer.priceUnits) : (offer?.priceUnits || {});

        const priceUnitsWithDefaults = { ...existingUnits };
        const priceFields = ['anytime', 'supplyCharge', 'vppOrcharge', 'peak', 'shoulder', 'offPeak', 'cl1Supply', 'cl1Usage', 'cl2Supply', 'cl2Usage', 'demand', 'demandOp', 'demandP', 'demandS', 'fit', 'fitPeak', 'fitCritical', 'fitVpp'];

        priceFields.forEach(field => {
            // Apply default unit if the backend gave us a price value without a unit
            let offerField = (offer as any)?.[field];
            if (offerField && !priceUnitsWithDefaults[field] && defaultUnitId) {
                priceUnitsWithDefaults[field] = defaultUnitId;
            }
        });

        setFormData({
            codes: Array.isArray(ratePlan.codes) ? ratePlan.codes.join(', ') : (ratePlan.codes || ''),
            planId: ratePlan.planId || '',
            tariff: ratePlan.tariff || '',
            state: ratePlan.state || 'NSW',
            dnsp: typeof ratePlan.dnsp === 'number' ? ratePlan.dnsp : parseInt(String(ratePlan.dnsp) || '0', 10),
            type: typeof ratePlan.type === 'number' ? ratePlan.type : parseInt(String(ratePlan.type) || '0', 10),
            vpp: ratePlan.vpp || 0,
            discountApplies: ratePlan.discountApplies ? 1 : 0,
            discountPercentage: ratePlan.discountPercentage || 0,
            isActive: ratePlan.isActive ? 1 : 0,
            offerName: offer?.offerName || '',
            anytime: offer?.anytime?.toString() || '',
            supplyCharge: offer?.supplyCharge?.toString() || '',
            vppOrcharge: offer?.vppOrcharge?.toString() || '',
            peak: offer?.peak?.toString() || '',
            shoulder: offer?.shoulder?.toString() || '',
            offPeak: offer?.offPeak?.toString() || '',
            cl1Supply: offer?.cl1Supply?.toString() || '',
            cl1Usage: offer?.cl1Usage?.toString() || '',
            cl2Supply: offer?.cl2Supply?.toString() || '',
            cl2Usage: offer?.cl2Usage?.toString() || '',
            demand: offer?.demand?.toString() || '',
            demandOp: offer?.demandOp?.toString() || '',
            demandP: offer?.demandP?.toString() || '',
            demandS: offer?.demandS?.toString() || '',
            fit: offer?.fit?.toString() || '',
            fitPeak: offer?.fitPeak?.toString() || '',
            fitCritical: offer?.fitCritical?.toString() || '',
            fitVpp: offer?.fitVpp?.toString() || '',
            priceUnits: priceUnitsWithDefaults,
            dynamicRates: (typeof offer?.dynamicRates === 'string' ? JSON.parse(offer.dynamicRates) : (offer?.dynamicRates || [])) as DynamicRate[],
        });
        setFormErrors({});
        setEditModalOpen(true);
    }, [measurementUnits]);

    // Submit Update Rate (LOCALLY ONLY)
    const handleUpdateRate = async () => {
        if (isSubmittingRef.current) return;
        if (!editingRatePlan) return;
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        isSubmittingRef.current = true;

        try {
            // 1. Capture Original State if not already captured
            if (!localOriginals.has(editingRatePlan.uid)) {
                setLocalOriginals(prev => new Map(prev).set(editingRatePlan.uid, JSON.parse(JSON.stringify(editingRatePlan))));
            }

            // 2. Construct Updated Object from FormData
            const existingOffer = editingRatePlan.offers?.[0];
            const updatedOffer: RateOffer = {
                ...(existingOffer || {}), // Keep existing IDs etc
                id: existingOffer?.id || crypto.randomUUID(),
                uid: existingOffer?.uid || crypto.randomUUID(),
                offerName: formData.offerName || existingOffer?.offerName || 'Default Offer',
                anytime: parseFloat(formData.anytime) || 0,
                supplyCharge: parseFloat(formData.supplyCharge) || 0,
                vppOrcharge: parseFloat(formData.vppOrcharge) || 0,
                peak: parseFloat(formData.peak) || 0,
                shoulder: parseFloat(formData.shoulder) || 0,
                offPeak: parseFloat(formData.offPeak) || 0,
                cl1Supply: parseFloat(formData.cl1Supply) || 0,
                cl1Usage: parseFloat(formData.cl1Usage) || 0,
                cl2Supply: parseFloat(formData.cl2Supply) || 0,
                cl2Usage: parseFloat(formData.cl2Usage) || 0,
                demand: parseFloat(formData.demand) || 0,
                demandOp: parseFloat(formData.demandOp) || 0,
                demandP: parseFloat(formData.demandP) || 0,
                demandS: parseFloat(formData.demandS) || 0,
                fit: parseFloat(formData.fit) || 0,
                fitPeak: parseFloat(formData.fitPeak) || 0,
                fitCritical: parseFloat(formData.fitCritical) || 0,
                fitVpp: parseFloat(formData.fitVpp) || 0,
                priceUnits: formData.priceUnits,
                dynamicRates: formData.dynamicRates,
                // Required fields for type safety, though might not be edited
                type: existingOffer?.type || '',
                isActive: existingOffer?.isActive ?? true,
                isDeleted: existingOffer?.isDeleted ?? false,
            };

            const updatedPlan: RatePlan = {
                ...editingRatePlan,
                codes: formData.codes.split(',').map(c => c.trim()), // Simple arrays
                planId: formData.planId,
                tariff: formData.tariff,
                state: formData.state,
                dnsp: String(formData.dnsp), // Ensure string if that's what's expected, though interface says string
                type: String(formData.type),
                vpp: formData.vpp,
                discountApplies: formData.discountApplies === 1,
                discountPercentage: formData.discountPercentage,
                isActive: formData.isActive === 1,
                offers: [updatedOffer]
            };

            // 3. Update Local State (All Rate Plans)
            setAllRatePlans(prev => prev.map(p => p.uid === editingRatePlan.uid ? updatedPlan : p));

            // 4. Mark as Modified Locally (Only if NOT a local creation - Creations already track their full state)
            if (!localCreatedUids.has(editingRatePlan.uid)) {
                setLocalModifiedUids(prev => new Set(prev).add(editingRatePlan.uid));
            }

            setEditModalOpen(false);
            setEditingRatePlan(null);
            setFormData(initialFormState);

        } catch (err: any) {
            console.error('Failed to update rate plan locally:', err);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    // Open delete modal
    const handleDeleteClick = useCallback((ratePlan: RatePlan) => {
        setRatePlanToDelete(ratePlan);
        setDeleteConfirmCode('');
        setDeleteModalOpen(true);
    }, []);

    // Confirm delete (LOCALLY ONLY)
    const handleConfirmDelete = async () => {
        if (!ratePlanToDelete) return;
        const codes = Array.isArray(ratePlanToDelete.codes)
            ? ratePlanToDelete.codes.join(', ')
            : ratePlanToDelete.codes;
        if (deleteConfirmCode !== codes) return;

        setIsDeleting(true);
        try {
            const uid = ratePlanToDelete.uid;

            if (localCreatedUids.has(uid)) {
                // If it was locally created, just remove it entirely
                setAllRatePlans(prev => prev.filter(p => p.uid !== uid));
                setLocalCreatedUids(prev => {
                    const next = new Set(prev);
                    next.delete(uid);
                    return next;
                });
            } else {
                // Mark as deleted locally
                setAllRatePlans(prev =>
                    prev.map(r => r.uid === uid ? { ...r, isDeleted: 1 } : r)
                );
                setLocalDeletedUids(prev => new Set(prev).add(uid));
                // Remove from modified since deletion overrides edits
                setLocalModifiedUids(prev => {
                    const next = new Set(prev);
                    next.delete(uid);
                    return next;
                });
            }

            setDeleteModalOpen(false);
            setRatePlanToDelete(null);
            toast.success('Rate plan deleted locally');
        } catch (err: any) {
            console.error('Failed to delete rate plan locally:', err);
            toast.error('Failed to delete locally');
        } finally {
            setIsDeleting(false);
        }
    };

    // Open restore modal
    const handleRestoreClick = useCallback((ratePlan: RatePlan) => {
        setRatePlanToRestore(ratePlan);
        setRestoreModalOpen(true);
    }, []);

    // Confirm restore (LOCALLY ONLY)
    const handleConfirmRestore = async () => {
        if (!ratePlanToRestore) return;

        setIsRestoring(true);
        try {
            const uid = ratePlanToRestore.uid;

            // Mark as restored locally
            setAllRatePlans(prev =>
                prev.map(r => r.uid === uid ? { ...r, isDeleted: 0 } : r)
            );

            // If it was already deleted in DB, mark for DB restoration
            if (ratePlanToRestore.isDeleted === 1 || ratePlanToRestore.isDeleted === (true as any)) {
                setLocalRestoredUids(prev => new Set(prev).add(uid));
            }

            // Remove from deleted list if it was locally deleted
            setLocalDeletedUids(prev => {
                const next = new Set(prev);
                next.delete(uid);
                return next;
            });

            setRestoreModalOpen(false);
            setRatePlanToRestore(null);
            toast.success('Rate plan restored locally');
        } catch (err: any) {
            console.error('Failed to restore rate plan locally:', err);
            toast.error('Failed to restore locally');
        } finally {
            setIsRestoring(false);
        }
    };



    const columns: Column<RatePlan>[] = useMemo(() => [


        {
            key: 'state',
            header: 'State',
            width: 'w-[60px]',
            sticky: 'left' as const,
            stickyOffset: 0,
            render: (row: RatePlan) => (
                <Tooltip content={isFieldChanged(row, 'state') ? `Old: ${getOldValue(row, 'state')}` : null}>
                    <span className={isFieldChanged(row, 'state') ? 'bg-orange-800 text-white font-bold px-2 py-0.5 rounded' : ''}>{row.state || '-'}</span>
                </Tooltip>
            ),
        },
        {
            key: 'codes',
            header: 'Code',
            width: 'w-[150px]',
            sticky: 'left' as const,
            stickyOffset: 60,
            render: (row: RatePlan) => {
                let codes: string[] = [];
                if (Array.isArray(row.codes)) {
                    codes = row.codes;
                } else if (typeof row.codes === 'string') {
                    try {
                        // Try parsing as JSON first (e.g. "[\"E1\"]")
                        const parsed = JSON.parse(row.codes);
                        if (Array.isArray(parsed)) codes = parsed;
                        else codes = [row.codes];
                    } catch {
                        // Fallback to comma separation or single value
                        codes = (row.codes as string).includes(',')
                            ? (row.codes as string).split(',').map(c => c.trim())
                            : [row.codes];
                    }
                }

                const codesChanged = isFieldChanged(row, 'codes');

                return (
                    <Tooltip content={codesChanged ? `Old: ${getOldValue(row, 'codes')}` : null}>
                        <div className={`flex flex-wrap gap-1 ${codesChanged ? 'bg-orange-300 dark:bg-orange-700/50 -m-2 p-2 rounded ring-1 ring-orange-400' : ''}`}>
                            {codes.map((code, idx) => (
                                <span key={idx} className={`text-xs px-2 py-0.5 rounded ${codesChanged ? 'bg-orange-800 text-white dark:bg-orange-500/50 dark:text-orange-100 font-bold' : 'bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-zinc-100'}`}>
                                    {code}
                                </span>
                            )) || '-'}
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            key: 'dnsp',
            header: 'DNSP',
            width: 'w-[120px]',
            render: (row: RatePlan) => (
                <div className={isFieldChanged(row, 'dnsp') ? "bg-orange-800 text-white -m-2 p-2 rounded ring-1 ring-orange-500" : ""}>
                    <Tooltip content={isFieldChanged(row, 'dnsp') ? `Old: ${DNSP_MAP[String(getOldValue(row, 'dnsp'))] || getOldValue(row, 'dnsp')}` : null}>
                        <StatusField type="dnsp" value={row.dnsp} mode="badge" />
                    </Tooltip>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            width: 'w-[120px]',
            render: (row: RatePlan) => (
                <div className={isFieldChanged(row, 'type') ? "bg-orange-800 text-white -m-2 p-2 rounded ring-1 ring-orange-500" : ""}>
                    <Tooltip content={isFieldChanged(row, 'type') ? `Old: ${RATE_TYPE_MAP[String(getOldValue(row, 'type'))] || getOldValue(row, 'type')}` : null}>
                        <StatusField type="rate_type" value={row.type} mode="badge" />
                    </Tooltip>
                </div>
            ),
        },
        {
            key: 'anytime',
            header: 'Anytime',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_anytime') ? `Old: ${getOldValue(row, 'offer_anytime')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_anytime') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-orange-200 text-orange-950 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                        {row.offers?.[0]?.anytime || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'peak',
            header: 'Peak',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_peak') ? `Old: ${getOldValue(row, 'offer_peak')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_peak') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-blue-200 text-blue-950 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        {row.offers?.[0]?.peak || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'shoulder',
            header: 'Shoulder',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_shoulder') ? `Old: ${getOldValue(row, 'offer_shoulder')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_shoulder') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-blue-200 text-blue-950 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        {row.offers?.[0]?.shoulder || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'offPeak',
            header: 'Off-Peak',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_offPeak') ? `Old: ${getOldValue(row, 'offer_offPeak')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_offPeak') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-blue-200 text-blue-950 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        {row.offers?.[0]?.offPeak || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'supplyCharge',
            header: 'Supply Charge',
            width: 'w-[120px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_supplyCharge') ? `Old: ${getOldValue(row, 'offer_supplyCharge')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_supplyCharge') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-purple-200 text-purple-950 dark:bg-purple-900/20 dark:text-purple-400'}`}>
                        {row.offers?.[0]?.supplyCharge || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'cl1Supply',
            header: 'CL1 Supply',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_cl1Supply') ? `Old: ${getOldValue(row, 'offer_cl1Supply')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_cl1Supply') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-green-200 text-green-950 dark:bg-green-900/20 dark:text-green-400'}`}>
                        {row.offers?.[0]?.cl1Supply || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'cl1Usage',
            header: 'CL1 Usage', // Assuming 'Usage' in image maps here or CL1 Usage
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_cl1Usage') ? `Old: ${getOldValue(row, 'offer_cl1Usage')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_cl1Usage') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-green-200 text-green-950 dark:bg-green-900/20 dark:text-green-400'}`}>
                        {row.offers?.[0]?.cl1Usage || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'cl2Supply',
            header: 'CL2 Supply',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_cl2Supply') ? `Old: ${getOldValue(row, 'offer_cl2Supply')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_cl2Supply') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-green-200 text-green-950 dark:bg-green-900/20 dark:text-green-400'}`}>
                        {row.offers?.[0]?.cl2Supply || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'cl2Usage',
            header: 'CL2 Usage',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_cl2Usage') ? `Old: ${getOldValue(row, 'offer_cl2Usage')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_cl2Usage') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-green-200 text-green-950 dark:bg-green-900/20 dark:text-green-400'}`}>
                        {row.offers?.[0]?.cl2Usage || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'demand',
            header: 'Demand',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_demand') ? `Old: ${getOldValue(row, 'offer_demand')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_demand') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-red-200 text-red-950 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {row.offers?.[0]?.demand || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'demandOp',
            header: 'Demand(OP)',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_demandOp') ? `Old: ${getOldValue(row, 'offer_demandOp')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_demandOp') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-red-200 text-red-950 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {row.offers?.[0]?.demandOp || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'demandP',
            header: 'Demand(P)',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_demandP') ? `Old: ${getOldValue(row, 'offer_demandP')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_demandP') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-red-200 text-red-950 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {row.offers?.[0]?.demandP || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'demandS',
            header: 'Demand(S)',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_demandS') ? `Old: ${getOldValue(row, 'offer_demandS')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_demandS') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-red-200 text-red-950 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {row.offers?.[0]?.demandS || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'fit',
            header: 'FIT',
            width: 'w-[80px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_fit') ? `Old: ${getOldValue(row, 'offer_fit')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_fit') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-teal-100 text-teal-950 dark:bg-teal-900/20 dark:text-teal-300'}`}>
                        {row.offers?.[0]?.fit || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'fitPeak',
            header: 'Premium FIT',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_fitPeak') ? `Old: ${getOldValue(row, 'offer_fitPeak')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_fitPeak') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-teal-100 text-teal-950 dark:bg-teal-900/20 dark:text-teal-300'}`}>
                        {row.offers?.[0]?.fitPeak || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'fitCritical',
            header: 'CRITICAL EVENT FIT',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_fitCritical') ? `Old: ${getOldValue(row, 'offer_fitCritical')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_fitCritical') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-teal-100 text-teal-950 dark:bg-teal-900/20 dark:text-teal-300'}`}>
                        {row.offers?.[0]?.fitCritical || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'fitVpp',
            header: 'BASE FIT',
            width: 'w-[100px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_fitVpp') ? `Old: ${getOldValue(row, 'offer_fitVpp')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_fitVpp') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-teal-100 text-teal-950 dark:bg-teal-900/20 dark:text-teal-300'}`}>
                        {row.offers?.[0]?.fitVpp || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            key: 'vppOrcharge',
            header: 'VPP Orchestration',
            width: 'w-[140px]',
            render: (row: RatePlan) => (
                <Tooltip fullWidth content={isFieldChanged(row, 'offer_vppOrcharge') ? `Old: ${getOldValue(row, 'offer_vppOrcharge')}` : null}>
                    <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isFieldChanged(row, 'offer_vppOrcharge') ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-red-200 text-red-950 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {row.offers?.[0]?.vppOrcharge || '-'}
                    </div>
                </Tooltip>
            ),
        },
        ...dynamicFieldNames.map(fieldName => ({
            key: `dynamic_${fieldName}`,
            header: fieldName,
            width: 'w-[150px]',
            render: (row: RatePlan) => {
                const rate = row.offers?.[0]?.dynamicRates?.find(r => r.name?.toLowerCase() === fieldName.toLowerCase());
                if (!rate) return '-';
                const isChanged = isFieldChanged(row, `dynamic_${fieldName}`);
                const oldValue = getOldValue(row, `dynamic_${fieldName}`);

                return (
                    <Tooltip fullWidth content={isChanged ? `Old: ${oldValue}` : null}>
                        <div className={`px-2 py-1 rounded font-bold text-xs w-full text-center ${isChanged ? 'bg-orange-800 text-white border border-orange-500 font-bold' : 'bg-blue-100 text-blue-950 dark:bg-blue-900/20 dark:text-blue-300'}`}>
                            {rate.value}
                        </div>
                    </Tooltip>
                );
            }
        })),
        {
            key: 'discount',
            header: 'Discount',
            width: 'w-[100px]',
            render: (row: RatePlan) => {
                const isChanged = isFieldChanged(row, 'discountApplies') || isFieldChanged(row, 'discountPercentage');
                return (
                    <div className={isChanged ? "bg-orange-800 -m-2 p-2 rounded ring-1 ring-orange-500" : ""}>
                        <Tooltip content={isChanged ? `Old: ${getOldValue(row, 'discountApplies') ? 'Yes' : 'No'}` : null}>
                            <div className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${row.discountApplies ? 'bg-primary' : 'bg-gray-300'}`} onClick={() => console.log('Toggle Discount', row.uid)}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${row.discountApplies ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            key: 'tariff',
            header: 'Tariff Code',
            width: 'w-[100px]',
            render: (row: RatePlan) => <span className="font-medium text-foreground">{row.tariff || '-'}</span>,
        },
        {
            key: 'planId',
            header: 'Plan ID',
            width: 'w-[150px]',
            render: (row: RatePlan) => <span className="font-medium text-foreground">{row.planId || '-'}</span>,
        },
        {
            key: 'updatedAt',
            header: 'Updated',
            width: 'w-[150px]',
            render: (row: RatePlan) => <span className="text-muted-foreground">{formatSydneyTime(row.updatedAt)}</span>,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'w-[100px]',
            sticky: 'right' as const,
            stickyOffset: 0,
            render: (row: RatePlan) => (
                <div className="flex items-center gap-2">
                    {row.isDeleted ? (
                        canDelete && (
                            <Tooltip content="Restore Rate">
                                <button
                                    className="p-2 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    onClick={() => handleRestoreClick(row)}
                                >
                                    <RefreshCwIcon size={16} />
                                </button>
                            </Tooltip>
                        )
                    ) : (
                        <>
                            {canEdit && (
                                <Tooltip content="Edit Rate">
                                    <button
                                        className="p-2 border border-border rounded-lg bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => handleEditRate(row)}
                                    >
                                        <PencilIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                            {canDelete && (
                                <Tooltip content="Delete Rate">
                                    <button
                                        className="p-2 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        onClick={() => handleDeleteClick(row)}
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </Tooltip>
                            )}
                        </>
                    )}
                    {!canEdit && !canDelete && !row.isDeleted && <span className="text-muted-foreground">-</span>}
                </div>
            )
        },
    ], [handleEditRate, handleDeleteClick, handleRestoreClick, canEdit, canDelete, isFieldChanged, getOldValue, dynamicFieldNames, unitMap]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Rates Management</h1>
                    <p className="text-muted-foreground">Manage utility rates and plans</p>
                </div>
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Button
                            variant="outline"
                            onClick={() => setUnitsModalOpen(true)}
                        >
                            Manage Units
                        </Button>
                    )}
                    {canCreate && (
                        <Button
                            leftIcon={<PlusIcon size={16} />}
                            onClick={handleAddRate}
                        >
                            Add Rate
                        </Button>
                    )}
                    {canEdit && (
                        <>

                            <Button
                                variant="outline"
                                leftIcon={<ClockIcon size={16} />}
                                onClick={handleOpenHistory}
                            >
                                Versions
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 bg-background rounded-lg border border-border shadow-sm">
                {/* Filters */}
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div className="flex items-end gap-4 flex-wrap">
                            <Input
                                type="search"
                                placeholder="Search"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                containerClassName="w-[200px]"
                            />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-muted-foreground">State</label>
                                <StatusField
                                    type="state"
                                    mode="select"
                                    showAllOption
                                    value={stateFilter}
                                    onChange={(val) => {
                                        setAllRatePlans([]);
                                        setPage(1);
                                        setStateFilter(val as string);
                                    }}
                                    placeholder="All"
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-muted-foreground">DNSP</label>
                                <StatusField
                                    type="dnsp"
                                    mode="select"
                                    showAllOption
                                    value={dnspFilter}
                                    onChange={(val) => {
                                        setAllRatePlans([]);
                                        setPage(1);
                                        setDnspFilter(val as string);
                                    }}
                                    placeholder="All"
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-muted-foreground">Type</label>
                                <StatusField
                                    type="rate_type"
                                    mode="select"
                                    showAllOption
                                    value={typeFilter}
                                    onChange={(val) => {
                                        setAllRatePlans([]);
                                        setPage(1);
                                        setTypeFilter(val as string);
                                    }}
                                    placeholder="All"
                                    className="w-[150px]"
                                />
                            </div>

                            {/* <Button variant="outline" leftIcon={<FilterIcon size={16} />} className="self-end">
                                Filters
                            </Button>


                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors self-end pb-2"
                            >
                                <RefreshCwIcon size={14} />
                                Clear all
                            </button> */}
                        </div>
                        <div className="flex items-center gap-2">
                            {hasLocalChanges && (
                                <Button
                                    variant="ghost"
                                    onClick={handleResetLocalChanges}
                                    leftIcon={<RefreshCwIcon size={16} />}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Reset
                                </Button>
                            )}
                            <Tooltip content={(hasUnsavedChanges || hasLocalChanges) ? "Unsaved changes - Click to save version" : "All changes saved"}>
                                <Button
                                    variant={(hasUnsavedChanges || hasLocalChanges) ? "default" : "outline"}
                                    onClick={handleCreateSnapshot}
                                    isLoading={isSnapshotting || isUpdating}
                                    disabled={(!hasUnsavedChanges && !hasLocalChanges) || isSnapshotting || isUpdating}
                                    className={`px-4 gap-2 transition-all duration-300 ${(hasUnsavedChanges || hasLocalChanges)
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg border-0'
                                        : 'border-green-300 bg-green-50 text-green-600 cursor-default'}`}
                                >
                                    {!isSnapshotting && !isUpdating && (
                                        (hasUnsavedChanges || hasLocalChanges) ? (
                                            <>
                                                <SaveIcon size={16} />
                                                <span className="text-sm font-medium">Save</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span className="text-sm font-medium">Saved</span>
                                            </>
                                        )
                                    )}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {meta ? `Showing ${allRatePlans.length} out of ${meta.totalRecords} records` : 'Loading...'}
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    data={allRatePlans}
                    loading={loading}
                    error={error?.message}
                    rowKey={(row) => row.uid}
                    emptyMessage="No rate plans found."
                    loadingMessage="Loading rates..."
                    infiniteScroll
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}


                    rowClassName={(row: RatePlan) => (changedRatePlanUids.has(row.uid) || localModifiedUids.has(row.uid) || localCreatedUids.has(row.uid) || localDeletedUids.has(row.uid) || localRestoredUids.has(row.uid)) ? '[&>td]:!bg-orange-100 dark:[&>td]:!bg-orange-950/50 font-medium' : ''}
                />
            </div>

            {/* Add Rate Modal */}
            <Modal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                title="Add New Rate"
                size="full"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setAddModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateRate}
                            isLoading={isSubmitting}
                            loadingText="Submitting..."
                        >
                            Create rate
                        </Button>
                    </>
                }
            >
                <div className="space-y-6 py-2">
                    {/* Row 1: Code, Tariff Code */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="E.g. N73"
                                value={formData.codes}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, codes: e.target.value }));
                                    if (formErrors.codes) setFormErrors(prev => ({ ...prev, codes: '' }));
                                }}
                                className={formErrors.codes ? 'border-red-500' : ''}
                            />
                            {formErrors.codes && <p className="text-xs text-red-500">{formErrors.codes}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tariff Code</label>
                            <Input
                                placeholder="E.g. General"
                                value={formData.tariff}
                                onChange={(e) => setFormData(prev => ({ ...prev, tariff: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Row 2: Plan ID, State */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Plan ID</label>
                            <Input
                                placeholder="E.g. PLAN-001"
                                value={formData.planId}
                                onChange={(e) => setFormData(prev => ({ ...prev, planId: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State</label>
                            <div className="flex flex-wrap gap-2">
                                {STATE_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.state === option.value
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        onClick={() => setFormData(prev => ({ ...prev, state: option.value }))}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DNSP */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">DNSP</label>
                        <div className="flex flex-wrap gap-2">
                            {DNSP_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${String(formData.dnsp) === opt.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, dnsp: parseInt(opt.value, 10) }))}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type and Toggles - inline layout */}
                    <div className="flex items-start gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.type === 0
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, type: 0 }))}
                                >
                                    Business
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.type === 1
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, type: 1 }))}
                                >
                                    Residential
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">VPP Enabled</label>
                            <br />
                            <button
                                type="button"
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.vpp === 1 ? 'bg-primary' : 'bg-muted'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, vpp: prev.vpp === 1 ? 0 : 1 }))}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${formData.vpp === 1 ? 'translate-x-4' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Discount applies</label>
                            <br />
                            <button
                                type="button"
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.discountApplies === 1 ? 'bg-primary' : 'bg-muted'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, discountApplies: prev.discountApplies === 1 ? 0 : 1 }))}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${formData.discountApplies === 1 ? 'translate-x-4' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Anytime and Supply Charge */}
                    <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/50 dark:border-orange-800 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Anytime</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.anytime}
                                        onChange={(e) => handlePriceChange('anytime', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.anytime || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, anytime: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Supply Charge</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.supplyCharge}
                                        onChange={(e) => handlePriceChange('supplyCharge', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.supplyCharge || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, supplyCharge: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VPP Orchestration */}
                    <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">VPP Orchestration</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.vppOrcharge}
                                onChange={(e) => handlePriceChange('vppOrcharge', e.target.value)}
                            />
                            <select
                                className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.priceUnits?.vppOrcharge || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    priceUnits: { ...prev.priceUnits, vppOrcharge: e.target.value }
                                }))}
                            >
                                <option value="">Unit</option>
                                {measurementUnits.map(u => (
                                    <option key={u.uid} value={u.uid}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Peak, Shoulder, Off-Peak */}
                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-800 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Peak</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.peak}
                                        onChange={(e) => handlePriceChange('peak', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.peak || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, peak: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Shoulder</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.shoulder}
                                        onChange={(e) => handlePriceChange('shoulder', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.shoulder || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, shoulder: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Off-Peak</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.offPeak}
                                        onChange={(e) => handlePriceChange('offPeak', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.offPeak || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, offPeak: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CL1/CL2 Supply/Usage */}
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/50 dark:border-green-800 space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL1 Supply</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.cl1Supply}
                                        onChange={(e) => handlePriceChange('cl1Supply', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.cl1Supply || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, cl1Supply: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL1 Usage</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.cl1Usage}
                                        onChange={(e) => handlePriceChange('cl1Usage', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.cl1Usage || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, cl1Usage: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL2 Supply</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.cl2Supply}
                                        onChange={(e) => handlePriceChange('cl2Supply', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.cl2Supply || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, cl2Supply: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL2 Usage</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.cl2Usage}
                                        onChange={(e) => handlePriceChange('cl2Usage', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.cl2Usage || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, cl2Usage: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demand fields */}
                    <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/50 dark:border-red-800 space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.demand}
                                        onChange={(e) => handlePriceChange('demand', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.demand || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, demand: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (OP)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.demandOp}
                                        onChange={(e) => handlePriceChange('demandOp', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.demandOp || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, demandOp: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (P)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.demandP}
                                        onChange={(e) => handlePriceChange('demandP', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.demandP || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, demandP: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (S)</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.demandS}
                                        onChange={(e) => handlePriceChange('demandS', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.demandS || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, demandS: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FIT fields */}
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/50 dark:border-green-800 space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">FIT</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.fit}
                                        onChange={(e) => handlePriceChange('fit', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.fit || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, fit: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">BASE FIT</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.fitVpp}
                                        onChange={(e) => handlePriceChange('fitVpp', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.fitVpp || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, fitVpp: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">PREMIUM FIT</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.fitPeak}
                                        onChange={(e) => handlePriceChange('fitPeak', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.fitPeak || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, fitPeak: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CRITICAL EVENT FIT</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.fitCritical}
                                        onChange={(e) => handlePriceChange('fitCritical', e.target.value)}
                                    />
                                    <select
                                        className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.priceUnits?.fitCritical || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            priceUnits: { ...prev.priceUnits, fitCritical: e.target.value }
                                        }))}
                                    >
                                        {measurementUnits.map(u => (
                                            <option key={u.uid} value={u.uid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Rates */}
                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Dynamic Rates</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addDynamicRate}
                                className="h-8"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Dynamic Rate
                            </Button>
                        </div>

                        {formData.dynamicRates && formData.dynamicRates.length > 0 ? (
                            <div className="space-y-3">
                                {formData.dynamicRates.map((rate, index) => (
                                    <div key={rate.id} className="grid grid-cols-12 gap-3 items-end bg-background/50 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                                        <div className="col-span-3 space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                                            <Input
                                                placeholder="Rate name"
                                                value={rate.name}
                                                onChange={(e) => handleDynamicRateChange(index, 'name', e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Value</label>
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                placeholder="0.0000"
                                                value={rate.value}
                                                onChange={(e) => handleDynamicRateChange(index, 'value', e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Unit</label>
                                            <select
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 h-9"
                                                value={rate.unitId}
                                                onChange={(e) => handleDynamicRateChange(index, 'unitId', e.target.value)}
                                            >
                                                {measurementUnits.map(u => (
                                                    <option key={u.uid} value={u.uid}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Type</label>
                                            <select
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 h-9"
                                                value={rate.type}
                                                onChange={(e) => handleDynamicRateChange(index, 'type', e.target.value as any)}
                                            >
                                                <option value="charges">Charges</option>
                                                <option value="fit">FIT</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeDynamicRate(index)}
                                                className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center py-2">No dynamic rates added.</p>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Edit Rate Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingRatePlan(null);
                    setFormData(initialFormState);
                }}
                title="Edit Rate"
                size="full"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditModalOpen(false);
                                setEditingRatePlan(null);
                                setFormData(initialFormState);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateRate}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                            loadingText="Submitting..."
                        >
                            Update rate
                        </Button>
                    </>
                }
            >
                {!editingRatePlan ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                        <p className="mt-4 text-sm text-muted-foreground">Loading rate details...</p>
                    </div>
                ) : (
                    <div className="space-y-6 py-2">
                        {/* Row 1: Code, Tariff Code */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Code <span className="text-red-500">*</span></label>
                                <Input
                                    placeholder="E.g. N73"
                                    value={formData.codes}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, codes: e.target.value }));
                                        if (formErrors.codes) setFormErrors(prev => ({ ...prev, codes: '' }));
                                    }}
                                    className={formErrors.codes ? 'border-red-500' : ''}
                                />
                                {formErrors.codes && <p className="text-xs text-red-500">{formErrors.codes}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Tariff Code</label>
                                <Input
                                    placeholder="E.g. General"
                                    value={formData.tariff}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tariff: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Row 2: Plan ID, State */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Plan ID</label>
                                <Input
                                    placeholder="E.g. PLAN-001"
                                    value={formData.planId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, planId: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">State</label>
                                <div className="flex flex-wrap gap-2">
                                    {STATE_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.state === option.value
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                            onClick={() => setFormData(prev => ({ ...prev, state: option.value }))}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* DNSP */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">DNSP</label>
                            <div className="flex flex-wrap gap-2">
                                {DNSP_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${String(formData.dnsp) === opt.value
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        onClick={() => setFormData(prev => ({ ...prev, dnsp: parseInt(opt.value, 10) }))}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type and Toggles */}
                        <div className="flex items-start gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.type === 0
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        onClick={() => setFormData(prev => ({ ...prev, type: 0 }))}
                                    >
                                        Business
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${formData.type === 1
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        onClick={() => setFormData(prev => ({ ...prev, type: 1 }))}
                                    >
                                        Residential
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">VPP Enabled</label>
                                <br />
                                <button
                                    type="button"
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.vpp === 1 ? 'bg-primary' : 'bg-muted'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, vpp: prev.vpp === 1 ? 0 : 1 }))}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${formData.vpp === 1 ? 'translate-x-4' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Discount applies</label>
                                <br />
                                <button
                                    type="button"
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.discountApplies === 1 ? 'bg-primary' : 'bg-muted'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, discountApplies: prev.discountApplies === 1 ? 0 : 1 }))}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${formData.discountApplies === 1 ? 'translate-x-4' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-red-600 dark:text-red-400">Hidden</label>
                                <br />
                                <button
                                    type="button"
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.isActive === 0 ? 'bg-red-500' : 'bg-muted'
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: prev.isActive === 1 ? 0 : 1 }))}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${formData.isActive === 0 ? 'translate-x-4' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                        </div>

                        {/* Anytime and Supply Charge */}
                        <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/50 dark:border-orange-800 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Anytime</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.anytime}
                                            onChange={(e) => handlePriceChange('anytime', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.anytime || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, anytime: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Supply Charge</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.supplyCharge}
                                            onChange={(e) => handlePriceChange('supplyCharge', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.supplyCharge || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, supplyCharge: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* VPP Orchestration */}
                        <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">VPP Orchestration</label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.vppOrcharge}
                                    onChange={(e) => handlePriceChange('vppOrcharge', e.target.value)}
                                />
                                <select
                                    className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.priceUnits?.vppOrcharge || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        priceUnits: { ...prev.priceUnits, vppOrcharge: e.target.value }
                                    }))}
                                >
                                    <option value="">Unit</option>
                                    {measurementUnits.map(u => (
                                        <option key={u.uid} value={u.uid}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Peak, Shoulder, Off-Peak */}
                        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-800 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Peak</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.peak}
                                            onChange={(e) => handlePriceChange('peak', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.peak || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, peak: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Shoulder</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.shoulder}
                                            onChange={(e) => handlePriceChange('shoulder', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.shoulder || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, shoulder: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Off-Peak</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.offPeak}
                                            onChange={(e) => handlePriceChange('offPeak', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.offPeak || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, offPeak: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CL1/CL2 Supply/Usage */}
                        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/50 dark:border-green-800 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL1 Supply</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.cl1Supply}
                                            onChange={(e) => handlePriceChange('cl1Supply', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.cl1Supply || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, cl1Supply: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL1 Usage</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.cl1Usage}
                                            onChange={(e) => handlePriceChange('cl1Usage', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.cl1Usage || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, cl1Usage: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL2 Supply</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.cl2Supply}
                                            onChange={(e) => handlePriceChange('cl2Supply', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.cl2Supply || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, cl2Supply: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CL2 Usage</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.cl2Usage}
                                            onChange={(e) => handlePriceChange('cl2Usage', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.cl2Usage || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, cl2Usage: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demand fields */}
                        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/50 dark:border-red-800 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.demand}
                                            onChange={(e) => handlePriceChange('demand', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.demand || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, demand: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (OP)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.demandOp}
                                            onChange={(e) => handlePriceChange('demandOp', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.demandOp || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, demandOp: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (P)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.demandP}
                                            onChange={(e) => handlePriceChange('demandP', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.demandP || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, demandP: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Demand (S)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.demandS}
                                            onChange={(e) => handlePriceChange('demandS', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.demandS || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, demandS: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FIT fields */}
                        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/50 dark:border-green-800 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">FIT</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.fit}
                                            onChange={(e) => handlePriceChange('fit', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.fit || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, fit: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">BASE FIT</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.fitVpp}
                                            onChange={(e) => handlePriceChange('fitVpp', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.fitVpp || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, fitVpp: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">PREMIUM FIT</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.fitPeak}
                                            onChange={(e) => handlePriceChange('fitPeak', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.fitPeak || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, fitPeak: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">CRITICAL EVENT FIT</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.fitCritical}
                                            onChange={(e) => handlePriceChange('fitCritical', e.target.value)}
                                        />
                                        <select
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.priceUnits?.fitCritical || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                priceUnits: { ...prev.priceUnits, fitCritical: e.target.value }
                                            }))}
                                        >
                                            {measurementUnits.map(u => (
                                                <option key={u.uid} value={u.uid}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Rates */}
                        <div className="mt-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Dynamic Rates</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDynamicRate}
                                    className="h-8"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Add Dynamic Rate
                                </Button>
                            </div>

                            {formData.dynamicRates && formData.dynamicRates.length > 0 ? (
                                <div className="space-y-3">
                                    {formData.dynamicRates.map((rate, index) => (
                                        <div key={rate.id} className="grid grid-cols-12 gap-3 items-end bg-background/50 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                                            <div className="col-span-3 space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Name</label>
                                                <Input
                                                    placeholder="Rate name"
                                                    value={rate.name}
                                                    onChange={(e) => handleDynamicRateChange(index, 'name', e.target.value)}
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Value</label>
                                                <Input
                                                    type="number"
                                                    step="0.0001"
                                                    placeholder="0.0000"
                                                    value={rate.value}
                                                    onChange={(e) => handleDynamicRateChange(index, 'value', e.target.value)}
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Unit</label>
                                                <select
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 h-9"
                                                    value={rate.unitId}
                                                    onChange={(e) => handleDynamicRateChange(index, 'unitId', e.target.value)}
                                                >
                                                    {measurementUnits.map(u => (
                                                        <option key={u.uid} value={u.uid}>{u.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Type</label>
                                                <select
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 h-9"
                                                    value={rate.type}
                                                    onChange={(e) => handleDynamicRateChange(index, 'type', e.target.value as any)}
                                                >
                                                    <option value="charges">Charges</option>
                                                    <option value="fit">FIT</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDynamicRate(index)}
                                                    className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No dynamic rates added.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm deletion"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteConfirmCode !== (Array.isArray(ratePlanToDelete?.codes) ? ratePlanToDelete?.codes.join(', ') : ratePlanToDelete?.codes) || isDeleting}
                            isLoading={isDeleting}
                            loadingText="Deleting..."
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Type the code <span className="font-semibold text-foreground">{Array.isArray(ratePlanToDelete?.codes) ? ratePlanToDelete?.codes.join(', ') : ratePlanToDelete?.codes}</span> to delete this rate plan.
                    </p>
                    <Input
                        placeholder="Enter rate code"
                        value={deleteConfirmCode}
                        onChange={(e) => setDeleteConfirmCode(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            const codes = Array.isArray(ratePlanToDelete?.codes) ? ratePlanToDelete?.codes.join(', ') : ratePlanToDelete?.codes;
                            if (e.key === 'Enter' && deleteConfirmCode === codes) {
                                handleConfirmDelete();
                            }
                        }}
                    />
                </div>
            </Modal>

            {/* Restore Confirmation Modal */}
            <Modal
                isOpen={restoreModalOpen}
                onClose={() => setRestoreModalOpen(false)}
                title="Confirm restoration"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setRestoreModalOpen(false)}
                            disabled={isRestoring}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRestore}
                            isLoading={isRestoring}
                            loadingText="Restoring..."
                        >
                            Restore
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to restore <span className="font-semibold text-foreground">{Array.isArray(ratePlanToRestore?.codes) ? ratePlanToRestore?.codes.join(', ') : ratePlanToRestore?.codes}</span>?
                        This will make the rate plan visible and active again.
                    </p>
                </div>
            </Modal>

            {/* History Modal */}
            <RatesHistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                refetchChanges={() => refetchChanges()}
                refetchRatePlans={() => {
                    setAllRatePlans([]);
                    setPage(1);
                    refetch();
                }}
                onApplyLocalSnapshot={handleApplyLocalSnapshot}
            />

            {/* Manage Units Modal */}
            <Modal
                isOpen={unitsModalOpen}
                onClose={() => setUnitsModalOpen(false)}
                title="Add Measurement Unit"
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setUnitsModalOpen(false)} disabled={isCreatingUnit}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateUnit} isLoading={isCreatingUnit}>
                            Save Unit
                        </Button>
                    </>
                }
            >
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">Add a new dynamic unit format (e.g., month, year, kvAr) that can be applied to rate prices.</p>

                    {/* Add Unit Field */}
                    <div className="flex items-end gap-2">
                        <div className="space-y-2 flex-grow">
                            <label className="text-sm font-medium">Unit Name <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="e.g. month"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                                disabled={isCreatingUnit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateUnit();
                                }}
                            />
                        </div>
                        <Button
                            onClick={handleCreateUnit}
                            isLoading={isCreatingUnit}
                            disabled={!newUnitName.trim()}
                        >
                            <PlusIcon size={16} className="mr-2" /> Add
                        </Button>
                    </div>

                    <div className="border-t border-border my-4 pt-4">
                        <label className="text-sm font-medium mb-3 block">Existing Units</label>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {measurementUnits.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No custom units found.</p>
                            ) : (
                                measurementUnits.map(unit => (
                                    <div key={unit.uid} className="flex items-center justify-between p-2 rounded-md bg-accent/50 border border-border">
                                        <span className="text-sm font-medium">{unit.name}</span>
                                        <button
                                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors disabled:opacity-50"
                                            onClick={() => handleDeleteUnit(unit.uid)}
                                            disabled={deletingUnitUid === unit.uid}
                                            title="Delete Unit"
                                        >
                                            <TrashIcon size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Navigation Block Confirmation */}
            <Modal
                isOpen={blocker.state === 'blocked'}
                onClose={() => blocker.reset?.()}
                title={<span className="flex items-center gap-2"><AlertCircleIcon className="text-amber-500" size={20} /> Unsaved Changes</span>}
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => blocker.reset?.()}>Stay</Button>
                        <Button variant="destructive" onClick={() => blocker.proceed?.()}>Leave Page</Button>
                    </>
                }
            >
                <div className="space-y-2">
                    <p className="text-sm text-foreground">
                        You have unsaved changes to your rate plans.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to leave this page? Your changes will be lost.
                    </p>
                </div>
            </Modal>
        </div>
    );
}