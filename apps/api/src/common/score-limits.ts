import { UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Each subject on a report has an assessment score and an examination score.
 * A branch sets the highest each can be on the Grade settings page (40 and 60
 * by default); together they are the subject's total.
 */
export type ScoreLimits = { assessment_max: number; examination_max: number };

export const DEFAULT_LIMITS: ScoreLimits = {
  assessment_max: 40,
  examination_max: 60,
};

export async function scoreLimits(
  prisma: PrismaService,
  branchUuid: string | null | undefined,
): Promise<ScoreLimits> {
  if (!branchUuid) return DEFAULT_LIMITS;
  const branch = await prisma.branch.findUnique({
    where: { uuid: branchUuid },
    select: { assessment_max: true, examination_max: true },
  });
  return branch ?? DEFAULT_LIMITS;
}

/**
 * Reads one subject's scores, checked against the limits. Returns the scores
 * rounded to two decimals, or an error message. Empty counts as 0. Older
 * clients may still send ca_one and ca_two; those are added together as the
 * assessment.
 */
export function readScores(
  item: Record<string, unknown>,
  limits: ScoreLimits,
  subject = 'This subject',
): { assessment: number; examination: number } | string {
  const rawAssessment =
    item.assessment ??
    (item.ca_one !== undefined || item.ca_two !== undefined
      ? Number(item.ca_one ?? 0) + Number(item.ca_two ?? 0)
      : undefined);
  const check = (value: unknown, label: string, max: number) => {
    if (value === undefined || value === null || value === '') return 0;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      return `${subject}: ${label} must be a number from 0 to ${max}`;
    }
    if (n > max) return `${subject}: ${label} can't be more than ${max}`;
    return Math.round(n * 100) / 100;
  };
  const assessment = check(rawAssessment, 'assessment', limits.assessment_max);
  if (typeof assessment === 'string') return assessment;
  const examination = check(
    item.examination,
    'examination',
    limits.examination_max,
  );
  if (typeof examination === 'string') return examination;
  return { assessment, examination };
}

/** Validates new limits typed on the Grade settings page. */
export function parseLimits(body: Record<string, unknown>): ScoreLimits {
  const assessment_max = Number(body?.assessment_max);
  const examination_max = Number(body?.examination_max);
  const ok = (n: number) => Number.isInteger(n) && n >= 0 && n <= 100;
  if (!ok(assessment_max) || !ok(examination_max)) {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message: 'Limits must be whole numbers from 0 to 100',
    });
  }
  const total = assessment_max + examination_max;
  if (total < 1 || total > 100) {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message: `Assessment and examination add up to the total, which must be from 1 to 100 (now ${total})`,
    });
  }
  return { assessment_max, examination_max };
}
