import { Body, Controller, Get, Post, Param } from '@nestjs/common';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../models/student.entity';
import { StudentsService } from '../services/student.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Student | undefined> {
    return await this.studentService.findOne(id);
  }

  @Get()
  async getAll(): Promise<Student[] | undefined> {
    return await this.studentService.findAll();
  }
}
