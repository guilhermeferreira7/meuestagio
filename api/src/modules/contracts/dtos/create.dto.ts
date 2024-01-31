import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty({
    message: 'Lista de atividades é obrigatória',
  })
  activities: string;

  @IsNotEmpty({
    message: 'Data final é obrigatória',
  })
  @IsDate({
    message: 'Data final deve ser uma data válida',
  })
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty({
    message: 'Data de início é obrigatória',
  })
  @IsDate({
    message: 'Data de início deve ser uma data válida',
  })
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty({
    message: 'ID do aluno é obrigatório',
  })
  studentId: number;
}
