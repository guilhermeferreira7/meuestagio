import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException, Res } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcryptService from '../../../../utils/bcriptUtils';
import { Student } from '../entities/student.entity';
import { StudentsService } from './students.service';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { ResumesService } from '../../../resumes/resumes.service';
import { Resume } from '../../../resumes/resume/resume.entity';

const oneStudent: CreateStudentDto = {
  name: 'student one',
  email: 'student@email.com',
  password: 'abc123',
  institutionId: 1,
  courseId: 1,
  cityId: 1,
};

const studentsArray: CreateStudentDto[] = [
  {
    name: 'student one',
    email: 'student@email.com',
    password: 'abc123',
    institutionId: 1,
    courseId: 1,
    cityId: 1,
  },
  {
    name: 'student two',
    email: 'student2@email.com',
    password: 'abc123',
    institutionId: 1,
    courseId: 1,
    cityId: 1,
  },
];

const mockStudentsRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((student) => Promise.resolve(student)),
  findOne: jest.fn(),
  find: jest.fn(() => studentsArray),
};

const mockResumesRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((resume) => Promise.resolve(resume)),
};

describe('StudentsService', () => {
  let service: StudentsService;
  let resumesRepository: Repository<Resume>;
  let studentsRepository: Repository<Student>;

  const STUDENT_REPOSITORY_TOKEN = getRepositoryToken(Student);
  const RESUME_REPOSITORY_TOKEN = getRepositoryToken(Resume);
  const HASHED_PASS = 'hashedPass';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService],
    })
      .useMocker((token) => {
        switch (token) {
          case STUDENT_REPOSITORY_TOKEN:
            return mockStudentsRepository;
          case RESUME_REPOSITORY_TOKEN:
            return mockResumesRepository;
        }
      })
      .compile();

    service = module.get<StudentsService>(StudentsService);

    studentsRepository = module.get<Repository<Student>>(
      STUDENT_REPOSITORY_TOKEN,
    );
    resumesRepository = module.get<Repository<Resume>>(RESUME_REPOSITORY_TOKEN);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(studentsRepository).toBeDefined();
    expect(resumesRepository).toBeDefined();
  });

  describe('createStudent()', () => {
    it('should throw error if email is already in use', async () => {
      const existingStudent = await service.createStudent(oneStudent);
      const newStudent = {
        name: 'student two',
        email: 'student@email.com',
        password: 'abc123',
        cityId: 1,
        institutionId: 1,
        courseId: 1,
      };

      jest
        .spyOn(studentsRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(existingStudent));

      try {
        await service.createStudent(newStudent);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Email já cadastrado!');
      }
    });

    it('should hash password correctly', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue(HASHED_PASS);
      await service.createStudent(oneStudent);
      expect(bcryptService.hash).toBeCalledWith('abc123');
    });

    it('should call studentsRepository.create', async () => {
      await service.createStudent(oneStudent);
      expect(studentsRepository.create).toBeCalledWith({
        ...oneStudent,
        password: HASHED_PASS,
      });
    });

    it('should call studentsRepository.save', async () => {
      await service.createStudent(oneStudent);
      expect(studentsRepository.save).toBeCalledWith({
        ...oneStudent,
        password: HASHED_PASS,
      });
    });
  });

  describe('findOne()', () => {
    it('should return one student by email', async () => {
      const spyFind = jest.spyOn(studentsRepository, 'findOne');
      expect(service.findOne('student@email.com'));
      expect(spyFind).toBeCalledWith({
        relations: ['course', 'institution', 'city'],
        where: { email: 'student@email.com' },
      });
    });
  });
});
