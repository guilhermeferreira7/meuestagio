import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../../auth/roles/roles.guard';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { CreateJobApplicationDto } from '../dtos/create-jobApplication.dto';
import { JobApplicationStatus } from '../entities/status';
import { JobApplicationsService } from '../services/job-applications.service';
import { ApiTags } from '@nestjs/swagger';

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

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('company')
  async findByJobId(@Query('jobId', ParseIntPipe) jobId: number) {
    return this.jobApplicationsService.findByJobId(jobId);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('student')
  async findByStudentId(@Request() req: any) {
    return this.jobApplicationsService.findByStudentId(req.query.studentId);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('interview')
  async interview(@Request() req: any) {
    return this.jobApplicationsService.setStatus(
      req.body.jobApplicationId,
      JobApplicationStatus.INTERVIEW,
    );
  }

  @HasRoles(Role.COMPANY, Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('finish')
  async finish(@Request() req: any) {
    return this.jobApplicationsService.setStatus(
      req.body.jobApplicationId,
      JobApplicationStatus.FINISHED,
    );
  }
}
