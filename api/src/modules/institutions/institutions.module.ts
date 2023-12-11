import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Institution } from './entities/institution.entity';

import { InstitutionsService } from './services/institutions.service';

import { InstitutionsController } from './controllers/institutions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Institution])],
  providers: [InstitutionsService],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
