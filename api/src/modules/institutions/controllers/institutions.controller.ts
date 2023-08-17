import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Institution } from '../entities/institution.entity';
import { InstitutionsService } from '../services/institutions.service';
import { CoursesService } from '../../courses/services/courses.service';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Controller('institutions')
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  async getAll(@Request() req): Promise<Institution[]> {
    return await this.institutionsService.findAll({
      cityId: req.query.cityId,
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

  @Get(':id/courses')
  async getCourses(@Param('id') id: string) {
    return await this.coursesService.findByInstitution(+id);
  }
}
