import { Controller, Get, Post, Body } from '@nestjs/common';
import { VacanciesService } from '../services/vacancies.service';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  findAll() {
    return this.vacanciesService.findAll();
  }
}
