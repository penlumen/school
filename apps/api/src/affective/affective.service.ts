import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

/** Traits a new branch starts with (the ones the report card used to hard-code). */
export const DEFAULT_AFFECTIVE_TRAITS = [
  'Punctuality',
  'Neatness',
  'Politeness',
  'Honesty',
  'Leadership',
];

/** Ratings run 1-5; the report card prints this key. */
export const AFFECTIVE_SCALE = [
  { rating: 5, label: 'Excellent' },
  { rating: 4, label: 'Very good' },
  { rating: 3, label: 'Good' },
  { rating: 2, label: 'Fair' },
  { rating: 1, label: 'Poor' },
];

@Injectable()
export class AffectiveService {
  constructor(private readonly prisma: PrismaService) {}

  private requireBranch(branchUuid: string | undefined): string {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }
    return branchUuid;
  }

  /** Staff of this school who can use the branch (admins can also edit). */
  private async assertBranchStaff(decoded: DecodedUser, branchUuid: string) {
    const access = ['ROOT', 'ADMIN', 'STAFF'].includes(decoded.role)
      ? await this.prisma.branchAccess.findFirst({
          where: {
            user_uuid: decoded.uuid,
            branch_uuid: branchUuid,
            school_uuid: decoded.school_uuid,
          },
          select: { id: true },
        })
      : null;
    if (!access) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }
  }

  async index(branchUuid: string | undefined, decoded: DecodedUser) {
    const branch = this.requireBranch(branchUuid);
    await this.assertBranchStaff(decoded, branch);
    const traits = await this.prisma.affectiveTrait.findMany({
      where: { branch_uuid: branch },
      orderBy: { position: 'asc' },
      select: { uuid: true, name: true, position: true },
    });
    return {
      status: 200,
      success: true,
      message: 'Affective traits',
      data: { traits, scale: AFFECTIVE_SCALE },
    };
  }

  /**
   * Saves the whole list in order, matching the single Save button: rows with
   * a uuid are renamed or moved, new rows are created and missing ones are
   * removed. Ratings already given keep their copied trait name.
   */
  async save(branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const branch = this.requireBranch(branchUuid);
    await this.assertBranchStaff(decoded, branch);
    const isAdmin =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!isAdmin) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only administrators can change the affective domain',
      });
    }

    const seen = new Set<string>();
    const rows: { uuid?: string; name: string }[] = (
      Array.isArray(body?.traits) ? body.traits : []
    )
      .map((row: any) => ({
        uuid: typeof row?.uuid === 'string' ? row.uuid : undefined,
        name: typeof row?.name === 'string' ? row.name.trim().slice(0, 60) : '',
      }))
      // Drop blanks and repeated names (case-insensitive).
      .filter((row: { name: string }) => {
        const key = row.name.toLowerCase();
        if (!row.name || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 20);

    const existing = await this.prisma.affectiveTrait.findMany({
      where: { branch_uuid: branch },
      select: { uuid: true },
    });
    const existingUuids = new Set(existing.map((t) => t.uuid));
    const kept = rows
      .filter((r) => r.uuid && existingUuids.has(r.uuid))
      .map((r) => r.uuid as string);

    // One batched transaction (a single request), which works with poolers.
    await this.prisma.$transaction([
      this.prisma.affectiveTrait.deleteMany({
        where: { branch_uuid: branch, uuid: { notIn: kept } },
      }),
      ...rows.map((row, position) =>
        row.uuid && kept.includes(row.uuid)
          ? this.prisma.affectiveTrait.update({
              where: { uuid: row.uuid },
              data: { name: row.name, position },
            })
          : this.prisma.affectiveTrait.create({
              data: { branch_uuid: branch, name: row.name, position },
            }),
      ),
    ]);

    return this.index(branch, decoded);
  }
}
