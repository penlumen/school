/// <reference types="multer" />
import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service.js';

const ALLOWED_FOLDERS = ['students', 'staff', 'parents', 'branches', 'schools'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Query('folder') folder = 'misc') {
    if (!file) {
      throw new BadRequestException({ status: 400, success: false, message: 'File is required' });
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException({ status: 400, success: false, message: 'Only image uploads are supported' });
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException({ status: 400, success: false, message: 'Image must be under 5MB' });
    }

    const safeFolder = ALLOWED_FOLDERS.includes(folder) ? folder : 'misc';
    const uploaded = await this.storageService.uploadImage(file.buffer, safeFolder);

    return {
      status: 201,
      success: true,
      message: 'File uploaded successfully',
      data: uploaded,
    };
  }
}
