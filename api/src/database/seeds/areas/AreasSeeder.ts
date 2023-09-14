import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Area } from '../../../modules/areas/entities/area.entity';
import axios from 'axios';

export class AreasSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const areasRepository = dataSource.getRepository(Area);

    const knowledgeAreas = await axios.get(
      'https://dados.iffarroupilha.edu.br/api/v1/areas-curso-cnpq.json',
    );
    const knowledgeAreasFilter = knowledgeAreas.data.data
      .filter((area: any) => {
        return (
          area.id_area_conhecimento_cnpq.toString().substring(3, 7) === '0000'
        );
      })
      .sort((a: any, b: any) => {
        const areaA = a.nome.toUpperCase();
        const areaB = b.nome.toUpperCase();
        return areaA > areaB ? 1 : -1;
      })
      .map((area: any) => {
        return {
          cnpqId: area.id_area_conhecimento_cnpq,
          title: area.nome,
        };
      });

    console.log('Gerando áreas de conhecimento...');

    try {
      await areasRepository.upsert(knowledgeAreasFilter, ['cnpqId']);
    } catch (error) {
      console.log(error);
    }
  }
}
