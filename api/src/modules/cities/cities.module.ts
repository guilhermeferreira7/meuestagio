import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './models/city.entity';
import { CitiesService } from './services/city.service';
import { CitiesController } from './controllers/city.controller';
import { Student } from '../users/students/models/student.entity';
import { Institution } from '../institutions/models/institution.entity';
import { InstitutionsService } from '../institutions/services/institution.service';

@Module({
  imports: [TypeOrmModule.forFeature([City, Student, Institution])],
  providers: [CitiesService, InstitutionsService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
