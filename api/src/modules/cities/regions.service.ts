import { ConflictException, Injectable } from '@nestjs/common';

import { CreateRegionDto } from './dtos/create-region.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRegion(createRegionDto: CreateRegionDto) {
    const region = await this.prisma.region.findFirst({
      where: {
        name: createRegionDto.name,
      },
    });

    if (region) {
      throw new ConflictException('Região já existe!');
    }

    return await this.prisma.region.create({
      data: {
        name: createRegionDto.name,
        state: createRegionDto.state,
        IBGECode: createRegionDto.IBGECode,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    state: string,
    orderBy: 'name' | 'id',
  ) {
    const order = this.defineOrderBy(orderBy);

    return await this.prisma.region.findMany({
      skip: page,
      take: limit,
      where: {
        state,
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
