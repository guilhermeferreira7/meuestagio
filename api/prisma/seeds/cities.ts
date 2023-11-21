import axios from 'axios';

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

const getRegion = () => {
  console.log('Criando região...');
  return {
    IBGECode: 41029,
    name: 'Guarapuava',
    state: 'Paraná',
  };
};

export const region = getRegion();

export const getCities = async (regionIBGECode: number) => {
  const cities = await axios.get(
    `http://servicodados.ibge.gov.br/api/v1/localidades/microrregioes/${regionIBGECode}/municipios`,
  );
  console.log(`Criando ${cities.data.length} cidades...`);

  return cities.data;
};
