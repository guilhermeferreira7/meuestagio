import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { CreateJobApplicationDto } from '../dtos/create-jobApplication.dto';
import { JobApplicationsService } from '../services/job-applications.service';

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
  async findByJobId(@Request() req: any) {
    return this.jobApplicationsService.findByJobId(req.query.jobId);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('student')
  async findByStudentId(@Request() req: any) {
    return this.jobApplicationsService.findByStudentId(req.query.studentId);
  }
}
