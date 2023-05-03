import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesModule } from '../courses/courses.module';

import { City } from '../cities/entities/city.entity';
import { Institution } from './entities/institution.entity';
import { Course } from '../courses/entities/course.entity';

import { InstitutionsService } from './services/institutions.service';
import { CoursesService } from '../courses/services/courses.service';

import { InstitutionsController } from './controllers/institutions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Institution, Course]),
    CoursesModule,
  ],
  providers: [InstitutionsService, CoursesService],
  controllers: [InstitutionsController],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
