import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../auth/roles/roles.guard';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { CreateCityDto } from './dtos/create-city.dto';
import { CreateRegionDto } from './dtos/create-region.dto';
import { CitiesQuery, CitiesService } from './cities.service';
import { RegionsService } from './regions.service';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly regionsService: RegionsService,
  ) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createCity(@Body() createCityDto: CreateCityDto) {
    return await this.citiesService.createCity(createCityDto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('regions')
  async createRegion(@Body() createRegionDto: CreateRegionDto) {
    return await this.regionsService.createRegion(createRegionDto);
  }

  @Get()
  async getAll(@Query() query: CitiesQuery) {
    const params = {
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      state: query.state ? query.state : undefined,
      region: query.region ? Number(query.region) : undefined,
      name: query.name ? query.name : undefined,
      orderBy: query.orderBy,
    };

    return await this.citiesService.findAll(
      params.page,
      params.limit,
      params.state,
      params.region,
      params.name,
      params.orderBy,
    );
  }

  @Get('regions')
  async getRegions(@Query() query) {
    const params = {
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      state: query.state ? query.state : undefined,
      orderBy: query.orderBy,
    };

    return await this.regionsService.findAll(
      params.page,
      params.limit,
      params.state,
      params.orderBy,
    );
  }
}
