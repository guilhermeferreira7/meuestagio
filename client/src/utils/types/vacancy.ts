import { Area } from "./area";

export type Vacancy = {
  id: number;
  title: string;
  description: string;
  salary: number;
  remote: boolean;
  keyWords: string;
  areaId: number;
  companyId: number;
  cityId: number;
  regionId: string;
  state: string;
  company: {
    id: number;
    name: string;
  };
  area: Area;
};
