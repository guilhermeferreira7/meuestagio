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

@Controller('vacancies')
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly companiesService: CompaniesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createVacancyDto: CreateVacancyDto,
    @Request() req: ReqAuth,
  ) {
    const company = await this.companiesService.findOne(req.user.sub);
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
