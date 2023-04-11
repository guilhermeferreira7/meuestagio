import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student } from './students/models/student.entity';
import { Course } from '../courses/models/course.entity';
import { Institution } from '../institutions/models/institution.entity';
import { City } from '../cities/models/city.entity';
import { StudentsController } from './students/controllers/student.controller';
import { StudentsService } from './students/services/student.service';
import { StudentValidator } from './students/services/student-validator.service';

@Module({
  imports: [TypeOrmModule.forFeature([City, Student, Institution, Course])],
  providers: [StudentsService, StudentValidator],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class UsersModule {}
