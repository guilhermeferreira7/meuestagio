import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  institutionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  areaId: number;
}
