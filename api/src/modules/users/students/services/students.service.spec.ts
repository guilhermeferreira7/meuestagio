import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcryptService from '../../../../utils/bcriptUtils';
import { Student } from '../entities/student.entity';
import { StudentsService } from './students.service';
import { StudentValidator } from './students-validator.service';
import { CreateStudentDto } from '../dtos/create-student.dto';

const oneStudent: CreateStudentDto = {
  name: 'student one',
  email: 'student@email.com',
  password: 'abc123',
  institutionId: 1,
};

const studentsArray: CreateStudentDto[] = [
  {
    name: 'student one',
    email: 'student@email.com',
    password: 'abc123',
    institutionId: 1,
  },
  {
    name: 'student two',
    email: 'student2@email.com',
    password: 'abc123',
    institutionId: 1,
  },
];

const mockStudentsRepository = {
  create: jest.fn((dto) => dto),
  save: jest.fn((student) => Promise.resolve(student)),
  findOneBy: jest.fn(() => undefined),
  findOne: jest.fn(),
  find: jest.fn(() => studentsArray),
};

describe('StudentsService', () => {
  let service: StudentsService;
  let studentValidator: StudentValidator;
  let studentsRepository: Repository<Student>;

  const STUDENT_REPOSITORY_TOKEN = getRepositoryToken(Student);
  const HASHED_PASS = 'hashedPass';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: StudentValidator,
          useValue: {
            validateCreate: jest.fn(() => Promise.resolve(oneStudent)),
          },
        },
      ],
    })
      .useMocker((token) => {
        switch (token) {
          case STUDENT_REPOSITORY_TOKEN:
            return mockStudentsRepository;
        }
      })
      .compile();

    service = module.get<StudentsService>(StudentsService);
    studentValidator = module.get<StudentValidator>(StudentValidator);

    studentsRepository = module.get<Repository<Student>>(
      STUDENT_REPOSITORY_TOKEN,
    );
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(studentValidator).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(studentsRepository).toBeDefined();
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
        .spyOn(studentsRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(existingStudent));

      try {
        await service.createStudent(newStudent);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Email já cadastrado!');
      }
    });

    it('should throw error if validator service fails', async () => {
      jest
        .spyOn(studentValidator, 'validateCreate')
        .mockReturnValueOnce(Promise.resolve(null));

      try {
        await service.createStudent(oneStudent);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
      expect(studentValidator.validateCreate).toBeCalledWith(oneStudent);
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
    it('should return one student by id', async () => {
      const spyFind = jest.spyOn(studentsRepository, 'findOne');
      expect(service.findOne(1));
      expect(spyFind).toBeCalledWith({
        relations: ['course', 'institution'],
        where: { id: 1 },
      });
    });
  });
});
