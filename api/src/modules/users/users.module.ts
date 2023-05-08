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

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Student, Company, Institution, Course]),
  ],
  providers: [StudentsService, StudentValidator],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class UsersModule {}
