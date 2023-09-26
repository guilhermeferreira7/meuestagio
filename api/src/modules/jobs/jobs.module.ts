import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsController } from './controllers/jobs.controller';
import { Job } from './entities/job.entity';
import { JobsService } from './services/jobs.service';
import { JobApplicationsService } from '../job-applications/services/job-applications.service';
import { JobApplication } from '../job-applications/entities/job-applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobApplication])],
  controllers: [JobsController],
  providers: [JobsService, JobApplicationsService],
})
export class JobsModule {}
