import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../entities/student.entity';
import { StudentsService } from '../services/students.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { ReqAuth } from '../../../auth/types/request';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    console.log('createStudentDto ', createStudentDto);

    return await this.studentService.createStudent(createStudentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: ReqAuth): Promise<any> {
    const student = await this.studentService.findOne(req.user.sub);

    if (!student) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = student;

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async update(
    @Request() req: ReqAuth,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<any> {
    const student = await this.studentService.findOne(req.user.sub);
    if (!student) {
      throw new UnauthorizedException();
    }

    const updatedStudent = await this.studentService.updateStudent(
      student.id,
      updateStudentDto,
    );

    console.log('updatedStudent ', updatedStudent);

    return updatedStudent;
  }
}
