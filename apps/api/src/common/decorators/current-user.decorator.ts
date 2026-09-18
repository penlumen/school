import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedUser } from '../types/auth.js';

/**
 * Equivalent of the old `const decoded = verifyToken(token, res)` line,
 * but the verification itself now happens once in JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): DecodedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
