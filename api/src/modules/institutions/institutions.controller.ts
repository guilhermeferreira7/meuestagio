import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { RolesGuard } from '../auth/roles/roles.guard';
import { CreateInstitutionDto } from './dtos/create-institution.dto';
import { InstitutionsService } from './institutions.service';

type InstitutionsQuery = {
  page?: number;
  limit?: number;
  name?: string;
  cityId?: number;
  orderBy?: 'id' | 'name';
};

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  async getAll(@Query() query: InstitutionsQuery) {
    const params = {
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      name: query.name ? query.name : undefined,
      cityId: query.cityId ? Number(query.cityId) : undefined,
      orderBy: query.orderBy,
    };

    return await this.institutionsService.findAll(
      params.page,
      params.limit,
      params.name,
      params.cityId,
      params.orderBy,
    );
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return await this.institutionsService.createInstitution(
      createInstitutionDto,
    );
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.institutionsService.delete(id);
  }
}
