import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from '../admin/create-user.dto';
import { Transform } from 'class-transformer';

export class CreateCompanyDto extends CreateUserDto {
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

  @IsNotEmpty()
  cnpj: string;
}
