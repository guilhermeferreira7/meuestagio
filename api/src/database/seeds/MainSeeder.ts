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
    const companiesRepository = dataSource.getRepository(Company);
    const vacanciesRepository = dataSource.getRepository(Vacancy);

    const companiesSeed = await companiesRepository.upsert(
      companies.map((company) => {
        console.log('Gerando empresa: ', company);
        return { ...company };
      }),
      ['email'],
    );
    console.log(
      'Sucesso! Empresas geradas: ',
      companiesSeed.generatedMaps.length,
    );

    const vacanciesSeed = await vacanciesRepository.upsert(
      vacancies.map((vacancy) => {
        console.log('Gerando vaga: ', vacancy);

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
    console.log('Sucesso! Vagas geradas: ', vacanciesSeed.generatedMaps.length);
  }
}
