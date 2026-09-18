import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or controller) as not requiring JWT authentication.
 * Mirrors the old Express routes that never called verifyToken()
 * (register, login, and the root health check).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
