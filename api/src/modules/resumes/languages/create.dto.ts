import { LanguageLevelEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(LanguageLevelEnum)
  level: LanguageLevelEnum;
}
