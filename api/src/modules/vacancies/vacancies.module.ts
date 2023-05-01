import { Module } from '@nestjs/common';
import { VacanciesService } from './services/vacancies.service';
import { VacanciesController } from './controllers/vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  controllers: [VacanciesController],
  providers: [VacanciesService],
})
export class VacanciesModule {}
