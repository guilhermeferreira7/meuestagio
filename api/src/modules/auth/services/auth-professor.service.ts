import { Injectable } from '@nestjs/common';

import { Role } from '../roles/roles';
import { UserAuth } from '../../../types/auth/user-auth';
import { ProfessorsService } from '../../users/professors/professors.service';
import bcryptService from '../../../utils/bcriptUtils';

@Injectable()
export class AuthProfessorService {
  constructor(private readonly service: ProfessorsService) {}

  async validateProfessor(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    const professor = await this.service.findOne(email);
    if (!professor) return null;

    const validCredentials = await bcryptService.compare(
      password,
      professor.password,
    );

    if (!validCredentials) {
      return null;
    }

    return {
      sub: professor.id,
      email: professor.email,
      name: professor.name,
      role: Role.PROFESSOR,
    };
  }
}
