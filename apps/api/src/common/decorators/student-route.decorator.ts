import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';

export const STUDENT_ROUTE_KEY = 'studentRoute';

/**
 * Marks a route a signed-in student may call. Student tokens are refused
 * everywhere else, so existing staff/parent routes stay closed to them
 * without each one having to check for the STUDENT role.
 */
export const StudentRoute = () =>
  applyDecorators(
    SetMetadata(STUDENT_ROUTE_KEY, true),
    ApiExtension('x-student-route', true),
  );
