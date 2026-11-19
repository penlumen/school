import { UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * Student registration numbers: PREFIX/YY/NNNN, e.g. NPR/SS/26/0001. Each
 * branch sets its prefix; the counter restarts every year and is padded to
 * four digits (it keeps growing past 9999).
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
 * The next free number for a branch this year. It reads the numbers already
 * used (including ones typed in before numbering existed), so it carries on
 * from the highest, e.g. after NPR/SS/26/0041 comes NPR/SS/26/0042.
 */
export async function nextRegNumber(
  prisma: PrismaService,
  branchUuid: string,
  prefix: string,
  now = new Date(),
) {
  const stem = `${prefix}/${String(now.getFullYear()).slice(-2)}/`;
  const used = await prisma.student.findMany({
    where: {
      branch_uuid: branchUuid,
      reg_number: { startsWith: stem, mode: 'insensitive' },
    },
    select: { reg_number: true },
  });
  const highest = used.reduce((max, { reg_number }) => {
    const n = Number(reg_number.slice(stem.length));
    return Number.isInteger(n) && n > max ? n : max;
  }, 0);
  return `${stem}${String(highest + 1).padStart(4, '0')}`;
}
