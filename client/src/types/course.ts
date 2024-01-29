import { Area } from "types/area";
import { Institution } from "types/institution";

export type Course = {
  id: number;
  institution: Institution;
  institutionId: number;
  area: Area;
  areaId: number;
  name: string;
};
