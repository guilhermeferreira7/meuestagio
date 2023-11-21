import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';
import { Company } from './companies/entities/company.entity';

import { StudentsService } from './students/students.service';
import { CompaniesService } from './companies/services/companies.service';

import { StudentsController } from './students/students.controller';
import { CompaniesController } from './companies/controllers/companies.controller';
import { AdminController } from './admin/admin.controller';
import { ImagesService } from '../images/images.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  providers: [
    StudentsService,
    CompaniesService,
    AdminService,
    ImagesService,
    PrismaService,
  ],
  controllers: [StudentsController, CompaniesController, AdminController],
  exports: [StudentsService, CompaniesService, AdminService],
})
export class UsersModule {}
