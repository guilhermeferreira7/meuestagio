import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './create.dto';
import { ReqAuth } from '../../../types/auth/request';

@Controller('resumes/me/languages')
export class LanguagesController {
  constructor(private readonly service: LanguagesService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async add(@Body() body: CreateLanguageDto, @Req() req: ReqAuth) {
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
