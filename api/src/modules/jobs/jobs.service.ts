import { BadRequestException, Injectable } from '@nestjs/common';
import { JobApplicationStatusEnum, JobStatusEnum } from '@prisma/client';

import { CreateJobDto } from './dtos/create-job.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    await this.validateCreate(createJobDto);

    return await this.prisma.job.create({
      data: createJobDto,
    });
  }

  async close(id: number) {
    await this.prisma.jobApplication.updateMany({
      where: {
        jobId: id,
      },
      data: {
        status: JobApplicationStatusEnum.Finalizado,
      },
    });

    return await this.prisma.job.update({
      where: {
        id,
      },
      data: {
        status: JobStatusEnum.closed,
      },
    });
  }

  async findAll(
    page = 0,
    limit = 10,
    search: string,
    city: number,
    region: number,
    state: string,
  ) {
    if (search) {
      return await this.searchJobs(search, page, limit, city, region, state);
    }

    return this.prisma.job.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        cityId: city,
        regionId: region,
        state: state,
      },
      skip: page,
      take: limit,
      include: {
        company: { select: { name: true, imageUrl: true } },
        city: { select: { name: true } },
        region: { select: { name: true } },
        area: { select: { title: true } },
      },
    });
  }

  async findAllByCompany(companyId: number) {
    return await this.prisma.job.findMany({
      where: { companyId },
      orderBy: { id: 'desc' },
      include: {
        company: {
          select: { name: true, imageUrl: true },
        },
        city: { select: { name: true } },
        area: { select: { title: true } },
        region: { select: { name: true } },
      },
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        company: {
          select: { name: true, imageUrl: true },
        },
        city: {
          select: { name: true },
        },
        area: {
          select: { title: true },
        },
        region: { select: { name: true } },
      },
    });
    return job;
  }

  private async validateCreate(createJobDto: CreateJobDto) {
    if (
      !(await this.prisma.city.findUnique({
        where: { id: createJobDto.cityId },
      }))
    )
      throw new BadRequestException('Cidade é obrigatória.');
  }

  private async searchJobs(
    search: string,
    page: number,
    limit: number,
    city: number,
    region: number,
    state: string,
  ) {
    const jobs = this.prisma.job.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: page,
      take: limit,
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { keywords: { contains: search, mode: 'insensitive' } },
          { company: { name: { contains: search, mode: 'insensitive' } } },
          { area: { title: { contains: search, mode: 'insensitive' } } },
        ],

        cityId: city,
        regionId: region,
        state: state,
      },
      include: {
        company: { select: { name: true, imageUrl: true } },
        city: { select: { name: true } },
        area: { select: { title: true } },
        region: { select: { name: true } },
      },
    });

    return jobs;
  }
}
