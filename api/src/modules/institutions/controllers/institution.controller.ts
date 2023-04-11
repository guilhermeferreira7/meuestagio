import { Controller, Get, Param } from '@nestjs/common';

import { Institution } from '../models/institution.entity';
import { InstitutionsService } from '../services/institution.service';
import { CoursesService } from '../../courses/services/courses.service';

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

  @Get(':id/courses')
  async getCourses(@Param('id') id: string) {
    return await this.coursesService.findByInstitution(+id);
  }
}
