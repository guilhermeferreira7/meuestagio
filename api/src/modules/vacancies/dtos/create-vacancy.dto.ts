import { IsNotEmpty } from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  salary: number;

  @IsNotEmpty()
  cityId: number;

  @IsNotEmpty()
  remote: boolean;

  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  keyWords: string;

  @IsNotEmpty()
  areaId: number;
}
