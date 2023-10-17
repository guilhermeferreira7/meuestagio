import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from '../../../auth/roles/roles';
import { HasRoles } from '../../../auth/roles/roles.decorator';
import { RolesGuard } from '../../../auth/roles/roles.guard';
import { AuthService } from '../../../auth/auth.service';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { Company } from '../entities/company.entity';
import { CompaniesService } from '../services/companies.service';
import { ReqAuth } from '../../../../types/auth/request';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly authService: AuthService,
  ) {}

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
    const company = await this.companiesService.findOne(req.user.email);
    if (!company) {
      throw new UnauthorizedException();
    }

    return company;
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('profile/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: ReqAuth,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Company> {
    return await this.companiesService.updateImage(req.user.email, file);
  }

  @HasRoles(Role.COMPANY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Request() req: ReqAuth,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<any> {
    const company = await this.companiesService.update(
      req.user.email,
      updateCompanyDto,
    );

    const { access_token, user } = await this.authService.signJwt({
      email: company.email,
      name: company.name,
      role: Role.COMPANY,
      sub: company.id,
    });

    const companyUpdated = await this.companiesService.findOne(req.user.email);

    const { password, ...userWithoutPassword } = companyUpdated;

    return {
      access_token,
      user,
      company: userWithoutPassword,
    };
  }
}
