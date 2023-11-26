import { BadRequestException, Injectable } from '@nestjs/common';
import { JobApplicationStatusEnum, JobStatusEnum } from '@prisma/client';

import { CreateJobDto } from './dtos/create-job.dto';
import { PrismaService } from '../../../prisma/prisma.service';

type JobsQuery = {
  page?: number;
  limit?: number;
  state?: string;
  region?: number;
  city?: number;
  search?: string;
};

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

  async findAll({ page, limit, state, region, city, search }: JobsQuery) {
    if (search) {
      const jobs = this.prisma.job.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
          OR: [
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
              keywords: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              company: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              area: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        orderBy: {
          id: 'desc',
        },
        skip: page ? page : 0,
        take: limit ? limit : undefined,
        include: {
          company: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
          city: {
            select: {
              name: true,
            },
          },
        },
      });

      if (city) return (await jobs).filter((job) => job.cityId === city);
      else if (region)
        return (await jobs).filter((job) => job.regionId === region);
      else if (state) return (await jobs).filter((job) => job.state === state);

      return jobs;
    }

    return await this.prisma.job.findMany();
  }

  async findAllByCompany(companyId: number) {
    return await this.prisma.job.findMany({
      where: {
        companyId,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        company: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        city: {
          select: {
            name: true,
          },
        },
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
          select: {
            name: true,
            imageUrl: true,
          },
        },
        area: {
          select: { title: true },
        },
        city: {
          select: { name: true },
        },
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
      throw new BadRequestException();
  }
}
