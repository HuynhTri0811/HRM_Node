import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, Min, MinLength, IsIn } from 'class-validator';
import { Column } from 'typeorm';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Mã phòng ban là bắt buộc' })
  @IsString({ message: 'Mã phòng ban phải là chuỗi' })
  Code_Department!: string;

  @IsNotEmpty({ message: 'Tên phòng ban là bắt buộc' })
  @IsString({ message: 'Tên phòng ban phải là chuỗi' })
  Name_Department!: string;

  @IsNumber({},{ message: 'Mã phòng ban phải là số' })
  Code_Department_Parent!: number;
}

export class UpdateDepartmentDto {
  @IsNotEmpty({ message: 'Mã phòng ban là bắt buộc' })
  @IsString({ message: 'Mã phòng ban phải là chuỗi' })
  Code_Department!: string;

  @IsNotEmpty({ message: 'Tên phòng ban là bắt buộc' })
  @IsString({ message: 'Tên phòng ban phải là chuỗi' })
  Name_Department!: string;

  @IsNumber({},{ message: 'Mã phòng ban phải là số' })
  Code_Department_Parent!: number;
}