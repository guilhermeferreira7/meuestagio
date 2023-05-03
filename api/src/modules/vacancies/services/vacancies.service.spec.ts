import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from '../entities/vacancy.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockVacanciesRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((vacancy) => Promise.resolve(vacancy)),
  findOneBy: jest.fn(() => undefined),
  findOne: jest.fn(),
  find: jest.fn(),
};

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;

  const REPOSITORY_TOKEN = getRepositoryToken(Vacancy);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacanciesService],
    })
      .useMocker((token) => {
        switch (token) {
          case REPOSITORY_TOKEN:
            return mockVacanciesRepository;
        }
      })
      .compile();

    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
