import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

const UNAUTHENTICATED_RESPONSE = {
  status: 401,
  success: false,
  message: 'Unauthenticated',
  error: 'unauthenticated',
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Only HTTP requests go through this guard. WebSocket connections
    // (ReportGateway) authenticate themselves in handleConnection() instead,
    // since a socket handshake doesn't carry a per-message Authorization header.
    if (context.getType() !== 'http') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(UNAUTHENTICATED_RESPONSE);
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      if (!decoded) {
        throw new UnauthorizedException(UNAUTHENTICATED_RESPONSE);
      }
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(UNAUTHENTICATED_RESPONSE);
    }
  }
}
