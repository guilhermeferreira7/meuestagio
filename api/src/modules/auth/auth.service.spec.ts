import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Role } from '../../utils/roles';

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
      const payload = {
        email: 'guilherme@gmail.com',
        sub: '1',
        role: Role.STUDENT,
      };

      expect(await authService.login(payload)).toEqual({
        access_token: 'secret_token',
        user: payload,
      });
    });
  });
  //   describe('login', () => {
  //     it('should return a JWT token if the credentials are valid', async () => {});

  //     it('should throw an error if the credentials are invalid', async () => {});
  //   });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UnauthorizedException } from '@nestjs/common';
// import { JwtStrategy } from './strategies/jwt.strategy';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let jwtStrategy: JwtStrategy;

//   beforeEach(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [
//         JwtModule.register({
//           secret: 'secretKey',
//           signOptions: { expiresIn: '1d' },
//         }),
//         PassportModule,
//       ],
//       providers: [AuthService, JwtStrategy],
//     }).compile();

//     authService = moduleRef.get<AuthService>(AuthService);
//     jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
//   });

//   describe('validateUser', () => {
//     it('should return a user object if the credentials are valid', async () => {
//       const user = { id: 1, username: 'john.doe', password: 'password' };
//       jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

//       const validatedUser = await authService.validateUser('john.doe', 'password');
//       expect(validatedUser).toEqual(user);
//     });

//     it('should throw an error if the username is incorrect', async () => {
//       jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

//       await expect(authService.validateUser('wrongusername', 'password'))
//         .rejects.toThrow(UnauthorizedException);
//     });

//     it('should throw an error if the password is incorrect', async () => {
//       const user = { id: 1, username: 'john.doe', password: 'password' };
//       jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

//       await expect(authService.validateUser('john.doe', 'wrongpassword'))
//         .rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('login', () => {
//     it('should return a JWT token if the credentials are valid', async () => {
//       const user = { id: 1, username: 'john.doe', password: 'password' };
//       jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

//       const token = await authService.login('john.doe', 'password');
//       const decodedToken = jwtStrategy.verify(token);

//       expect(decodedToken.username).toEqual(user.username);
//       expect(decodedToken.sub).toEqual(user.id);
//     });

//     it('should throw an error if the credentials are invalid', async () => {
//       jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

//       await expect(authService.login('wrongusername', 'wrongpassword'))
//         .rejects.toThrow(UnauthorizedException);
//     });
//   });
// });
