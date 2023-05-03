import { Injectable } from '@nestjs/common';

import { StudentsService } from '../../users/students/services/student.service';
import bcryptService from '../../../utils/bcriptUtils';
import { UserAuth } from '../types/user-auth';
import { Role } from '../../../utils/roles';

@Injectable()
export class AuthStudentService {
  constructor(private readonly userService: StudentsService) {}

  async validateStudent(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const student = await this.userService.findByEmail(email);

    const validCredentials =
      student && (await bcryptService.compare(password, student?.password));

    if (validCredentials) {
      return {
        sub: student.id,
        email: student.email,
        name: student.name,
        role: Role.STUDENT,
      };
    }

    return null;
  }
}
