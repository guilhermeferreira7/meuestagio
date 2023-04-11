import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { CreateCityDto } from '../dtos/create-city.dto';
import { City } from '../models/city.entity';
import { CitiesService } from '../services/city.service';
import { InstitutionsService } from '../../institutions/services/institution.service';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly institutionsService: InstitutionsService,
  ) {}

  @Post()
  async createCity(@Body() createCityDto: CreateCityDto): Promise<City> {
    return await this.citiesService.createCity(createCityDto);
  }

  @Get()
  async getAll(): Promise<City[]> {
    return await this.citiesService.findAll();
  }

  @Get(':id/institutions')
  async getCourses(@Param('id') id: string) {
    return await this.institutionsService.findByCity(+id);
  }
}
