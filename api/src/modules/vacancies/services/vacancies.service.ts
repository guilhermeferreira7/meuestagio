import { Injectable } from '@nestjs/common';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from '../entities/vacancy.entity';
import { Repository } from 'typeorm';
import { Company } from '../../users/companies/entities/company.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly repository: Repository<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    const vacancy = this.repository.create(createVacancyDto);
    await this.repository.save(vacancy);
    return vacancy;
  }

  async findAll({ page, limit, state, region, city, search, remote }) {
    if (search) {
      const vacancies = await this.repository
        .createQueryBuilder()
        .select()
        .where('Vacancy.title ILIKE :search', { search: `%${search}%` })
        .orWhere('description ILIKE :search', { search: `%${search}%` })
        .orWhere('keywords ILIKE :search', { search: `%${search}%` })
        .orWhere('area.title ILIKE :search', { search: `%${search}%` })
        .addOrderBy('remote', remote === 'true' ? 'DESC' : 'ASC')
        .leftJoinAndSelect('Vacancy.company', 'company')
        .leftJoinAndSelect('Vacancy.city', 'city')
        .leftJoinAndSelect('Vacancy.region', 'region')
        .leftJoinAndSelect('Vacancy.area', 'area')
        .skip(page)
        .take(limit)
        .getMany();

      return vacancies;
    }

    const vacancies = await this.repository.find({
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
    const result = vacancies.map((vacancy) => {
      return {
        ...vacancy,
        company: {
          name: vacancy.company.name,
        },
        city: {
          name: vacancy.city.name,
        },
      };
    });

    return result;
  }

  async findAllByCompany(companyId: number) {
    const vacancies = await this.repository.find({
      where: {
        companyId,
      },
      order: {
        id: 'DESC',
      },
      relations: ['company', 'area', 'city', 'region'],
    });
    const result = vacancies.map((vacancy) => {
      return {
        ...vacancy,
        company: {
          name: vacancy.company.name,
        },
        city: {
          name: vacancy.city.name,
        },
      };
    });

    return result;
  }

  async findOne(id: number) {
    const vacancy = await this.repository.findOne({
      where: { id: id },
      relations: ['company', 'area', 'city', 'region'],
    });
    return {
      ...vacancy,
      company: {
        name: vacancy.company.name,
      },
    };
  }
}
