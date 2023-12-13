import { Area } from "./area";
import { Company } from "./users/company";

export type Job = {
  id: number;
  title: string;
  description: string;
  salary: string;
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
  company: Company;
  area: Area;
  status: JobStatus;
};

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}
