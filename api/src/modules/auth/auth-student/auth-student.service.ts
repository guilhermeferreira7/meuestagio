import { Injectable } from '@nestjs/common';
import { StudentsService } from '../../users/students/services/student.service';
import bcryptService from '../../../utils/bcriptUtils';

@Injectable()
export class AuthStudentService {
  constructor(private readonly userService: StudentsService) {}

  async validateStudent(email: string, pass: string): Promise<any> {
    const student = await this.userService.findByEmail(email);

    const validCredentials = student
      ? await bcryptService.compare(pass, student.password)
      : false;

    if (validCredentials) {
      return { email: student.email, id: student.id, name: student.name };
    }

    return null;
  }
}
