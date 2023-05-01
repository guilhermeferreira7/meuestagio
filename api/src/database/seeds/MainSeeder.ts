import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Vacancy } from '../../modules/vacancies/entities/vacancy.entity';
import { Company } from '../../modules/users/companies/company.entity';

import { vacancies } from './data/vacancies';
import { companies } from './data/companies';

export default class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const vacanciesRepository = dataSource.getRepository(Vacancy);
    const companiesRepository = dataSource.getRepository(Company);

    const companiesSeed = await companiesRepository.upsert(companies, [
      'email',
    ]);

    companiesSeed.generatedMaps.forEach((company) => {
      console.log(company);
    });

    const vacanciesSeed = await vacanciesRepository.upsert(
      vacancies.map((vacancy) => {
        return {
          ...vacancy,
          companyId:
            companiesSeed.generatedMaps[
              Math.floor(Math.random() * companies.length)
            ].id,
        };
      }),
      ['title'],
    );

    vacanciesSeed.generatedMaps.forEach((vacancy) => {
      console.log(vacancy);
    });
  }
}
