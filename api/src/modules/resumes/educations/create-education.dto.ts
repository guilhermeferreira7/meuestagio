import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Degree } from './educations.entity';

export class CreateEducationDto {
  @IsString()
  school: string;

  @IsEnum(Degree)
  degree: Degree;

  @IsString()
  fieldOfStudy: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsNumber()
  resumeId: number;
}
