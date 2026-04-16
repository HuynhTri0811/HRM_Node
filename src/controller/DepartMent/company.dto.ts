import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, Min, MinLength, IsIn, IsUrl } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Mã công ty', example: 'COMP001' })
  @IsNotEmpty({ message: 'Mã công ty là bắt buộc' })
  @IsString({ message: 'Mã công ty phải là chuỗi' })
  Code_Department!: string;

  @ApiProperty({ description: 'Tên công ty', example: 'Công ty ABC' })
  @IsNotEmpty({ message: 'Tên công ty là bắt buộc' })
  @IsString({ message: 'Tên công ty phải là chuỗi' })
  Name_Department!: string;

  @ApiPropertyOptional({ description: 'ID công ty cha', example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'ID công ty cha phải là số' })
  Code_Department_Parent?: number;

  @ApiPropertyOptional({ description: 'Địa chỉ công ty', example: '123 Đường Nguyễn Huệ, TP.HCM' })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại công ty', example: '+84-123-456-7890' })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email công ty', example: 'contact@company.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({ description: 'Website công ty', example: 'https://company.com' })
  @IsOptional()
  @IsUrl({}, { message: 'Website không hợp lệ' })
  website?: string;

  @ApiPropertyOptional({ description: 'Mã số thuế', example: 'TAX123456789' })
  @IsOptional()
  @IsString({ message: 'Mã số thuế phải là chuỗi' })
  taxId?: string;
}
