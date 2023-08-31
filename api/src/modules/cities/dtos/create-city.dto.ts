import { IsNotEmpty } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  regionId: number;

  @IsNotEmpty()
  IBGECityCode: number;
}
