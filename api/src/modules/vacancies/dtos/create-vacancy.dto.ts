import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  salary: number;

  @IsNotEmpty()
  cityId: number;

  @IsNotEmpty()
  regionId: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  remote: boolean;

  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  keyWords: string;

  @IsNotEmpty()
  areaId: number;
}
