import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqAuth } from '../../../../types/auth/request';
import { User } from '../../user/user.entity';
import { dataSource } from '../../../../database/data-source';
import { HasRoles } from '../../../auth/roles/roles.decorator';
import { Role } from '../../../auth/roles/roles';
import { RolesGuard } from '../../../auth/roles/roles.guard';

@Controller('admin')
export class AdminController {
  constructor() {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Request() req: ReqAuth): Promise<any> {
    const usersRepository = dataSource.getRepository(User);
    const admin = await usersRepository.findOne({
      where: { email: req.user.email },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = admin;

    return result;
  }
}
