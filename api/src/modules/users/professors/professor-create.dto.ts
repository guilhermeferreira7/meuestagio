import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateProfessorDto {
  @Length(3, undefined, {
    message: 'O nome precisa ter pelo menos 3 caracteres',
  })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @Length(6, undefined, {
    message: 'A senha precisa no mínimo 6 caracteres',
  })
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  courseId: number;
}
