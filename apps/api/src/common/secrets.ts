import { Logger } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

/**
 * Encrypts school-supplied secrets (Paystack secret key, SMTP password,
 * integration secrets) at rest with AES-256-GCM.
 *
 * The key comes from SETTINGS_ENCRYPTION_KEY. Without it we fall back to
 * JWT_SECRET so development keeps working, but rotating JWT_SECRET would
 * then make stored secrets unreadable, so production should set its own.
 */
let warned = false;

function key(): Buffer {
  const source = process.env.SETTINGS_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!source) throw new Error('SETTINGS_ENCRYPTION_KEY is not set');
  if (!process.env.SETTINGS_ENCRYPTION_KEY && !warned) {
    warned = true;
    new Logger('Secrets').warn(
      'SETTINGS_ENCRYPTION_KEY is not set; falling back to JWT_SECRET.',
    );
  }
  return createHash('sha256').update(source).digest();
}

/** Returns "v1:iv:tag:ciphertext", all base64. */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return [
    'v1',
    iv.toString('base64'),
    cipher.getAuthTag().toString('base64'),
    data.toString('base64'),
  ].join(':');
}

/** Null when the value is missing or can't be decrypted with the current key. */
export function decryptSecret(
  stored: string | null | undefined,
): string | null {
  if (!stored) return null;
  const [version, iv, tag, data] = stored.split(':');
  if (version !== 'v1' || !iv || !tag || !data) return null;
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key(),
      Buffer.from(iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(data, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    return null;
  }
}

/** "••••1a2b" style hint so settings screens can show a secret is saved. */
export function secretHint(plain: string | null): string | null {
  return plain ? `••••${plain.slice(-4)}` : null;
}
