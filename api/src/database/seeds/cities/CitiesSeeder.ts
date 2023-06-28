import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { City } from '../../../modules/cities/entities/city.entity';
import { cities } from './cities';
import { Region } from '../../../modules/cities/entities/region.entity';
import axios from 'axios';

export class CitiesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const regionsRepository = dataSource.getRepository(Region);
    const citiesRepository = dataSource.getRepository(City);
    const regionsApi = await axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/microrregioes',
    );
    const regions = [];
    for (let i = 0; i < 4; i++) {
      const randNum = Math.floor(Math.random() * 500);
      regions.push({
        IBGECode: regionsApi.data[randNum].id,
        name: regionsApi.data[randNum].nome,
        state: regionsApi.data[randNum].mesorregiao.UF.nome,
      });
    }

    const regionsUpsert = await regionsRepository.upsert(regions, ['IBGECode']);
    return regionsUpsert.identifiers;
  }
}
