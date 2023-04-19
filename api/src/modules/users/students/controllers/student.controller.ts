import {
  Body,
  Controller,
  Get,
  Post,
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
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return await this.studentService.createStudent(createStudentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    const student = await this.studentService.findByEmail(req.user.email);
    const { password, ...result } = student;
    return result;
  }
}
