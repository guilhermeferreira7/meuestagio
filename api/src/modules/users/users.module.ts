import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';
import { Student } from './students/entities/student.entity';
import { Company } from './companies/entities/company.entity';
import { Resume } from '../resumes/resume/resume.entity';

import { StudentsService } from './students/services/students.service';
import { CompaniesService } from './companies/services/companies.service';

import { StudentsController } from './students/controllers/students.controller';
import { CompaniesController } from './companies/controllers/companies.controller';
import { AdminController } from './admin/admin.controller';
import { ImagesService } from '../images/images.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Company, User, Resume])],
  providers: [StudentsService, CompaniesService, ImagesService],
  controllers: [StudentsController, CompaniesController, AdminController],
  exports: [StudentsService, CompaniesService],
})
export class UsersModule {}
