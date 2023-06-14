import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles/roles';
import { UserAuth } from '../../types/auth/user-auth';

export type TPayload = {
  sub: string;
  email: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserAuth) {
    return {
      access_token: this.jwtService.sign(user),
      user,
    };
  }
}
