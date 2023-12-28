import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthStudentService } from './services/auth-student.service';
import { LocalStudentStrategy } from './strategies/student.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCompanyService } from './services/auth-company.service';
import { LocalCompanyStrategy } from './strategies/company.strategy';
import { AuthAdminService } from './services/auth-admin.service';
import { LocalAdminStrategy } from './strategies/admin.strategy';
import { jwtConstants } from '../../constants/jwt';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '14d' },
    }),
  ],
  providers: [
    AuthService,
    AuthStudentService,
    AuthCompanyService,
    AuthAdminService,
    LocalAdminStrategy,
    LocalStudentStrategy,
    LocalCompanyStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
