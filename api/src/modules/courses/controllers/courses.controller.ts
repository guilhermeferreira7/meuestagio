import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { CoursesService } from '../services/courses.service';
import { HasRoles } from '../../auth/roles.decorator';
import { Role } from '../../../utils/roles';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }
}
