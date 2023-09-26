import { Area } from "./area";

export type Job = {
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
  status: JobStatus;
};

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}
