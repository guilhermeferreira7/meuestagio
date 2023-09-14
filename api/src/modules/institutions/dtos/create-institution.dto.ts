import { IsNotEmpty } from 'class-validator';

export class CreateInstitutionDto {
  @IsNotEmpty({
    message: 'O nome da instituição é obrigatório',
  })
  name: string;

  @IsNotEmpty({
    message: 'A cidade é obrigatória',
  })
  cityId: number;
}
