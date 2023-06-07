import { IsNotEmpty } from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  salary: number;

  @IsNotEmpty()
  cityId: number;

  @IsNotEmpty()
  remote: boolean;

  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  requirements: string;

  @IsNotEmpty()
  desirableRequirements: string;

  @IsNotEmpty()
  activities: string;

  @IsNotEmpty()
  keyWords: string;

  @IsNotEmpty()
  areaId: number;
}
