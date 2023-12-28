import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JobApplicationStatusEnum } from '@prisma/client';

import { RolesGuard } from '../auth/roles/roles.guard';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { CreateJobApplicationDto } from './dtos/update';
import { JobApplicationsService } from './job-applications.service';
import { ReqAuth } from '../../types/auth/request';

@ApiTags('Job Applications')
@Controller('job-applications')
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('apply')
  async create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return await this.jobApplicationsService.create(createJobApplicationDto);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('student')
  async findByStudentId(@Request() req: ReqAuth) {
    return this.jobApplicationsService.findByStudentId(req.user.sub);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('job')
  async findByJobId(@Query('jobId', ParseIntPipe) jobId: number) {
    return this.jobApplicationsService.findByJobId(jobId);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('interview')
  async interview(
    @Body('jobApplicationId', ParseIntPipe) jobApplicationId: number,
  ) {
    return this.jobApplicationsService.setStatus(
      jobApplicationId,
      JobApplicationStatusEnum.Entrevista,
    );
  }

  @HasRoles(Role.COMPANY, Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('finish')
  async finish(
    @Body('jobApplicationId', ParseIntPipe) jobApplicationId: number,
  ) {
    return this.jobApplicationsService.setStatus(
      jobApplicationId,
      JobApplicationStatusEnum.Finalizado,
    );
  }
}
