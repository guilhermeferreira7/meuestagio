import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  regionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  IBGECityCode: number;
}
