import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  salary: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cityId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  regionId: number;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  remote: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  companyId: number;

  @IsNotEmpty()
  keywords: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  areaId: number;
}
