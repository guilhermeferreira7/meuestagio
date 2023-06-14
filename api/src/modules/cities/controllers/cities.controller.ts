import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';

import { CreateCityDto } from '../dtos/create-city.dto';
import { City } from '../entities/city.entity';
import { CitiesService } from '../services/cities.service';
import { InstitutionsService } from '../../institutions/services/institutions.service';

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
  async getAll(@Request() request): Promise<City[]> {
    console.log(request.query.page, request.query.limit);

    return await this.citiesService.findAll({
      page: request.query.page,
      limit: request.query.limit,
    });
  }

  @Get(':id/institutions')
  async getCourses(@Param('id') id: string) {
    return await this.institutionsService.findByCity(+id);
  }
}
