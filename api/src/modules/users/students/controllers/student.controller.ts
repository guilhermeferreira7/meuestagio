import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../models/student.entity';
import { StudentsService } from '../services/student.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.createStudent(createStudentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req): Promise<Student> {
    return this.studentService.findByEmail(req.user.email);
  }
}
