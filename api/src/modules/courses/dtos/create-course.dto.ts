import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  institutionId: number;

  @IsNotEmpty()
  areaId: number;
}
