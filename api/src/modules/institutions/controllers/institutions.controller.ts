import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Institution } from '../entities/institution.entity';
import { InstitutionsService } from '../services/institutions.service';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  async getAll(@Request() req): Promise<Institution[]> {
    return await this.institutionsService.findAll({
      page: req.query.page,
      limit: req.query.limit,
      name: req.query.name,
      cityId: req.query.cityId,
      orderBy: req.query.orderBy,
      order: req.query.order,
    });
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<Institution> {
    return await this.institutionsService.createInstitution(
      createInstitutionDto,
    );
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Institution> {
    return await this.institutionsService.delete(+id);
  }
}
