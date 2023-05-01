import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import MainSeeder from './seeds/MainSeeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'meuestagio',
  username: 'postgres',
  host: process.env.PG_HOST,
  password: 'qwerty',
  entities: ['dist/**/*.entity.js'],
  // entities: ['src/**/*.entity.ts'],
  seeds: [MainSeeder],
  // migrations: ['dist/migrations/*.js'],
  synchronize: true,
};

export const dataSource = new DataSource(options);
