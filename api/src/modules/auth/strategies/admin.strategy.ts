import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthAdminService } from '../services/auth-admin.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authAdminService: AuthAdminService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authAdminService.validateAdmin(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }
    return user;
  }
}
