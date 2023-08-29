import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Education } from '../entities/education.entity';
import { Experience } from '../entities/experiences.entity';
import { Skill } from '../entities/skill.entity';

export class UpdateResumeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  languages: string;

  skills: Skill[];

  educations: Education[];

  experiences: Experience[];
}
