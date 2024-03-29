import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  endDate: Date;
}
