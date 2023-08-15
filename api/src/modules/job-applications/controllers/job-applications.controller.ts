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
import { StudentsService } from '../../users/students/services/students.service';
import { CompaniesService } from '../../users/companies/services/companies.service';

@Controller('job-applications')
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
    private readonly studentsService: StudentsService,
    private readonly companiesService: CompaniesService,
  ) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return await this.jobApplicationsService.create(createJobApplicationDto);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('company')
  async findByVacancyId(@Body() body: any) {
    return this.jobApplicationsService.findByVacancyId(body.vacancyId);
  }
}
