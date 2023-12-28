import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from '../../types/auth/user-auth';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signJwt(user: UserAuth) {
    return {
      access_token: this.jwtService.sign(user),
      user,
    };
  }
}
