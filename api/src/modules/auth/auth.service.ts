import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../utils/roles';

export type TPayload = {
  email: string;
  sub: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: TPayload) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
