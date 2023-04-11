import { Test, TestingModule } from '@nestjs/testing';
import { AuthStudentService } from './auth-student/auth-student.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('Controller', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
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
});
