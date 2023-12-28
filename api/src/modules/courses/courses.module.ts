import { Module } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CoursesController } from './courses.controller';

@Module({
  providers: [CoursesService, PrismaService],
  controllers: [CoursesController],
})
export class CoursesModule {}
