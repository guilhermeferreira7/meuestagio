import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { CreateCourseDto } from './dtos/create-course.dto';
import { PrismaService } from '../../../prisma/prisma.service';

type CourseQuery = {
  page: number;
  limit: number;
  name: string;
  institutionId: number;
  areaId: number;
  orderBy: string;
  order: string;
};

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    await this.validate(dto);

    return await this.prisma.course.create({
      data: dto,
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return await this.prisma.course.delete({ where: { id } });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Curso não encontrado!');
    }
    return course;
  }

  async findAll(
    page?: number,
    limit?: number,
    name?: string,
    institutionId?: number,
    areaId?: number,
    orderBy?: 'name' | 'id',
  ) {
    const order = this.defineOrderBy(orderBy);

    return await this.prisma.course.findMany({
      skip: page,
      take: limit,
      where: {
        institutionId,
        areaId,
        name: name ? { contains: name } : undefined,
      },
      orderBy: order,
      include: {
        institution: true,
        area: true,
      },
    });
  }

  async validate(dto: CreateCourseDto) {
    const courseAlreadyExists = await this.prisma.course.findFirst({
      where: {
        name: dto.name,
        institutionId: dto.institutionId,
      },
    });

    if (courseAlreadyExists) {
      throw new ConflictException('Esse curso já existe nessa instituição!');
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
