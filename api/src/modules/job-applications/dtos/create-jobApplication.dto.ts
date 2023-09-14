import { IsNotEmpty } from 'class-validator';

export class CreateJobApplicationDto {
  @IsNotEmpty()
  jobId: number;

  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  resumeId: number;
}
