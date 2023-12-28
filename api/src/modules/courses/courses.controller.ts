import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { CreateCourseDto } from './dtos/create-course.dto';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../auth/roles/roles.guard';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(
      query.page ? Number(query.page) : undefined,
      query.limit ? Number(query.limit) : undefined,
      query.name,
      query.institutionId ? Number(query.institutionId) : undefined,
      query.areaId ? Number(query.areaId) : undefined,
      query.orderBy,
    );
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
