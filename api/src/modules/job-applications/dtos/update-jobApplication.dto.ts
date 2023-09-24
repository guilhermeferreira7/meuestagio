import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobApplicationStatus } from '../entities/status';

export class UpdateJobApplicationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsEnum(JobApplicationStatus)
  status: string;
}
