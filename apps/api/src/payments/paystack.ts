import { createHmac, timingSafeEqual } from 'crypto';
import { Prisma } from '@prisma/client';

// Overridable so tests can point at a local stand-in for Paystack.
const API = process.env.PAYSTACK_API_URL || 'https://api.paystack.co';

export const PUBLIC_KEY_PATTERN = /^pk_(test|live)_[A-Za-z0-9]{20,}$/;
export const SECRET_KEY_PATTERN = /^sk_(test|live)_[A-Za-z0-9]{20,}$/;

/** "test" or "live", read from the key prefix. */
export const keyMode = (key: string | null | undefined) =>
  key?.match(/^[ps]k_(test|live)_/)?.[1] ?? null;

/**
 * Paystack's local (NGN) card fee: 1.5% plus ₦100 from ₦2,500 up, capped at
 * ₦2,000. When parents cover the fee we gross the charge up so the school
 * still receives the full `amount`.
 */
export function feeFor(amount: Prisma.Decimal): Prisma.Decimal {
  const value = amount.toNumber();
  const flat = value >= 2500 ? 100 : 0;
  const gross = (value + flat) / (1 - 0.015);
  const fee = Math.min(Math.ceil((gross - value) * 100) / 100, 2000);
  return new Prisma.Decimal(fee.toFixed(2));
}

/** Naira to kobo, the unit Paystack amounts use. */
export const toKobo = (amount: Prisma.Decimal) =>
  amount.mul(100).toDecimalPlaces(0).toNumber();

export interface VerifiedTransaction {
  status: string;
  amount: number;
  currency: string;
  channel: string | null;
  paid_at: string | null;
}

/**
 * Asks Paystack for the true state of a transaction. Status is "not_found"
 * when Paystack has no such reference; null if Paystack can't be reached or
 * rejects the key.
 */
export async function verifyTransaction(
  secretKey: string,
  reference: string,
): Promise<VerifiedTransaction | null> {
  try {
    const response = await fetch(
      `${API}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(10000),
      },
    );
    const body: any = await response.json();
    if (body?.status === false && [400, 404].includes(response.status)) {
      return {
        status: 'not_found',
        amount: 0,
        currency: '',
        channel: null,
        paid_at: null,
      };
    }
    if (!body?.status || !body.data) return null;
    return {
      status: body.data.status,
      amount: body.data.amount,
      currency: body.data.currency,
      channel: body.data.channel ?? null,
      paid_at: body.data.paid_at ?? null,
    };
  } catch {
    return null;
  }
}

/** Paystack signs webhook bodies with HMAC-SHA512 of the secret key. */
export function validSignature(
  secretKey: string,
  rawBody: Buffer,
  signature: string | undefined,
) {
  if (!signature) return false;
  const expected = createHmac('sha512', secretKey).update(rawBody).digest();
  const given = Buffer.from(signature, 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}
