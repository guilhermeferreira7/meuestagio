import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateCourseDto } from '../dtos/create-course.dto';
import { CoursesService } from '../services/courses.service';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { Course } from '../entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.coursesService.findAll({
      page: req.query.page,
      limit: req.query.limit,
      institutionId: req.query.institutionId,
      areaId: req.query.areaId,
      orderBy: req.query.orderBy,
      order: req.query.order,
    });
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Course> {
    return this.coursesService.delete(+id);
  }
}
