import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateCityDto } from '../dtos/create-city.dto';
import { City } from '../entities/city.entity';
import { CitiesService } from '../services/cities.service';
import { InstitutionsService } from '../../institutions/services/institutions.service';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { Region } from '../entities/region.entity';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly institutionsService: InstitutionsService,
  ) {}

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
    });
  }

  @Get('regions')
  async getRegions(@Request() request): Promise<Region[]> {
    return await this.citiesService.findRegionsByState({
      page: request.query.page,
      limit: request.query.limit,
      state: request.query.state,
    });
  }

  @Get(':id/institutions')
  async getCourses(@Param('id') id: string) {
    return await this.institutionsService.findByCity(+id);
  }
}
