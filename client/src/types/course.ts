import { Area } from "@customTypes/area";
import { Institution } from "@customTypes/institution";

export type Course = {
  id: number;
  institution: Institution;
  institutionId: number;
  area: Area;
  areaId: number;
  name: string;
};
