import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../user/create-user.dto';

export class CreateCompanyDto extends CreateUserDto {
  @IsNotEmpty()
  cnpj: string;
}
