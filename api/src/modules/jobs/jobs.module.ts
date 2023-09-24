import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsController } from './controllers/jobs.controller';
import { Job } from './entities/job.entity';
import { JobsService } from './services/jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
