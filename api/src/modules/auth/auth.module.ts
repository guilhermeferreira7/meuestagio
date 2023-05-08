import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthStudentService } from './auth-student/auth-student.service';
import { LocalStudentStrategy } from './strategies/student.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCompanyService } from './auth-company/auth-company.service';
import { LocalCompanyStrategy } from './strategies/company.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '14d' },
    }),
  ],
  providers: [
    AuthService,
    AuthStudentService,
    AuthCompanyService,
    LocalStudentStrategy,
    LocalCompanyStrategy,
    JwtStrategy,
  ],
  exports: [AuthStudentService, AuthService, AuthCompanyService],
  controllers: [AuthController],
})
export class AuthModule {}
