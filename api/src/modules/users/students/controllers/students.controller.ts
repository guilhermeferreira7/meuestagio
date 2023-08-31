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
import { ReqAuth } from '../../../../types/auth/request';
import { Role } from '../../../auth/roles/roles';
import { HasRoles } from '../../../auth/roles/roles.decorator';
import { RolesGuard } from '../../../auth/roles/roles.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return await this.studentService.createStudent(createStudentDto);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Request() req: ReqAuth): Promise<any> {
    const student = await this.studentService.findOne(req.user.email);

    if (!student) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = student;

    return result;
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch()
  async update(
    @Request() req: ReqAuth,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<any> {
    const student = await this.studentService.findOne(req.user.email);
    if (!student) {
      throw new UnauthorizedException();
    }

    const updatedStudent = await this.studentService.updateStudent(
      student.email,
      updateStudentDto,
    );

    return updatedStudent;
  }

  // remove this later
  @Get()
  async getAll(): Promise<Student[]> {
    return await this.studentService.findAll();
  }
}
