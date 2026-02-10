
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Popover } from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';

interface ColorPickerProps {
    color?: string;
    onChange: (color: string) => void;
    className?: string;
}

const PRESET_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#64748B', // Slate
    '#71717A', // Zinc
    '#737373', // Neutral
    '#78716C', // Stone
];

export function ColorPicker({ color = '#3B82F6', onChange, className }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const trigger = (
        <button
            type="button"
            className={cn(
                "w-10 h-10 rounded-md border border-border flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                className
            )}
            style={{ backgroundColor: color }}
        >
            <span className="sr-only">Pick a color</span>
        </button>
    );

    const content = (
        <div className="p-3 w-64">
            <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_COLORS.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        className={cn(
                            "w-6 h-6 rounded-full border border-border transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            color === preset && "ring-2 ring-offset-2 ring-primary scale-110"
                        )}
                        style={{ backgroundColor: preset }}
                        onClick={() => {
                            onChange(preset);
                            setIsOpen(false);
                        }}
                        title={preset}
                    />
                ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground w-12">Custom</span>
                <div className="flex-1 flex gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer"
                        title="Custom color"
                    />
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 h-8 text-xs border rounded px-2"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            trigger={trigger}
            content={content}
            placement="bottom-start"
            showArrow={true}
        />
    );
}

export default ColorPicker;
