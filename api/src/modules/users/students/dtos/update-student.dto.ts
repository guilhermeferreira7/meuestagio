import { IsEmail, IsOptional } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  institutionId: number;

  @IsOptional()
  courseId: number;
}
