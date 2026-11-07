import { UnprocessableEntityException } from '@nestjs/common';

/** Statuses a class or student can have; the tables filter on these. */
export const RECORD_STATUSES = ['active', 'inactive'] as const;
export type RecordStatus = (typeof RECORD_STATUSES)[number];

/**
 * Validates an optional status from a request body. Returns undefined when
 * it wasn't sent (so updates leave it alone) and rejects unknown values.
 */
export function parseRecordStatus(value: unknown): RecordStatus | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const status = String(value).toLowerCase();
  if (!(RECORD_STATUSES as readonly string[]).includes(status)) {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message: `Status must be one of: ${RECORD_STATUSES.join(', ')}`,
    });
  }
  return status as RecordStatus;
}
