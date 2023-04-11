import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { citiesData } from './cities-data';
import { City } from '../../../modules/cities/models/city.entity';

export default class CitySeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(City);
    const cities = await repository.upsert(citiesData, ['name']);

    //logging
    console.log(`Ids generated ${cities.identifiers.length}`);
    citiesData.forEach((city) => {
      console.log(`city: ${city.name}/${city.uf}`);
    });
  }
}
