import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { ImportBody } from '../docs/schemas.js';
import { DataTransferService } from './data-transfer.service.js';

const TYPE = {
  name: 'type',
  enum: ['students', 'staff', 'parents', 'classes', 'subjects', 'results'],
};

/** Spreadsheet import and export for the current branch (administrators). */
@Controller('data')
export class DataTransferController {
  constructor(private readonly data: DataTransferService) {}

  @ApiOperation({ summary: 'Columns for each record type (for templates)' })
  @Get('types')
  types() {
    return this.data.types();
  }

  @ApiOperation({
    summary: 'Export records as rows; results need calendar_uuid',
  })
  @ApiParam(TYPE)
  @Get(':type/export')
  export(
    @Param('type') type: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Query() query: Record<string, string>,
  ) {
    return this.data.export(type, branchUuid, user, query);
  }

  @ApiOperation({
    summary: 'Check (dry_run, the default) or save imported rows',
  })
  @ApiParam(TYPE)
  @ApiBody({ type: ImportBody })
  @Post(':type/import')
  @HttpCode(200)
  import(
    @Param('type') type: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.data.import(type, branchUuid, user, body);
  }
}
