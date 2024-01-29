import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthProfessorService } from '../services/auth-professor.service';

@Injectable()
export class LocalProfessorStrategy extends PassportStrategy(
  Strategy,
  'professor',
) {
  constructor(private service: AuthProfessorService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.service.validateProfessor(email, password);
    if (!user) throw new UnauthorizedException('Email ou senha invalidos');

    return user;
  }
}
