import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cityId: number;

  @IsOptional()
  imageUrl?: string;
}
