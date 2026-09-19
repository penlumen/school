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
import { StorageEntity, StorageService } from './storage.service.js';

const ALLOWED_ENTITIES: StorageEntity[] = ['student', 'staff', 'parent'];
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
    @Query('entity') entity: StorageEntity,
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
    if (!ALLOWED_ENTITIES.includes(entity)) {
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
      entity,
      uuid,
    );

    return {
      status: 201,
      success: true,
      message: 'File uploaded successfully',
      data: uploaded,
    };
  }
}
