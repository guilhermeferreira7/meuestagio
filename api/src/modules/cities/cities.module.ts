import { Module } from '@nestjs/common';

import { CitiesService } from './cities.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegionsService } from './regions.service';
import { CitiesController } from './cities.controller';

@Module({
  providers: [CitiesService, RegionsService, PrismaService],
  controllers: [CitiesController],
})
export class CitiesModule {}
