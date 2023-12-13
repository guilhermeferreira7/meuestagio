import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInstitutionDto {
  @IsNotEmpty({
    message: 'O nome da instituição é obrigatório',
  })
  name: string;

  @IsNotEmpty({
    message: 'A cidade é obrigatória',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cityId: number;
}
