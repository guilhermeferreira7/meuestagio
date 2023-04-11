import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthStudentService } from './auth-student/auth-student.service';
import { LocalStudentStrategy } from './strategies/student.strategy';
import { AuthService } from './auth.service';
import config from '../../../config/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config().jwtSecret,
      signOptions: { expiresIn: '14d' },
    }),
  ],
  providers: [
    AuthService,
    AuthStudentService,
    LocalStudentStrategy,
    JwtStrategy,
  ],
  exports: [AuthStudentService, AuthService],
})
export class AuthModule {}
