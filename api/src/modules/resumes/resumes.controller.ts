import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/me')
  async find(@Request() req: any) {
    const id = req.query.studentId;
    return await this.resumesService.findByStudentId(+id);
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('/me')
  async update(@Body() body: UpdateResumeDto) {
    return await this.resumesService.update(body.id, body);
  }
}
