import { IsNotEmpty } from 'class-validator';
import { JobApplicationStatus } from '../entities/status';

export class CreateJobApplicationDto {
  @IsNotEmpty()
  vacancyId: number;

  @IsNotEmpty()
  studentId: number;
}
