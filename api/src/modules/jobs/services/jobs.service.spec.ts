import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateJobDto } from '../dtos/create-job.dto';

const job: CreateJobDto = {
  title: 'Test job',
  description: 'Test description',
  salary: 1000,
  cityId: 1,
  remote: false,
  companyId: 1,
  areaId: 1,
  keywords: 'test, job',
  regionId: '1',
  state: 'Paraná',
};

const jobs = [
  {
    id: 1,
    title: 'Test job',
    description: 'Test description',
    salary: 1000,
    cityId: 1,
    remote: false,
    companyId: 1,
    areaId: 1,
    keywords: 'test, job',
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
    title: 'Test job 2',
    description: 'Test description',
    salary: 1000,
    cityId: 1,
    remote: false,
    companyId: 1,
    areaId: 1,
    keywords: 'test, job',
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

const mockJobsRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((job) => Promise.resolve(job)),
  findOneBy: jest.fn(() => undefined),
  findOne: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve({ ...job, company: { name: 'Test company' } });
      }),
  ),
  find: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve(jobs);
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

describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  const REPOSITORY_TOKEN = getRepositoryToken(Job);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService],
    })
      .useMocker((token) => {
        switch (token) {
          case REPOSITORY_TOKEN:
            return mockJobsRepository;
        }
      })
      .compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<Repository<Job>>(REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createVancancy()', () => {
    it('should call repository.create', async () => {
      await service.create(job);
      expect(repository.create).toBeCalledWith(job);
    });

    it('should call repository.save', async () => {
      await service.create(job);
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
