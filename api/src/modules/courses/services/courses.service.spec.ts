import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CoursesService } from './courses.service';
import { Course } from '../models/course.entity';
import { Institution } from '../../institutions/models/institution.entity';

const oneCourse = {
  name: 'TSI',
  institutionId: 1,
};

const mockInstitutionsRepository = {
  findOneBy: jest.fn((id) => Promise.resolve({ id, name: 'UTFPR' })),
};

const mockCoursesRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: Repository<Course>;
  let institutionsRepository: Repository<Institution>;

  const COURSE_REPOSITORY_TOKEN = getRepositoryToken(Course);
  const INSTITUTION_REPOSITORY_TOKEN = getRepositoryToken(Institution);

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: COURSE_REPOSITORY_TOKEN,
          useValue: mockCoursesRepository,
        },
        {
          provide: INSTITUTION_REPOSITORY_TOKEN,
          useValue: mockInstitutionsRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<Repository<Course>>(COURSE_REPOSITORY_TOKEN);
    institutionsRepository = module.get<Repository<Institution>>(
      INSTITUTION_REPOSITORY_TOKEN,
    );
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(repository).toBeDefined();
    expect(institutionsRepository).toBeDefined();
  });

  describe('createCourse()', () => {
    it('should validate institutionId', async () => {
      const spyValidate = jest
        .spyOn(service, 'validate')
        .mockResolvedValueOnce(Promise.resolve(true));

      await service.createCourse(oneCourse);

      expect(spyValidate).toBeCalled();
      expect(spyValidate).toBeCalledWith(oneCourse);
    });

    it('should call repository.create', async () => {
      await service.createCourse(oneCourse);
      expect(repository.create).toBeCalled();
    });

    it('should call repository.save', async () => {
      await service.createCourse(oneCourse);
      expect(repository.save).toBeCalled();
    });
  });

  describe('findOne()', () => {
    it('should return one course', async () => {
      const id = 1;
      const spyFind = jest.spyOn(repository, 'findOneBy');
      await service.findOne(id);

      expect(spyFind).toBeCalled();
      expect(spyFind).toBeCalledWith({ id });
    });
  });
});
