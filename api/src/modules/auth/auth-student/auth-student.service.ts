import { Injectable } from '@nestjs/common';

import { StudentsService } from '../../users/students/students.service';
import bcryptService from '../../../utils/bcriptUtils';
import { UserAuth } from '../../../types/auth/user-auth';
import { Role } from '../roles/roles';

@Injectable()
export class AuthStudentService {
  constructor(private readonly userService: StudentsService) {}

  async validateStudent(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const student = await this.userService.findOne(email);
    if (!student) return null;

    const validCredentials = await bcryptService.compare(
      password,
      student.password,
    );

    if (!validCredentials) {
      return null;
    }

    return {
      sub: student.id,
      email: student.email,
      name: student.name,
      role: Role.STUDENT,
    };
  }
}
