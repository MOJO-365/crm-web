/**
 * Australian Phone Number Utilities
 * Validates, formats, and restricts phone inputs for Australian CRM operations.
 */

// Characters allowed in phone number input
export const ALLOWED_PHONE_CHARS = /^[0-9+\s()-]*$/;

/**
 * Filter raw input to only allow valid phone characters and limit max length.
 */
export function sanitizePhoneInput(val: string): string {
    if (!val) return '';
    // Allow digits, plus sign (only at start), spaces, hyphens, parentheses
    const hasLeadingPlus = val.trim().startsWith('+');
    let cleaned = val.replace(/[^0-9\s()-]/g, '');
    if (hasLeadingPlus) {
        cleaned = '+' + cleaned.replace(/\+/g, '');
    } else {
        cleaned = cleaned.replace(/\+/g, '');
    }
    // Limit to reasonable phone length (16 characters max)
    return cleaned.slice(0, 18);
}

/**
 * Format digits into standard Australian phone layout:
 * - Mobile: 04XX XXX XXX
 * - Landline: 0X XXXX XXXX
 * - 1300 / 1800: 1300 XXX XXX
 * - 13: 13 XX XX
 */
export function formatAustralianPhone(value: string): string {
    if (!value) return '';

    const isPlus = value.startsWith('+');
    const digits = value.replace(/\D/g, '');

    if (!digits) return isPlus ? '+' : '';

    // If starts with +61
    if (isPlus && digits.startsWith('61')) {
        const rest = digits.slice(2);
        if (rest.length <= 1) return `+61 ${rest}`;
        if (rest.length <= 4) return `+61 ${rest.slice(0, 1)} ${rest.slice(1)}`;
        if (rest.length <= 7) return `+61 ${rest.slice(0, 1)} ${rest.slice(1, 4)} ${rest.slice(4)}`;
        return `+61 ${rest.slice(0, 1)} ${rest.slice(1, 4)} ${rest.slice(4, 7)} ${rest.slice(7, 9)}`;
    }

    // 1300 or 1800 numbers
    if (digits.startsWith('1300') || digits.startsWith('1800')) {
        if (digits.length <= 4) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }

    // 13 numbers (6 digits)
    if (digits.startsWith('13') && digits.length <= 6) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)}`;
    }

    // Mobile: 04XX XXX XXX
    if (digits.startsWith('04')) {
        if (digits.length <= 4) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }

    // Landline: 02, 03, 07, 08 (0X XXXX XXXX)
    if (/^0[2378]/.test(digits)) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }

    // Fallback: return as typed if not matching standard AU prefixes
    return value;
}

/**
 * Validates whether a phone number is a valid Australian or international phone number.
 * Returns null if valid, or a descriptive error message if invalid.
 */
export function validatePhoneNumber(phone: string, isRequired: boolean = false): string | null {
    const raw = (phone || '').trim();

    if (!raw) {
        return isRequired ? 'Phone number is required' : null;
    }

    // Digits only
    const digits = raw.replace(/\D/g, '');

    if (digits.length === 0) {
        return 'Please enter a valid phone number';
    }

    // 1. Reject invalid repeating or sequence patterns (wrong numbers / spam)
    if (/^(\d)\1+$/.test(digits)) {
        return 'Invalid number: cannot consist of identical repeating digits';
    }
    if (['123456789', '1234567890', '0123456789', '9876543210', '0000000000'].includes(digits)) {
        return 'Please enter a valid, active phone number';
    }

    // 2. Handle Australian numbers
    // Convert +61... or 61... to local 0...
    let localDigits = digits;
    if (raw.startsWith('+61') || digits.startsWith('61')) {
        const withoutPrefix = digits.startsWith('61') ? digits.slice(2) : digits;
        localDigits = '0' + withoutPrefix;
    }

    // 1300 / 1800 check
    if (digits.startsWith('1300') || digits.startsWith('1800')) {
        if (digits.length !== 10) {
            return '1300 / 1800 numbers must be 10 digits';
        }
        return null;
    }

    // 13 check
    if (digits.startsWith('13') && digits.length === 6) {
        return null;
    }

    // Standard Australian mobile / landline
    if (localDigits.startsWith('0')) {
        if (localDigits.length < 10) {
            return `Australian number is too short (${localDigits.length}/10 digits)`;
        }
        if (localDigits.length > 10) {
            return `Australian number is too long (${localDigits.length}/10 digits)`;
        }

        const areaPrefix = localDigits.slice(0, 2);
        // Valid AU prefixes: 04 (mobile), 02 (NSW/ACT), 03 (VIC/TAS), 07 (QLD), 08 (WA/SA/NT)
        if (!['04', '02', '03', '07', '08'].includes(areaPrefix)) {
            return `Invalid area code "${areaPrefix}". Must start with 04 (mobile) or 02, 03, 07, 08 (landline)`;
        }

        return null; // Valid Australian number!
    }

    // 3. International format (+ followed by country code and 8-15 digits)
    if (raw.startsWith('+')) {
        if (digits.length < 8) {
            return 'International phone number is too short';
        }
        if (digits.length > 15) {
            return 'International phone number cannot exceed 15 digits';
        }
        return null;
    }

    // If 9 digits without leading 0 (common user omission: e.g. 412345678)
    if (digits.length === 9 && digits.startsWith('4')) {
        return 'Please include the leading 0 (e.g. 0412 345 678)';
    }

    return 'Please enter a valid 10-digit Australian number starting with 04 (mobile) or 02/03/07/08 (landline)';
}

