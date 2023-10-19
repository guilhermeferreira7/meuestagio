import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { AreasModule } from '../src/modules/areas/areas.module';
import { CitiesModule } from '../src/modules/cities/cities.module';
import { InstitutionsModule } from '../src/modules/institutions/institutions.module';
import { CoursesModule } from '../src/modules/courses/courses.module';
import { ImagesModule } from '../src/modules/images/images.module';
import { ResumesModule } from '../src/modules/resumes/resumes.module';
import { JobApplicationModule } from '../src/modules/job-applications/job-applications.module';
import { JobsModule } from '../src/modules/jobs/jobs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: 'meuestagiotest',
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
})
export class TestModule {}
