import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqAuth } from '../../types/auth/request';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('student'))
  @Post('auth/login/student')
  async loginStudent(@Request() req: ReqAuth) {
    return await this.authService.login({ ...req.user });
  }

  @UseGuards(AuthGuard('company'))
  @Post('auth/login/company')
  async loginCompany(@Request() req: ReqAuth) {
    return await this.authService.login({ ...req.user });
  }

  @UseGuards(AuthGuard('admin'))
  @Post('auth/login/admin')
  async loginAdmin(@Request() req: ReqAuth) {
    return await this.authService.login({ ...req.user });
  }
}
