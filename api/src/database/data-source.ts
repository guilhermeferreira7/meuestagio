import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { Institution } from '../modules/institutions/models/institution.entity';
import { City } from '../modules/cities/models/city.entity';
import MainSeeder from './seeds/MainSeeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'meuestagio',
  username: 'postgres',
  password: 'qwerty',
  entities: [City, Institution],
  seeds: [MainSeeder],
};

export const dataSource = new DataSource(options);
