import { Module } from '@nestjs/common';

import { JobsController } from './controllers/jobs.controller';
import { JobsService } from './services/jobs.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}
