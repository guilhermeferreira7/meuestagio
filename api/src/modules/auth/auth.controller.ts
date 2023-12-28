import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqAuth } from '../../types/auth/request';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth/login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('student'))
  @Post('student')
  async loginStudent(@Request() req: ReqAuth) {
    return await this.authService.signJwt({ ...req.user });
  }

  @UseGuards(AuthGuard('company'))
  @Post('company')
  async loginCompany(@Request() req: ReqAuth) {
    return await this.authService.signJwt({ ...req.user });
  }

  @UseGuards(AuthGuard('admin'))
  @Post('admin')
  async loginAdmin(@Request() req: ReqAuth) {
    return await this.authService.signJwt({ ...req.user });
  }
}
