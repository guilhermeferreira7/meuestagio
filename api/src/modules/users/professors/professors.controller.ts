import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateProfessorDto } from './professor-create.dto';
import { ProfessorsService } from './professors.service';
import { ReqAuth } from '../../../types/auth/request';

@ApiTags('Professors')
@Controller('professors')
export class ProfessorsController {
  constructor(private readonly service: ProfessorsService) {}

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() body: CreateProfessorDto) {
    const professor = await this.service.create(body);

    return {
      ...professor,
      password: undefined,
    };
  }

  @HasRoles(Role.PROFESSOR)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Req() req: ReqAuth) {
    const professor = await this.service.findOneWithAllData(req.user.email);

    return {
      ...professor,
      password: undefined,
    };
  }
}
