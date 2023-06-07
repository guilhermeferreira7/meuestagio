import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { City } from '../../../modules/cities/entities/city.entity';
import { cities } from './cities';

export class CitiesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const citiesRepository = dataSource.getRepository(City);
    const seed = await citiesRepository.upsert(cities, ['fullName']);
    return seed.identifiers;
  }
}
