import { Module } from '@nestjs/common';

import { StudentsService } from './students/students.service';
import { CompaniesService } from './companies/companies.service';

import { StudentsController } from './students/students.controller';
import { CompaniesController } from './companies/companies.controller';
import { AdminController } from './admin/admin.controller';
import { ImagesService } from '../images/images.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminService } from './admin/admin.service';
import { ProfessorsController } from './professors/professors.controller';
import { ProfessorsService } from './professors/professors.service';

@Module({
  providers: [
    StudentsService,
    CompaniesService,
    AdminService,
    ImagesService,
    PrismaService,
    ProfessorsService,
  ],
  controllers: [
    StudentsController,
    CompaniesController,
    AdminController,
    ProfessorsController,
  ],
  exports: [StudentsService, CompaniesService, AdminService],
})
export class UsersModule {}
