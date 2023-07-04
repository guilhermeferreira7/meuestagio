import { Area } from "./area";

export type Vacancy = {
  id: number;
  title: string;
  description: string;
  salary: number;
  remote: boolean;
  keywords: string;
  areaId: number;
  companyId: number;
  cityId: number;
  city: {
    name: string;
  };
  regionId: string;
  state: string;
  company: {
    id: number;
    name: string;
  };
  area: Area;
};
