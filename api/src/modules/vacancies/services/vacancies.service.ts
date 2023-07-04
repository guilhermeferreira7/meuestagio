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

  async findAll({ page, limit, state, region, city, search }) {
    if (search) {
      const vacancies = await this.repository
        .createQueryBuilder()
        .select()
        .where('title ILIKE :search', { search: `%${search}%` })
        .orWhere('description ILIKE :search', { search: `%${search}%` })
        .orWhere('keywords ILIKE :search', { search: `%${search}%` })
        .leftJoinAndSelect('Vacancy.company', 'company')
        .leftJoinAndSelect('Vacancy.city', 'city')
        .leftJoinAndSelect('Vacancy.region', 'region')
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
      relations: ['company', 'city', 'region'],
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
      relations: ['company', 'area'],
    });
    return {
      ...vacancy,
      company: {
        name: vacancy.company.name,
      },
    };
  }
}
