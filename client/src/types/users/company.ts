export type Company = {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  cityId: number;
  city: {
    id: number;
    name: string;
    regionId: string;
    region: {
      id: string;
      name: string;
    };
    state: string;
  };
};
