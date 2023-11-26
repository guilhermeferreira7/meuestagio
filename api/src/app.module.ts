import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AreasModule } from './modules/areas/areas.module';
import { JobApplicationModule } from './modules/job-applications/job-applications.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { ImagesModule } from './modules/images/images.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
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
