import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { StudentsService } from '../services/students.service';
import { StudentsController } from './students.controller';
import { Role } from '../../../auth/roles/roles';

const createStudentDto: CreateStudentDto = {
  name: 'student one',
  email: 'email@example.com',
  password: 'changeme',
  institutionId: 1,
  courseId: 1,
  cityId: 1,
};

const mockService = {
  createStudent: jest.fn((student) => Promise.resolve({ id: 1, ...student })),
  updateStudent: jest.fn((email, student) => {
    if (email !== 'email@example.com') return Promise.resolve(null);
    return Promise.resolve({ id: 1, ...student });
  }),
  findOne: jest.fn((email) => {
    if (email !== 'email@example.com') return Promise.resolve(null);
    return Promise.resolve({ ...createStudentDto, email });
  }),
};

describe('StudentController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = app.get<StudentsController>(StudentsController);
    service = app.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a Student', async () => {
      const createStudent = await controller.create(createStudentDto);
      expect(createStudent).toEqual({ id: 1, ...createStudentDto });
      expect(service.createStudent).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('getProfile()', () => {
    it('should call service.findOne', async () => {
      const student = await controller.getProfile({
        user: {
          name: 'student one',
          email: 'email@example.com',
          role: Role.STUDENT,
          sub: 1,
        },
      });

      expect(student).toEqual({
        name: 'student one',
        email: 'email@example.com',
        institutionId: 1,
        courseId: 1,
        cityId: 1,
      });
      expect(service.findOne).toHaveBeenCalledWith('email@example.com');
    });

    it('should throw UnauthorizedException', async () => {
      try {
        await controller.getProfile({
          user: {
            name: 'student one',
            email: 'invalid@email.com',
            role: Role.STUDENT,
            sub: 1,
          },
        });
      } catch (error) {
        expect(error.message).toEqual('Unauthorized');
      }
    });
  });

  describe('update()', () => {
    it('should call service.findOne', async () => {
      const student = await controller.update(
        {
          user: {
            name: 'student one',
            email: 'email@example.com',
            role: Role.STUDENT,
            sub: 1,
          },
        },
        {
          name: 'student one',
          email: 'email@example.com',
          institutionId: 1,
          courseId: 1,
          cityId: 1,
        },
      );

      expect(student).toEqual({
        id: 1,
        name: 'student one',
        email: 'email@example.com',
        institutionId: 1,
        courseId: 1,
        cityId: 1,
      });
      expect(service.findOne).toHaveBeenCalledWith('email@example.com');
    });

    it('should throw UnauthorizedException', async () => {
      try {
        await controller.update(
          {
            user: {
              name: 'student one',
              email: 'invalid@example.com',
              role: Role.STUDENT,
              sub: 1,
            },
          },
          {
            name: 'student one',
            email: 'email@example.com',
            institutionId: 1,
            courseId: 1,
            cityId: 1,
          },
        );
      } catch (error) {
        expect(error.message).toEqual('Unauthorized');
      }
    });
  });
});
