import { Injectable } from '@nestjs/common';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from '../entities/vacancy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly repository: Repository<Vacancy>,
  ) {}

  create(createVacancyDto: CreateVacancyDto) {
    return 'This action adds a new vacancy';
  }

  async findAll() {
    const vacancies = await this.repository.find({ relations: ['company'] });
    const result = vacancies.map((vacancy) => {
      return {
        ...vacancy,
        company: {
          name: vacancy.company.name,
        },
      };
    });

    return result;
  }
}
