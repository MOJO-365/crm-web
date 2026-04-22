// Twilio SMS Verification Utility
// Uses Twilio API directly from frontend for phone verification

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const messagingServiceSid = import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID;
const CODE_TTL_MS = 5 * 60 * 1000;

type PendingCode = { code: string; expiresAt: number };
const pendingCodes = new Map<string, PendingCode>();

function authHeader() {
    return "Basic " + btoa(`${accountSid}:${authToken}`);
}

export function normalisePhone(to: string | null | undefined): string {
    if (!to) return '';

    let cleaned = to.trim();
    const hasPlus = cleaned.startsWith('+');
    let digits = cleaned.replace(/\D/g, "");

    if (hasPlus) {
        return '+' + digits;
    }

    // AU Mobiles/Landlines
    if (digits.startsWith("0")) {
        return `+61${digits.slice(1)}`;
    }

    if (digits.startsWith("61")) {
        if (digits.length >= 11) {
            return `+${digits}`;
        }
    }

    if (digits.length === 9) {
        return `+61${digits}`;
    }

    return digits.length > 0 ? `+${digits}` : '';
}

/**
 * Denormalises a phone number for the UI by removing common prefixes.
 * @param phone The normalised phone number.
 * @returns The digits only, stripped of +61 or leading 0.
 */
export function denormalisePhone(phone: string | null | undefined): string {
    if (!phone) return '';
    let digits = phone.replace(/\D/g, "");
    
    if (digits.startsWith("61")) {
        return digits.slice(2);
    }
    
    if (digits.startsWith("0")) {
        return digits.slice(1);
    }
    
    return digits;
}

export async function sendVerification(to: string) {
    if (!messagingServiceSid) {
        throw new Error("Twilio messaging service not configured");
    }

    const normalised = normalisePhone(to);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const messageBody = `Your GEE verification code is ${code}`;

    const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
            method: "POST",
            headers: {
                Authorization: authHeader(),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                To: normalised,
                MessagingServiceSid: messagingServiceSid,
                Body: messageBody,
            }),
        }
    );

    if (!res.ok) {
        throw new Error("Failed to send verification code");
    }

    pendingCodes.set(normalised, { code, expiresAt: Date.now() + CODE_TTL_MS });
}

export async function checkVerification(
    to: string,
    code: string
): Promise<boolean> {
    const normalised = normalisePhone(to);
    const pending = pendingCodes.get(normalised);
    if (!pending) return false;
    if (pending.expiresAt < Date.now()) {
        pendingCodes.delete(normalised);
        return false;
    }
    const ok = pending.code === code.trim();
    if (ok) {
        pendingCodes.delete(normalised);
    }
    return ok;
}
