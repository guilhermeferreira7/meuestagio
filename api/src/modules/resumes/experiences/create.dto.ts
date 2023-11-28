import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  description: string;

  @IsBoolean()
  currentJob: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
