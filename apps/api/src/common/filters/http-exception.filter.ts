import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      // Guards/services that already throw a fully-shaped payload
      // (e.g. { status, success, message, error }) pass straight through.
      if (typeof body === 'object' && body !== null && 'success' in body) {
        res.status(status).json(body);
        return;
      }

      const message =
        typeof body === 'string'
          ? body
          : (body as any)?.message || exception.message;

      res.status(status).json({
        status,
        success: false,
        message: Array.isArray(message) ? message.join(', ') : message,
        data: null,
      });
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: (exception as Error)?.message || 'Internal Server Error',
      data: null,
    });
  }
}
