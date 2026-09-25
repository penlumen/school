import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { ResultsService } from './results.service.js';

@Controller('result')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Query()
    query: {
      status?: 'PENDING' | 'APPROVED' | 'REJECTED';
      search?: string;
      page?: string;
      limit?: string;
    },
  ) {
    return this.resultsService.index(branchUuid, user, query);
  }

  @Get('view/:result_uuid')
  view(
    @Headers('x-branch-session') branchUuid: string,
    @Param('result_uuid') resultUuid: string,
  ) {
    return this.resultsService.view(branchUuid, resultUuid);
  }

  @Get('show/:student_uuid')
  show(@Param('student_uuid') studentUuid: string) {
    return this.resultsService.show(studentUuid);
  }

  @Post('create/:student_uuid')
  create(
    @Param('student_uuid') studentUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: { calendar_uuid?: string },
  ) {
    return this.resultsService.create(studentUuid, user, body?.calendar_uuid);
  }

  @Patch('update/:result_uuid')
  update(
    @Param('result_uuid') resultUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.resultsService.update(resultUuid, user, body);
  }

  @Delete('delete/:result_uuid')
  remove(
    @Param('result_uuid') resultUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.resultsService.remove(resultUuid, user);
  }
}
