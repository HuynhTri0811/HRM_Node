import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ length: 100 })
  resource!: string;

  @Column({ length: 100 })
  action!: string;
}
