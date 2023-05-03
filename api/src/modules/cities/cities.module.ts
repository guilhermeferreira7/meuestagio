import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './entities/city.entity';
import { Student } from '../users/students/entities/student.entity';
import { Institution } from '../institutions/entities/institution.entity';

import { CitiesService } from './services/cities.service';
import { InstitutionsService } from '../institutions/services/institutions.service';

import { CitiesController } from './controllers/cities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, Student, Institution])],
  providers: [CitiesService, InstitutionsService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
