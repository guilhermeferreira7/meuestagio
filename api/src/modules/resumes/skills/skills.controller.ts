import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HasRoles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { CreateSkillDto } from './create-skill.dto';
import { SkillsService } from './skills.service';

@Controller('resumes/me/skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addSkill(@Body() body: CreateSkillDto) {
    return await this.service.add(body);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getSkills(@Param('resumeId') id: number) {
    return await this.service.getAll(id);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteSkill(@Param('id') id: number) {
    return await this.service.delete(id);
  }
}
