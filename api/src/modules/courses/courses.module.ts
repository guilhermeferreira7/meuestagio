import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { Institution } from '../institutions/entities/institution.entity';

import { CoursesService } from './services/courses.service';

import { CoursesController } from './controllers/courses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
