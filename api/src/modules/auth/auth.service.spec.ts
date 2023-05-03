import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Role } from '../../utils/roles';
import { UserAuth } from './types/user-auth';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '14d' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'secret_token') },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login()', () => {
    it('should return a JWT token if the credentials are valid', async () => {
      const user: UserAuth = {
        sub: 1,
        email: 'guilherme@gmail.com',
        name: 'Guilherme',
        role: Role.STUDENT,
      };

      expect(await authService.login(user)).toEqual({
        access_token: 'secret_token',
        user,
      });
    });
  });
});
