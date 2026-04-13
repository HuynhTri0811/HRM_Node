import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, Min, MinLength, IsIn } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Họ tên là bắt buộc' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  hoTen!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'nguyenvana@example.com'
  })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @ApiProperty({
    description: 'Password',
    example: 'P@ssw0rd123',
    writeOnly: true,
  })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password!: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '0123456789'
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  soDienThoai?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Đường ABC, Quận 1, TP.HCM'
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  diaChi?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  ngaySinh?: string;

  @ApiPropertyOptional({
    description: 'Position/Job title',
    example: 'Nhân viên kinh doanh'
  })
  @IsOptional()
  @IsString({ message: 'Chức vụ phải là chuỗi' })
  chucVu?: string;

  @ApiPropertyOptional({
    description: 'Department ID',
    example: 1
  })
  @IsOptional()
  @IsNumber({}, { message: 'Phòng ban phải là số' })
  phongBan?: number;

  @ApiPropertyOptional({
    description: 'Hire date',
    example: '2023-01-15'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày vào làm không hợp lệ' })
  ngayVaoLam?: string;

  @ApiPropertyOptional({
    description: 'Resignation date',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày nghỉ việc không hợp lệ' })
  ngayNghiViec?: string;

  @ApiPropertyOptional({
    description: 'Basic salary',
    example: 15000000
  })
  @IsOptional()
  @IsNumber({}, { message: 'Lương cơ bản phải là số' })
  @Min(0, { message: 'Lương cơ bản không được âm' })
  luongCoBan?: number;

  @ApiPropertyOptional({
    description: 'Status',
    example: 'active',
    enum: ['active', 'inactive', 'terminated']
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'terminated'], { message: 'Trạng thái không hợp lệ' })
  trangThai?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional({
    description: 'Full name of the personnel',
    example: 'Nguyễn Văn A'
  })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  hoTen?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'nguyenvana@example.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Password',
    example: 'NewP@ssw0rd123',
    writeOnly: true,
  })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '0123456789'
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  soDienThoai?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Đường ABC, Quận 1, TP.HCM'
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  diaChi?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  ngaySinh?: string;

  @ApiPropertyOptional({
    description: 'Position/Job title',
    example: 'Nhân viên kinh doanh'
  })
  @IsOptional()
  @IsString({ message: 'Chức vụ phải là chuỗi' })
  chucVu?: string;

  @ApiPropertyOptional({
    description: 'Department ID',
    example: 1
  })
  @IsOptional()
  @IsNumber({}, { message: 'Phòng ban phải là số' })
  phongBan?: number;

  @ApiPropertyOptional({
    description: 'Hire date',
    example: '2023-01-15'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày vào làm không hợp lệ' })
  ngayVaoLam?: string;

  @ApiPropertyOptional({
    description: 'Resignation date',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày nghỉ việc không hợp lệ' })
  ngayNghiViec?: string;

  @ApiPropertyOptional({
    description: 'Basic salary',
    example: 15000000
  })
  @IsOptional()
  @IsNumber({}, { message: 'Lương cơ bản phải là số' })
  @Min(0, { message: 'Lương cơ bản không được âm' })
  luongCoBan?: number;

  @ApiPropertyOptional({
    description: 'Status',
    example: 'active',
    enum: ['active', 'inactive', 'terminated']
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'terminated'], { message: 'Trạng thái không hợp lệ' })
  trangThai?: string;
}