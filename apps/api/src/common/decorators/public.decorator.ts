import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or controller) as not requiring JWT authentication.
 * Mirrors the old Express routes that never called verifyToken()
 * (register, login, and the root health check). The API docs show these
 * routes without the Bearer token.
 */
export const Public = () =>
  applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiExtension('x-public', true),
  );
