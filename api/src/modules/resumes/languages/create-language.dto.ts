import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LanguageLevel } from './language.entity';

export class CreateLanguageDto {
  @IsNotEmpty()
  resumeId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(LanguageLevel)
  level: string;
}
