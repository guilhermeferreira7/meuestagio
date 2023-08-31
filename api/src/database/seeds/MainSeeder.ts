import { DataSource } from 'typeorm';
import { Seeder, runSeeder } from 'typeorm-extension';
import { AdminSeeder } from './admin/AdminSeeder';
import { AreasSeeder } from './areas/AreasSeeder';

export default class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, AdminSeeder);
    await runSeeder(dataSource, AreasSeeder);
  }
}
