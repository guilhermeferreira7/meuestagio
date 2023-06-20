import { Area } from "./area";

export type Vacancy = {
  id: number;
  title: string;
  description: string;
  salary: number;
  remote: boolean;
  requirements: string;
  desirableRequirements: string;
  activities: string;
  keyWords: string;
  areaId: number;
  companyId: number;
  cityId: number;
  company: {
    id: number;
    name: string;
  };
  area: Area;
};
