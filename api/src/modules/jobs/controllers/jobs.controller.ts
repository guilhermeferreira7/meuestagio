import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dtos/create-job.dto';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll(@Request() request) {
    return await this.jobsService.findAll({
      page: request.query.page,
      limit: request.query.limit,
      state: request.query.state,
      region: request.query.region,
      city: request.query.city,
      search: request.query.search,
      remote: request.query.remote,
    });
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('company/:id')
  async findAllByCompany(@Param('id') id: string) {
    return await this.jobsService.findAllByCompany(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(+id);
  }
}
