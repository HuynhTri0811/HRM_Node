import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from '../DepartMent/deparment.entity';

@Entity('nhan_su')
export class NhanSu {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Full name', example: 'Nguyễn Văn A' })
  @Column({ name: 'ho_ten', length: 255 })
  hoTen!: string;

  @ApiProperty({ description: 'Email address', example: 'nguyenvana@example.com' })
  @Column({ name: 'email', length: 255, unique: true })
  email!: string;

  @ApiProperty({ description: 'Password', writeOnly: true, example: 'P@ssw0rd123' })
  @Column({ name: 'password', length: 255, nullable: true, select: false })
  password?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '0123456789' })
  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
  soDienThoai?: string;

  @ApiPropertyOptional({ description: 'Address', example: '123 Đường ABC, Quận 1, TP.HCM' })
  @Column({ name: 'dia_chi', length: 500, nullable: true })
  diaChi?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @Column({ name: 'ngay_sinh', type: 'date', nullable: true })
  ngaySinh?: Date;

  @ApiPropertyOptional({ description: 'Position/Job title', example: 'Nhân viên kinh doanh' })
  @Column({ name: 'chuc_vu', length: 255, nullable: true })
  chucVu?: string;

  @ApiPropertyOptional({ description: 'Department', type: () => Department })
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'phong_ban' })
  phongBan?: Department;

  @ApiPropertyOptional({ description: 'Hire date', example: '2023-01-15' })
  @Column({ name: 'ngay_vao_lam', type: 'date', nullable: true })
  ngayVaoLam?: Date;

  @ApiPropertyOptional({ description: 'Resignation date', example: '2024-12-31' })
  @Column({ name: 'ngay_nghi_viec', type: 'date', nullable: true })
  ngayNghiViec?: Date;

  @ApiPropertyOptional({ description: 'Basic salary', example: 15000000 })
  @Column({ name: 'luong_co_ban', type: 'decimal', precision: 15, scale: 2, nullable: true })
  luongCoBan?: number;

  @ApiProperty({ description: 'Status', example: 'active', enum: ['active', 'inactive', 'terminated'] })
  @Column({ name: 'trang_thai', length: 50, default: 'active' })
  trangThai!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Soft delete flag', example: false })
  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;
}