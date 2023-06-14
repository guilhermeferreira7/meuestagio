import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CompaniesService } from '../services/companies.service';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { Company } from '../entities/company.entity';
import { AuthGuard } from '@nestjs/passport';
import { ReqAuth } from '../../../auth/types/request';
import { Role } from '../../../../utils/roles';
import { HasRoles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.companiesService.create(createCompanyDto);
  }

  @Get()
  async findAll(): Promise<Company[]> {
    return await this.companiesService.findAll();
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('profile')
  async getProfile(@Request() req: ReqAuth): Promise<any> {
    const company = await this.companiesService.findOne(req.user.sub);
    if (!company) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = company;

    return result;
  }
}
