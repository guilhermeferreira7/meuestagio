import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { CreateCompanyDto } from './create-company.dto';
import bcryptService from '../../../utils/bcriptUtils';
import { UpdateCompanyDto } from './update-company.dto';
import { ImagesService } from '../../images/images.service';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly prisma: PrismaService,
  ) {}

  async createCompany(company: CreateCompanyDto) {
    await this.validateCreate(company);

    const password = await bcryptService.hash(company.password);

    return await this.prisma.company.create({
      data: {
        ...company,
        password,
      },
    });
  }

  async update(email: string, dto: UpdateCompanyDto) {
    await this.validateUpdate(email, dto);

    const companyUpdated = await this.prisma.company.update({
      where: { email },
      data: dto,
    });

    return await this.findOne(companyUpdated.email);
  }

  async findByCnpj(cnpj: string = '') {
    return await this.prisma.company.findUnique({ where: { cnpj } });
  }

  async findOne(email: string = '') {
    return await this.prisma.company.findUnique({ where: { email } });
  }

  async findOneWithAllRelations(email: string) {
    return await this.prisma.company.findUnique({
      where: { email },
      include: {
        city: true,
      },
    });
  }

  async updateImage(email: string, image: Express.Multer.File) {
    const { id } = await this.prisma.company.findUnique({ where: { email } });

    const url = await this.imagesService.uploadImage(
      image,
      `companies/${id}/profile-picture`,
    );
    await this.prisma.company.update({
      where: { email },
      data: { imageUrl: url },
    });
    return await this.findOne(email);
  }

  private async validateCreate(company: CreateCompanyDto) {
    if (await this.findOne(company.email))
      throw new ConflictException('Email já cadastrado!');

    if (await this.findByCnpj(company.cnpj))
      throw new ConflictException('CNPJ já cadastrado!');

    if (!(await this.prisma.city.findUnique({ where: { id: company.cityId } })))
      throw new BadRequestException();
  }

  private async validateUpdate(email: string, dto: UpdateCompanyDto) {
    if (dto.email) {
      const company = await this.findOne(dto.email);
      if (company && company.email !== email) {
        throw new ConflictException('Email pertence a outro usuário');
      }
    }
  }
}
