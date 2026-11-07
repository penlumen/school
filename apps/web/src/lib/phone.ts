import {
    type CountryCode,
    getCountries,
    getCountryCallingCode,
    parsePhoneNumberFromString,
} from 'libphonenumber-js';

/** Country assumed for numbers typed without a "+" prefix. */
export const DEFAULT_COUNTRY = ((process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || 'NG').toUpperCase()) as CountryCode;

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], {type: 'region'})
    : null;

/** 🇳🇬 from "NG": regional-indicator letters render as the country's flag. */
export const countryFlag = (code: string) =>
    String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));

export interface CountryOption {
    code: CountryCode;
    name: string;
    dialCode: string;
}

let cachedCountries: CountryOption[] | null = null;

/** Every country libphonenumber-js supports, sorted by name, default country first. */
export function countryOptions(): CountryOption[] {
    if (!cachedCountries) {
        cachedCountries = getCountries()
            .map((code) => ({
                code,
                name: regionNames?.of(code) || code,
                dialCode: `+${getCountryCallingCode(code)}`,
            }))
            .sort((a, b) => (a.code === DEFAULT_COUNTRY ? -1 : b.code === DEFAULT_COUNTRY ? 1 : a.name.localeCompare(b.name)));
    }
    return cachedCountries;
}

const parse = (value: string | null | undefined) =>
    value ? parsePhoneNumberFromString(value, DEFAULT_COUNTRY) : undefined;

/**
 * Readable phone number: national format for home-country numbers
 * ("0801 234 5678"), international for the rest ("+44 20 7946 0958").
 * Unparseable values are shown as stored.
 */
export function formatPhone(value: string | null | undefined): string {
    if (!value) return '';
    const phone = parse(value);
    if (!phone || !phone.isValid()) return value;
    return phone.country === DEFAULT_COUNTRY ? phone.formatNational() : phone.formatInternational();
}

/** Always-international format, for documents that may travel (e.g. invoices). */
export function formatPhoneInternational(value: string | null | undefined): string {
    const phone = parse(value);
    return phone?.isValid() ? phone.formatInternational() : value || '';
}

/** "tel:+2348012345678" for links, falling back to the raw value without spaces. */
export function phoneHref(value: string | null | undefined): string {
    const phone = parse(value);
    return phone ? phone.getURI() : `tel:${(value || '').replace(/\s+/g, '')}`;
}

/** Digits-only form for searching ("0801 234…" and "+234801…" both match). */
export function phoneSearchKey(value: string | null | undefined): string {
    const phone = parse(value);
    // formatNational keeps the trunk prefix ("0801…"), nationalNumber drops it ("801…").
    return [value || '', phone?.formatNational() || '', phone?.nationalNumber || '', phone?.number || '']
        .map((part) => part.replace(/\D/g, ''))
        .join(' ');
}
