import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Institution } from '../../../modules/institutions/entities/institution.entity';
import { institutions } from './institutions';

export class InstitutionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const institutionsRepository = dataSource.getRepository(Institution);
    const seed = await institutionsRepository.upsert(institutions, ['name']);

    return seed.identifiers;
  }
}
