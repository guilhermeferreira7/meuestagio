import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateExperienceDto } from './create.dto';
import { ExperiencesService } from './experiences.service';
import { ReqAuth } from '../../../types/auth/request';

@Controller('resumes/me/experiences')
export class ExperiencesController {
  constructor(private readonly service: ExperiencesService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async add(@Body() body: CreateExperienceDto, @Req() req: ReqAuth) {
    return await this.service.add(body, req.user.email);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async get(@Req() req: ReqAuth) {
    return await this.service.getAll(req.user.email);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: ReqAuth) {
    return await this.service.delete(id, req.user.email);
  }
}
