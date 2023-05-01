import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { VacanciesModule } from './modules/vacancies/vacancies.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      synchronize: true,
      autoLoadEntities: true,
    }),
    CitiesModule,
    InstitutionsModule,
    CoursesModule,
    VacanciesModule,
  ],
})
export class AppModule {}
