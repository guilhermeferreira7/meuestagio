import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCityDto } from './dtos/create-city.dto';
import { PrismaService } from '../../../prisma/prisma.service';

export type CitiesQuery = {
  page?: number;
  limit?: number;
  state?: string;
  region?: number;
  name?: string;
  orderBy?: 'name' | 'id';
};

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCity(createCityDto: CreateCityDto) {
    const region = await this.prisma.region.findUnique({
      where: {
        id: createCityDto.regionId,
      },
    });

    if (!region) {
      throw new BadRequestException('Região não existe!');
    }

    return await this.prisma.city.create({
      data: {
        name: createCityDto.name,
        state: createCityDto.state,
        region: {
          connect: region,
        },
        IBGECityCode: createCityDto.IBGECityCode,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    state: string,
    region: number,
    name: string,
    orderBy: 'name' | 'id',
  ) {
    const order = this.defineOrderBy(orderBy);

    return await this.prisma.city.findMany({
      skip: page,
      take: limit,
      where: {
        state,
        name,
        regionId: region,
      },
      orderBy: order,
    });
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
