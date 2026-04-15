import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './deparment.entity';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { LogModule } from '../../logs_hrm/log.module';
import { NhanSu } from '../NhanSu/nhan-su.entity';
import { Permission } from '../../auth/permission.entity';
import { PermissionsGuard } from '../../auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Permission]), LogModule],
  providers: [DepartmentService, PermissionsGuard],
  controllers: [DepartmentController],
  exports: [TypeOrmModule, DepartmentService],
})
export class DepartmentModule {}