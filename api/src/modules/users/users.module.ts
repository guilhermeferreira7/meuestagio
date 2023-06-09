import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student } from './students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { Institution } from '../institutions/entities/institution.entity';
import { City } from '../cities/entities/city.entity';
import { Company } from './companies/entities/company.entity';

import { StudentsService } from './students/services/students.service';
import { StudentValidator } from './students/services/students-validator.service';

import { StudentsController } from './students/controllers/students.controller';
import { CompaniesService } from './companies/services/companies.service';
import { CompaniesController } from './companies/controllers/companies.controller';
import { AdminController } from './admin/controllers/admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Student, Company, Institution, Course]),
  ],
  providers: [StudentsService, CompaniesService, StudentValidator],
  controllers: [StudentsController, CompaniesController, AdminController],
  exports: [StudentsService, CompaniesService],
})
export class UsersModule {}
