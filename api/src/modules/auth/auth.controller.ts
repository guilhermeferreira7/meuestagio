import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../../utils/roles';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('student'))
  @Post('auth/login/student')
  async loginStudent(@Request() req) {
    return await this.authService.login({ ...req.user, role: Role.STUDENT });
  }
}
