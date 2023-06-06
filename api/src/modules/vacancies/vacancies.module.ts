import { Module } from '@nestjs/common';
import { VacanciesService } from './services/vacancies.service';
import { VacanciesController } from './controllers/vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { City } from '../cities/entities/city.entity';
import { CompaniesService } from '../users/companies/services/companies.service';
import { Company } from '../users/companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, City, Company])],
  controllers: [VacanciesController],
  providers: [VacanciesService, CompaniesService],
})
export class VacanciesModule {}
