import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    AuthModule,
    CitiesModule,
    InstitutionsModule,
    CoursesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // type: 'postgres',
      // host: process.env.PG_HOST,
      // port: parseInt(process.env.DB_PORT),
      // username: 'postgres',
      // password: 'qwerty',
      // database: process.env.DB_NAME,
      // autoLoadEntities: true,
      // synchronize: true,
    }),
  ],
})
export class AppModule {}
