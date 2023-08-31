import { IsNotEmpty } from 'class-validator';
import { JobApplicationStatus } from '../entities/status';

export class CreateJobApplicationDto {
  @IsNotEmpty()
  jobId: number;

  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  resumeId: number;
}
