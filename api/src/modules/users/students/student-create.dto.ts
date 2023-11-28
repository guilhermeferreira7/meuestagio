import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStudentDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cityId: number;

  @IsOptional()
  imageUrl?: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  institutionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  courseId: number;
}
