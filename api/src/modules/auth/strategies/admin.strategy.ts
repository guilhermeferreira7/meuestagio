import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthCompanyService } from '../auth-company/auth-company.service';
import { AuthAdminService } from '../auth-admin/auth-admin.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authCompanyService: AuthAdminService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authCompanyService.validateAdmin(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }
    return user;
  }
}
