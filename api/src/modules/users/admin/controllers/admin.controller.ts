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
import { ReqAuth } from '../../../auth/types/request';
import { User } from '../../user/user.entity';
import { dataSource } from '../../../../database/data-source';

@Controller('admin')
export class AdminController {
  constructor() {}

  @UseGuards(AuthGuard('jwt'))
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
