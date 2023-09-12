import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Language } from '../languages/language.entity';
import { Experience } from '../experiences/experiences.entity';
import { Education } from '../educations/educations.entity';
import { Skill } from '../skills/skill.entity';

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

  languages?: Language[];
}
