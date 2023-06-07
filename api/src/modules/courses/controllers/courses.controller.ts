import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { CoursesService } from '../services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }
}
