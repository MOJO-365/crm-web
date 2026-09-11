import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { GET_GST_RULES } from '@/graphql/queries/rates';
import { SAVE_GST_RULE, RESET_GST_RULES } from '@/graphql/mutations/rates';
import { DEFAULT_GST_RULES, getGSTConfig, setGSTRule, resetGSTConfig, updateGSTConfigCache, type GSTRule } from '@/lib/gst-config';
import { PercentIcon, RefreshCwIcon, SpinnerIcon } from '@/components/icons';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function GstManagementModal({ isOpen, onClose }: Props) {
    const [config, setConfig] = useState<Record<string, boolean>>({});

    const loadConfig = () => {
        setConfig(getGSTConfig());
    };

    const { data: dbData, loading: isLoading } = useQuery(GET_GST_RULES, {
        fetchPolicy: 'network-only',
        skip: !isOpen,
        onCompleted: (data) => {
            if (data?.getGstRules?.length > 0) {
                const map: Record<string, boolean> = {};
                data.getGstRules.forEach((r: any) => {
                    map[r.key] = r.appliesGst;
                });
                setConfig(map);
                updateGSTConfigCache(data.getGstRules);
            }
        }
    });

    const [saveGstRuleMutation] = useMutation(SAVE_GST_RULE, {
        onError: (err) => {
            toast.error(err.message || 'Failed to save GST rule');
            loadConfig();
        }
    });

    const [resetGstRulesMutation, { loading: isResetting }] = useMutation(RESET_GST_RULES, {
        onCompleted: (data) => {
            if (data?.resetGstRules) {
                const map: Record<string, boolean> = {};
                data.resetGstRules.forEach((r: any) => {
                    map[r.key] = r.appliesGst;
                });
                setConfig(map);
                updateGSTConfigCache(data.resetGstRules);
                toast.success('GST rules reset to defaults in database');
            }
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to reset GST rules');
        }
    });

    useEffect(() => {
        if (isOpen) {
            loadConfig();
        }
    }, [isOpen]);

    const handleToggle = async (key: string) => {
        const newValue = !config[key];
        setConfig(prev => ({ ...prev, [key]: newValue }));
        setGSTRule(key, newValue);

        try {
            await saveGstRuleMutation({
                variables: { key, appliesGst: newValue }
            });
            toast.info(`GST for ${DEFAULT_GST_RULES[key]?.label || key} updated to ${newValue ? 'Applicable (10%)' : 'GST Free'}`);
        } catch (e) {
            // Handled in onError
        }
    };

    const handleReset = async () => {
        try {
            await resetGstRulesMutation();
        } catch (e) {
            resetGSTConfig();
            loadConfig();
        }
    };

    const rulesList: GSTRule[] = (dbData?.getGstRules && dbData.getGstRules.length > 0)
        ? dbData.getGstRules
        : Object.values(DEFAULT_GST_RULES);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage GST Application Rules"
            size="3xl"
        >
            <div className="space-y-5 py-1">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        <PercentIcon size={20} />
                    </div>
                    <div className="text-xs space-y-1">
                        <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            GST Application Settings
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Define which rate types have 10% Goods and Services Tax (GST) applied during billing and price inclusive calculations.
                            Toggle any rate type below to enable or disable GST application.
                        </p>
                    </div>
                </div>

                <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                    <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Rate Category / Type
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-16 text-right">
                            Apply GST
                        </span>
                    </div>

                    <div className="divide-y divide-border">
                        {isLoading && (!dbData?.getGstRules || dbData.getGstRules.length === 0) ? (
                            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <SpinnerIcon size={16} className="animate-spin text-primary" />
                                Loading GST rules from database...
                            </div>
                        ) : rulesList.map((rule) => {
                            const isGstApplied = config[rule.key] ?? rule.appliesGst;
                            return (
                                <div key={rule.key} className="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                                    <div className="space-y-0.5 max-w-md">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm text-foreground">{rule.label}</span>
                                            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                {rule.key}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                                    </div>

                                    <div
                                        className={cn(
                                            "w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                                            isGstApplied ? 'bg-primary justify-end' : 'bg-muted-foreground/30 justify-start'
                                        )}
                                        onClick={() => handleToggle(rule.key)}
                                        title={`Toggle GST for ${rule.label}`}
                                    >
                                        <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        disabled={isResetting}
                        leftIcon={isResetting ? <SpinnerIcon size={14} className="animate-spin" /> : <RefreshCwIcon size={14} />}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        Reset Defaults
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Done & Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
