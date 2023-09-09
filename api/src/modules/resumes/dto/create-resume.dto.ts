import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Education } from '../educations/educations.entity';
import { Experience } from '../entities/experiences.entity';

export class CreateResumeDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  skills: string;

  @IsString()
  @IsNotEmpty()
  languages: string;

  educations: Education[];

  experiences: Experience[];
}
