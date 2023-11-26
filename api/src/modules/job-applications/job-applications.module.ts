import { Module } from '@nestjs/common';

import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsController } from './job-applications.controller';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  providers: [JobApplicationsService, PrismaService],
  controllers: [JobApplicationsController],
})
export class JobApplicationModule {}
