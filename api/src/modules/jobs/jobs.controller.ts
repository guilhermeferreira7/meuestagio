import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { HasRoles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dtos/create-job.dto';
import { Role } from '../auth/roles/roles';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
    return this.jobsService.close(id);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('company/:id')
  async findAllByCompany(@Param('id') id: string) {
    return await this.jobsService.findAllByCompany(+id);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.jobsService.findAll(
      query.page ? Number(query.page) : undefined,
      query.limit ? Number(query.limit) : undefined,
      query.search ? query.search : undefined,
      query.city ? Number(query.city) : undefined,
      query.region ? Number(query.region) : undefined,
      query.state ? query.state : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.jobsService.findOne(id);
  }
}
