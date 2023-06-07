import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from '../entities/vacancy.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const vacancy = {
  title: 'Test vacancy',
  description: 'Test description',
  salary: 1000,
  cityId: 1,
  remote: false,
  companyId: 1,
  requirements: 'Test requirements',
  desirableRequirements: 'Test desirable requirements',
  activities: 'Test activities',
  areaId: 1,
};

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
    repository = module.get<Repository<Vacancy>>(REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createVancancy()', () => {
    it('should call repository.create', async () => {
      await service.create(vacancy);
      expect(repository.create).toBeCalledWith(vacancy);
    });

    it('should call repository.save', async () => {
      await service.create(vacancy);
      expect(repository.save).toBeCalled();
    });
  });
});
