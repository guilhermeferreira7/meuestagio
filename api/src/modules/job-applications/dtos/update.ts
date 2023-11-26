import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobApplicationDto {
  @IsNotEmpty()
  jobId: number;

  @IsOptional()
  message?: string;

  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  resumeId: number;
}
