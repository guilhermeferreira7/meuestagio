import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { CreateStudentDto } from './student-create.dto';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { AuthService } from '../../auth/auth.service';
import { ReqAuth } from '../../../types/auth/request';
import { StudentWithAllRelations } from '../../../types/prisma/student';
import { UpdateStudentDto } from './student-update.dto';
import { Role } from '../../auth/roles/roles';

const createStudentDto: CreateStudentDto = {
  name: 'student one',
  email: 'email@example.com',
  password: 'changeme',
  institutionId: 1,
  courseId: 1,
  cityId: 1,
};

const oneStudent = {} as StudentWithAllRelations;

const mockService = {
  updateStudent: jest.fn(() => {
    return Promise.resolve(oneStudent);
  }),
  findOne: jest.fn(() => {
    return Promise.resolve(oneStudent);
  }),
};

const mockAuthService = {
  signJwt: jest.fn().mockResolvedValue({}),
};

describe('StudentController', () => {
  let controller: StudentsController;
  let service: StudentsService;
  let authService: AuthService;

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
    authService = app.get<AuthService>(AuthService);
  });

  describe('getProfile()', () => {
    it('should throw error if student not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      expect(
        controller.getProfile({ user: { email: 'test@email.com' } } as ReqAuth),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return student without password', async () => {
      expect(
        controller.getProfile({
          user: { email: createStudentDto.email },
        } as ReqAuth),
      ).not.toHaveProperty('password');
    });
  });

  describe('update()', () => {
    it('should sign new jwt', async () => {
      const dto: UpdateStudentDto = {
        name: 'new name',
        email: 'new@email.com',
      };

      jest.spyOn(service, 'updateStudent').mockResolvedValueOnce({
        id: 1,
        email: dto.email,
        name: dto.name,
      } as StudentWithAllRelations);

      await controller.update(
        { user: { email: dto.email, role: Role.STUDENT, sub: 1 } } as ReqAuth,
        dto,
      );

      expect(authService.signJwt).toBeCalledWith({
        sub: 1,
        role: Role.STUDENT,
        email: dto.email,
        name: dto.name,
      });
    });

    it('should return student without password', async () => {
      await service.updateStudent(createStudentDto.email, {
        password: 'newpassword',
      });

      expect(
        controller.update(
          {
            user: { email: createStudentDto.email },
          } as ReqAuth,
          {
            password: 'newpassword',
          },
        ),
      ).not.toHaveProperty('password');
    });
  });
});
