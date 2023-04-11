import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstitutionsService } from './services/institution.service';
import { InstitutionsController } from './controllers/institution.controller';
import { City } from '../cities/models/city.entity';
import { Institution } from './models/institution.entity';
import { CoursesService } from '../courses/services/courses.service';
import { CoursesModule } from '../courses/courses.module';
import { Course } from '../courses/models/course.entity';

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
