import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Education } from '../entities/education.entity';
import { Experience } from '../entities/experiences.entity';
import { Skill } from '../entities/skill.entity';
import { Language } from '../entities/language.entity';
import { Project } from '../entities/project.entity';

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

  skills: Skill[];

  educations: Education[];

  experiences: Experience[];

  projects: Project[];

  languages: Language[];
}
