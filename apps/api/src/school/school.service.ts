import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StorageService } from '../storage/storage.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { sanitizeHtml } from '../common/sanitize-html.js';

// Never expose the school token, which identifies the school to the API.
const SCHOOL_PROFILE = {
  uuid: true,
  name: true,
  slug: true,
  email: true,
  contact: true,
  avatar: true,
  address: true,
  subtext: true,
  about: true,
  mission: true,
  vision: true,
  features: true,
  values: true,
};

interface ContentItem {
  icon?: string;
  title: string;
  description: string;
}

@Injectable()
export class SchoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private assertAdmin(decoded: DecodedUser) {
    if (!['ROOT', 'ADMIN'].includes(decoded.role)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }
  }

  private isUuid(value: unknown): value is string {
    return typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value);
  }

  private text(value: unknown, max = 500): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim().slice(0, max);
    return trimmed || null;
  }

  /** Why Choose Us / Our Values rows: drop empty rows and cap the list. */
  private contentItems(value: unknown, withIcon: boolean): ContentItem[] {
    if (!Array.isArray(value)) return [];
    return value
      .map((item: any) => ({
        ...(withIcon ? { icon: this.text(item?.icon, 40) ?? undefined } : {}),
        title: this.text(item?.title, 80) ?? '',
        description: this.text(item?.description, 300) ?? '',
      }))
      .filter((item) => item.title)
      .slice(0, 8);
  }

  async show(decoded: DecodedUser) {
    const school = await this.prisma.school.findUnique({
      where: { uuid: decoded.school_uuid },
      select: {
        ...SCHOOL_PROFILE,
        facilities: { orderBy: { position: 'asc' } },
        gallery_categories: {
          orderBy: { position: 'asc' },
          include: { _count: { select: { images: true } } },
        },
        gallery_images: { orderBy: { created_at: 'desc' } },
      },
    });

    if (!school) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'School not found',
      });
    }

    return { status: 200, success: true, message: 'School', data: { school } };
  }

  async update(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);

    const data: Record<string, any> = {};
    if ('name' in body) {
      const name = this.text(body.name, 120);
      if (!name) {
        throw new UnprocessableEntityException({
          status: 422,
          success: false,
          message: 'School name is required',
        });
      }
      data.name = name;
    }
    if ('slug' in body) {
      const slug = this.text(body.slug, 60)?.toLowerCase();
      if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
        throw new UnprocessableEntityException({
          status: 422,
          success: false,
          message:
            'Website slug can only use lowercase letters, numbers and hyphens',
        });
      }
      data.slug = slug;
    }
    if ('email' in body) {
      const email = this.text(body.email, 120);
      if (!email) {
        throw new UnprocessableEntityException({
          status: 422,
          success: false,
          message: 'Email address is required',
        });
      }
      data.email = email;
    }
    for (const field of ['contact', 'address', 'avatar', 'subtext']) {
      if (field in body) data[field] = this.text(body[field], 1000);
    }
    for (const field of ['about', 'mission', 'vision']) {
      if (field in body) data[field] = sanitizeHtml(body[field]);
    }
    if ('features' in body)
      data.features = this.contentItems(body.features, true);
    if ('values' in body) data.values = this.contentItems(body.values, false);

    try {
      const school = await this.prisma.school.update({
        where: { uuid: decoded.school_uuid },
        data,
        select: SCHOOL_PROFILE,
      });
      return {
        status: 200,
        success: true,
        message: 'School settings saved',
        data: { school },
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException({
          status: 409,
          success: false,
          message:
            'That website slug or email is already used by another school',
        });
      }
      throw error;
    }
  }

  // ---------- Facilities ----------

  async createFacility(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const title = this.text(body.title, 120);
    if (!title) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Title is required',
      });
    }

    const position = await this.prisma.schoolFacility.count({
      where: { school_uuid: decoded.school_uuid },
    });
    const facility = await this.prisma.schoolFacility.create({
      data: {
        // The image is uploaded first under this uuid, so reuse it.
        ...(this.isUuid(body.uuid) ? { uuid: body.uuid } : {}),
        school_uuid: decoded.school_uuid,
        title,
        description: this.text(body.description, 500),
        image: this.text(body.image, 1000),
        position,
      },
    });

    return {
      status: 201,
      success: true,
      message: 'Facility added',
      data: { facility },
    };
  }

  async updateFacility(uuid: string, decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    await this.findOwned('schoolFacility', uuid, decoded.school_uuid);

    const title = 'title' in body ? this.text(body.title, 120) : undefined;
    if (title === null) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Title is required',
      });
    }

    const facility = await this.prisma.schoolFacility.update({
      where: { uuid },
      data: {
        title,
        description:
          'description' in body ? this.text(body.description, 500) : undefined,
        image: 'image' in body ? this.text(body.image, 1000) : undefined,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Facility updated',
      data: { facility },
    };
  }

  async removeFacility(uuid: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const facility = await this.findOwned(
      'schoolFacility',
      uuid,
      decoded.school_uuid,
    );
    await this.prisma.schoolFacility.delete({ where: { uuid } });
    await this.deleteFile(facility.image);

    return { status: 200, success: true, message: 'Facility deleted' };
  }

  // ---------- Gallery ----------

  async createImage(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const title = this.text(body.title, 120);
    const image = this.text(body.image, 1000);
    if (!title || !image) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Image and title are required',
      });
    }

    const created = await this.prisma.galleryImage.create({
      data: {
        ...(this.isUuid(body.uuid) ? { uuid: body.uuid } : {}),
        school_uuid: decoded.school_uuid,
        title,
        image,
        category_uuid: await this.categoryFor(
          body.category_uuid,
          decoded.school_uuid,
        ),
      },
    });

    return {
      status: 201,
      success: true,
      message: 'Image added',
      data: { image: created },
    };
  }

  async updateImage(uuid: string, decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    await this.findOwned('galleryImage', uuid, decoded.school_uuid);

    const title = 'title' in body ? this.text(body.title, 120) : undefined;
    if (title === null) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Title is required',
      });
    }

    const image = await this.prisma.galleryImage.update({
      where: { uuid },
      data: {
        title,
        image: body.image ? this.text(body.image, 1000)! : undefined,
        category_uuid:
          'category_uuid' in body
            ? await this.categoryFor(body.category_uuid, decoded.school_uuid)
            : undefined,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Image updated',
      data: { image },
    };
  }

  async removeImage(uuid: string, decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const image = await this.findOwned(
      'galleryImage',
      uuid,
      decoded.school_uuid,
    );
    await this.prisma.galleryImage.delete({ where: { uuid } });
    await this.deleteFile(image.image);

    return { status: 200, success: true, message: 'Image deleted' };
  }

  /**
   * Saves the whole category list at once, matching the single Save Changes
   * button: rows with a uuid are renamed, rows without one are created and
   * categories missing from the list are deleted (their images become
   * uncategorised).
   */
  async saveCategories(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const rows: { uuid?: string; name: string }[] = (
      Array.isArray(body?.categories) ? body.categories : []
    )
      .map((row: any) => ({
        uuid: typeof row?.uuid === 'string' ? row.uuid : undefined,
        name: this.text(row?.name, 60) ?? '',
      }))
      .filter((row) => row.name);

    const schoolUuid = decoded.school_uuid;
    const existing = await this.prisma.galleryCategory.findMany({
      where: { school_uuid: schoolUuid },
      select: { uuid: true },
    });
    const existingUuids = new Set(existing.map((c) => c.uuid));
    const keptUuids = new Set(
      rows
        .filter((r) => r.uuid && existingUuids.has(r.uuid))
        .map((r) => r.uuid as string),
    );

    // One batched transaction (a single request) instead of an interactive
    // one, which connection poolers such as Prisma Postgres don't support well.
    await this.prisma.$transaction([
      this.prisma.galleryCategory.deleteMany({
        where: {
          school_uuid: schoolUuid,
          uuid: { notIn: Array.from(keptUuids) },
        },
      }),
      ...rows.map((row, position) =>
        row.uuid && keptUuids.has(row.uuid)
          ? this.prisma.galleryCategory.update({
              where: { uuid: row.uuid },
              data: { name: row.name, position },
            })
          : this.prisma.galleryCategory.create({
              data: { school_uuid: schoolUuid, name: row.name, position },
            }),
      ),
    ]);

    const categories = await this.prisma.galleryCategory.findMany({
      where: { school_uuid: schoolUuid },
      orderBy: { position: 'asc' },
      include: { _count: { select: { images: true } } },
    });

    return {
      status: 200,
      success: true,
      message: 'Categories saved',
      data: { categories },
    };
  }

  // ---------- Public website ----------

  private async schoolByToken(token: string | undefined) {
    const school = token
      ? await this.prisma.school.findUnique({
          where: { token },
          select: { uuid: true },
        })
      : null;
    if (!school) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid school token',
      });
    }
    return school.uuid;
  }

  async publicSite(token: string | undefined) {
    const schoolUuid = await this.schoolByToken(token);
    const school = await this.prisma.school.findUnique({
      where: { uuid: schoolUuid },
      select: {
        ...SCHOOL_PROFILE,
        uuid: false,
        branches: {
          orderBy: { created_at: 'asc' },
          select: {
            uuid: true,
            name: true,
            email: true,
            contact: true,
            address: true,
            avatar: true,
          },
        },
        facilities: {
          orderBy: { position: 'asc' },
          select: { uuid: true, title: true, description: true, image: true },
        },
        gallery_categories: {
          orderBy: { position: 'asc' },
          select: { uuid: true, name: true },
        },
        gallery_images: {
          orderBy: { created_at: 'desc' },
          select: {
            uuid: true,
            title: true,
            image: true,
            category_uuid: true,
          },
        },
      },
    });

    return { status: 200, success: true, message: 'Website', data: { school } };
  }

  /** Only events an admin has explicitly marked "Show on website". */
  async publicEvents(token: string | undefined) {
    const schoolUuid = await this.schoolByToken(token);
    const events = await this.prisma.event.findMany({
      where: { is_public: true, branch: { school_uuid: schoolUuid } },
      orderBy: [{ date: 'asc' }, { start_time: 'asc' }],
      select: {
        uuid: true,
        title: true,
        description: true,
        date: true,
        start_time: true,
        end_time: true,
        location: true,
        branch: { select: { uuid: true, name: true } },
        calendar: { select: { uuid: true, session: true, term: true } },
      },
    });

    return { status: 200, success: true, message: 'Events', data: { events } };
  }

  // ---------- Helpers ----------

  private async findOwned(
    model: 'schoolFacility' | 'galleryImage',
    uuid: string,
    schoolUuid: string,
  ) {
    const record = await (this.prisma[model] as any).findFirst({
      where: { uuid, school_uuid: schoolUuid },
    });
    if (!record) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Not found',
      });
    }
    return record;
  }

  private async categoryFor(value: unknown, schoolUuid: string) {
    if (typeof value !== 'string' || !value) return null;
    const category = await this.prisma.galleryCategory.findFirst({
      where: { uuid: value, school_uuid: schoolUuid },
    });
    return category?.uuid ?? null;
  }

  private async deleteFile(url: string | null) {
    const key = this.storage.keyFromUrl(url);
    if (key) await this.storage.delete(key).catch(() => undefined);
  }
}
