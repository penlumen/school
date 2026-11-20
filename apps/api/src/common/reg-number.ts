import { UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Student registration numbers: PREFIX/YY/NNNN (e.g. NPR/SS/26/0001) or,
 * when a branch leaves the year out, PREFIX/NNNN. Each branch sets its
 * prefix; numbers are padded to four digits (0001) and keep growing past 9999.
 */

/** Cleans a prefix typed in Branch Settings. Empty turns numbering off. */
export function parseRegPrefix(value: unknown): string | null {
  const prefix = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/\/+$/, '');
  if (!prefix) return null;
  if (prefix.length > 30 || !/^[A-Z0-9]+([/-][A-Z0-9]+)*$/.test(prefix)) {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message:
        'Use letters and numbers for the prefix, separated by / or -, e.g. NPR/SS',
    });
  }
  return prefix;
}

/**
 * The next free number for a branch, or null when it has no prefix. With the
 * year included (the default) it is PREFIX/YY/NNNN and restarts each year;
 * without, PREFIX/NNNN and it keeps counting. It reads the numbers already
 * used (including ones typed in before numbering existed) and carries on from
 * the highest, e.g. after NPR/SS/26/0041 comes NPR/SS/26/0042.
 */
export async function nextRegNumber(
  prisma: PrismaService,
  branchUuid: string,
  now = new Date(),
) {
  const branch = await prisma.branch.findUnique({
    where: { uuid: branchUuid },
    select: { reg_prefix: true, reg_include_year: true },
  });
  if (!branch?.reg_prefix) return null;
  const stem = branch.reg_include_year
    ? `${branch.reg_prefix}/${String(now.getFullYear()).slice(-2)}/`
    : `${branch.reg_prefix}/`;
  const used = await prisma.student.findMany({
    where: {
      branch_uuid: branchUuid,
      reg_number: { startsWith: stem, mode: 'insensitive' },
    },
    select: { reg_number: true },
  });
  // Only plain numbers after the stem count, so PREFIX/26/0001 doesn't
  // affect a branch numbering PREFIX/NNNN.
  const highest = used.reduce((max, { reg_number }) => {
    const rest = reg_number.slice(stem.length);
    const n = /^\d+$/.test(rest) ? Number(rest) : NaN;
    return Number.isInteger(n) && n > max ? n : max;
  }, 0);
  return `${stem}${String(highest + 1).padStart(4, '0')}`;
}
