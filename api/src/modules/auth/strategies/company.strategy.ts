import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthCompanyService } from '../services/auth-company.service';

@Injectable()
export class LocalCompanyStrategy extends PassportStrategy(
  Strategy,
  'company',
) {
  constructor(private authCompanyService: AuthCompanyService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authCompanyService.validateCompany(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }
    return user;
  }
}
