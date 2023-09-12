import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReqAuth } from '../../../../types/auth/request';
import { User } from '../../user/user.entity';
import { HasRoles } from '../../../auth/roles/roles.decorator';
import { Role } from '../../../auth/roles/roles';
import { RolesGuard } from '../../../auth/roles/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Request() req: ReqAuth): Promise<any> {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    const admin = await this.usersRepository.findOne({
      where: { email: req.user.email },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = admin;

    return result;
  }
}
