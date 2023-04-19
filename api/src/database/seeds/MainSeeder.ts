import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Vacancy } from '../../modules/vacancies/entities/vacancy.entity';
import { vacancies } from './data/vacancies';

export default class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const vacanciesRepository = dataSource.getRepository(Vacancy);
    const vacanciesSeed = await vacanciesRepository.upsert(vacancies, ['name']);

    vacanciesSeed.generatedMaps.forEach((vacancy) => {
      console.log(vacancy);
    });
  }
}
