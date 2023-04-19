import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import MainSeeder from './seeds/MainSeeder';
import { Vacancy } from '../modules/vacancies/entities/vacancy.entity';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'meuestagio',
  username: 'postgres',
  host: process.env.PG_HOST,
  password: 'qwerty',
  entities: [Vacancy],
  seeds: [MainSeeder],
  synchronize: true,
};

export const dataSource = new DataSource(options);
