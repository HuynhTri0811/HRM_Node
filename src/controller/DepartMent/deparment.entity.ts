import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('department')
export class Department {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Id', example: 'DEPT001' })
  @Column({ name: 'id_code', length: 50, unique: true,nullable: false })
  Code_Department!: string;

  @ApiProperty({ description: 'Name', example: 'Kinh Doanh' })
  @Column({ name: 'name', length: 255, nullable: false })
  Name_Department!: string;


  @ApiProperty({ description: 'Parent department ID', example: 1 })
  @Column({ name: 'department_parent', nullable: true })
  Department_Parrent!: number;
  


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