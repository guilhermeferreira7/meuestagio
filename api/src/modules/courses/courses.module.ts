import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { Institution } from '../institutions/models/institution.entity';
import { Course } from './models/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
