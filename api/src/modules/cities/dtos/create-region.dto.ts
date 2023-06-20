import { IsNotEmpty } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  IBGECode: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  state: string;
}
