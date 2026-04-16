import { Entity, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from './deparment.entity';

@Entity('company')
export class Company extends Department {
  @ApiPropertyOptional({ description: 'Company address', example: '123 Main St' })
  @Column({ name: 'address', length: 500, nullable: true })
  address?: string;

  @ApiPropertyOptional({ description: 'Company phone', example: '+84-12-3456-7890' })
  @Column({ name: 'phone', length: 20, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Company email', example: 'company@example.com' })
  @Column({ name: 'email', length: 255, nullable: true })
  email?: string;

  @ApiPropertyOptional({ description: 'Company website', example: 'https://example.com' })
  @Column({ name: 'website', length: 255, nullable: true })
  website?: string;

  @ApiPropertyOptional({ description: 'Tax ID', example: 'TAX123456789' })
  @Column({ name: 'tax_id', length: 50, nullable: true })
  taxId?: string;
}
