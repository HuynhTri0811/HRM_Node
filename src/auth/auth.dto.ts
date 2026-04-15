import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'nguyenvana@example.com',
  })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'P@ssw0rd123',
    writeOnly: true,
  })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Đăng nhập thành công',
  })
  message!: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      hoTen: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      soDienThoai: '0123456789',
      chucVu: 'Nhân viên kinh doanh',
    },
  })
  user!: any;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expiresIn!: number;
}
