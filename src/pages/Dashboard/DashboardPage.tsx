import { useState, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CUSTOMERS_CURSOR, GET_CUSTOMER_BY_CUSTOMER_ID } from '@/graphql';
import {
    SearchIcon,
    XIcon,
    ChevronDownIcon,
    InfoIcon,
    SpinnerIcon
} from '@/components/icons';
import { ProjectDetailsCard } from './components/ProjectDetailsCard';

interface CustomerResult {
    uid: string;
    customerId: string;
    firstName: string;
    lastName: string;
    address?: {
        fullAddress?: string;
    };
}

interface CustomersCursorResult {
    customersCursor: {
        data: CustomerResult[];
    };
}

export function DashboardPage() {
    // Search input values
    const [searchId, setSearchId] = useState('');
    const [searchContact, setSearchContact] = useState('');
    const [searchAddress, setSearchAddress] = useState('');

    // Active dropdown track
    const [activeColumn, setActiveColumn] = useState<'id' | 'contact' | 'address' | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Selected customer
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null);
    const [selectionSourceCol, setSelectionSourceCol] = useState<'id' | 'contact' | 'address' | null>(null);

    // Refs for outside click detection
    const searchBarRef = useRef<HTMLDivElement>(null);

    // GraphQL search query
    const [searchCustomers, { data: searchData, loading: searchLoading }] =
        useLazyQuery<CustomersCursorResult>(GET_CUSTOMERS_CURSOR);

    // GraphQL fetch details query
    const [fetchDetails, { data: detailsData, loading: detailsLoading }] =
        useLazyQuery(GET_CUSTOMER_BY_CUSTOMER_ID);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
                setActiveColumn(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Perform query when inputs change
    const handleSearchChange = (val: string, column: 'id' | 'contact' | 'address') => {
        // Set search values
        if (column === 'id') {
            setSearchId(val);
        } else if (column === 'contact') {
            setSearchContact(val);
        } else {
            setSearchAddress(val);
        }

        // Reset customer selection when typing restarts
        if (selectedCustomer && selectionSourceCol === column) {
            setSelectedCustomer(null);
            setSelectionSourceCol(null);
        }

        setActiveColumn(column);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (val.trim().length >= 3) {
            debounceTimer.current = setTimeout(() => {
                searchCustomers({
                    variables: {
                        first: 10,
                        searchId: column === 'id' ? val : undefined,
                        searchName: column === 'contact' ? val : undefined,
                        searchAddress: column === 'address' ? val : undefined,
                        includeDeleted: "true",
                        isGlobalSearch: true
                    }
                });
                setShowDropdown(true);
            }, 500);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectCustomer = (customer: CustomerResult, column: 'id' | 'contact' | 'address') => {
        setSelectedCustomer(customer);
        setSelectionSourceCol(column);

        // Fill the selected value in the search bar input, clear others
        if (column === 'id') {
            setSearchId(customer.customerId);
        } else if (column === 'contact') {
            setSearchContact(`${customer.firstName} ${customer.lastName}`);
        } else {
            setSearchAddress(customer.address?.fullAddress || `${customer.firstName} ${customer.lastName}`);
        }

        setShowDropdown(false);
        setActiveColumn(null);

        // Fetch complete customer details
        fetchDetails({
            variables: { customerId: customer.customerId }
        });
    };

    const handleClearSelection = (column: 'id' | 'contact' | 'address') => {
        if (column === 'id') setSearchId('');
        else if (column === 'contact') setSearchContact('');
        else setSearchAddress('');

        if (selectedCustomer && selectionSourceCol === column) {
            setSelectedCustomer(null);
            setSelectionSourceCol(null);
        }
    };

    const searchResults = searchData?.customersCursor?.data || [];
    const customer = detailsData?.customerByCustomerId;

    const activeSearchVal = activeColumn === 'id' ? searchId : activeColumn === 'contact' ? searchContact : searchAddress;

    return (
        <div
            className="relative min-h-[calc(100vh-64px)] -m-4 p-8 flex flex-col items-center select-none"
        >
            {/* Background image layer - full vibrancy for Apple glassmorphism */}
            <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none rounded-2xl md:rounded-none opacity-80 dark:opacity-100 transition-opacity"
                style={{ backgroundImage: "url('/Gee-Dashboard-Bg.png')" }}
            />
            {/* Light tint for light mode readability, dark tint for dark mode */}
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 pointer-events-none rounded-2xl md:rounded-none transition-colors" />

            <div className="relative w-full max-w-[98%] xl:max-w-7xl z-10 flex flex-col items-center mt-12 space-y-6">

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl leading-tight font-medium tracking-tight text-center text-gray-900 dark:text-white drop-shadow-sm mb-2">
                    Welcome to <span className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">GEE Energy</span>
                </h1>

                {/* Floating Search Bar */}
                <div ref={searchBarRef} className="relative w-full max-w-3xl">
                    <div className="flex items-center h-14 bg-white/75 dark:bg-[#1c1c1e]/75 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full border border-white/40 dark:border-white/10 px-4 transition-all duration-300">

                        {/* Col 1: Search By Customer ID */}
                        <div className="relative flex-1 flex items-center px-4 gap-2.5 min-w-0">
                            <SearchIcon className="text-gray-400 dark:text-white/80 shrink-0" size={16} />
                            <input
                                type="text"
                                value={searchId}
                                onFocus={() => {
                                    setActiveColumn('id');
                                    setShowDropdown(searchId.trim().length > 0);
                                }}
                                onChange={(e) => handleSearchChange(e.target.value, 'id')}
                                placeholder="Search By Customer ID"
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-white/70 min-w-0"
                            />
                            {searchId && (
                                <button onClick={() => handleClearSelection('id')} className="text-gray-400 dark:text-white/60 hover:text-gray-600 dark:hover:text-white">
                                    <XIcon size={14} />
                                </button>
                            )}
                            <ChevronDownIcon className="text-gray-400/80 dark:text-white/60 shrink-0 cursor-pointer" size={14} />
                        </div>

                        {/* Divider */}
                        <div className="h-7 w-[1.5px] bg-black/[0.08] dark:bg-white/[0.08]" />

                        {/* Col 2: Search By Contact Details */}
                        <div className="relative flex-1 flex items-center px-4 gap-2.5 min-w-0">
                            <input
                                type="text"
                                value={searchContact}
                                onFocus={() => {
                                    setActiveColumn('contact');
                                    setShowDropdown(searchContact.trim().length > 0);
                                }}
                                onChange={(e) => handleSearchChange(e.target.value, 'contact')}
                                placeholder="Search By Name, Number, Email"
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-white/70 min-w-0"
                            />
                            {searchContact && (
                                <button onClick={() => handleClearSelection('contact')} className="text-gray-400 dark:text-white/60 hover:text-gray-600 dark:hover:text-white">
                                    <XIcon size={14} />
                                </button>
                            )}
                            <ChevronDownIcon className="text-gray-400/80 dark:text-white/60 shrink-0 cursor-pointer" size={14} />
                        </div>

                        {/* Divider */}
                        <div className="h-7 w-[1.5px] bg-black/[0.08] dark:bg-white/[0.08]" />

                        {/* Col 3: Search By Address */}
                        <div className="relative flex-1 flex items-center px-4 gap-2.5 min-w-0">
                            <input
                                type="text"
                                value={searchAddress}
                                onFocus={() => {
                                    setActiveColumn('address');
                                    setShowDropdown(searchAddress.trim().length > 0);
                                }}
                                onChange={(e) => handleSearchChange(e.target.value, 'address')}
                                placeholder="Search By Address, NMI"
                                className="w-full bg-transparent border-none outline-none text-sm text-gray-700 dark:text-white placeholder-gray-500/70 dark:placeholder-white/70 min-w-0"
                            />
                            {searchAddress && (
                                <button onClick={() => handleClearSelection('address')} className="text-gray-400 dark:text-white/60 hover:text-gray-600 dark:hover:text-white">
                                    <XIcon size={14} />
                                </button>
                            )}
                            <ChevronDownIcon className="text-gray-400/80 dark:text-white/60 shrink-0 cursor-pointer" size={14} />
                        </div>
                    </div>

                    {/* Full-width Dropdown suggestion list */}
                    {showDropdown && activeColumn && (
                        <div
                            className="absolute left-0 right-0 z-50 mt-2 bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[24px] shadow-[0_10px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgb(0,0,0,0.4)] overflow-hidden p-2 w-full"
                        >
                            {activeSearchVal.trim().length < 3 ? (
                                <div className="px-3.5 py-3 text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 rounded-xl border border-sky-100 dark:border-sky-900/50 flex items-center gap-1.5">
                                    <InfoIcon size={14} />
                                    Please enter 3 or more characters
                                </div>
                            ) : searchLoading ? (
                                <div className="flex items-center justify-center py-6 text-gray-400 dark:text-neutral-500 text-xs gap-2">
                                    <SpinnerIcon size={16} className="animate-spin text-primary" />
                                    Searching...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                                    {searchResults.map((cust) => (
                                        <button
                                            key={cust.uid}
                                            onClick={() => handleSelectCustomer(cust, activeColumn)}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 active:bg-gray-100 dark:active:bg-neutral-800 transition-colors flex items-center justify-between gap-4"
                                        >
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className="font-semibold text-xs text-gray-800 dark:text-neutral-200">
                                                    {cust.firstName} {cust.lastName}
                                                </span>
                                                <span className="text-[10px] text-gray-400 dark:text-neutral-500 truncate">
                                                    {cust.address?.fullAddress || 'No Address'}
                                                </span>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-2">
                                                <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 font-bold text-[10px] px-2 py-0.5 rounded">
                                                    #{cust.customerId}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-xs text-gray-400 dark:text-neutral-500 text-center">
                                    No records found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Search Text Link under search bar */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm px-4 py-2 rounded-full">
                    <InfoIcon size={14} className="text-gray-500 dark:text-white/70" />
                    <span>Search For Customers</span>
                </div>

                {/* Details Card */}
                {selectedCustomer && (
                    <div className="w-full flex items-start gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {detailsLoading || !customer ? (
                            <div className="flex-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xl p-12 flex flex-col items-center justify-center gap-3">
                                <SpinnerIcon size={24} className="animate-spin text-primary" />
                                <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">Loading project details...</span>
                            </div>
                        ) : (
                            <>
                                <ProjectDetailsCard customer={customer} />

                                {/* Floating Close Button beside the card */}
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="w-10 h-10 -mt-3 rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 active:scale-95 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 shadow-lg border border-gray-100 dark:border-neutral-800 flex items-center justify-center transition-all shrink-0"
                                >
                                    <XIcon size={18} />
                                </button>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
