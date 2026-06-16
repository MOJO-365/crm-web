/// <reference types="google.maps" />
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadPlaces } from './googleLoader';
import { Input } from '@/components/ui/Input';

type Prediction = { description: string; place_id: string };
type Props = {
    /** Controlled address string */
    value: string;
    /** Called on free-typed change (keeps your form controlled) */
    onChange: (text: string) => void;
    /** Called when the user selects a place (returns address + parsed bits) */
    onSelect: (payload: {
        address: string;
        state?: string;
        suburb?: string;
        postcode?: string;
        unitNumber?: string;
        houseNumber?: string;
        buildingName?: string;
        floorLevelNumber?: string;
        streetNumber?: string;
        streetName?: string;
        streetType?: string;
        country?: string;
        placeId?: string;
        lat?: number;
        lng?: number;
    }) => void;
    placeholder?: string;
    /** Restrict to certain countries (default AU). Pass empty array for global search. */
    countries?: string[];
    /** Google Places types (default ['geocode']) */
    types?: string[];
    /** Optional: z-index for the dropdown */
    zIndexClass?: string; // e.g. "z-50"
    label?: string;
    error?: string;
    required?: boolean;
};

export default function LocationAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = 'Start typing address',
    countries = ['au'],
    types = ['geocode', 'establishment'],
    zIndexClass = 'z-50',
    label,
    error,
    required,
}: Props) {
    const [googleReady, setGoogleReady] = useState(false);
    const [options, setOptions] = useState<Prediction[]>([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    const acRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const psRef = useRef<google.maps.places.PlacesService | null>(null);
    const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement | null>(null);
    const debounceId = useRef<number | null>(null);
    const [dropdownRect, setDropdownRect] = useState<{ width: number; top: number; left: number } | null>(null);

    const updateDropdownPosition = useCallback(() => {
        const inputEl = inputRef.current;
        if (!inputEl) return;
        const rect = inputEl.getBoundingClientRect();
        setDropdownRect({
            width: rect.width,
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        });
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const google = await loadPlaces();
            if (!mounted) return;
            acRef.current = new google.maps.places.AutocompleteService();
            psRef.current = new google.maps.places.PlacesService(document.createElement('div'));
            tokenRef.current = new google.maps.places.AutocompleteSessionToken();
            setGoogleReady(true);
        })();
        return () => {
            mounted = false;
            if (debounceId.current) window.clearTimeout(debounceId.current);
        };
    }, []);

    // close on outside click
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            const target = e.target as Node;
            const insideInput = containerRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);
            if (!insideInput && !insideDropdown) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    useLayoutEffect(() => {
        if (!open) return;
        updateDropdownPosition();
        const handle = () => updateDropdownPosition();
        window.addEventListener('resize', handle);
        window.addEventListener('scroll', handle, true);
        return () => {
            window.removeEventListener('resize', handle);
            window.removeEventListener('scroll', handle, true);
        };
    }, [open, options.length, updateDropdownPosition]);

    const fetchPredictions = (text: string) => {
        if (!acRef.current || !googleReady) return;
        setLoading(true);

        const request: google.maps.places.AutocompletionRequest = {
            input: text,
            types: types,
            sessionToken: tokenRef.current || undefined,
        };

        if (countries && countries.length > 0) {
            request.componentRestrictions = { country: countries };
        }

        acRef.current.getPlacePredictions(
            request,
            (preds) => {
                setOptions((preds || []).map((p: any) => ({ description: p.description, place_id: p.place_id! })));
                setLoading(false);
                setOpen(true);
                setActiveIndex(-1);
                updateDropdownPosition();
            }
        );
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        onChange(text);
        if (!text.trim()) {
            setOptions([]);
            setOpen(false);
            setDropdownRect(null);
            return;
        }
        if (debounceId.current) window.clearTimeout(debounceId.current);
        debounceId.current = window.setTimeout(() => fetchPredictions(text), 220);
        updateDropdownPosition();
    };

    const parseComponents = (place: google.maps.places.PlaceResult) => {
        const comps = place.address_components || [];
        const byType = (t: string, field: 'long_name' | 'short_name' = 'long_name') =>
            comps.find(c => c.types.includes(t))?.[field] || '';
        const state = byType('administrative_area_level_1', 'short_name');
        const suburb = byType('locality') || byType('sublocality') || byType('postal_town');
        const postcode = byType('postal_code');
        const rawSubpremise = byType('subpremise');
        const premiseFromComponents = byType('premise');
        let streetNumber = byType('street_number');
        const route = byType('route');
        const routeParts = route.trim().split(/\s+/).filter(Boolean);
        const streetType = routeParts.length > 1 ? routeParts[routeParts.length - 1] : '';
        const streetName = routeParts.length > 1 ? routeParts.slice(0, -1).join(' ') : route;
        const country = byType('country', 'short_name') || 'AU';

        // Parse subpremise: could be a unit ("5"), a level ("level 25"), or combined ("level 25/unit 5")
        let unitNumber = '';
        let floorLevelNumber = '';
        if (rawSubpremise) {
            const lower = rawSubpremise.toLowerCase();
            if (lower.startsWith('level') || lower.startsWith('floor') || lower.startsWith('lvl') || lower.startsWith('l ')) {
                // It's a floor/level identifier
                floorLevelNumber = rawSubpremise;
            } else if (lower.includes('/')) {
                // Could be "level 25/unit 5" or "25/5"
                const parts = rawSubpremise.split('/');
                // Check if it's a unit/house range like "1003/6" where streetNumber is "10"
                if (parts.length === 2 && /^\d+$/.test(parts[0].trim()) && /^\d+$/.test(parts[1].trim()) && streetNumber && /^\d+$/.test(streetNumber.trim())) {
                    unitNumber = parts[0].trim();
                    streetNumber = `${parts[1].trim()}-${streetNumber.trim()}`;
                } else {
                    for (const part of parts) {
                        const p = part.trim().toLowerCase();
                        if (p.startsWith('level') || p.startsWith('floor') || p.startsWith('lvl')) {
                            floorLevelNumber = part.trim();
                        } else {
                            unitNumber = part.trim();
                        }
                    }
                }
            } else {
                // Check if it's space-separated numbers like "1003 6" where streetNumber is "10"
                const spaceParts = rawSubpremise.trim().split(/\s+/);
                if (spaceParts.length === 2 && /^\d+$/.test(spaceParts[0]) && /^\d+$/.test(spaceParts[1]) && streetNumber && /^\d+$/.test(streetNumber.trim())) {
                    unitNumber = spaceParts[0];
                    streetNumber = `${spaceParts[1]}-${streetNumber.trim()}`;
                } else {
                    // Plain number like "5" — treat as unit number
                    unitNumber = rawSubpremise.replace(/^(unit|unit\s+)/i, '');
                }
            }
        }

        // Handle slash in streetNumber (e.g. "6/10")
        if (streetNumber && streetNumber.includes('/')) {
            const parts = streetNumber.split('/');
            if (parts.length === 2) {
                if (unitNumber) {
                    // We already have a unit (e.g. "1003"), so "6/10" must be the house number range "6-10"
                    streetNumber = `${parts[0].trim()}-${parts[1].trim()}`;
                } else {
                    // No unit number, so "6/10" means Unit 6, House 10
                    unitNumber = parts[0].trim();
                    streetNumber = parts[1].trim();
                }
            }
        }

        // Building name: use premise component, or fall back to place.name for establishments
        let buildingName = premiseFromComponents;
        
        // If buildingName is just a number and matches streetNumber, it's not a building name
        if (buildingName && streetNumber && buildingName.trim() === streetNumber.trim()) {
            buildingName = '';
        }

        if (!buildingName && place.name) {
            // Check if the place name is NOT just the street address (e.g., "Eureka Tower" vs "7 Riverside Quay")
            const placeTypes = place.types || [];
            const isEstablishment = placeTypes.some(t =>
                ['establishment', 'point_of_interest', 'shopping_mall', 'lodging', 'real_estate_agency', 'hospital', 'university', 'school'].includes(t)
            ) && !placeTypes.includes('street_address') && !placeTypes.includes('route');

            if (isEstablishment) {
                buildingName = place.name;
            } else if (place.name && place.formatted_address && !place.formatted_address.startsWith(place.name)) {
                // The name is different from the formatted address start — likely a building name
                buildingName = place.name;
            }
        }

        // Final sanity check: if buildingName is still just the street name or address, clear it
        if (buildingName) {
            const lowerBuilding = buildingName.toLowerCase().trim();
            const lowerStreet = streetName.toLowerCase().trim();
            const lowerFull = (place.formatted_address || '').toLowerCase().trim();
            
            // If it matches street name exactly, or it's just the start of the address (like "123 Main St")
            // or if it contains the street name and number and looks like an address
            const isAddressLike = 
                lowerBuilding === lowerStreet || 
                lowerFull.startsWith(lowerBuilding) && (lowerBuilding.includes(lowerStreet) || /^\d+/.test(lowerBuilding)) ||
                (streetNumber && lowerBuilding.includes(streetNumber.toLowerCase()) && lowerBuilding.includes(lowerStreet));

            if (isAddressLike) {
                buildingName = '';
            }
        }

        // Log for debugging
        console.log('[LocationAutocomplete] Parsed:', {
            rawSubpremise, premiseFromComponents, placeName: place.name, placeTypes: place.types,
            unitNumber, floorLevelNumber, buildingName, streetNumber, streetName, streetType,
            suburb, state, postcode, country
        });

        const loc = place.geometry?.location;
        return {
            state,
            suburb,
            postcode,
            unitNumber,
            houseNumber: streetNumber,
            buildingName,
            floorLevelNumber,
            streetNumber,
            streetName,
            streetType,
            country,
            lat: loc?.lat?.(),
            lng: loc?.lng?.(),
        };
    };

    const selectPlaceId = (p: Prediction) => {
        const closeDropdown = () => {
            setOpen(false);
            setDropdownRect(null);
        };
        if (!psRef.current) {
            onSelect({
                address: p.description,
                placeId: p.place_id,
                unitNumber: '',
                houseNumber: '',
                buildingName: '',
                floorLevelNumber: '',
                streetNumber: '',
                streetName: '',
                streetType: '',
                suburb: '',
                postcode: '',
                state: '',
                country: '',
            });
            closeDropdown();
            return;
        }
        psRef.current.getDetails(
            {
                placeId: p.place_id,
                fields: ['formatted_address', 'address_components', 'geometry', 'place_id', 'name', 'types'],
                sessionToken: tokenRef.current || undefined,
            },
            (place: any, status: any) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    const address = p.description || place.formatted_address || '';
                    const parts = parseComponents(place);
                    
                    // If Google stripped the suffix or range in address_components, try to recover it from the description
                    if (p.description && parts.streetNumber) {
                        const rangeRegex = new RegExp(`\\b${parts.streetNumber}-\\d+\\b`, 'i');
                        const rangeMatch = p.description.match(rangeRegex);
                        if (rangeMatch) {
                            parts.houseNumber = rangeMatch[0];
                            parts.streetNumber = rangeMatch[0];
                        } else {
                            const regex = new RegExp(`^\\b${parts.streetNumber}([a-zA-Z])\\b`, 'i');
                            const regex2 = new RegExp(`\\b${parts.streetNumber}([a-zA-Z])\\b`, 'i');
                            const match = p.description.match(regex) || p.description.match(regex2);
                            if (match) {
                                parts.houseNumber = match[0];
                                parts.streetNumber = match[0];
                            }
                        }
                    }
                    
                    
                    // Recover unit number and floor/level number from description if missing from Google components
                    if (!parts.unitNumber && p.description) {
                        const unitMatch = p.description.match(/\b(Suite|Unit|Apt|Apartment|Shop|Ste|U)\s*(\d+[a-zA-Z]?)\b/i);
                        if (unitMatch) {
                            parts.unitNumber = unitMatch[2];
                        } else {
                            const slashMatch = p.description.match(/^\s*(\d+[a-zA-Z]?)\//);
                            if (slashMatch) {
                                parts.unitNumber = slashMatch[1];
                            }
                        }
                    }

                    if (!parts.floorLevelNumber && p.description) {
                        const levelMatch = p.description.match(/\b(Level|Floor|Lvl|L)\s*(\d+)\b/i);
                        if (levelMatch) {
                            parts.floorLevelNumber = levelMatch[2];
                        }
                    }

                    onSelect({ address, placeId: place.place_id!, ...parts });
                } else {
                    onSelect({ address: p.description, placeId: p.place_id });
                }
                // refresh token for next session
                tokenRef.current = new google.maps.places.AutocompleteSessionToken();
                closeDropdown();
            }
        );
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open || !options.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, options.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                e.preventDefault();
                selectPlaceId(options[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
            setDropdownRect(null);
        }
    };

    const dropdown = open && dropdownRect
        ? createPortal(
            <ul
                ref={node => { dropdownRef.current = node; }}
                role="listbox"
                className={`${zIndexClass} bg-white dark:bg-neutral-900 text-foreground border border-border rounded-md shadow-xl max-h-72 overflow-auto`}
                style={{ position: 'absolute', top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
            >
                {loading && (
                    <li className="px-3 py-2 text-sm text-muted-foreground">Searching…</li>
                )}
                {!loading && options.length === 0 && (
                    <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>
                )}
                {options.map((opt, idx) => (
                    <li
                        key={opt.place_id}
                        role="option"
                        aria-selected={idx === activeIndex}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${idx === activeIndex ? 'bg-accent text-accent-foreground' : ''}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
                        onClick={() => selectPlaceId(opt)}
                        title={opt.description}
                    >
                        {opt.description}
                    </li>
                ))}
            </ul>,
            document.body
        )
        : null;

    return (
        <div className="relative" ref={containerRef}>
            <Input
                ref={inputRef}
                label={label}
                error={error}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={handleInput}
                onKeyDown={onKeyDown}
                onFocus={() => { if (options.length) { setOpen(true); updateDropdownPosition(); } }}
                autoComplete="off"
            />

            {dropdown}

        </div>
    );
}
