import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dtos/create-job.dto';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { JobApplicationsService } from '../../job-applications/services/job-applications.service';
import { JobApplicationStatus } from '../../job-applications/entities/status';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/close')
  async close(@Param('id', ParseIntPipe) id: number) {
    this.jobApplicationsService.closeAllByJobId(id);
    return this.jobsService.close(id);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('company/:id')
  async findAllByCompany(@Param('id') id: string) {
    return await this.jobsService.findAllByCompany(+id);
  }

  @Get()
  async findAll(@Request() request) {
    return await this.jobsService.findAll({
      ...request.query,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.jobsService.findOne(id);
  }
}
