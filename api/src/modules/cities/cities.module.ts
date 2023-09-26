import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './entities/city.entity';
import { Region } from './entities/region.entity';
import { Institution } from '../institutions/entities/institution.entity';
import { CitiesService } from './services/cities.service';
import { CitiesController } from './controllers/cities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, Institution, Region])],
  providers: [CitiesService],
  controllers: [CitiesController],
})
export class CitiesModule {}
