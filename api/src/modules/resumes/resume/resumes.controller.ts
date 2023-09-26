import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResumesService } from './resumes.service';
import { UpdateResumeDto } from './update-resume.dto';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Role } from '../../auth/roles/roles';
import { HasRoles } from '../../auth/roles/roles.decorator';
import { ReqAuth } from '../../../types/auth/request';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/me')
  async update(@Body() body: UpdateResumeDto) {
    return await this.resumesService.update(body.id, body);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/me')
  async getResume(@Request() req: ReqAuth) {
    return await this.resumesService.getResume(req.user.sub);
  }
}
