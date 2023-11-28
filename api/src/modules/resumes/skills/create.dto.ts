import { SkillLevelEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(SkillLevelEnum)
  level: SkillLevelEnum;
}
