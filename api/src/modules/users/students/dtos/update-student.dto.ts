import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  about: string;

  @IsOptional()
  password: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  institutionId: number;

  @IsOptional()
  courseId: number;

  @IsOptional()
  cityId: number;
}
