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
  regionId: 1,
  state: 'Paraná',
};

const jobs = [
  {
    title: 'Test job',
    company: {
      name: 'Test company',
    },
    city: {
      name: 'Test city',
    },
  },
  {
    title: 'Test job 2',
    company: {
      name: 'Test company 2',
    },
    city: {
      name: 'Test city 2',
    },
  },
];

const jobsSearch = [
  {
    title: 'job1',
    company: { name: 'company1' },
    city: {
      id: 1,
      name: 'City 1',
    },
    region: {
      id: 1,
      name: 'Region 1',
    },
    state: 'Paraná',
  },
  {
    title: 'job2',
    company: { name: 'company2' },
    city: {
      id: 2,
      name: 'City 2',
    },
    region: {
      id: 2,
      name: 'Region 2',
    },
    state: 'Paraná',
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
    getMany: jest.fn().mockReturnValue(jobsSearch),
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

  describe('createJob()', () => {
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
      const jobsTest = await service.findAll({});
      expect(repository.find).toBeCalled();
      expect(jobsTest).toEqual(jobs);
    });

    it('should call repository.find with search', async () => {
      const jobsTest = await service.findAll({ search: 'test' });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(jobsTest).toEqual(jobsSearch);
    });

    it('should call repository.find with city', async () => {
      const jobsTest = await service.findAll({ search: 'test', city: 1 });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(jobsTest).toEqual(jobsSearch.filter((job) => job.city.id === 1));
    });

    it('should call repository.find with region', async () => {
      const jobsTest = await service.findAll({ search: 'test', region: 1 });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(jobsTest).toEqual(jobsSearch.filter((job) => job.region.id === 1));
    });

    it('should call repository.find with state', async () => {
      const jobsTest = await service.findAll({
        search: 'test',
        state: 'Paraná',
      });
      expect(repository.createQueryBuilder).toBeCalled();
      expect(jobsTest).toEqual(
        jobsSearch.filter((job) => job.state === 'Paraná'),
      );
    });

    it('should call repository.find with remote', async () => {
      await service.findAll({ search: 'test', remote: true });
      expect(repository.createQueryBuilder).toBeCalled();
    });
  });

  describe('findOne()', () => {
    it('should call repository.findOne', async () => {
      await service.findOne(1);
      expect(repository.findOne).toBeCalled();
    });
  });
});
