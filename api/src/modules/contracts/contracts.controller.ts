import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ReqAuth } from '../../types/auth/request';
import { Role } from '../auth/roles/roles';
import { HasRoles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dtos/create.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() dto: CreateContractDto, @Request() req: ReqAuth) {
    return await this.service.create({
      ...dto,
      companyId: req.user.sub,
    });
  }
}
