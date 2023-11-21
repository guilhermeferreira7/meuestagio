import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/roles/roles';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateStudentDto } from './student-create.dto';
import { UpdateStudentDto } from './student-update.dto';
import { StudentsService } from './students.service';
import { ReqAuth } from '../../../types/auth/request';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentService: StudentsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.createStudent(createStudentDto);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Request() req: ReqAuth) {
    const student = await this.studentService.findOne(req.user.email);
    if (!student) throw new UnauthorizedException();

    const { password, ...result } = student;
    return result;
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('profile')
  async update(
    @Request() req: ReqAuth,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
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

    const studentUpdated = await this.studentService.findOne(student.email);
    const { password, ...userWithoutPassword } = studentUpdated;

    return {
      access_token,
      user,
      student: userWithoutPassword,
    };
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('profile/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Request() req: ReqAuth,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.studentService.updateImage(req.user.email, file);
  }
}
