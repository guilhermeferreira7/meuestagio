import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsNumber()
  resumeId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  level: string;
}
