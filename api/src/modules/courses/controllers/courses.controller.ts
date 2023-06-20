import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { CoursesService } from '../services/courses.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';

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
