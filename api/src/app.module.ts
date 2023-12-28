import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AreasModule } from './modules/areas/areas.module';
import { JobApplicationModule } from './modules/job-applications/job-applications.module';
import { ImagesModule } from './modules/images/images.module';
import { AppController } from './app.controller';
import { ResumesModule } from './modules/resumes/resumes.module';

@Module({
  imports: [
    AuthModule,
    AreasModule,
    CitiesModule,
    InstitutionsModule,
    CoursesModule,
    JobsModule,
    JobApplicationModule,
    ResumesModule,
    ImagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
