import { useRef, useEffect, useCallback, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// DataTable Types
// ============================================================

export interface Column<T> {
    /** Unique key for the column */
    key: string;
    /** Column header label */
    header: ReactNode;
    /** Width class (e.g., 'w-[120px]') */
    width?: string;
    /** Render function for cell content */
    render: (row: T, index: number) => ReactNode;
    /** Sticky column configuration */
    sticky?: boolean | 'left' | 'right';
    /** Sticky left offset in px (for multiple sticky columns) */
    stickyOffset?: number;
}

export interface PaginationProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface DataTableProps<T> {
    /** Array of column definitions */
    columns: Column<T>[];
    /** Array of data rows */
    data: T[];
    /** Unique key extractor for each row */
    rowKey: (row: T) => string;
    /** Loading state */
    loading?: boolean;
    /** Error message */
    error?: string;
    /** Empty state message */
    emptyMessage?: string;
    /** Loading message */
    loadingMessage?: string;
    /** Enable infinite scroll */
    infiniteScroll?: boolean;
    /** Has more data to load */
    hasMore?: boolean;
    /** Is loading more data */
    isLoadingMore?: boolean;
    /** Callback when scrolled near bottom */
    onLoadMore?: () => void;
    /** Custom max height class (legacy) */
    maxHeightClass?: string;
    /** Custom container height class (e.g. h-[500px]) - prefers this over maxHeightClass and default */
    containerHeightClass?: string;
    /** Custom class for wrapper */
    className?: string;
    /** Enable row selection */
    enableSelection?: boolean;
    /** Selected row keys */
    selectedRowKeys?: string[];
    /** Callback when selection changes */
    onSelectionChange?: (keys: string[]) => void;
    /** Optional function to apply a class name to a row */
    rowClassName?: (row: T) => string;
    /** Callback for select all - use this to fetch all IDs from backend */
    onSelectAll?: (selectAll: boolean) => void;
    /** Total filtered count (for showing "Select all X" message) */
    totalFilteredCount?: number;
    /** Whether select all is loading */
    isSelectingAll?: boolean;
    /** Pagination configuration */
    pagination?: PaginationProps;
}

// ============================================================
// DataTable Component
// ============================================================

export function DataTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    error,
    emptyMessage = 'No data found.',
    loadingMessage = 'Loading...',
    infiniteScroll = false,
    hasMore = false,
    isLoadingMore = false,
    onLoadMore,
    maxHeightClass = 'max-h-[calc(100vh-270px)]',
    containerHeightClass,
    className,
    rowClassName,
    enableSelection = false,
    selectedRowKeys = [],
    onSelectionChange,
    onSelectAll,
    totalFilteredCount,
    isSelectingAll = false,
    pagination,
}: DataTableProps<T>) {
    // Determine the height class to use
    // If containerHeightClass is provided, use it. Otherwise use maxHeightClass.
    const heightClass = containerHeightClass || maxHeightClass;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const colSpan = columns.length + (enableSelection ? 1 : 0);
    const [isScrolledHorizontally, setIsScrolledHorizontally] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Handle scroll to load more and track horizontal scroll
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Track horizontal scroll for sticky column shadow
        setIsScrolledHorizontally(container.scrollLeft > 0);

        // Track if we can scroll right (not at the end)
        const canScroll = container.scrollWidth > container.clientWidth;
        const atRightEdge = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
        setCanScrollRight(canScroll && !atRightEdge);

        // Infinite scroll logic - ONLY if pagination is NOT used
        if (pagination) return;

        if (!infiniteScroll || !onLoadMore) return;
        if (loading || isLoadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollThreshold = 100;

        if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
            onLoadMore();
        }
    }, [infiniteScroll, onLoadMore, loading, isLoadingMore, hasMore, pagination]);

    // Attach scroll listener and check initial overflow
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });

            // Check initial overflow state
            const checkOverflow = () => {
                const canScroll = container.scrollWidth > container.clientWidth;
                const atRightEdge = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
                setCanScrollRight(canScroll && !atRightEdge);
            };
            checkOverflow();

            // Use ResizeObserver to detect changes in overflow
            const resizeObserver = new ResizeObserver(checkOverflow);
            resizeObserver.observe(container);

            return () => {
                container.removeEventListener('scroll', handleScroll);
                resizeObserver.disconnect();
            };
        }
    }, [handleScroll]);

    // Selection Logic
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        // If onSelectAll is provided, use it for external handling (like fetching all IDs)
        if (onSelectAll) {
            onSelectAll(checked);
            return;
        }

        // Default behavior: select/deselect only visible rows
        if (!onSelectionChange) return;
        if (checked) {
            const allKeys = data.map(rowKey);
            onSelectionChange(allKeys);
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (key: string, checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            onSelectionChange([...selectedRowKeys, key]);
        } else {
            onSelectionChange(selectedRowKeys.filter(k => k !== key));
        }
    };

    // Check if all visible items are selected
    const allVisibleSelected = data.length > 0 && data.every(row => selectedRowKeys.includes(rowKey(row)));
    // Check if all filtered (total) items are selected
    const allFilteredSelected = totalFilteredCount !== undefined && selectedRowKeys.length >= totalFilteredCount;
    const allSelected = allFilteredSelected || allVisibleSelected;
    const someSelected = data.length > 0 && selectedRowKeys.length > 0 && !allSelected;

    return (
        <div className={cn('flex flex-col rounded-md', className)}>
            <div
                ref={scrollContainerRef}
                className={cn(heightClass, 'overflow-auto scrollbar-thin rounded-t-md', pagination ? 'border-b border-border' : '')}
            >
                <table className="w-full relative border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20 bg-background">
                        <tr className="border-b border-border shadow-sm">
                            {enableSelection && (
                                <th className="sticky left-0 z-30 w-[40px] px-3 py-3 text-left bg-background border-b border-border">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            disabled={isSelectingAll}
                                            ref={input => {
                                                if (input) input.indeterminate = someSelected;
                                            }}
                                            onChange={handleSelectAll}
                                            className={cn(
                                                "rounded border-gray-300 text-primary focus:ring-primary h-4 w-4",
                                                isSelectingAll ? "opacity-50 cursor-wait" : "cursor-pointer"
                                            )}
                                            title={totalFilteredCount ? `Select all ${totalFilteredCount} items` : 'Select all visible items'}
                                        />
                                    </div>
                                </th>
                            )}
                            {columns.map((col, colIndex) => {
                                const isSticky = col.sticky === true || col.sticky === 'left';
                                const isRightSticky = col.sticky === 'right';
                                // Find if this is the last sticky column
                                const isLastSticky = isSticky && !columns.slice(colIndex + 1).some(c => c.sticky === true || c.sticky === 'left');
                                // sticky offset needs to account for selection column if present
                                const baseOffset = col.stickyOffset ?? 0;
                                const stickyLeft = enableSelection && isSticky ? baseOffset + 40 : baseOffset; // 40px for selection checkbox

                                const stickyStyles: React.CSSProperties = isSticky ? {
                                    position: 'sticky',
                                    left: stickyLeft,
                                    zIndex: 30,
                                } : isRightSticky ? {
                                    position: 'sticky',
                                    right: 0,
                                    zIndex: 30,
                                } : {};

                                return (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            'px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-background border-b border-border align-top whitespace-nowrap',
                                            col.width,
                                            isLastSticky && isScrolledHorizontally && "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                                            isRightSticky && canScrollRight && "shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                                        )}
                                        style={stickyStyles}
                                    >
                                        {col.header}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-12 text-center text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                        {loadingMessage}
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-12 text-center text-destructive">
                                    {error}
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-12 text-center text-muted-foreground">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            <>
                                {data.map((row, rowIndex) => {
                                    const key = rowKey(row);
                                    const isSelected = selectedRowKeys.includes(key);

                                    return (
                                        <tr
                                            key={key}
                                            className={cn(
                                                "bg-background hover:bg-muted group",
                                                isSelected && "bg-muted/30",
                                                rowClassName?.(row)
                                            )}
                                        >
                                            {enableSelection && (
                                                <td className="sticky left-0 z-10 w-[40px] px-3 py-3 bg-local align-top">
                                                    {/* bg-local might not be enough to hide content under sticky, needs background color matching row */}
                                                    <div className={cn(
                                                        "absolute inset-0",
                                                        isSelected ? "bg-slate-50 dark:bg-slate-900" : "bg-background group-hover:bg-muted",
                                                        rowClassName?.(row)
                                                    )} aria-hidden="true" />
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => handleSelectRow(key, e.target.checked)}
                                                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                                        />
                                                    </div>
                                                </td>
                                            )}
                                            {columns.map((col, colIndex) => {
                                                const isSticky = col.sticky === true || col.sticky === 'left';
                                                const isRightSticky = col.sticky === 'right';
                                                // Find if this is the last sticky column
                                                const isLastSticky = isSticky && !columns.slice(colIndex + 1).some(c => c.sticky === true || c.sticky === 'left');
                                                // sticky offset needs to account for selection column if present
                                                const baseOffset = col.stickyOffset ?? 0;
                                                const stickyLeft = enableSelection && isSticky ? baseOffset + 40 : baseOffset;

                                                const stickyStyles: React.CSSProperties = isSticky ? {
                                                    position: 'sticky',
                                                    left: stickyLeft,
                                                    zIndex: 10,
                                                } : isRightSticky ? {
                                                    position: 'sticky',
                                                    right: 0,
                                                    zIndex: 10,
                                                } : {};

                                                return (
                                                    <td
                                                        key={col.key}
                                                        className={cn(
                                                            "px-3 py-3 text-sm transition-colors overflow-hidden",
                                                            // For sticky columns, we need to manually match the row's background color
                                                            // to prevent transparency issues when scrolling
                                                            (isSticky || isRightSticky) && (
                                                                isSelected
                                                                    ? "bg-slate-50 dark:bg-slate-900" // Use solid light background for selected sticky cells
                                                                    : cn("bg-background group-hover:bg-muted", rowClassName?.(row))
                                                            ),
                                                            isLastSticky && isScrolledHorizontally && "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]",
                                                            isRightSticky && canScrollRight && "shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                                                        )}
                                                        style={stickyStyles}
                                                    >
                                                        {col.render(row, rowIndex)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                                {/* Loading more indicator - ONLY for infinite scroll */}
                                {isLoadingMore && !pagination && (
                                    <tr>
                                        <td colSpan={colSpan} className="px-4 py-4 text-center text-muted-foreground">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                Loading more...
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-4 bg-background border-t border-border rounded-b-md select-none group/pagination">
                    {/* Left: Showing X-Y of Z */}
                    <div className="text-sm text-muted-foreground font-medium">
                        {(() => {
                            const start = (pagination.currentPage - 1) * pagination.pageSize + 1;
                            const end = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount);
                            return (
                                <span className="flex items-center gap-1">
                                    Showing <span className="text-foreground font-bold">{start}-{end}</span> of <span className="text-foreground font-bold">{pagination.totalCount}</span> customers
                                </span>
                            );
                        })()}
                    </div>

                    {/* Right: Rows per page + Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Rows per page selector */}
                        {pagination.onPageSizeChange && (
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Rows per page</span>
                                <select
                                    value={pagination.pageSize}
                                    onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                                    className="h-8 px-2 py-1 text-xs font-bold rounded-md border border-input bg-background hover:bg-accent hover:border-accent-foreground/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {[10, 25, 50, 100].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="h-8 px-3 text-xs font-bold rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Previous
                            </button>

                            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                                Page <span className="text-foreground font-bold px-1.5 py-0.5 bg-accent/50 rounded">{pagination.currentPage}</span>
                                <span className="opacity-50">of</span>
                                <span className="text-foreground font-bold">{Math.ceil(pagination.totalCount / pagination.pageSize) || 1}</span>
                            </div>

                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="h-8 px-3 text-xs font-bold rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm active:scale-95 text-primary"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default DataTable;
