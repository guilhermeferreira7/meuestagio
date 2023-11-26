import { JobApplicationStatusEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateJobApplicationDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsEnum(JobApplicationStatusEnum)
  status: string;
}
