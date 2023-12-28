import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateSkillDto } from './create.dto';
import { SkillsService } from './skills.service';
import { ReqAuth } from '../../../types/auth/request';

@Controller('resumes/me/skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addSkill(@Body() body: CreateSkillDto, @Req() req: ReqAuth) {
    return await this.service.add(body, req.user.email);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getSkills(@Req() req: ReqAuth) {
    return await this.service.getAll(req.user.email);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteSkill(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: ReqAuth,
  ) {
    return await this.service.delete(id, req.user.email);
  }
}
