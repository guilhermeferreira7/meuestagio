import { Injectable } from '@nestjs/common';
import { CreateJobDto } from '../dtos/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.repository.create(createJobDto);
    await this.repository.save(job);
    return job;
  }

  async findAll({ page, limit, state, region, city, search, remote }) {
    if (search) {
      const jobs = await this.repository
        .createQueryBuilder()
        .select()
        .where('Job.title ILIKE :search', { search: `%${search}%` })
        .orWhere('description ILIKE :search', { search: `%${search}%` })
        .orWhere('keywords ILIKE :search', { search: `%${search}%` })
        .orWhere('area.title ILIKE :search', { search: `%${search}%` })
        .addOrderBy('Job.remote', remote === 'true' ? 'DESC' : 'ASC')
        .leftJoinAndSelect('Job.company', 'company')
        .leftJoinAndSelect('Job.city', 'city')
        .leftJoinAndSelect('Job.region', 'region')
        .leftJoinAndSelect('Job.area', 'area')
        .skip(page)
        .take(limit)
        .getMany();

      if (city || region || state) {
        if (city) {
          return jobs.filter((job) => job.city.id === Number(city));
        } else if (region) {
          return jobs.filter((job) => job.region.id === Number(region));
        } else if (state) {
          return jobs.filter((job) => job.state === state);
        }
      }

      return jobs;
    }

    const jobs = await this.repository.find({
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
      },
      where: {
        state,
        regionId: region,
        cityId: city,
      },
      relations: ['company', 'city', 'region', 'area'],
    });
    const result = jobs.map((job) => {
      return {
        ...job,
        company: {
          name: job.company.name,
        },
        city: {
          name: job.city.name,
        },
      };
    });

    return result;
  }

  async findAllByCompany(companyId: number) {
    const jobs = await this.repository.find({
      where: {
        companyId,
      },
      order: {
        id: 'DESC',
      },
      relations: ['company', 'area', 'city', 'region'],
    });
    const result = jobs.map((job) => {
      return {
        ...job,
        company: {
          name: job.company.name,
        },
        city: {
          name: job.city.name,
        },
      };
    });

    return result;
  }

  async findOne(id: number) {
    const job = await this.repository.findOne({
      where: { id: id },
      relations: ['company', 'area', 'city', 'region'],
    });
    return {
      ...job,
      company: {
        name: job.company.name,
      },
    };
  }
}
