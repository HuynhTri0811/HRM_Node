import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './deparment.entity';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { LogModule } from '../../logs_hrm/log.module';
import { NhanSu } from '../NhanSu/nhan-su.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), LogModule],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [TypeOrmModule, DepartmentService],
})
export class DepartmentModule {}