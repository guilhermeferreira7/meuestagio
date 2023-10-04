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
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../../auth/auth.service';
import { Role } from '../../../auth/roles/roles';
import { HasRoles } from '../../../auth/roles/roles.decorator';
import { RolesGuard } from '../../../auth/roles/roles.guard';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Student } from '../entities/student.entity';
import { StudentsService } from '../services/students.service';
import { ReqAuth } from '../../../../types/auth/request';
import { UserAuth } from '../../../../types/auth/user-auth';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentService: StudentsService,
    private readonly authService: AuthService,
  ) {}

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
  @Patch('profile')
  async update(
    @Request() req: any,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<{
    access_token: string;
    user: UserAuth;
  }> {
    console.log('req ', req);
    console.log('req user', req.user);
    console.log('req authorization', req.headers.authorization);
    const student = await this.studentService.updateStudent(
      req.user.email,
      updateStudentDto,
    );

    const { access_token, user } = await this.authService.signJwt({
      email: student.email,
      name: student.name,
      role: Role.STUDENT,
      sub: student.id,
    });

    return {
      access_token,
      user,
    };
  }
}
