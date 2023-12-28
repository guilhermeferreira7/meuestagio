import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './student-create.dto';
import { IsOptional } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  about?: string;

  @IsOptional()
  phone?: string;
}
