import axios from 'axios';
import { prisma } from '../prisma';

const GET_CITY_URL =
  'http://servicodados.ibge.gov.br/api/v1/localidades/municipios/guarapuava';

export type CityIBGE = {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        nome: string;
      };
    };
  };
};

export const createRegion = async () => {
  console.log('Gerando região...');
  const region = (await axios.get(GET_CITY_URL)).data.microrregiao;

  prisma.region.upsert({
    create: {
      IBGECode: region.id,
      name: region.nome,
      state: region.mesorregiao.UF.nome,
    },
    update: {},
    where: {
      IBGECode: region.id,
    },
  });

  return await prisma.region.findFirst({ where: { IBGECode: region.id } });
};

export const getCities = async (regionIBGECode: number) => {
  console.log('Gerando cidades...');
  const cities = await axios.get(
    `http://servicodados.ibge.gov.br/api/v1/localidades/microrregioes/${regionIBGECode}/municipios`,
  );

  return cities.data;
};
