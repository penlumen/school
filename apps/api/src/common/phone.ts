import { UnprocessableEntityException } from '@nestjs/common';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

/** Country assumed for numbers sent without a "+" prefix (e.g. "0801 234 5678"). */
const DEFAULT_COUNTRY = (
  process.env.DEFAULT_PHONE_COUNTRY || 'NG'
).toUpperCase() as CountryCode;

/**
 * Normalises a phone number to E.164 ("+2348012345678") before it is saved.
 * Returns undefined when the field wasn't sent (so updates leave it alone),
 * null when it was cleared, and rejects anything that isn't a valid number.
 */
export function normalizePhone(
  value: unknown,
  field = 'Phone number',
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw invalid(field);
  }
  const trimmed = value.trim();
  if (!trimmed) return null;

  const phone = parsePhoneNumberFromString(trimmed, DEFAULT_COUNTRY);
  if (!phone?.isValid()) throw invalid(field);
  return phone.number;
}

function invalid(field: string) {
  return new UnprocessableEntityException({
    status: 422,
    success: false,
    message: `${field} is not a valid phone number. Include the country code if it isn't a ${DEFAULT_COUNTRY} number.`,
  });
}
