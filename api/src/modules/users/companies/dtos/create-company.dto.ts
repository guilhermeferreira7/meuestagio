import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../user/create-user.dto';
import { IsCNPJ } from './isCNPJ';

export class CreateCompanyDto extends CreateUserDto {
  @IsNotEmpty()
  // just for test
  // @IsCNPJ('cnpj', {
  //   message: 'CNPJ inválido',
  // })
  cnpj: string;
}
