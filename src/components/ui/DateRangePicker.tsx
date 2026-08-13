import { useState, useMemo, useCallback } from 'react';
import { Popover } from './Popover';
import { Button } from './Button';
import { DatePicker } from './DatePicker';
import { CalendarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface DateRange {
    from: Date;
    to: Date;
}

export interface DateRangePickerProps {
    value?: DateRange | null;
    onChange: (range: DateRange | null) => void;
    className?: string;
    placeholder?: string;
    isClearable?: boolean;
}

export function DateRangePicker({ value, onChange, className, placeholder = "Select date range", isClearable = false }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Helper to format Date as YYYY-MM-DD local string
    const toDateString = useCallback((date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    const [tempFrom, setTempFrom] = useState<string>(() => value?.from ? toDateString(value.from) : '');
    const [tempTo, setTempTo] = useState<string>(() => value?.to ? toDateString(value.to) : '');

    // Helper to format Date for display, e.g., "18 Jan 2026"
    const toDisplayString = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const presets = useMemo(() => [
        {
            id: 'last-7-days',
            label: 'Last 7 Days',
            getValue: () => {
                const to = new Date();
                const from = new Date();
                from.setDate(to.getDate() - 7);
                return { from, to };
            }
        },
        {
            id: 'last-30-days',
            label: 'Last 30 Days',
            getValue: () => {
                const to = new Date();
                const from = new Date();
                from.setDate(to.getDate() - 30);
                return { from, to };
            }
        },
        {
            id: 'last-12-months',
            label: 'Last 12 Months',
            getValue: () => {
                const to = new Date();
                const from = new Date();
                from.setFullYear(to.getFullYear() - 1);
                return { from, to };
            }
        },
        {
            id: 'this-year',
            label: 'This Year',
            getValue: () => {
                const to = new Date();
                const from = new Date(to.getFullYear(), 0, 1);
                return { from, to };
            }
        },
        {
            id: 'custom',
            label: 'Custom Range',
            getValue: () => null
        }
    ], []);

    // Detect active preset based on current values
    const activePreset = useMemo(() => {
        let found = 'custom';
        for (const preset of presets) {
            if (preset.id === 'custom') continue;
            const range = preset.getValue();
            if (range) {
                if (toDateString(range.from) === tempFrom && toDateString(range.to) === tempTo) {
                    found = preset.id;
                    break;
                }
            }
        }
        return found;
    }, [tempFrom, tempTo, presets, toDateString]);

    const handlePresetClick = (presetId: string, getValue: () => DateRange | null) => {
        if (presetId !== 'custom') {
            const range = getValue();
            if (range) {
                const fromStr = toDateString(range.from);
                const toStr = toDateString(range.to);
                setTempFrom(fromStr);
                setTempTo(toStr);
                onChange(range);
                setIsOpen(false);
            }
        }
    };

    const handleApply = () => {
        const fromDate = new Date(tempFrom + 'T12:00:00');
        const toDate = new Date(tempTo + 'T12:00:00');
        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            onChange({ from: fromDate, to: toDate });
            setIsOpen(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            if (value?.from && value?.to) {
                setTempFrom(toDateString(value.from));
                setTempTo(toDateString(value.to));
            } else {
                setTempFrom('');
                setTempTo('');
            }
        }
    };

    const triggerButton = (
        <button
            type="button"
            className={cn(
                "inline-flex items-center gap-2.5 px-4 py-2 border border-border bg-background rounded-lg text-sm text-foreground hover:bg-accent/40 active:scale-95 transition-all shadow-sm font-medium",
                className
            )}
        >
            <CalendarIcon size={16} className="text-muted-foreground shrink-0" />
            <span className="truncate">
                {value?.from && value?.to 
                    ? `${toDisplayString(value.from)} — ${toDisplayString(value.to)}` 
                    : placeholder}
            </span>
            {isClearable && value?.from && value?.to ? (
                <div 
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange(null);
                    }}
                    className="ml-1.5 opacity-60 hover:opacity-100 hover:text-foreground transition-all rounded-full hover:bg-accent p-0.5 shrink-0"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                </div>
            ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground ml-1.5 opacity-80 shrink-0">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            )}
        </button>
    );

    const popoverContent = (
        <div className="flex flex-col sm:flex-row p-3 gap-3 min-w-[320px] sm:min-w-[420px] max-w-[500px]">
            {/* Presets List */}
            <div className="flex flex-col gap-1 pr-3 sm:border-r border-border/50 shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2.5 py-1.5 mb-1">Presets</span>
                {presets.map(p => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePresetClick(p.id, p.getValue)}
                        className={cn(
                            "text-left text-xs font-semibold px-2.5 py-2 rounded-md transition-all active:scale-95",
                            activePreset === p.id 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Custom Inputs and Apply Button */}
            <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest py-1.5 block">Custom range</span>
                    
                    <div className="space-y-2">
                        <label className="text-[11px] font-medium text-muted-foreground block">Start Date</label>
                        <DatePicker
                            value={tempFrom ? new Date(tempFrom + 'T12:00:00') : null}
                            onChange={(d) => setTempFrom(d ? toDateString(d) : '')}
                            placeholder="Select start date"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-medium text-muted-foreground block">End Date</label>
                        <DatePicker
                            value={tempTo ? new Date(tempTo + 'T12:00:00') : null}
                            onChange={(d) => setTempTo(d ? toDateString(d) : '')}
                            placeholder="Select end date"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-medium h-8 rounded-md"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleApply}
                        disabled={!tempFrom || !tempTo}
                        className="text-xs font-medium h-8 rounded-md"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <Popover
            trigger={triggerButton}
            content={popoverContent}
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            placement="bottom-end"
            showArrow={false}
        />
    );
}
