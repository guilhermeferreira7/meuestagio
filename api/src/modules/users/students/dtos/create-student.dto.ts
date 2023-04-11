import { IsNotEmpty } from 'class-validator';

import { CreateUserDto } from '../../user/create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsNotEmpty()
  institutionId: number;

  @IsNotEmpty()
  courseId: number;
}
