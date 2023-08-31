import { Module } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { JobsController } from './controllers/jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { City } from '../cities/entities/city.entity';
import { CompaniesService } from '../users/companies/services/companies.service';
import { Company } from '../users/companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, City, Company])],
  controllers: [JobsController],
  providers: [JobsService, CompaniesService],
})
export class JobsModule {}
