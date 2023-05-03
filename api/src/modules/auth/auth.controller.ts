import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqAuth } from './types/request';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('student'))
  @Post('auth/login/student')
  async loginStudent(@Request() req: ReqAuth) {
    return await this.authService.login({ ...req.user });
  }
}
