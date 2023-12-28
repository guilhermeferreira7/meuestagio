import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthStudentService } from '../services/auth-student.service';

@Injectable()
export class LocalStudentStrategy extends PassportStrategy(
  Strategy,
  'student',
) {
  constructor(private authStudentService: AuthStudentService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authStudentService.validateStudent(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }
    return user;
  }
}
