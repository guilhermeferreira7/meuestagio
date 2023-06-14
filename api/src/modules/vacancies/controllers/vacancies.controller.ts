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
import { ReqAuth } from '../../auth/types/request';
import { CompaniesService } from '../../users/companies/services/companies.service';
import { HasRoles } from '../../auth/roles.decorator';
import { Role } from '../../../utils/roles';
import { RolesGuard } from '../../auth/roles.guard';

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
    const company = await this.companiesService.findByEmail(req.user.email);
    if (!company) {
      throw new UnauthorizedException();
    }

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
