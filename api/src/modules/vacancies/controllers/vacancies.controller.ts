import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { VacanciesService } from '../services/vacancies.service';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { ReqAuth } from '../../../types/auth/request';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Controller('vacancies')
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly companiesService: CompaniesService,
  ) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(
    @Body() createVacancyDto: CreateVacancyDto,
    @Request() req: ReqAuth,
  ) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  async findAll() {
    return await this.vacanciesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.vacanciesService.findOne(+id);
  }
}
