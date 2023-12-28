import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional } from 'class-validator';

export class UpdateCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['cnpj'] as const),
) {
  @IsOptional()
  phone?: string;
}
