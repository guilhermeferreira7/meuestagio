import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { CreateStudentDto } from '../dtos/create-student.dto';
import { StudentsService } from '../services/students.service';
import { StudentsController } from './students.controller';
import { UserAuth } from '../../../../types/auth/user-auth';
import { Role } from '../../../auth/roles/roles';
import { AuthService } from '../../../auth/auth.service';

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

const mockAuthService = {
  signJwt: jest.fn().mockResolvedValue({}),
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
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = app.get<StudentsController>(StudentsController);
    service = app.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a Student', async () => {
      const student = await controller.create(createStudentDto);
      expect(student).toEqual({ id: 1, ...createStudentDto });
      expect(service.createStudent).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('getProfile()', () => {
    it('should throw error if student not found', async () => {
      const user: UserAuth = {
        email: 'notfound',
        role: Role.STUDENT,
        name: 'student one',
        sub: 1,
      };
      try {
        await controller.getProfile({ user });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return student without password', async () => {
      const user = {
        email: createStudentDto.email,
        role: Role.STUDENT,
        name: 'student one',
        sub: 1,
      };
      const profile = await controller.getProfile({ user });
      expect(service.findOne).toHaveBeenCalledWith(user.email);
      expect(profile).toEqual({
        ...createStudentDto,
        email: user.email,
        password: undefined,
      });
    });
  });

  describe('update()', () => {
    it('should call service with correct params', async () => {
      const user = {
        email: createStudentDto.email,
        role: Role.STUDENT,
        name: 'student one',
        sub: 1,
      };

      await controller.update({ user }, createStudentDto);

      expect(service.updateStudent).toHaveBeenCalledWith(
        user.email,
        createStudentDto,
      );
    });
  });
});
