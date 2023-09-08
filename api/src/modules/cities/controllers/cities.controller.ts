import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateCityDto } from '../dtos/create-city.dto';
import { City } from '../entities/city.entity';
import { CitiesService } from '../services/cities.service';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { Region } from '../entities/region.entity';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createCity(@Body() createCityDto: CreateCityDto): Promise<City> {
    return await this.citiesService.createCity(createCityDto);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('regions')
  async createRegion(
    @Body() createRegionDto: CreateRegionDto,
  ): Promise<Region> {
    return await this.citiesService.createRegion(createRegionDto);
  }

  @Get()
  async getAll(@Request() request): Promise<City[]> {
    return await this.citiesService.findAll({
      page: request.query.page,
      limit: request.query.limit,
      state: request.query.state,
      name: request.query.name,
      orderBy: request.query.orderBy,
    });
  }

  @Get('regions')
  async getRegions(@Request() request): Promise<Region[]> {
    return await this.citiesService.findRegionsByState({
      page: request.query.page,
      limit: request.query.limit,
      state: request.query.state,
      orderBy: request.query.orderBy,
    });
  }
}
