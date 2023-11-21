import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateUserDto } from '../user/create-user.dto';
import { Transform } from 'class-transformer';

export class CreateStudentDto extends CreateUserDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  institutionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  courseId: number;
}
