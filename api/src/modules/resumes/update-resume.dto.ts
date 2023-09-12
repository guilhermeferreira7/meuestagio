import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Education } from './educations/educations.entity';
import { Skill } from './skills/skill.entity';
import { Language } from './entities/language.entity';
import { Project } from './entities/project.entity';
import { Experience } from './experiences/experiences.entity';

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

  skills?: Skill[];

  educations?: Education[];

  experiences?: Experience[];

  projects?: Project[];

  languages?: Language[];
}
