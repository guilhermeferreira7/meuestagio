import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentValidator } from './student-validator.service';
import { City } from '../../../cities/models/city.entity';
import { Institution } from '../../../institutions/models/institution.entity';
import { Course } from '../../../courses/models/course.entity';

const mockCitiesRepository = {};
const mockInstitutionsRepository = {};
const mockCoursesRepository = {};

describe('StudentsValidator', () => {
  let studentsValidator: StudentValidator;

  const citiesRepository = Repository<City>;
  const institutionsRepository = Repository<Institution>;
  const coursesRepository = Repository<Course>;

  const CITIES_REPOSITORY_TOKEN = getRepositoryToken(City);
  const INSTITUTIONS_REPOSITORY_TOKEN = getRepositoryToken(Institution);
  const COURSES_REPOSITORY_TOKEN = getRepositoryToken(Course);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentValidator],
    })
      .useMocker((token) => {
        switch (token) {
          case CITIES_REPOSITORY_TOKEN:
            return mockCitiesRepository;
          case INSTITUTIONS_REPOSITORY_TOKEN:
            return mockInstitutionsRepository;
          case COURSES_REPOSITORY_TOKEN:
            return mockCoursesRepository;
        }
      })
      .compile();

    studentsValidator = module.get<StudentValidator>(StudentValidator);
  });

  it('validator should be defined', () => {
    expect(studentsValidator).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(citiesRepository).toBeDefined();
    expect(institutionsRepository).toBeDefined();
    expect(coursesRepository).toBeDefined();
  });
});
