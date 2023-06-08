import { DataSource } from 'typeorm';
import { Seeder, runSeeder } from 'typeorm-extension';
import { CitiesSeeder } from './cities/CitiesSeeder';
import { InstitutionsSeeder } from './institutions/InstitutionsSeeder';
import { AdminSeeder } from './admin/AdminSeeder';

export default class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    // const cities = (await runSeeder(dataSource, CitiesSeeder)) as any;
    // console.log(`${cities.length} cidades geradas `);
    // console.log('\t', cities);
    // const institutions = (await runSeeder(
    //   dataSource,
    //   InstitutionsSeeder,
    // )) as any;
    // console.log(`${institutions.length} instituições geradas `);
    // console.log('\t', institutions);
    await runSeeder(dataSource, AdminSeeder);
  }
}
