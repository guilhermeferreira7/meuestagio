import { Module } from '@nestjs/common';

import { CoursesService } from './services/courses.service';
import { CoursesController } from './controllers/courses.controller';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
