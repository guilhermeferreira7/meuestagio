import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Institution } from '../models/institution.entity';
import { InstitutionsService } from '../services/institution.service';
import { CoursesService } from '../../courses/services/courses.service';
import { CreateCityDto } from '../../cities/dtos/create-city.dto';
import { City } from '../../cities/models/city.entity';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';

@Controller('institutions')
export class InstitutionsController {
  constructor(
    private readonly institutionsService: InstitutionsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  async getAll(): Promise<Institution[]> {
    return await this.institutionsService.findAll();
  }

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
