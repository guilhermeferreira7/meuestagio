import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateProfessorDto } from './professor-create.dto';
import { ProfessorsService } from './professors.service';

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
}
