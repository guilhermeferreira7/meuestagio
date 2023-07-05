import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from '../entities/vacancy.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';

const vacancy: CreateVacancyDto = {
  title: 'Test vacancy',
  description: 'Test description',
  salary: 1000,
  cityId: 1,
  remote: false,
  companyId: 1,
  areaId: 1,
  keywords: 'test, vacancy',
  regionId: '1',
  state: 'Paraná',
};

const vacancies = [
  {
    id: 1,
    title: 'Test vacancy',
    description: 'Test description',
    salary: 1000,
    cityId: 1,
    remote: false,
    companyId: 1,
    areaId: 1,
    keywords: 'test, vacancy',
    regionId: '1',
    state: 'Paraná',
    company: {
      name: 'Test company',
    },
    city: {
      name: 'City Name',
    },
  },
  {
    id: 2,
    title: 'Test vacancy 2',
    description: 'Test description',
    salary: 1000,
    cityId: 1,
    remote: false,
    companyId: 1,
    areaId: 1,
    keywords: 'test, vacancy',
    regionId: '1',
    state: 'Paraná',
    company: {
      name: 'Test company',
    },
    city: {
      name: 'City Name',
    },
  },
];

const mockVacanciesRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((vacancy) => Promise.resolve(vacancy)),
  findOneBy: jest.fn(() => undefined),
  findOne: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve({ ...vacancy, company: { name: 'Test company' } });
      }),
  ),
  find: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve(vacancies);
      }),
  ),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
  })),
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

  describe('findAll()', () => {
    it('should call repository.find', async () => {
      await service.findAll({
        page: 0,
        limit: 10,
        state: 'Paraná',
        region: 1,
        city: 1,
        search: '',
        remote: false,
      });
      expect(repository.find).toBeCalled();
    });

    it('should call repository.find with search', async () => {
      await service.findAll({
        page: 0,
        limit: 10,
        state: 'Paraná',
        region: 1,
        city: 1,
        search: 'test',
        remote: false,
      });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(repository.find).toBeCalled();
    });

    it('should call repository.find with remote', async () => {
      await service.findAll({
        page: 0,
        limit: 10,
        state: 'Paraná',
        region: 1,
        city: 1,
        search: '',
        remote: true,
      });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(repository.find).toBeCalled();
    });
  });

  describe('findOne()', () => {
    it('should call repository.findOne', async () => {
      await service.findOne(1);
      expect(repository.findOne).toBeCalled();
    });
  });
});
