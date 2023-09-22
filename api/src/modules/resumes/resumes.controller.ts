import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UserAuth } from '../../types/auth/user-auth';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/me')
  async find(@Request() user: UserAuth) {
    const id = user.sub;
    console.log('??');
    return await this.resumesService.findByStudentId(id);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('/me')
  async update(@Body() body: UpdateResumeDto) {
    return await this.resumesService.update(body.id, body);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/me/skills')
  async addSkill(@Body() body: CreateSkillDto) {
    return await this.resumesService.addSkill(body);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/me/skills/:id')
  async deleteSkill(@Param('id') id: number) {
    return await this.resumesService.deleteSkill(id);
  }
}
