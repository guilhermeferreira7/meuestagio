import axios from 'axios';

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
  const cities = [
    {
      IBGECityCode: 4103958,
      name: 'Campina do Simão',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4104428,
      name: 'Candói',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4104451,
      name: 'Cantagalo',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4107546,
      name: 'Espigão Alto do Iguaçu',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4108452,
      name: 'Foz do Jordão',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4108650,
      name: 'Goioxim',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4109401,
      name: 'Guarapuava',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4110201,
      name: 'Inácio Martins',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4113304,
      name: 'Laranjeiras do Sul',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4115457,
      name: 'Marquinho',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4117057,
      name: 'Nova Laranjeiras',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4119301,
      name: 'Pinhão',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4120150,
      name: 'Porto Barreiro',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4120903,
      name: 'Quedas do Iguaçu',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4121752,
      name: 'Reserva do Iguaçu',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4122156,
      name: 'Rio Bonito do Iguaçu',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4127965,
      name: 'Turvo',
      state: 'Paraná',
    },
    {
      IBGECityCode: 4128658,
      name: 'Virmond',
      state: 'Paraná',
    },
  ];
  console.log(`Criando ${cities.length} cidades...`);

  return cities;
};
