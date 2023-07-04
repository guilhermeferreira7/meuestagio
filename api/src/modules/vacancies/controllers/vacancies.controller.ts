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

import { VacanciesService } from '../services/vacancies.service';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  async findAll(@Request() request) {
    return await this.vacanciesService.findAll({
      page: request.query.page,
      limit: request.query.limit,
      state: request.query.state,
      region: request.query.region,
      city: request.query.city,
      search: request.query.search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.vacanciesService.findOne(+id);
  }
}
