import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  resumeId: number;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  endDate?: string;

  @IsBoolean()
  currentJob: boolean;
}
