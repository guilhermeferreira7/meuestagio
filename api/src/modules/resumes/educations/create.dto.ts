import { EducationDegreeEnum } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  school: string;

  @IsEnum(EducationDegreeEnum)
  degree: EducationDegreeEnum;

  @IsString()
  fieldOfStudy: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
