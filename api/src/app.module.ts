import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ConfigModule } from '@nestjs/config';

const localModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: 'postgres',
  password: 'qwerty',
  database: process.env.DB_NAME,
  synchronize: true,
  autoLoadEntities: true,
});

const dockerModule = TypeOrmModule.forRoot({
  type: process.env.DB_TYPE as any,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  synchronize: true,
  autoLoadEntities: true,
});

@Module({
  imports: [
    AuthModule,
    CitiesModule,
    InstitutionsModule,
    CoursesModule,
    ConfigModule.forRoot(),
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
  ],
})
export class AppModule {}
