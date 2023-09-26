import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { JobApplication } from '../entities/job-applications.entity';
import { JobApplicationsService } from '../services/job-applications.service';

const oneJobApplication = {
  jobId: 1,
  studentId: 1,
  resumeId: 1,
};

const student = {
  id: 1,
  name: 'John Doe',
  email: 'email@email.com',
  phone: '999999999',
  city: {
    id: 1,
    name: 'Curitiba',
  },
  institution: {
    id: 1,
    name: 'UTFPR',
  },
  course: {
    id: 1,
    name: 'TSI',
  },
};

const resume = {
  id: 1,
  studentId: 1,
  skills: [],
  languages: [],
  experiences: [],
  educations: [],
};

const mockJobApplicationsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(
    () =>
      new Promise((resolve) => {
        resolve([
          {
            id: 1,
            ...oneJobApplication,
            resume: resume,
            student: student,
          },
        ]);
      }),
  ),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};

describe('JobApplicationsService', () => {
  let service: JobApplicationsService;
  let repository: Repository<JobApplication>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApplicationsService,
        {
          provide: getRepositoryToken(JobApplication),
          useValue: mockJobApplicationsRepository,
        },
      ],
    }).compile();

    service = module.get<JobApplicationsService>(JobApplicationsService);
    repository = module.get<Repository<JobApplication>>(
      getRepositoryToken(JobApplication),
    );
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should call repository.create', async () => {
      await service.create(oneJobApplication);
      expect(repository.create).toBeCalled();
    });

    it('should call repository.save', async () => {
      await service.create(oneJobApplication);
      expect(repository.save).toBeCalled();
    });
  });

  describe('findByJobId()', () => {
    it('should return job applications', async () => {
      const jobId = 1;
      const spyFind = jest.spyOn(repository, 'find');
      await service.findByJobId(jobId);

      expect(spyFind).toBeCalled();
      expect(spyFind).toBeCalledWith({
        where: { jobId },
        relations: [
          'resume',
          'resume.skills',
          'resume.languages',
          'resume.experiences',
          'resume.educations',
          'student',
          'student.city',
          'student.institution',
          'student.course',
        ],
        select: {
          student: {
            id: true,
            about: true,
            name: true,
            email: true,
          },
        },
      });
    });
  });

  describe('findByStudentId()', () => {
    it('should return job applications', async () => {
      const studentId = 1;
      const spyFind = jest.spyOn(repository, 'find');
      await service.findByStudentId(studentId);

      expect(spyFind).toBeCalled();
      expect(spyFind).toBeCalledWith({
        where: { studentId },
        relations: ['job', 'job.company', 'job.company.city'],
      });
    });
  });
});
