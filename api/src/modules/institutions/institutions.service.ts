import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInstitutionDto } from './dtos/create-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page?: number,
    limit?: number,
    name?: string,
    cityId?: number,
    orderBy?: 'name' | 'id',
  ) {
    const order = this.defineOrderBy(orderBy);

    return await this.prisma.institution.findMany({
      skip: page,
      take: limit,
      where: {
        name: {
          contains: name,
        },
        cityId,
      },
      orderBy: order,
      include: {
        city: true,
      },
    });
  }

  async createInstitution(createInstitutionDto: CreateInstitutionDto) {
    await this.validate(createInstitutionDto);

    return await this.prisma.institution.create({
      data: createInstitutionDto,
    });
  }

  async delete(id: number) {
    const institution = await this.findOne(id);

    return await this.prisma.institution.delete({
      where: { id: institution.id },
    });
  }

  async findOne(id: number) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      throw new NotFoundException('Instituição não encontrada!');
    }

    return institution;
  }

  private async validate(institution: CreateInstitutionDto) {
    const city = await this.prisma.city.findUnique({
      where: { id: institution.cityId },
    });
    if (!city) throw new BadRequestException();

    const institutionExists = await this.prisma.institution.findUnique({
      where: {
        name: institution.name,
      },
    });

    if (institutionExists) {
      throw new ConflictException('Instituição já cadastrada!');
    }
  }

  private defineOrderBy(orderBy: 'name' | 'id') {
    let order = {};
    switch (orderBy) {
      case 'name':
        order = { name: 'asc' };
        break;
      case 'id':
        order = { id: 'asc' };
        break;
      default:
        order = { id: 'desc' };
    }
    return order;
  }
}
