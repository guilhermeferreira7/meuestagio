import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  IBGECode: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  state: string;
}
