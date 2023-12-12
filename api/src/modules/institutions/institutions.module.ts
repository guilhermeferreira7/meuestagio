import { Module } from '@nestjs/common';

import { InstitutionsService } from './institutions.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { InstitutionsController } from './institutions.controller';

@Module({
  providers: [InstitutionsService, PrismaService],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
