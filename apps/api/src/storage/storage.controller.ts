/// <reference types="multer" />
import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  SiteAssetEntity,
  StorageEntity,
  StorageService,
} from './storage.service.js';

const ALLOWED_ENTITIES: StorageEntity[] = ['student', 'staff', 'parent'];
const SITE_ENTITIES: SiteAssetEntity[] = [
  'branch',
  'school',
  'gallery',
  'facility',
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('storage')
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('entity') entity: StorageEntity | SiteAssetEntity,
    @Query('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    if (!file) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'File is required',
      });
    }
    const isSiteAsset = SITE_ENTITIES.includes(entity as SiteAssetEntity);
    if (!isSiteAsset && !ALLOWED_ENTITIES.includes(entity as StorageEntity)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid storage entity',
      });
    }
    if (!uuid || !branchUuid || !user.school_uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Entity, school and branch are required',
      });
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only image uploads are supported',
      });
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Image must be under 5MB',
      });
    }

    if (isSiteAsset) {
      if (!['ROOT', 'ADMIN'].includes(user.role)) {
        throw new BadRequestException({
          status: 400,
          success: false,
          message: 'Unauthorized',
        });
      }
      const ownerUuid = await this.siteAssetOwner(
        entity as SiteAssetEntity,
        uuid,
        user.school_uuid,
      );
      const uploaded = await this.storageService.uploadSiteAsset(
        file.buffer,
        user.school_uuid,
        entity as SiteAssetEntity,
        ownerUuid,
      );
      return {
        status: 201,
        success: true,
        message: 'File uploaded successfully',
        data: uploaded,
      };
    }

    const branch = await this.prisma.branch.findFirst({
      where: { uuid: branchUuid, school_uuid: user.school_uuid },
    });
    if (!branch) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid branch',
      });
    }

    if (entity === 'student') {
      const student = await this.prisma.student.findFirst({
        where: { uuid, branch_uuid: branchUuid },
      });
      if (!student)
        throw new BadRequestException({
          status: 400,
          success: false,
          message: 'Student not found in this branch',
        });
    } else {
      // const access = await this.prisma.branchAccess.findFirst({
      //   where: {
      //     user_uuid: uuid,
      //     branch_uuid: branchUuid,
      //     school_uuid: user.school_uuid,
      //   },
      // });
      // const validRole =
      //   entity === 'staff'
      //     ? !!access && ['ROOT', 'ADMIN', 'STAFF'].includes(access.role)
      //     : !!access && access.role === 'PARENT';
      // if (!validRole)
      //   throw new BadRequestException({
      //     status: 400,
      //     success: false,
      //     message: 'Account is not assigned to this branch',
      //   });
    }

    const uploaded = await this.storageService.uploadAvatar(
      file.buffer,
      user.school_uuid,
      branchUuid,
      entity as StorageEntity,
      uuid,
    );

    return {
      status: 201,
      success: true,
      message: 'File uploaded successfully',
      data: uploaded,
    };
  }

  /**
   * Branch logos must belong to the user's school; the school logo is always
   * keyed by the school itself. Gallery and facility photos are uploaded
   * before their record exists, so the client supplies a fresh uuid that the
   * record is then created with.
   */
  private async siteAssetOwner(
    entity: SiteAssetEntity,
    uuid: string,
    schoolUuid: string,
  ): Promise<string> {
    if (entity === 'school') return schoolUuid;
    // The uuid becomes part of the S3 key, so only accept a plain uuid.
    if (!/^[0-9a-f-]{36}$/i.test(uuid)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid uuid',
      });
    }
    if (entity === 'branch') {
      const branch = await this.prisma.branch.findFirst({
        where: { uuid, school_uuid: schoolUuid },
      });
      if (!branch) {
        throw new BadRequestException({
          status: 400,
          success: false,
          message: 'Invalid branch',
        });
      }
    }
    return uuid;
  }
}
