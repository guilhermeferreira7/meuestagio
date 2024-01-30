import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ContractsService } from './contracts.service';
import { HasRoles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles';
import { RolesGuard } from '../auth/roles/roles.guard';
import { CreateContractDto } from './dtos/create';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() dto: CreateContractDto) {
    return await this.service.create(dto);
  }
}
