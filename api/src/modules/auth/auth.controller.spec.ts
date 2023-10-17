import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStudentService } from './auth-student/auth-student.service';
import { Role } from './roles/roles';

const mockAuthService = {
  signJwt: jest.fn().mockResolvedValue({}),
};

describe('Controller', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        { provide: JwtService, useValue: {} },
        {
          provide: AuthStudentService,
          useValue: {
            validadeUser: jest.fn().mockResolvedValue({
              email: 'email@example.com',
              pass: '123123',
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('loginStudent()', () => {
    it('should return a token', async () => {
      const token = await authController.loginStudent({
        user: {
          email: 'student@email.com',
          name: 'student one',
          role: Role.STUDENT,
          sub: 1,
        },
      });

      expect(token).toBeDefined();
    });
  });

  describe('loginCompany()', () => {
    it('should return a token', async () => {
      const token = await authController.loginCompany({
        user: {
          email: 'company@email.com',
          name: 'company one',
          role: Role.COMPANY,
          sub: 1,
        },
      });
      expect(token).toBeDefined();
    });
  });

  describe('loginAdmin()', () => {
    it('should return a token', async () => {
      const token = await authController.loginAdmin({
        user: {
          email: 'admin@email.com',
          name: 'admin one',
          role: Role.ADMIN,
          sub: 1,
        },
      });
      expect(token).toBeDefined();
    });
  });
});
