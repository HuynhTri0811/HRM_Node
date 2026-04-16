import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../../logs_hrm/log.module';
import { Permission } from '../../auth/permission.entity';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Permission]), LogModule],
  providers: [CompanyService, PermissionsGuard],
  controllers: [CompanyController],
  exports: [TypeOrmModule, CompanyService],
})
export class CompanyModule {}