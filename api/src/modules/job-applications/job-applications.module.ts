import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobApplication } from './entities/job-applications.entity';
import { JobApplicationsService } from './services/job-applications.service';
import { JobApplicationsController } from './controllers/job-applications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication])],
  providers: [JobApplicationsService],
  controllers: [JobApplicationsController],
})
export class JobApplicationModule {}
