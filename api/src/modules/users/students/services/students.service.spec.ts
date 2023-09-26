import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../entities/student.entity';
import { Resume } from '../../../resumes/resume/resume.entity';
import { StudentsService } from './students.service';
import bcryptService from '../../../../utils/bcriptUtils';

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
  findOne: jest.fn(() => Promise.resolve(null)),
  find: jest.fn(() => studentsArray),
  update: jest.fn((email, student) => Promise.resolve(student)),
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
      jest
        .spyOn(studentsRepository, 'findOne')
        .mockResolvedValueOnce(new Student());

      await expect(service.createStudent(oneStudent)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should hash password correctly', async () => {
      jest.spyOn(bcryptService, 'hash').mockResolvedValue(HASHED_PASS);
      await service.createStudent(oneStudent);
      expect(bcryptService.hash).toBeCalledWith('abc123');
    });

    it('should create student', async () => {
      await service.createStudent(oneStudent);
      expect(studentsRepository.save).toBeCalledWith({
        ...oneStudent,
        password: HASHED_PASS,
      });
    });

    it('should create resume', async () => {
      const student = await service.createStudent(oneStudent);
      expect(resumesRepository.save).toBeCalledWith({
        studentId: student.id,
      });
    });

    it('should update student with resumeId', async () => {
      const student = await service.createStudent(oneStudent);
      expect(studentsRepository.update).toBeCalledWith(student.id, {
        resumeId: student.resumeId,
      });
    });
  });

  describe('findOne()', () => {
    it('should throw error if email is null', async () => {
      try {
        await service.findOne(null);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return student', async () => {
      jest
        .spyOn(studentsRepository, 'findOne')
        .mockResolvedValueOnce(new Student());
      await service.findOne(oneStudent.email);
      expect(studentsRepository.findOne).toBeCalled();
    });
  });

  describe('findAll()', () => {
    it('should return students array', async () => {
      await service.findAll();
      expect(studentsRepository.find).toBeCalled();
    });
  });

  describe('updateStudent()', () => {
    it('should update student', async () => {
      await service.updateStudent(oneStudent.email, {
        name: 'student updated',
      });
      expect(studentsRepository.update).toBeCalledWith(
        {
          email: oneStudent.email,
        },
        {
          name: 'student updated',
        },
      );
      expect(studentsRepository.findOne).toBeCalledWith({
        relations: ['course', 'institution', 'city'],
        where: { email: oneStudent.email },
      });
    });
  });
});
